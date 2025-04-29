import { IResolvers } from "@graphql-tools/utils";
import mongoose from "mongoose"; // Import for ObjectId validation
import Order from "../models/order.model";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import Stripe from "stripe";

// Logging utilities for tracking operations
const logInfo = (msg: string, data?: any) =>
  console.info("[INFO]", msg, data || "");
const logError = (msg: string, error?: any) =>
  console.error("[ERROR]", msg, error || "");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

// Mock payment processing function
const processPayment = async (
  paymentToken: string,
  amount: number
): Promise<boolean> => {
  logInfo("Processing payment", { paymentToken, amount });
  if (paymentToken === "tok_visa") {
    return true;
  } else {
    throw new Error("Payment failed: Invalid token");
  }
};

const orderResolvers: IResolvers = {
  Query: {
    orders: async (_parent, _args, { user }) => {
      if (!user) throw new Error("Not authenticated");
      try {
        const orders = await Order.find({ user: user.id }).populate(
          "items.product"
        );
        logInfo("Fetched orders successfully", {
          userId: user.id,
          count: orders.length,
        });
        return orders;
      } catch (error) {
        logError("Failed to fetch orders", error);
        if (error instanceof Error) {
          throw new Error("Failed to fetch orders: " + error.message);
        } else {
          throw new Error("Failed to fetch orders: Unknown error");
        }
      }
    },

    latestOrders: async (_parent, { limit = 5 }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      try {
        // Fetch latest orders sorted by createdAt in descending order
        const orders = await Order.find({})
          .sort({ createdAt: -1 })
          .limit(limit)
          .populate("items.product");
        logInfo("Fetched latest orders successfully", { count: orders.length });
        return orders;
      } catch (error) {
        logError("Failed to fetch latest orders", error);
        if (error instanceof Error) {
          throw new Error("Failed to fetch latest orders: " + error.message);
        } else {
          throw new Error("Failed to fetch latest orders: Unknown error");
        }
      }
    },
    order: async (_parent, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      try {
        // Validate if the order ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error("Invalid order ID format");
        }

        // Populate both the 'user' and 'items.product' fields
        const order = await Order.findById(id)
          .populate("user")
          .populate("items.product");
        if (!order) {
          throw new Error("Order not found");
        }
        return order;
      } catch (error) {
        logError("Failed to fetch order", error);
        if (error instanceof Error) {
          throw new Error("Failed to fetch order: " + error.message);
        } else {
          throw new Error("Failed to fetch order: Unknown error");
        }
      }
    },
    userOrders: async (_parent, { userId }, { user }) => {
      // Only allow admins to fetch another user’s orders
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      try {
        const orders = await Order.find({ user: userId }).populate(
          "items.product"
        );
        logInfo("Fetched user orders successfully", {
          userId,
          count: orders.length,
        });
        return orders;
      } catch (error) {
        logError("Failed to fetch user orders", error);
        throw new Error("Failed to fetch user orders");
      }
    },
  },
  Mutation: {
    createOrder: async (_parent, { cartItems, paymentMethod }, { user }) => {
      logInfo("Received cart items", { cartItems, paymentMethod });
      if (!user) throw new Error("Not authenticated");

      try {
        // Build order items by fetching product details from DB
        const orderItems = await Promise.all(
          cartItems.map(async (item: any) => {
            const product = await Product.findById(item.productId);
            if (!product) {
              throw new Error(`Product not found for ID: ${item.productId}`);
            }
            return {
              product: product._id,
              quantity: item.quantity,
              price: product.price != null ? product.price : 0,
            };
          })
        );

        // Calculate total using the fetched price values
        const total = orderItems.reduce(
          (sum: number, item) => sum + item.price * item.quantity,
          0
        );
        logInfo("Calculated total for checkout", { total });

        // Create a PaymentIntent with Stripe (amount in cents)
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(total * 100), // convert dollars to cents
          currency: "usd",
          payment_method_types: ["card"],
          metadata: { userId: user.id },
        });

        // Create the order in your database
        const order = await Order.create({
          user: user.id,
          items: orderItems,
          total,
          status: "pending",
          createdAt: new Date().toISOString(),
        });

        // Optionally clear the user's cart after order creation
        await Cart.deleteMany({ user: user.id });

        logInfo("Order created successfully", {
          orderId: order._id.toString(),
        });
        // Return the order and PaymentIntent client secret as required by your schema
        return {
          order: {
            order,
            items: orderItems,
          },
          clientSecret: paymentIntent?.client_secret,
        };
      } catch (error) {
        logError("Failed to create order", error);
        if (error instanceof Error) {
          throw new Error("Failed to create order: " + error.message);
        }
        throw new Error("Failed to create order: Unknown error");
      }
    },
    checkoutCart: async (_parent, { paymentToken }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      try {
        // Fetch the user's cart items
        const cartItems = await Cart.find({ user: user.id }).populate(
          "product"
        );
        if (!cartItems || cartItems.length === 0) {
          throw new Error("Cart is empty");
        }

        // Calculate total price
        const total = cartItems.reduce((sum: number, item: any) => {
          return sum + item.product.price * item.quantity;
        }, 0);
        logInfo("Calculated total for checkout", { total });

        // Process payment (mock)
        const paymentSuccessful = await processPayment(paymentToken, total);
        if (!paymentSuccessful) {
          throw new Error("Payment processing failed");
        }
        logInfo("Payment processed successfully");

        // Create order items
        const orderItems = cartItems.map((item: any) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        }));

        // Create the order
        const order = await Order.create({
          user: user.id,
          items: orderItems,
          total,
          status: "completed",
          createdAt: new Date().toISOString(),
        });
        logInfo("Order created successfully", { orderId: order._id });

        // Clear the user's cart after successful checkout
        await Cart.deleteMany({ user: user.id });
        return order;
      } catch (error) {
        logError("Failed during checkout", error);
        if (error instanceof Error) {
          throw new Error("Checkout failed: " + error.message);
        } else {
          throw new Error("Checkout failed: Unknown error");
        }
      }
    },
  },
};

export default orderResolvers;
