import React, { Suspense } from "react";
import Products from ".";

const Page = () => {
  return (
    <Suspense fallback={<div className="p-10">Loading products...</div>}>
      <Products />
    </Suspense>
  );
};

export default Page;
