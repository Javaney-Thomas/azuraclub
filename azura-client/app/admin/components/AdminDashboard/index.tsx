"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Loader from "@/app/shared/components/Loader";
import { GET_ADMIN_DASHBOARD } from "@/app/shared/utils/queries";

// Define TypeScript types for the dashboard data (customize as needed)
export type DashboardData = {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageCartValue: number;
  conversionRate: number;
  cancellationRate: number;
  mostViewedProducts: Array<{
    _id: string;
    count: number;
  }>;
  mostSearchedProducts: Array<{
    _id: string;
    count: number;
  }>;
  failedSearches: Array<{
    _id: string;
    count: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    title: string;
    stock: number;
  }>;
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const AdminDashboard: React.FC = () => {
  const { data, loading, error } = useQuery<{ adminDashboard: DashboardData }>(
    GET_ADMIN_DASHBOARD,
    { fetchPolicy: "cache-and-network" }
  );

  console.log(error, "error");
  console.log(data, "dashboard");
  if (loading) return <Loader />;
  if (error)
    return (
      <p className="text-center text-red-500 py-8">Error: {error.message}</p>
    );

  const dashboard = data!.adminDashboard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" space-y-8"
    >
      <h1 className="text-4xl font-bold">Dashboard</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {dashboard.totalUsers}
          </h2>
          <p className="text-gray-500">Total Users</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {dashboard.totalProducts}
          </h2>
          <p className="text-gray-500">Total Products</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {dashboard.totalOrders}
          </h2>
          <p className="text-gray-500">Total Orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            ${dashboard.totalRevenue.toFixed(2)}
          </h2>
          <p className="text-gray-500">Total Revenue</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            ${dashboard.averageCartValue.toFixed(2)}
          </h2>
          <p className="text-gray-500">Avg. Cart Value</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {dashboard.conversionRate.toFixed(2)}%
          </h2>
          <p className="text-gray-500">Conversion Rate</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Viewed Products */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Most Viewed Products
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.mostViewedProducts}>
              <XAxis dataKey="_id" tickFormatter={(id) => id.slice(0, 6)} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count">
                {dashboard.mostViewedProducts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Searched Products */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Most Searched Products
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.mostSearchedProducts}>
              <XAxis dataKey="_id" tickFormatter={(id) => id.toUpperCase()} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count">
                {dashboard.mostSearchedProducts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Products Table */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Low Stock Products
        </h2>
        {dashboard.lowStockProducts.length === 0 ? (
          <p className="text-gray-500">All products are well stocked.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Product ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboard.lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {product.id}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {product.title}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {product.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
