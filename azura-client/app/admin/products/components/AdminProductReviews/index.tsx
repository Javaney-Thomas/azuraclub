"use client";

import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { DELETE_REVIEW, GET_REVIEWS } from "@/app/shared/utils/queries";
import Loader from "@/app/shared/components/Loader";
import { Star, Trash2 } from "lucide-react";
import { ReviewType } from "@/app/(landingPage)/shared/type";
import { CustomStar } from "@/app/(landingPage)/products/[id]/components/ProductReviews";

type ProductReviewsProps = {
  productId: string;
};

const AdminProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { data, loading, error, refetch } = useQuery<{ reviews: ReviewType[] }>(
    GET_REVIEWS,
    {
      variables: { productId },
      fetchPolicy: "cache-and-network",
    }
  );

  const [deleteReview, { loading: deleting }] = useMutation(DELETE_REVIEW, {
    onCompleted: () => {
      refetch(); // Refresh the review list after deletion
    },
    onError: (error) => {
      alert("Failed to delete review: " + error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReview({ variables: { id } });
    }
  };

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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDelete(review.id)}
                disabled={deleting}
                className="p-1 rounded hover:bg-red-100"
                title="Delete Review"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
          <p className="mt-2 font-semibold text-gray-800">{review.user.name}</p>
          <p className="mt-1 text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminProductReviews;
