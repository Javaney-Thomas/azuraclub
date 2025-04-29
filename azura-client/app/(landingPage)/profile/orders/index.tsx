"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_ORDERS } from "@/app/shared/utils/queries";
import Loader from "@/app/shared/components/Loader";
import { motion } from "framer-motion";
import { OrderType } from "../../shared/type";
import Link from "next/link";

const Orders: React.FC = () => {
  const { data, loading, error } = useQuery<{ orders: OrderType[] }>(
    GET_USER_ORDERS
  );

  if (loading) return <Loader />;
  if (error)
    return <p className="text-center text-red-500 py-8">{error.message}</p>;

  const orders = data?.orders || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        orders.map((order) => (
          <motion.div
            key={order.id}
            className="border rounded-xl p-6 mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Order #{order.id}
                </h2>
                <p className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-gray-700 text-lg">
                  Total: ${order.total.toFixed(2)}
                </p>
                <p className="text-gray-700">
                  Status:{" "}
                  <span className="font-medium text-primaryx">
                    {order.status}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800">Items:</h3>
              <ul className="list-disc ml-6 text-gray-600">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.product.title} (x{item.quantity})
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 text-right">
              <Link href={`/order/${order.id}`}>
                <span className="text-primaryx font-semibold hover:underline">
                  View Order Details
                </span>
              </Link>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default Orders;
