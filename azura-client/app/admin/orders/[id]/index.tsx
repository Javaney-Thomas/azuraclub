import OrderDetails from "@/app/(landingPage)/order/[id]";
import React from "react";

const Order = () => {
  return (
    <div>
      <OrderDetails backUrl={"/admin/orders"} />
    </div>
  );
};

export default Order;
