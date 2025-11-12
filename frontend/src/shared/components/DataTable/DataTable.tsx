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

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
  afterStatus?: boolean; // flag to render this column after status column
}

export type ChangeUserStatusFn = (regId: string | number) => Promise<any> | void;

export interface ActionsHelpers {
  changeUserStatue?: ChangeUserStatusFn;
}

export interface TableConfig<T> {
  showCheckbox?: boolean;
  showActions?: boolean;
  actions?: {
    /**
     * render receives the row and an optional helpers object.
     * Keep UI markup in config but call side-effect handlers via helpers.
     */
    render: (row: T, helpers?: ActionsHelpers) => React.ReactNode;
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
  changeUserStatue?: ChangeUserStatusFn;
  selectedIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  sortState?: { column: string | null; direction: "asc" | "desc" };
  onSortChange?: (column: string, direction: "asc" | "desc") => void;
  rowKey?: keyof T | string;
}

/**
 * Modern, professional-styled DataTable.
 * - Supports `afterStatus` on columns (render those after the Status column)
 * - Uses `rowKey` (default "regId") for selection and stable keys
 */
export function DataTable<T extends Record<string, any>>({
  data,
  config,
  selectedIds = [],
  onSelectionChange,
  changeUserStatue,
  sortState = { column: null, direction: "asc" },
  onSortChange,
  rowKey = "regId",
}: DataTableProps<T>) {
  // safe read of row key (fallback to id or index)
  const getRowKey = React.useCallback(
    (row: T, index?: number): string | number => {
      const val = (row as any)[rowKey as any];
      if (val !== undefined && val !== null) return val;
      if ((row as any).id !== undefined && (row as any).id !== null)
        return (row as any).id;
      return index ?? "";
    },
    [rowKey]
  );

  // normalized selected set (strings) for stable comparisons
  const selectedSet = React.useMemo(
    () => new Set(selectedIds.map(String)),
    [selectedIds]
  );

  // computed selection state
  const allSelected =
    data.length > 0 &&
    data.every((r, i) => selectedSet.has(String(getRowKey(r, i))));
  const partiallySelected = selectedIds.length > 0 && !allSelected;

  // select-all (current page)
  const toggleSelectAll = () => {
    if (!onSelectionChange) return;
    const keysOnPage = data.map((r, i) => String(getRowKey(r, i)));
    if (allSelected) {
      onSelectionChange(
        selectedIds.filter((s) => !keysOnPage.includes(String(s)))
      );
    } else {
      onSelectionChange(
        Array.from(new Set([...selectedIds.map(String), ...keysOnPage]))
      );
    }
  };

  // toggle a single row
  const toggleSelectRow = (keyVal: string | number) => {
    if (!onSelectionChange) return;
    const k = String(keyVal);
    if (selectedSet.has(k))
      onSelectionChange(selectedIds.filter((s) => String(s) !== k));
    else onSelectionChange([...selectedIds.map(String), k]);
  };

  // sorting helpers
  const handleHeaderClick = (header: string, sortable?: boolean) => {
    if (!sortable) return;
    const nextDir =
      sortState.column === header && sortState.direction === "asc"
        ? "desc"
        : "asc";
    onSortChange?.(header, nextDir);
  };

  const renderSortIndicator = (header: string) => {
    const active = sortState.column === header;
    return (
      <span
        className={`ml-2 inline-flex items-center text-xs transition-opacity ${
          active ? "opacity-100" : "opacity-50"
        }`}
        aria-hidden
      >
        {active ? (sortState.direction === "asc" ? "▲" : "▼") : "↕"}
      </span>
    );
  };

  // split columns into pre-status and post-status
  const preStatusColumns = config.columns.filter((c) => !c.afterStatus);
  const postStatusColumns = config.columns.filter((c) => !!c.afterStatus);

  // helpers object to pass to renderers
  const actionsHelpers = React.useMemo<ActionsHelpers>(
    () => ({ changeUserStatue }),
    [changeUserStatue]
  );

  return (
    <div className="w-full rounded-xl border bg-white shadow-sm ring-1 ring-gray-100">
      <div className="overflow-x-auto">
        <Table className="min-w-full text-sm  ">
          {/* Sticky header for better UX on long lists */}
          <TableHeader>
            <TableRow className="sticky top-0 z-10 bg-gradient-to-b from-white to-white/95 shadow-sm">
              {/* Checkbox header */}
              {config.showCheckbox && (
                <TableHead className="px-4 py-3 text-center w-[56px] whitespace-nowrap">
                  <label className="inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = partiallySelected;
                      }}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                      aria-label="Select all rows on page"
                    />
                  </label>
                </TableHead>
              )}

