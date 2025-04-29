/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type CategorType = { name: string; image: string; slug: string };

const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $slug: String!, $image: String!) {
    createCategory(name: $name, slug: $slug, image: $image) {
      id
      name
      slug
      image
    }
  }
`;

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^-+|-+$/g, "");

export const CreateCategory = () => {
  const { register, handleSubmit, watch, reset, setValue } =
    useForm<CategorType>();
  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [slug, setSlug] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const nameValue = watch("name");

  useEffect(() => {
    const generated = generateSlug(nameValue || "");
    setSlug(generated);
    setValue("slug", generated);
  }, [nameValue, setValue]);

  const onSubmit = async (data: CategorType) => {
    try {
      await createCategory({
        variables: {
          name: data.name,
          slug: data.slug,
          image: data.image,
        },
      });
      reset();
      setSlug("");
      setSuccessMessage("Category created successfully!");
      toast.success("Category has been created successfully.");
    } catch (error) {
      console.error("Error creating category:", error);
      toast("Failed to create category.");
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Category
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name", { required: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug (Auto-generated)
            </label>
            <input
              {...register("slug", { required: true })}
              value={slug}
              disabled
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              {...register("image", { required: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Submit
          </button>

          {successMessage && (
            <p className="text-green-600 font-medium mt-2 text-center">
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
