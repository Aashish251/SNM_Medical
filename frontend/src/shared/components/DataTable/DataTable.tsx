// 📄 @shared/components/DataTable/DataTable.tsx
import * as React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/components/ui";
import { Button } from "@shared/components/ui/button";

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface TableConfig<T> {
  showCheckbox?: boolean;
  showActions?: boolean;
  actions?: {
    render: (row: T) => React.ReactNode;
  };
  columns: TableColumn<T>[];
  statusColumn?: {
    key: keyof T | string;
    render?: (row: T) => React.ReactNode;
  };
}

export interface DataTableProps<T> {
  data: T[];
  config: TableConfig<T>;
  selectedIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  sortState?: { column: string | null; direction: "asc" | "desc" };
  onSortChange?: (column: string, direction: "asc" | "desc") => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  config,
  selectedIds = [],
  onSelectionChange,
  sortState = { column: null, direction: "asc" },
  onSortChange,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const partiallySelected = selectedIds.length > 0 && !allSelected;

  // ✅ Handle select all
  const toggleSelectAll = () => {
    if (allSelected) onSelectionChange?.([]);
    else onSelectionChange?.(data.map((row) => row.id));
  };

  // ✅ Handle individual select
  const toggleSelectRow = (id: string | number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter((x) => x !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  // ✅ Sorting
  const handleHeaderClick = (header: string, sortable?: boolean) => {
    if (!sortable) return;
    const nextDirection =
      sortState.column === header && sortState.direction === "asc"
        ? "desc"
        : "asc";
    onSortChange?.(header, nextDirection);
  };

  const renderSortArrow = (header: string) => {
    if (sortState.column !== header)
      return <span className="ml-1 text-white opacity-60">⇅</span>;
    return sortState.direction === "asc" ? (
      <span className="ml-1 text-white">↑</span>
    ) : (
      <span className="ml-1 text-white">↓</span>
    );
  };

  // ✅ Table rendering
  return (
    <div className="overflow-x-auto w-full rounded-xl border border-gray-200 bg-white shadow-sm">
      <Table className="min-w-full text-sm">
        <TableHeader>
          <TableRow className="bg-black hover:bg-black">
            {/* Checkbox header */}
            {config.showCheckbox && (
              <TableHead className="px-4 py-3 text-center text-white w-[50px]">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = partiallySelected;
                  }}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 cursor-pointer accent-blue-600"
                />
              </TableHead>
            )}

            {/* Action column */}
            {config.showActions && (
              <TableHead className="px-4 py-3 text-center text-white font-semibold w-[140px]">
                Actions
              </TableHead>
            )}

            {/* Sortable columns */}
            {config.columns.map((col) => (
              <TableHead
                key={col.key.toString()}
                onClick={() => handleHeaderClick(col.header, col.sortable)}
                className={`px-4 py-3 text-left font-semibold text-white ${
                  col.sortable ? "cursor-pointer select-none" : ""
                }`}
              >
                <div className="flex items-center">
                  {col.header}
                  {col.sortable && renderSortArrow(col.header)}
                </div>
              </TableHead>
            ))}

            {/* Status */}
            {config.statusColumn && (
              <TableHead className="px-4 py-3 text-center font-semibold text-white">
                Status
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  config.columns.length +
                  (config.showCheckbox ? 1 : 0) +
                  (config.showActions ? 1 : 0) +
                  (config.statusColumn ? 1 : 0)
                }
                className="text-center py-6 text-gray-500 italic"
              >
                No records found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => {
              const isSelected = selectedIds.includes(row.id);
              return (
                <TableRow
                  key={row.id}
                  className={`${
                    isSelected
                      ? "bg-blue-50"
                      : i % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors`}
                >
                  {/* Row checkbox */}
                  {config.showCheckbox && (
                    <TableCell className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(row.id)}
                        className="h-4 w-4 cursor-pointer accent-blue-600"
                      />
                    </TableCell>
                  )}

                  {/* Action buttons */}
                  {config.showActions && (
                    <TableCell className="px-4 py-3 text-center">
                      {config.actions?.render(row)}
                    </TableCell>
                  )}

                  {/* Columns */}
                  {config.columns.map((col) => (
                    <TableCell
                      key={col.key.toString()}
                      className="px-4 py-3 text-gray-700"
                    >
                      {col.render ? col.render(row) : (row[col.key] as any)}
                    </TableCell>
                  ))}

                  {/* Status */}
                  {config.statusColumn && (
                    <TableCell className="px-4 py-3 text-center">
                      {config.statusColumn.render?.(row)}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