              {/* Actions header */}
              {config.showActions && (
                <TableHead className="px-4 py-3 text-center w-[140px] whitespace-nowrap">
                  <span className="text-xs font-bold  text-gray-600  tracking-wide">
                    Actions
                  </span>
                </TableHead>
              )}

              {/* columns before status */}
              {preStatusColumns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  onClick={() => handleHeaderClick(col.header, col.sortable)}
                  className={`px-4 py-3 text-left align-middle ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  aria-sort={
                    sortState.column === col.header
                      ? sortState.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                      {col.header}
                    </span>
                    {col.sortable && renderSortIndicator(col.header)}
                  </div>
                </TableHead>
              ))}

              {/* Status header */}
              {config.statusColumn && (
                <TableHead className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                    Status
                  </span>
                </TableHead>
              )}

              {/* columns after status */}
              {postStatusColumns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  onClick={() => handleHeaderClick(col.header, col.sortable)}
                  className={`px-8 py-3 text-left align-middle ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                      {col.header}
                    </span>
                    {col.sortable && renderSortIndicator(col.header)}
                  </div>
                </TableHead>
              ))}
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
                  className="text-center py-12 text-gray-400 italic"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => {
                const keyVal = getRowKey(row, idx);
                const keyStr = String(keyVal);
                const isSelected = selectedSet.has(keyStr);

                return (
                  <TableRow
                    key={keyStr || idx}
                    className={`transition-colors group ${
                      isSelected
                        ? "bg-blue-50"
                        : idx % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    } hover:bg-blue-50/60 focus-within:ring-2 focus-within:ring-blue-100`}
                    tabIndex={-1}
                  >
                    {config.showCheckbox && (
                      <TableCell className="px-4 py-3 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(keyVal)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                          aria-label={`Select row ${keyStr}`}
                        />
                      </TableCell>
                    )}

                    {config.showActions && (
                      <TableCell className="px-4 py-3 text-center align-middle">
                        <div className="flex items-center justify-center gap-2">
                          {/* Pass helpers to the action renderer so it can call changeUserStatue */}
                          {config.actions?.render
                            ? config.actions.render(row, actionsHelpers)
                            : null}
                        </div>
                      </TableCell>
                    )}

                    {/* before-status columns */}
                    {preStatusColumns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className="px-4 py-3 align-middle text-gray-700 whitespace-nowrap"
                      >
                        <div className="text-sm whitespace-nowrap">
                          {col.render ? col.render(row) : (row[col.key] as any)}
                        </div>
                      </TableCell>
                    ))}

                    {/* status */}
                    {config.statusColumn && (
                      <TableCell className="px-4 py-3 text-center align-middle">
                        {config.statusColumn.render?.(row)}
                      </TableCell>
                    )}

                    {/* after-status columns */}
                    {postStatusColumns.map((col) => (
                      <TableCell
                        key={`post-${String(col.key)}`}
                        className="px-4 py-3 align-middle text-gray-700 whitespace-nowrap"
                      >
                        <div className="text-sm">
                          {col.render ? col.render(row) : (row[col.key] as any)}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* optional footer area for pagination or bulk actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-white/50">
        <div className="text-xs text-gray-600">
          Showing{" "}
          <span className="font-medium text-gray-800">{data.length}</span> rows
        </div>
        <div className="text-xs text-gray-600">
          {" "}
          {/* placeholder for pagination controls */}{" "}
        </div>
      </div>
    </div>
  );
}
