import { IResolvers } from "@graphql-tools/utils";
import Analytics from "../models/analytics.model";
import User from "../models/user.model";
import Product from "../models/product.model";
import Order from "../models/order.model";
import mongoose from "mongoose"; // Import mongoose for ObjectId

const analyticsResolvers: IResolvers = {
  Query: {
    analyticsData: async (_parent, _args, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      try {
        const totalUsers = await User.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({});

        // Count product view events.
        const productViewsCount = await Analytics.countDocuments({
          event: "product_view",
        });
        const productViews = productViewsCount || 0;

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const activeUserIds = await Analytics.distinct("userId", {
          timestamp: { $gte: sevenDaysAgo },
        });
        const activeUsers = activeUserIds.length;

        // Most viewed products: aggregate events with event "product_view" and group by productId.
        const mostViewedAggregation = await Analytics.aggregate([
          { $match: { event: "product_view", productId: { $ne: null } } },
          { $group: { _id: "$productId", views: { $sum: 1 } } },
          { $sort: { views: -1 } },
          { $limit: 5 },
        ]);

        // Correctly instantiate ObjectId using `new`
        const mostViewedProductIds = mostViewedAggregation.map(
          (doc) => new mongoose.Types.ObjectId(doc._id)
        );
        const mostViewedProducts = await Product.find({
          _id: { $in: mostViewedProductIds },
        });

        return {
          totalUsers,
          totalProducts,
          totalOrders,
          productViews,
          activeUsers,
          mostViewedProducts,
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error("Failed to fetch analytics data: " + error.message);
        } else {
          throw new Error("Failed to fetch analytics data: Unknown error");
        }
      }
    },
  },
  Mutation: {
    logEvent: async (
      _parent,
      { event, userId, productId, metadata, timestamp }
    ) => {
      try {
        // Ensure productId and userId are valid ObjectId instances.
        if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
          throw new Error("Invalid productId format");
        }
        if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error("Invalid userId format");
        }

        const log = await Analytics.create({
          event,
          userId: userId ? new mongoose.Types.ObjectId(userId) : null,
          productId: productId ? new mongoose.Types.ObjectId(productId) : null,
          metadata,
          timestamp,
        });
        return log;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error("Failed to log event: " + error.message);
        } else {
          throw new Error("Failed to log event: Unknown error");
        }
      }
    },
  },
};

export default analyticsResolvers;
