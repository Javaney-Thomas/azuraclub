"use client";
import React from "react";
import "./loader.css";
const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;

// "use client";
// import React from "react";

// const Loader = () => (
//   <div className="flex justify-center items-center h-screen">
//     {/* A simple spinning circle using Tailwind classes */}
//     <div className="w-16 h-16 border-4 border-t-primaryx border-gray-200 rounded-full animate-spin" />
//   </div>
// );

// export default Loader;
