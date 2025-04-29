"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import Image from "next/image";
import { GET_PRODUCT, DELETE_PRODUCT } from "@/app/shared/utils/queries";
import Loader from "@/app/shared/components/Loader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AdminProductReviews from "../components/AdminProductReviews";

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  console.log(id, "id");

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  const [deleteProduct, { loading: deleteLoading }] = useMutation(
    DELETE_PRODUCT,
    {
      onCompleted: (data) => {
        console.log(data, "data");
        toast.success("Product deleted successfully!");
        router.push("/admin/products");
      },
      onError: (error) => {
        console.log(error, "err");
        toast.error(error.message || "Failed to delete product");
      },
    }
  );

  if (loading) return <Loader />;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  const product = data.product;

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;
    await deleteProduct({ variables: { id: product.id } });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/2 relative">
            <Image
              src={product.imageUrl || "/images/placeholder.png"}
              alt={product.title}
              width={500}
              height={500}
              className="rounded-xl object-cover"
            />
          </div>
          {/* Product Details */}
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {product.title}
            </h1>
            <p className="text-gray-600 text-lg">{product.description}</p>
            <p className="text-3xl font-semibold text-primary">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Category: {product.category.replace("_", " ")}
            </p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            <div className="flex gap-4">
              <Button
                onClick={() => router.back()}
                className="bg-primaryx hover:bg-primaryx-hover text-white py-2 px-4 rounded-md"
              >
                Back to Products
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteLoading}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              >
                {deleteLoading ? "Deleting..." : "Delete Product"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {typeof id === "string" && <AdminProductReviews productId={id} />}
    </>
  );
};

export default ProductDetails;
