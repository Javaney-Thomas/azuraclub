"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ANALYTICS_DATA } from "@/app/shared/utils/queries";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AnalyticsChart: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ANALYTICS_DATA);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );

  // Transform the fetched analytics data into an array suitable for the chart.
  // Make sure GET_ANALYTICS_DATA returns analyticsData with the fields defined in your schema.
  const { totalUsers, totalProducts, totalOrders, productViews, activeUsers } =
    data.analyticsData;
  const chartData = [
    { name: "Users", value: totalUsers },
    { name: "Products", value: totalProducts },
    { name: "Orders", value: totalOrders },
    { name: "Views", value: productViews },
    { name: "Active", value: activeUsers },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Site Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#4B5563" }} />
          <YAxis tick={{ fill: "#4B5563" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#6366F1" name="Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
