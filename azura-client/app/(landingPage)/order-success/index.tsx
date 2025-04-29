"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4"
    >
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <Link href="/products">
          <span className="bg-primaryx hover:bg-primaryx-hover text-white py-2 px-6 rounded-full transition-colors">
            Continue Shopping
          </span>
        </Link>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;
