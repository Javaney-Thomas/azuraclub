import React, { Suspense } from "react";
import Products from ".";

const page = () => {
  return (
    <Suspense fallback={<div className="p-10">Loading products...</div>}>
      <Products />
    </Suspense>
  );
};

export default page;
