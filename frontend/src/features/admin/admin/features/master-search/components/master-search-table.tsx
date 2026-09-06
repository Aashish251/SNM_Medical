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
import { Cross2Icon } from "@radix-ui/react-icons";
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
import { Input } from "@admin/components/ui/input";
import { DataTablePagination } from "@admin/components/data-table";
import { DataTableViewOptions } from "@admin/components/data-table/view-options";
import { DataTableFacetedFilter } from "@admin/components/data-table/faceted-filter";
import { createMasterSearchColumns } from "./master-search-columns";
import { MasterSearchBulkActions } from "./master-search-bulk-actions";
import { masterSearchStatusOptions } from "../data/status";
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
  toolbarSearch: string;
  onToolbarSearchChange: (value: string) => void;
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
  toolbarSearch,
  onToolbarSearchChange,
}: MasterSearchTableProps) {
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

  const isFiltered = columnFilters.length > 0 || toolbarSearch.length > 0;

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        "flex flex-1 flex-col gap-4"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
          <Input
            placeholder="Filter records..."
            value={toolbarSearch}
            onChange={(event) => onToolbarSearchChange(event.target.value)}
            className="h-8 w-37.5 lg:w-62.5"
          />
          <div className="flex gap-x-2">
            {table.getColumn("status") && (
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={masterSearchStatusOptions}
              />
            )}
          </div>
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
                onToolbarSearchChange("");
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ms-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>

      <div className="admin-surface relative">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 text-sm text-muted-foreground">
            Loading...
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
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
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
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
                  className="admin-empty-state h-24 text-center"
                >
                  {isFetching ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
      <MasterSearchBulkActions table={table} />
    </div>
  );
}
