import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@admin/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import { getPageNumbers } from "@admin/lib/utils";

type MasterSearchPaginationProps = {
  totalRecords: number;
  currentPage: number;
  pageLimit: number;
  onPageChange: (page: number) => void;
  onPageLimitChange: (limit: number) => void;
};

export function MasterSearchPagination({
  totalRecords,
  currentPage,
  pageLimit,
  onPageChange,
  onPageLimitChange,
}: MasterSearchPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageLimit) || 1);
  const startEntry = totalRecords === 0 ? 0 : (currentPage - 1) * pageLimit + 1;
  const endEntry = Math.min(currentPage * pageLimit, totalRecords);

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6 dark:border-slate-800">
      {/* Left: Showing 1 - 10 of 84 entries */}
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{startEntry}</span> -{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{endEntry}</span> of{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{totalRecords}</span> entries
      </div>

      {/* Right: Rows dropdown + Page Numbers */}
      <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-3">
        {/* Rows per page selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <span>Rows:</span>
          <Select
            value={String(pageLimit)}
            onValueChange={(val) => onPageLimitChange(Number(val))}
          >
            <SelectTrigger className="h-8 w-16 rounded-lg border-slate-200 bg-white text-xs shadow-none dark:border-slate-700 dark:bg-slate-800">
              <SelectValue placeholder={pageLimit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="h-8 gap-1 rounded-lg border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page numbers */}
        <div className="flex max-w-full items-center gap-1 overflow-x-auto">
          {pageNumbers.map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1.5 text-xs text-slate-400"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="h-8 gap-1 rounded-lg border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
