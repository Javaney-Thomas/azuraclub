import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`px-3 py-1 rounded-md ${
            pageNumber === currentPage
              ? "bg-primaryx text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
