"use client";
import Link from "next/link";
import ProductsCategories from "../ProductsCategories";

const Hero = () => {
  return (
    <div className="py-10 w-full border-b border-gray-200 bg-gray-50 flex flex-col justify-center items-center text-center px-4">
      <div className="md:h-[35vh] flex flex-col justify-center items-center space-y-5">
        <h1 className="text-5xl font-bold text-gray-900">
          Groceries Delivered in{" "}
          <span className="text-primary">90 Minutes</span>
        </h1>
        <p className="text-gray-600 text-lg mt-3">
          Get your healthy foods & snacks delivered at your doorsteps all day,
          every day
        </p>
        <Link href="/products" className="mt-1">
          <span className="mt-6 bg-primaryx hover:bg-primaryx-hover text-white py-2 px-6 rounded-full transition duration-200">
            View All Products
          </span>
        </Link>
      </div>

      <div className="w-full flex flex-col items-center mt-8">
        <ProductsCategories />
      </div>
    </div>
  );
};

export default Hero;
