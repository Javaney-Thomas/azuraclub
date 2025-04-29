import React from "react";
import Hero from ".";

const page = () => {
  return (
    <div>
      <Hero />
      <ul className="flex flex-col gap-x-6">{/* <FeaturedProducts /> */}</ul>
    </div>
  );
};

export default page;
