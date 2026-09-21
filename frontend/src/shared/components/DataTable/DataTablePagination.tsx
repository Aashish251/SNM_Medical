import React, { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
  /** Total number of records (optional) */
  totalRecords?: number;
  /** Triggered when page changes */
  onPageChange: (page: number) => void;
  /** Triggered when limit changes */
  onLimitChange: (limit: number) => void;
}

const getPaginationRange = (
  currentPage: number,
  totalPages: number
): (number | "ellipsis-left" | "ellipsis-right")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [];
  const showLeftEllipsis = currentPage > 4;
  const showRightEllipsis = currentPage < totalPages - 3;

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("ellipsis-left");
  }

  const start = Math.max(2, Math.min(currentPage - 1, totalPages - 4));
  const end = Math.min(totalPages - 1, Math.max(currentPage + 1, 5));

  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (showRightEllipsis) {
    pages.push("ellipsis-right");
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
};

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  pageLimit,
  totalRecords,
  onPageChange,
  onLimitChange,
}) => {
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    onLimitChange(newLimit);
  };

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const startRecord =
    totalRecords !== undefined && totalRecords > 0
      ? (currentPage - 1) * pageLimit + 1
      : 0;
  const endRecord =
    totalRecords !== undefined
      ? Math.min(currentPage * pageLimit, totalRecords)
      : 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center py-4 px-3 border-t border-gray-200 mt-4 bg-white rounded-b-lg">
      {/* Left side: Rows per page and Records info */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
            Rows:
          </label>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 hover:border-blue-400 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-20 px-3 py-1.5 pr-8 shadow-sm transition-all duration-200 cursor-pointer"
              value={pageLimit}
              onChange={handleLimitChange}
            >
              {[5, 10, 20, 50, 100].map((size) => (
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

        {totalRecords !== undefined && totalRecords > 0 && (
          <span className="text-xs sm:text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{startRecord}</span> -{" "}
            <span className="font-semibold text-gray-700">{endRecord}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalRecords}</span> entries
          </span>
        )}
      </div>

      {/* Right side: Pagination navigation */}
      {totalPages > 1 && (
        <Pagination className="mx-0 flex w-auto justify-end">
          <PaginationContent className="gap-1 flex-wrap">
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                size="sm"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                className={`transition-all duration-200 cursor-pointer ${
                  currentPage === 1
                    ? "opacity-50 pointer-events-none text-gray-400"
                    : "hover:bg-blue-50 hover:text-blue-600 text-gray-600"
                }`}
              />
            </PaginationItem>

            {/* Smart Windowed Page Numbers */}
            {paginationRange.map((pageNumber) => {
              if (
                pageNumber === "ellipsis-left" ||
                pageNumber === "ellipsis-right"
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              const isCurrent = currentPage === pageNumber;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    size="default"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(pageNumber);
                    }}
                    className={`border w-9 h-9 flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer text-sm font-medium ${
                      isCurrent
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm hover:bg-blue-700"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                size="sm"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
                className={`transition-all duration-200 cursor-pointer ${
                  currentPage === totalPages
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
