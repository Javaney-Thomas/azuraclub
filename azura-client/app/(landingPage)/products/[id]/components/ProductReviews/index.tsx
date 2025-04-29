"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_REVIEWS } from "@/app/shared/utils/queries";
import Loader from "@/app/shared/components/Loader";
import { Star } from "lucide-react";
import { ReviewType } from "@/app/(landingPage)/shared/type";

type ProductReviewsProps = {
  productId: string;
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { data, loading, error } = useQuery<{ reviews: ReviewType[] }>(
    GET_REVIEWS,
    {
      variables: { productId },
      fetchPolicy: "cache-and-network",
    }
  );

  if (loading) return <Loader />;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  const reviews = data?.reviews || [];

  if (reviews.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No reviews yet for this product.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, index) =>
                index < review.rating ? (
                  <CustomStar key={index} />
                ) : (
                  <Star key={index} className="w-5 h-5 text-gray-300" />
                )
              )}
            </div>
            <span className="text-sm text-gray-600">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2 font-semibold text-gray-800">{review.user.name}</p>
          <p className="mt-1 text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;

export const CustomStar: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
  >
    <rect width="24" height="24" fill="none" />
    <path
      d="M10,15,4.122,18.09l1.123-6.545L.489,6.91l6.572-.955L10,0l2.939,5.955,6.572.955-4.755,4.635,1.123,6.545Z"
      transform="translate(2 3)"
      stroke="#000000"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
  </svg>
);
