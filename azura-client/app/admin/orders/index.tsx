"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import Loader from "@/app/shared/components/Loader";
import Link from "next/link";
import { motion } from "framer-motion";
import { OrderType } from "@/app/(landingPage)/shared/type";
import { Pencil } from "lucide-react";
import { GET_All_ORDERS } from "@/app/shared/utils/queries";

const Orders = () => {
  const { data, loading, error } = useQuery<{ allOrders: OrderType[] }>(
    GET_All_ORDERS
  );

  if (loading) return <Loader />;
  if (error)
    return <p className="text-center text-red-500 py-8">{error.message}</p>;

  const orders = data?.allOrders || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                  Order ID
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                  Total
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                  User
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                  Items
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b text-sm text-gray-900">
                    {order.id.slice(0, 6)}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-900">
                    {order.status}
                  </td>
                  <td className="px-4 py-2 border-b text-sm  text-green-500 underline">
                    <Link href={`/admin/users/${order.user.id}`}>
                      {order.user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-900">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.product.title} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/orders/edit/${order.id}`}>
                        <button className="text-black py-1 px-3 rounded-md hover:bg-gray-200 transition-colors">
                          <Pencil />
                        </button>
                      </Link>
                      <Link href={`/admin/orders/${order.id}`}>
                        <button className="bg-primaryx hover:bg-primaryx-hover text-white px-4 py-2 rounded">
                          View Order
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
    </motion.div>
  );
};

export default Orders;
