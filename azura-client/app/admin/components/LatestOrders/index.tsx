"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_LATEST_ORDERS } from "@/app/shared/utils/queries";
import Loader from "@/app/shared/components/Loader";
import { motion } from "framer-motion";
import Link from "next/link";
import { OrderType } from "@/app/(landingPage)/shared/type";

const LatestOrders = () => {
  const { data, loading, error } = useQuery(GET_LATEST_ORDERS, {
    variables: { limit: 5 },
  });

  if (loading) return <Loader />;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  const orders = data?.latestOrders || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-5 p-6 bg-white rounded-xl shadow-md"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Latest Orders</h1>
        <Link href="/admin/orders">
          <button className="bg-primaryx hover:bg-primaryx-hover text-white font-medium py-2 px-4 rounded-md transition-colors">
            View All Orders
          </button>
        </Link>
      </div>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {orders.map((order: OrderType) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link href={`/admin/orders/${order.id}`}>
                    <button className="bg-primaryx hover:bg-primaryx-hover text-white font-medium py-1 px-3 rounded-md transition-colors">
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default LatestOrders;
