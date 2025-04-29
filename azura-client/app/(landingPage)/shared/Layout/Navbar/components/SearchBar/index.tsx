"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Modal } from "@/app/shared/modal";

const allowedCategories = [
  "gaming_accessories",
  "electronics",
  "home_office",
  "kitchen_appliances",
  "fashion",
  "books",
  "health_beauty",
  "toys_games",
];

const SearchBar: React.FC = () => {
  const router = useRouter();
  // Desktop state
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  // Mobile modal state
  const [modalOpen, setModalOpen] = useState(false);

  // Handler for search button (desktop & mobile)
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (category) {
      params.set("category", category);
    }
    router.push(`/products?${params.toString()}`);
    setModalOpen(false); // Close modal after search on mobile
  };

  // Immediate navigation when category changes
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (value) {
      params.set("category", value);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden md:flex flex-1 mx-6">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-40 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="absolute right-32 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {allowedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            onClick={handleSearch}
            className="absolute right-2"
          >
            <Search className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Mobile Search (Modal) */}
      <div className="md:hidden">
        <Button variant="ghost" onClick={() => setModalOpen(true)}>
          <Search className="w-6 h-6 text-white" />
        </Button>
        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Search Products
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {allowedCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleSearch}
              className="w-full bg-primaryx hover:bg-primaryx-hover text-white py-2 rounded-md"
            >
              Search
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default SearchBar;
