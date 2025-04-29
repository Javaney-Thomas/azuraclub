import { IResolvers } from "@graphql-tools/utils";
import Cart from "../models/cart.model";
import Product from "../models/product.model";

// Logging utilities
const logInfo = (msg: string, data?: any) =>
  console.info("[INFO]", msg, data || "");
const logError = (msg: string, error?: any) =>
  console.error("[ERROR]", msg, error || "");

const cartResolvers: IResolvers = {
  Query: {
    // Retrieve all cart items for the authenticated user
    cart: async (_parent, _args, { user }) => {
      if (!user) throw new Error("Not authenticated");
      try {
        logInfo("Fetching cart items", { userId: user.id });
        const cartItems = await Cart.find({ user: user.id }).populate(
          "product"
        );
        logInfo("Fetched cart items", { count: cartItems.length });
        return cartItems;
      } catch (error) {
        logError("Failed to fetch cart items", error);
        throw new Error("Failed to fetch cart items");
      }
    },
  },
  Mutation: {
    // Add to cart: add a product or update quantity if it exists.
    addToCart: async (_parent, { productId, quantity }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      if (quantity <= 0) throw new Error("Quantity must be greater than 0");

      try {
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found");

        logInfo("Adding product to cart", {
          userId: user.id,
          productId,
          quantity,
        });
        const existing = await Cart.findOne({
          user: user.id,
          product: productId,
        });
        if (existing) {
          existing.quantity += quantity;
          await existing.save();
          logInfo("Updated existing cart item", { cartItemId: existing.id });
        } else {
          await Cart.create({ user: user.id, product: productId, quantity });
          logInfo("Added new cart item", { productId });
        }
        return await Cart.find({ user: user.id }).populate("product");
      } catch (error) {
        logError("Failed to add product to cart", error);
        throw new Error("Failed to add product to cart");
      }
    },

    // Update a single cart item's quantity.
    updateCartItem: async (_parent, { itemId, quantity }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      if (quantity <= 0) throw new Error("Quantity must be greater than 0");

      try {
        const item = await Cart.findById(itemId);
        if (!item) throw new Error("Cart item not found");
        item.quantity = quantity;
        await item.save();
        logInfo("Updated cart item", { cartItemId: item.id, quantity });
        return item;
      } catch (error) {
        logError("Failed to update cart item", error);
        throw new Error("Failed to update cart item");
      }
    },

    // Remove a product from the cart.
    removeFromCart: async (_parent, { itemId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      try {
        const item = await Cart.findById(itemId);
        if (!item) throw new Error("Cart item not found");

        // Use findByIdAndDelete instead of remove
        await Cart.findByIdAndDelete(itemId);
        logInfo("Removed cart item", { cartItemId: itemId });
        return await Cart.find({ user: user.id }).populate("product");
      } catch (error) {
        logError("Failed to remove cart item", error);
        throw new Error("Failed to remove product from cart");
      }
    },

    // Merge a guest cart with the user's existing cart.
    mergeCart: async (_parent, { guestCart }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      try {
        logInfo("Merging guest cart into user cart", {
          userId: user.id,
          guestCart,
        });
        for (const guestItem of guestCart) {
          // Validate quantity for each guest item
          if (guestItem.quantity <= 0) continue;
          // Check if the product already exists in the user's cart.
          const existing = await Cart.findOne({
            user: user.id,
            product: guestItem.productId,
          });
          if (existing) {
            // Merge quantities
            existing.quantity += guestItem.quantity;
            await existing.save();
          } else {
            // Add new item from the guest cart.
            await Cart.create({
              user: user.id,
              product: guestItem.productId,
              quantity: guestItem.quantity,
            });
          }
        }
        const mergedCart = await Cart.find({ user: user.id }).populate(
          "product"
        );
        logInfo("Merged cart successfully", {
          mergedCartCount: mergedCart.length,
        });
        return mergedCart;
      } catch (error) {
        logError("Failed to merge guest cart", error);
        throw new Error("Failed to merge guest cart");
      }
    },

    // Bulk update multiple cart items in one mutation.
    updateMultipleCartItems: async (_parent, { cartItems }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      try {
        for (const { itemId, quantity } of cartItems) {
          if (quantity <= 0) {
            throw new Error("Quantity must be greater than 0 for all items");
          }
          const item = await Cart.findById(itemId);
          if (!item) {
            throw new Error(`Cart item not found: ${itemId}`);
          }
          item.quantity = quantity;
          await item.save();
          logInfo("Bulk updated cart item", { cartItemId: item.id, quantity });
        }
        const updatedCart = await Cart.find({ user: user.id }).populate(
          "product"
        );
        return updatedCart;
      } catch (error) {
        logError("Failed to bulk update cart items", error);
        throw new Error("Failed to bulk update cart items");
      }
    },
  },
};

export default cartResolvers;
