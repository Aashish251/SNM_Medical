import { useEffect, useMemo, useState } from "react";
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table2,
  LayoutGrid,
  Download,
  Contact2,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@admin/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@admin/components/ui/table";
import { Button } from "@admin/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu";
import { createMasterSearchColumns } from "./master-search-columns";
import { MasterSearchCards } from "./master-search-cards";
import { MasterSearchPagination } from "./master-search-pagination";
import { MasterSearchBulkActions } from "./master-search-bulk-actions";
import type { MasterSearchSortState, MasterSearchUser } from "../types";

type MasterSearchTableProps = {
  data: MasterSearchUser[];
  totalRecords: number;
  currentPage: number;
  pageLimit: number;
  onPageChange: (page: number) => void;
  onPageLimitChange: (limit: number) => void;
  sortState: MasterSearchSortState;
  onSortChange: (sort: MasterSearchSortState) => void;
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (
    updater:
      | Record<string, boolean>
      | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
  onApprove: (regId: string | number) => void;
  isApproving: boolean;
  isFetching: boolean;
  onExport: () => void;
  isExporting: boolean;
};

export function MasterSearchTable({
  data,
  totalRecords,
  currentPage,
  pageLimit,
  onPageChange,
  onPageLimitChange,
  sortState,
  onSortChange,
  rowSelection,
  onRowSelectionChange,
  onApprove,
  isApproving,
  isFetching,
  onExport,
  isExporting,
}: MasterSearchTableProps) {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo(
    () => createMasterSearchColumns({ onApprove, isApproving }),
    [isApproving, onApprove]
  );

  const sorting: SortingState = sortState.column
    ? [
        {
          id: sortState.column,
          desc: sortState.direction === "DESC",
        },
      ]
    : [];

  const pageCount = Math.max(1, Math.ceil(totalRecords / pageLimit) || 1);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageLimit,
      },
      rowSelection,
      columnVisibility,
      columnFilters,
    },
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    pageCount,
    getRowId: (row) => row.id,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: currentPage - 1, pageSize: pageLimit })
          : updater;

      if (next.pageSize !== pageLimit) {
        onPageLimitChange(next.pageSize);
        onPageChange(1);
        return;
      }

      if (next.pageIndex !== currentPage - 1) {
        onPageChange(next.pageIndex + 1);
      }
    },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const first = next[0];
      if (!first) {
        onSortChange({ column: "fullName", direction: "ASC" });
        return;
      }
      onSortChange({
        column: first.id,
        direction: first.desc ? "DESC" : "ASC",
      });
    },
    onRowSelectionChange: (updater) => {
      onRowSelectionChange((prev) =>
        typeof updater === "function" ? updater(prev) : updater
      );
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(totalRecords / pageLimit) || 1);
    if (currentPage > maxPage) {
      onPageChange(maxPage);
    }
  }, [currentPage, onPageChange, pageLimit, totalRecords]);

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Table Header with View Switcher & Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:px-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Contact2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              User List ({totalRecords})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage and view all registered users.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Table / Card View Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            <Button
              type="button"
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={`h-8 gap-1.5 rounded-md px-3 text-xs font-semibold ${
                viewMode === "table"
                  ? "bg-blue-600 text-white shadow-xs hover:bg-blue-700"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              <span>Table View</span>
            </Button>

            <Button
              type="button"
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className={`h-8 gap-1.5 rounded-md px-3 text-xs font-semibold ${
                viewMode === "card"
                  ? "bg-blue-600 text-white shadow-xs hover:bg-blue-700"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Card View</span>
            </Button>
          </div>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isExporting}
                className="h-8.5 gap-1.5 rounded-lg border-slate-200 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>{isExporting ? "Exporting..." : "Export"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 text-xs">
              <DropdownMenuItem
                onClick={onExport}
                className="gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span>Export to Excel</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      <div className="relative flex-1 p-0 sm:px-2">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] text-xs font-medium text-slate-600 dark:bg-slate-900/60 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Loading records...
            </div>
          </div>
        )}

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          "h-10 text-[11px] font-semibold text-slate-600 dark:text-slate-300",
                          header.column.columnDef.meta?.className,
                          header.column.columnDef.meta?.thClassName
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50/60 data-[state=selected]:bg-blue-50/40 dark:border-slate-800 dark:hover:bg-slate-800/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "py-2.5 text-xs text-slate-700 dark:text-slate-300",
                            cell.column.columnDef.meta?.className,
                            cell.column.columnDef.meta?.tdClassName
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center text-xs text-slate-400"
                    >
                      {isFetching ? "Loading records..." : "No results found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <MasterSearchCards
              data={data}
              rowSelection={rowSelection}
              onRowSelectionChange={onRowSelectionChange}
              onApprove={onApprove}
              isApproving={isApproving}
            />
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <MasterSearchPagination
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageLimit={pageLimit}
        onPageChange={onPageChange}
        onPageLimitChange={onPageLimitChange}
      />

      {/* Bulk actions sticky toolbar if items selected */}
      <MasterSearchBulkActions table={table} />
    </div>
  );
}
