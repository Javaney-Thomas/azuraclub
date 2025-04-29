"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { GET_PRODUCT } from "@/app/shared/utils/queries"; // query to fetch product details
import { CREATE_REVIEW } from "@/app/shared/utils/queries"; // mutation to create a review

// Zod schema for review form
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating between 1 and 5").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters."),
});

type ReviewFormInputs = z.infer<typeof reviewSchema>;

const ReviewForm: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("productId");

  // Fetch product details to show image and title
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
    fetchPolicy: "cache-and-network",
  });

  // Set up review mutation
  const [createReview, { loading: reviewLoading, error }] = useMutation(
    CREATE_REVIEW,
    {
      onCompleted: () => {
        toast.success("Review submitted successfully!");
        // Redirect as needed
        router.push("/profile/orders");
      },
      onError: (error) => {
        console.log(error, "here");
        toast.error(error.message || "Failed to submit review");
      },
    }
  );

  console.log(error, "error");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormInputs>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  // Watch current rating
  const rating = watch("rating");

  const onSubmit = async (formData: ReviewFormInputs) => {
    if (!productId) {
      toast.error("No product selected for review.");
      return;
    }
    try {
      const res = await createReview({
        variables: {
          productId,
          rating: formData.rating,
          comment: formData.comment,
        },
      });
      console.log({ res });
    } catch (error) {
      console.log(error, "error");
    }
  };

  if (productLoading) return <p>Loading product...</p>;
  if (productError) return <p>Error loading product: {productError.message}</p>;

  const product = productData.product;

  // Render clickable stars with animation
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <motion.span
          key={i}
          onClick={() => setValue("rating", i)}
          whileHover={{ scale: 1.2 }}
          className="cursor-pointer"
        >
          {i <= rating ? (
            <Star className="w-8 h-8 text-yellow-400" />
          ) : (
            <Star className="w-8 h-8 text-gray-300" />
          )}
        </motion.span>
      );
    }
    return stars;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Submit Your Review</h1>
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-24 h-24">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{product.title}</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex">{renderStars()}</div>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            {...register("comment")}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Share your thoughts about the product..."
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={reviewLoading}
          className="w-full bg-primaryx hover:bg-primaryx-hover text-white py-2 px-4 rounded"
        >
          {reviewLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
