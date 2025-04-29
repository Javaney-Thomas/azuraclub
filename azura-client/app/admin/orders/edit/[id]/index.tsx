"use client";
import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Loader from "@/app/shared/components/Loader";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { GET_ORDER, UPDATE_ORDER_STATUS } from "@/app/shared/utils/queries";

// Define the possible order statuses
const orderStatusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// If you have a type for Order, it might look like this:
export type OrderItemType = {
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
};

export type OrderType = {
  id: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  items: OrderItemType[];
  total: number;
  status: string;
  createdAt: string;
};

export default function UpdateOrderStatus() {
  const { id } = useParams();
  // const router = useRouter();

  // Fetch order details
  const { data, loading, error } = useQuery<{ order: OrderType }>(GET_ORDER, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  // Mutation for updating order status
  const [updateOrderStatus, { loading: updateLoading, error: updateErr }] =
    useMutation(UPDATE_ORDER_STATUS, {
      onCompleted: () => {
        toast.success("Order status updated successfully!");
        // router.push("/admin/orders");
      },
      onError: (err) => {
        console.error(err);
        toast.error(err.message || "Failed to update order status");
      },
    });

  console.log({ updateErr });

  const handleStatusClick = async (newStatus: string) => {
    console.log(id, newStatus);
    // If already current status, do nothing
    if (newStatus === data?.order.status.toLowerCase()) return;
    try {
      const res = await updateOrderStatus({
        variables: { orderId: id, status: newStatus },
      });
      console.log(res);
    } catch (error) {
      console.log(error, "err");
    }
  };

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
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      {/* Order Header */}
      <div>
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <p className="text-gray-700">
          <span className="font-medium">Status:</span>{" "}
          <span className="capitalize">{order.status}</span>
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Created At:</span> {createdDate}
        </p>
      </div>

      {/* User Information */}
      <div className="border-t pt-4">
        <h2 className="text-2xl font-semibold mb-2">Customer Information</h2>
        <p className="text-gray-700">
          <span className="font-medium">Name:</span> {order.user.name}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Email:</span> {order.user.email}
        </p>
      </div>

      {/* Order Items */}
      <div className="border-t pt-4">
        <h2 className="text-2xl font-semibold mb-2">Order Items</h2>
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

      {/* Update Order Status */}
      <div className="border-t pt-4">
        <h2 className="text-2xl font-semibold mb-2">Update Order Status</h2>
        <div className="flex flex-wrap gap-4">
          {orderStatusOptions.map((statusOption) => {
            const isCurrent = statusOption === order.status.toLowerCase();
            return (
              <Button
                key={statusOption}
                onClick={() => handleStatusClick(statusOption)}
                disabled={updateLoading || isCurrent}
                className={`px-4 py-2 rounded transition-colors ${
                  isCurrent
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-end">
        <Link href="/admin/orders">
          <Button className="bg-primaryx hover:bg-primaryx-hover text-white py-2 px-4 rounded">
            Back to Orders
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
