"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GET_PRODUCT, UPDATE_PRODUCT } from "@/app/shared/utils/queries";
import ImageUpload from "./components/ImageUpload";
import { allowedCategories } from "@/app/admin/shared/utils/alllowedCategory";
import CategorySelect from "@/app/admin/shared/components/CategorySelect";

const productUpdateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  category: z.enum(allowedCategories, {
    errorMap: () => ({ message: "Please select a valid category." }),
  }),
  stock: z.number().nonnegative("Stock cannot be negative"),
  imageUrl: z.string().optional(),
});

type ProductUpdateInputs = z.infer<typeof productUpdateSchema>;

export default function UpdateProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_PRODUCT, { variables: { id } });
  const [updateProduct, { loading: updateLoading }] =
    useMutation(UPDATE_PRODUCT);
  const [image, setImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductUpdateInputs>({
    resolver: zodResolver(productUpdateSchema),
    mode: "onSubmit",
  });

  // Pre-fill the form with existing product data
  useEffect(() => {
    if (data?.product) {
      setValue("title", data.product.title);
      setValue("description", data.product.description);
      setValue("price", data.product.price);
      setValue("category", data.product.category);
      setValue("stock", data.product.stock);
      setValue("imageUrl", data.product.imageUrl);
      setImage(data.product.imageUrl);
    }
  }, [data, setValue]);

  const onSubmit = async (formData: ProductUpdateInputs) => {
    try {
      const variables = { id, input: { ...formData, imageUrl: image } };
      await updateProduct({ variables });
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to update product");
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6">Update Product</h1>

      {/* Add the ImageUpload component for updating the image */}
      <ImageUpload
        currentImage={data.product.imageUrl}
        productId={id as string}
        onImageUpload={(newImage) => setImage(newImage)}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Product title"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Product description"
            rows={4}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block mb-1 font-medium">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="stock" className="block mb-1 font-medium">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              placeholder="Quantity"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              {...register("stock", { valueAsNumber: true })}
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock.message}
              </p>
            )}
          </div>
        </div>

        {/* <div>
          <label htmlFor="category" className="block mb-1 font-medium">
            Category
          </label>
          <select
            id="category"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            {...register("category")}
          >
            <option value="">Select a category</option>
            {allowedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace("_", " ")}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div> */}
        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <div>
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Category
            </label>

            <CategorySelect register={register} />

            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>{" "}
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={updateLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {updateLoading ? "Updating..." : "Update Product"}
        </Button>
      </form>
    </div>
  );
}
