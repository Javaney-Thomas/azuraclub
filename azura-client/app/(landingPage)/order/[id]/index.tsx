"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ORDER } from "@/app/shared/utils/queries";
import Loader from "@/app/shared/components/Loader";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { OrderType } from "@/app/(landingPage)/shared/type";

interface OrderDetailsProps {
  backUrl?: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ backUrl }) => {
  const { id } = useParams();
  const { data, loading, error } = useQuery<{ order: OrderType }>(GET_ORDER, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <Loader />;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  const order = data!.order;
  const createdDate = new Date(order.createdAt).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md"
    >
      <h1 className="text-3xl font-bold mb-4">Order #{order.id}</h1>

      <div className="mb-4">
        <p className="text-gray-700">
          <span className="font-medium">Status:</span> {order.status}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Created At:</span> {createdDate}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">User Information</h2>
        <p className="text-gray-700">
          <span className="font-bold">ID:</span> {order.user.id}
        </p>
        <p className="text-gray-700">
          <span className="font-bold">Name:</span> {order.user.name}
        </p>
        <p className="text-gray-700">
          <span className="font-bold">Email:</span> {order.user.email}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <h3 className="text-xl font-medium">{item.product.title}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">
                  Price: ${item.product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Link href={backUrl ? backUrl : "/profile/orders"}>
          <button className="bg-primaryx hover:bg-primaryx-hover text-white py-2 px-4 rounded-md transition-colors">
            Back to Orders
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default OrderDetails;
