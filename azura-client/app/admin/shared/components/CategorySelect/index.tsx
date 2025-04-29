/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { allowedCategories } from "../../utils/alllowedCategory";

type Props = {
  register: any;
};

const CategorySelect = ({ register }: Props) => {
  return (
    <select
      id="category"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      {...register("category")}
      defaultValue=""
    >
      <option value="" disabled>
        Select category
      </option>
      {allowedCategories.map((cat) => (
        <option key={cat} value={cat}>
          {cat.replace("_", " ").toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
