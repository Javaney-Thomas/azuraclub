"use client";
import { useQuery } from "@apollo/client";
import React from "react";
import { GET_PRODUCTS_BY_CATEGORY } from "@/app/shared/utils/queries";
import Loader from "@/app/shared/components/Loader";
import NoProductsFound from "@/app/shared/components/NoProductsFound";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductType } from "@/app/(landingPage)/shared/type";
import ProductCard from "@/app/(landingPage)/shared/components/ProductCard";

const ProductCategoryCarousel = ({ category }: { category: string }) => {
  const page = 1;
  const limit = 8;
  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { category, page, limit },
  });

  console.log(category, "category");

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error.message}
      </div>
    );

  const products: ProductType[] = data?.products ?? [];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 px-4">
        More in{" "}
        {(category as string)
          ?.split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </h2>
      {products.length > 0 ? (
        <Carousel>
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-[80%] sm:basis-1/2 md:basis-1/4 lg:basis-1/6"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <NoProductsFound />
      )}
    </div>
  );
};

export default ProductCategoryCarousel;
