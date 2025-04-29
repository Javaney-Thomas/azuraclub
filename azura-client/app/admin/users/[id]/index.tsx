"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import Loader from "@/app/shared/components/Loader";
import { motion } from "framer-motion";
import Link from "next/link";
import { GET_USER, GET_USER_ORDERS_BY_ID } from "@/app/shared/utils/queries";
import { UserProfile, OrderType } from "@/app/(landingPage)/shared/type";

const SingleUserPage: React.FC = () => {
  const { id } = useParams(); // the ID of the user to view

  // Fetch user info (admin-only access)
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery<{ user: UserProfile }>(GET_USER, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  // Fetch the orders for the specified user
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
  } = useQuery<{ userOrders: OrderType[] }>(GET_USER_ORDERS_BY_ID, {
    variables: { userId: id },
    fetchPolicy: "network-only",
  });

  if (userLoading || ordersLoading) return <Loader />;
  if (userError)
    return (
      <p className="text-center text-red-500">Error: {userError.message}</p>
    );
  if (ordersError)
    return (
      <p className="text-center text-red-500">Error: {ordersError.message}</p>
    );

  const user = userData?.user;
  const orders = ordersData?.userOrders || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6 space-y-8"
    >
      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        <p className="text-lg">
          <span className="font-semibold">Name:</span> {user?.name}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Email:</span> {user?.email}
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">
            No orders found for this user.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Order ID
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Total
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Created At
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b text-sm text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-900">
                      {order.status}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b text-sm">
                      <Link href={`/admin/orders/${order.id}`}>
                        <button className="bg-primaryx hover:bg-primaryx-hover text-white py-1 px-3 rounded-md transition-colors">
                          View Order
                        </button>
                      </Link>
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

export default SingleUserPage;
