/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Modal } from "@/app/shared/modal";
import { CategorType, CreateCategory } from "./components/CreateCategory";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "@/app/shared/utils/queries";

const Categories: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES);

  const categories = data?.allCategories || [];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Explore Categories
          </h1>
          <Modal
            trigger={
              <button className="mb-4 px-4 py-2 bg-primaryx text-white rounded cursor-pointer">
                Create Category
              </button>
            }
          >
            <CreateCategory />
          </Modal>
        </div>

        {loading && <p className="text-center">Loading categories...</p>}
        {error && (
          <p className="text-center text-red-500">Failed to load categories.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category: CategorType) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:shadow-xl"
              >
                <div className="h-48 w-full relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-25"></div>
                </div>
                <div className="p-4">
                  <h2 className="text-2xl font-semibold text-gray-700">
                    {category.name}
                  </h2>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Categories;
