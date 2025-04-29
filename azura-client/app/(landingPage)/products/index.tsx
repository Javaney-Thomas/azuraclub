"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/app/shared/utils/queries";
import ProductCard from "../shared/components/ProductCard";
import { ProductType } from "../shared/type";
import Pagination from "../shared/components/Pagination";
import Loader from "@/app/shared/components/Loader";

const Products = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { page, limit, search: searchQuery, category },
  });

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error.message}
      </div>
    );

  const products: ProductType[] = data?.products ?? [];
  const totalCount: number = data?.productsCount ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      {(searchQuery || category) && (
        <p className="mb-4">
          {searchQuery && (
            <span>
              Search results for: <strong>{searchQuery}</strong>
            </span>
          )}
          {category && (
            <span>
              {" "}
              | Category: <strong>{category.replace("_", " ")}</strong>
            </span>
          )}
        </p>
      )}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="text-center text-gray-500">No products found.</div>
      )}
    </div>
  );
};

export default Products;
