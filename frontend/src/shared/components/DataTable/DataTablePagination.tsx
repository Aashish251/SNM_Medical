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
  if (totalPages <= 1) return null;

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    onLimitChange(newLimit);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center py-4">
      {/* Rows per page selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">
          Rows per page:
        </label>
        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pageLimit}
          onChange={handleLimitChange}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination navigation */}
      <Pagination className="mx-auto flex w-full justify-end">
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              size="sm"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={
                currentPage === 1
                  ? "opacity-50 pointer-events-none"
                  : "hover:bg-blue-100"
              }
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
                className={`${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "hover:bg-gray-100"
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
              className={
                currentPage === totalPages
                  ? "opacity-50 pointer-events-none"
                  : "hover:bg-blue-100"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
