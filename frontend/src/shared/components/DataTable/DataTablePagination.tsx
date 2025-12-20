import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@shared/components/ui";

interface PaginationComponentProps {
  /** Current active page */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Current limit (rows per page) */
  pageLimit: number;
  /** Triggered when page changes */
  onPageChange: (page: number) => void;
  /** Triggered when limit changes */
  onLimitChange: (limit: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  pageLimit,
  onPageChange,
  onLimitChange,
}) => {
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    onLimitChange(newLimit);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center py-4 px-2 border-t border-gray-200 mt-4 bg-white rounded-b-lg">
      {/* Rows per page selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
          Limit:
        </label>
        <div className="relative">
          <select
            className="appearance-none bg-white border border-gray-300 hover:border-blue-400 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-20 px-3 py-1.5 pr-8 shadow-sm transition-all duration-200 cursor-pointer"
            value={pageLimit}
            onChange={handleLimitChange}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Pagination navigation */}
      {totalPages > 1 && (
        <Pagination className="mx-auto flex w-full justify-end">
          <PaginationContent className="gap-1">
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                size="sm"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                className={`transition-all duration-200 ${currentPage === 1
                  ? "opacity-50 pointer-events-none text-gray-400"
                  : "hover:bg-blue-50 hover:text-blue-600 text-gray-600"
                  }`}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, idx) => (
              <PaginationItem key={idx + 1}>
                <PaginationLink
                  size={"default"}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(idx + 1);
                  }}
                  className={`border w-9 h-9 flex items-center justify-center rounded-md transition-all duration-200 ${currentPage === idx + 1
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                size="sm"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
                className={`transition-all duration-200 ${currentPage === totalPages
                  ? "opacity-50 pointer-events-none text-gray-400"
                  : "hover:bg-blue-50 hover:text-blue-600 text-gray-600"
                  }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaginationComponent;
