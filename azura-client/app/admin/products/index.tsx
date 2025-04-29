"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import Loader from "@/app/shared/components/Loader";
import { GET_PRODUCTS } from "@/app/shared/utils/queries";
import { ProductType } from "@/app/(landingPage)/shared/type";
import Pagination from "@/app/(landingPage)/shared/components/Pagination";
import { Pencil, Search } from "lucide-react";
import { ImgComp } from "@/app/shared/ImgComp";

const Products: React.FC = () => {
  // Get initial query parameters from the URL
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [page, setPage] = useState(1);
  // searchInput holds the current input value; searchQuery is what we actually send
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const limit = 10;

  const { data, loading, error, refetch } = useQuery<{
    products: ProductType[];
    productsCount: number;
  }>(GET_PRODUCTS, {
    variables: { page, limit, search: searchQuery, category },
    fetchPolicy: "cache-and-network",
  });

  // Reset page to 1 when searchQuery or category changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category]);

  // Handler for the search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // When the search button is clicked, update searchQuery (and URL, if desired)
  const handleSearchClick = () => {
    setSearchQuery(searchInput.trim());
    // Optionally, update the URL parameters if needed:
    // router.push(`/admin/products?search=${encodeURIComponent(searchInput.trim())}&category=${encodeURIComponent(category)}`);
  };

  // Handler for category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error.message}
      </div>
    );

  const products = data?.products || [];
  const totalCount = data?.productsCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header with Search & Create button */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Controlled Search Input with Search Button */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleSearchClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
            >
              <Search size={20} />
            </button>
          </div>
          {/* Category Selector */}
          <select
            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="gaming_accessories">Gaming Accessories</option>
            <option value="electronics">Electronics</option>
            <option value="home_office">Home Office</option>
            <option value="kitchen_appliances">Kitchen Appliances</option>
            <option value="fashion">Fashion</option>
            <option value="books">Books</option>
            <option value="health_beauty">Health & Beauty</option>
            <option value="toys_games">Toys & Games</option>
          </select>
          <Link href="/admin/products/create">
            <button className="bg-primaryx hover:bg-primaryx-hover text-white py-2 px-4 rounded-md transition-colors">
              Create New Product
            </button>
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Image
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Description
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Category
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Stock
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b text-sm text-gray-900">
                    {/* {product.id} */}
                    <ImgComp
                      className="w-32 rounded-full"
                      src={product.imageUrl}
                      alt={product.title}
                    />
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-900">
                    {product.title}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-600">
                    {product.description}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-900">
                    {product.category.replace("_", " ")}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">
                    {/* Actions for edit and view */}
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <button className="text-black py-1 px-3 rounded-md hover:bg-gray-200 transition-colors">
                          <Pencil />
                        </button>
                      </Link>
                      <Link href={`/admin/products/${product.id}`}>
                        <button className="bg-primaryx hover:bg-primaryx-hover text-white py-1 px-3 rounded-md transition-colors cursor-pointer">
                          View
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p);
            refetch({ page: p, limit, search: searchQuery, category });
          }}
        />
      )}
    </div>
  );
};

export default Products;
