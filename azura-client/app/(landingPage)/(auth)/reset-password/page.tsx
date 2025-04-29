import React, { Suspense } from "react";
import ResetPassword from ".";

const page = () => {
  return (
    <Suspense fallback={<div className="p-10">Loading products...</div>}>
      <ResetPassword />;
    </Suspense>
  );
};

export default page;
