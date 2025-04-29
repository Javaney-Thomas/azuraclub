"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "../../shared/components/ProductCard";
import { GET_PRODUCTS_BY_RELATED_VIEW } from "@/app/shared/utils/queries";
import Loader from "@/app/shared/components/Loader";
import { ProductType } from "../../shared/type";

const RelatedItems = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_RELATED_VIEW);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const products = data?.products ?? [];

  return (
    <div className="max-w-[95%] mx-auto my-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-start mb-6">
        Related to items you’ve viewed
      </h2>
      <Carousel>
        <CarouselContent>
          {products.map((product: ProductType) => (
            <CarouselItem
              key={product.id}
              className="basis-[80%] sm:basis-1/2 md:basis-1/4 lg:basis-1/6"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default RelatedItems;
