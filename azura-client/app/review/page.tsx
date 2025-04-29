import React, { Suspense } from "react";
import ReviewForm from ".";

const page = () => {
  return (
    <Suspense fallback={<div className="p-10">Loading review...</div>}>
      <ReviewForm />
    </Suspense>
  );
};

export default page;
