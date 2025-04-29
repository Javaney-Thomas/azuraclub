"use client";
import React from "react";
import Loader from "@/app/shared/components/Loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGetCurrentUser } from "@/app/shared/hooks/useGetCurrentUser";

const AccountProfile = () => {
  const { currentUser: user, loading, error, logout } = useGetCurrentUser();
  const router = useRouter();

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-200"
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">My Account</h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your profile and orders
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-xl font-semibold text-gray-800">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-xl font-semibold text-gray-800">{user?.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <Button
            onClick={() => router.push("/profile/orders")}
            className="w-full bg-primaryx hover:bg-primaryx-hover text-white py-3 px-6 rounded-lg transition-all"
          >
            View My Orders
          </Button>
          <Button
            onClick={() => logout()}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg transition-all"
          >
            Logout
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountProfile;
