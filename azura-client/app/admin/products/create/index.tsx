"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { CREATE_PRODUCT } from "@/app/shared/utils/queries";
import { ImgComp } from "@/app/shared/ImgComp";
import { useRouter } from "next/navigation";
import { allowedCategories } from "../../shared/utils/alllowedCategory";
import CategorySelect from "../../shared/components/CategorySelect";

// Zod schema for form validation using an enum for category
const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number." })
    .positive("Price must be greater than 0"),
  category: z.enum(allowedCategories, {
    errorMap: () => ({ message: "Please select a valid category." }),
  }),
  stock: z
    .number({ invalid_type_error: "Stock must be a number." })
    .nonnegative("Stock cannot be negative"),
  file: z.any(), // File will be handled by server
});

// Infer TS type from schema
type ProductFormInputs = z.infer<typeof productSchema>;

export default function CreateProductForm() {
  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setimage] = useState<File | null>(null);
  const router = useRouter();
  // Setup React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInputs>({
    resolver: zodResolver(productSchema),
    mode: "onSubmit",
  });

  // Handle image preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create URL for image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setimage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image preview
  const removeImagePreview = () => {
    setImagePreview(null);
    // Clear file input
    setValue("file", null);
  };

  // Form submission handler
  const onSubmit = async (formData: ProductFormInputs) => {
    try {
      const { ...inputFields } = formData;

      console.log(image, "meed");

      if (!image) {
        toast.error("Please upload a file.");
        return;
      }

      await createProduct({
        variables: {
          file: image,
          input: {
            title: inputFields.title,
            description: inputFields.description || "",
            price: inputFields.price,
            category: inputFields.category,
            stock: inputFields.stock,
          },
        },
      });

      toast.success("Product created successfully!");
      // Reset form and preview
      setImagePreview(null);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product.");
    }
  };

  return (
    <div className="max-w-[70%] mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Product Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter product name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  $
                </span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-7 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </label>
              <input
                id="stock"
                type="number"
                placeholder="Available stock"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Product Image
              </label>
              <div className="relative">
                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("file")}
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="file"
                  className="cursor-pointer flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition duration-300"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <ImgComp
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImagePreview}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <Upload size={40} className="mb-2" />
                      <p className="text-sm">Click to upload image</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.file && (
                <p className="text-red-500 text-xs mt-1">
                  {typeof errors.file?.message === "string" &&
                    errors.file.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description - Spanning full width */}
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter product description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primaryx text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-[1.02]"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
