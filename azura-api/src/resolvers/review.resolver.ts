import { IResolvers } from "@graphql-tools/utils";
import mongoose from "mongoose";
import Review from "../models/review.model";
import Order from "../models/order.model";
import Product from "../models/product.model";
import { logError, logInfo } from "../utils/logger.util";

const reviewResolvers: IResolvers = {
  Query: {
    // Get all reviews for a specific product
    reviews: async (_parent, { productId }, _context) => {
      try {
        // Optionally, you can validate that productId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          throw new Error("Invalid product ID format");
        }

        const reviews = await Review.find({ product: productId })
          .populate<{ user: { id: string; email: string; name: string } }>(
            "user"
          )
          .populate("product");
        logInfo("Fetched reviews for product", {
          productId,
          count: reviews.length,
        });
        return reviews || [];
      } catch (error) {
        logError("Failed to fetch reviews for product", error);
        throw new Error(
          "Failed to fetch reviews for product: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }
    },
    // reviews: async (_parent, { productId }, { user }) => {
    //   // Optionally check user if needed
    //   try {
    //     const reviews = await Review.find({ product: productId })
    //       .populate("user")
    //       .populate("product");
    //     // Return an empty array if no reviews found
    //     return reviews || [];
    //   } catch (error) {
    //     logError("Failed to fetch reviews", error);
    //     throw new Error("Failed to fetch reviews");
    //   }
    // },
  },
  Mutation: {
    createReview: async (_parent, { productId, rating, comment }, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Check if the user has already reviewed this product
      const existingReview = await Review.findOne({
        user: user.id,
        product: productId,
      });
      if (existingReview) {
        throw new Error("You have already reviewed this product.");
      }

      // Check if the user has at least one completed/delivered order with the product
      const orderExists = await Order.exists({
        user: user.id,
        "items.product": productId,
        status: { $in: ["completed", "delivered"] },
      });

      if (!orderExists) {
        throw new Error(
          "You must purchase this product before leaving a review."
        );
      }

      try {
        // Optionally verify that the product exists
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error("Product not found");
        }

        // Create the review
        const review = await Review.create({
          user: user.id,
          product: productId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        });

        logInfo("Review created successfully", { review });
        return review;
      } catch (error) {
        logError("Failed to create review", error);
        throw new Error(
          "Failed to create review: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }
    },
  },
};

export default reviewResolvers;
