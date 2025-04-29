import React from "react";
import AnalyticsChart from "./components/AnalyticsChart";
import LatestOrders from "./components/LatestOrders";
import AdminDashboard from "./components/AdminDashboard";

const Admin = () => {
  return (
    <div>
      <AdminDashboard />
      <AnalyticsChart />
      <LatestOrders />
    </div>
  );
};

export default Admin;
