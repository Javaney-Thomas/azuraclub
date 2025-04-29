import { IResolvers } from "@graphql-tools/utils";
import User from "../models/user.model";
import Product from "../models/product.model";
import Order from "../models/order.model";
import Analytics from "../models/analytics.model"; // Added Analytics model
import Content from "../models/content.model";
import mongoose from "mongoose";
import { sendReviewRequestEmail } from "../utils/emailHelper";
import { transformOrderToOrderType } from "../type";

const logInfo = (msg: string, data?: any) =>
  console.info("[INFO]", msg, data || "");
const logError = (msg: string, error?: any) =>
  console.error("[ERROR]", msg, error || "");

const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const adminResolvers: IResolvers = {
  Query: {
    // Returns aggregated data for the admin dashboard.
    adminDashboard: async (_parent, _args, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      try {
        const totalUsers = await User.countDocuments({});
        const activeUsers = await User.countDocuments({
          lastLogin: { $gte: sevenDaysAgo },
        });
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({});
        const orders = await Order.find({ status: "completed" });
        const totalRevenue = orders.reduce(
          (sum, order) => sum + order.total,
          0
        );

        const mostViewedProducts = await Analytics.aggregate([
          { $match: { event: "product_view" } },
          { $group: { _id: "$productId", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]);

        const mostSearchedProducts = await Analytics.aggregate([
          { $match: { event: "search" } },
          { $group: { _id: "$metadata.searchTerm", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]);

        const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
        const canceledOrders = await Order.countDocuments({
          status: "canceled",
        });

        // Prevent division by zero errors
        const averageCartValue =
          totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const totalProductViews = await Analytics.countDocuments({
          event: "product_view",
        });
        const conversionRate =
          totalProductViews > 0 ? (totalOrders / totalProductViews) * 100 : 0;
        const cancellationRate =
          totalOrders > 0 ? (canceledOrders / totalOrders) * 100 : 0;

        const failedSearches = await Analytics.aggregate([
          { $match: { event: "failed_search" } },
          { $group: { _id: "$metadata.searchTerm", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]);

        return {
          totalUsers,
          activeUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          averageCartValue,
          mostViewedProducts,
          mostSearchedProducts,
          failedSearches,
          conversionRate,
          lowStockProducts,
          cancellationRate,
        };
      } catch (error) {
        console.error("Failed to fetch admin dashboard data", error);
        throw new Error("Failed to fetch admin dashboard data");
      }
    },

    // Retrieve users for admin
    users: async (_parent, _args, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      try {
        return await User.find({});
      } catch (error) {
        logError("Failed to fetch users", error);
        throw new Error("Failed to fetch users");
      }
    },

    // Retrieve content by key for admin
    content: async (_parent, { key }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      try {
        const content = await Content.findOne({ key });
        if (!content) throw new Error("Content not found");
        return content;
      } catch (error) {
        logError("Failed to fetch content", error);
        throw new Error("Failed to fetch content");
      }
    },
  },
  Mutation: {
    // Update a user's role.
    updateUserRole: async (_parent, { id, role }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid User ID");
      }
      try {
        const foundUser = await User.findById(id);
        if (!foundUser) throw new Error("User not found");
        foundUser.role = role;
        await foundUser.save();
        return foundUser;
      } catch (error) {
        logError("Failed to update user role", error);
        throw new Error("Failed to update user role");
      }
    },

    // Suspend a user.
    suspendUser: async (_parent, { id }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid User ID");
      }
      try {
        const foundUser = await User.findById(id);
        if (!foundUser) throw new Error("User not found");
        foundUser.suspended = true;
        await foundUser.save();
        return foundUser;
      } catch (error) {
        logError("Failed to suspend user", error);
        throw new Error("Failed to suspend user");
      }
    },

    // Unsuspend a user.
    unsuspendUser: async (_parent, { id }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid User ID");
      }
      try {
        const foundUser = await User.findById(id);
        if (!foundUser) throw new Error("User not found");
        foundUser.suspended = false;
        await foundUser.save();
        return foundUser;
      } catch (error) {
        logError("Failed to unsuspend user", error);
        throw new Error("Failed to unsuspend user");
      }
    },

    // Delete a user.
    deleteUser: async (_parent, { id }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid User ID");
      }
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new Error("User not found");
        return "User deleted successfully";
      } catch (error) {
        logError("Failed to delete user", error);
        throw new Error("Failed to delete user");
      }
    },

    // Approve a product.
    approveProduct: async (_parent, { productId }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid User ID");
      }
      try {
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found");
        product.approved = true;
        await product.save();
        return product;
      } catch (error) {
        logError("Failed to approve product", error);
        throw new Error("Failed to approve product");
      }
    },

    // Reject a product.
    rejectProduct: async (_parent, { productId }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid User ID");
      }
      try {
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found");
        product.approved = false;
        await product.save();
        return product;
      } catch (error) {
        logError("Failed to reject product", error);
        throw new Error("Failed to reject product");
      }
    },

    // Update an order's status.
    updateOrderStatus: async (_parent, { orderId, status }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      logInfo("Received update request with:", { orderId, status });
      if (
        ![
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].includes(status.toLowerCase())
      ) {
        throw new Error("Invalid status value");
      }

      try {
        const order = await Order.findById(orderId)
          .populate<{ user: { email: string; name: string } }>("user")
          .populate("items.product");
        if (!order) throw new Error("Order not found");

        order.status = status;
        await order.save();

        logInfo("Order status updated successfully", { orderId, status });

        console.log(status.toLowerCase(), "status.toLowerCase()");
        console.log(order.user?.email, "order.user?.email");
        if (status.toLowerCase() === "delivered" && order.user?.email) {
          const transformedOrder = transformOrderToOrderType(order);
          await sendReviewRequestEmail(order.user, transformedOrder);
        }
        return order;
      } catch (error) {
        logError("Failed to update order status", error);
        throw new Error(
          "Failed to update order status: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }
    },

    // Update or create content.
    updateContent: async (_parent, { key, value }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      try {
        const content = await Content.findOneAndUpdate(
          { key },
          { value },
          { new: true, upsert: true }
        );
        return content;
      } catch (error) {
        logError("Failed to update content", error);
        throw new Error("Failed to update content");
      }
    },
  },
};

export default adminResolvers;
