import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@admin/lib/utils";
import { Badge } from "@admin/components/ui/badge";
import { Checkbox } from "@admin/components/ui/checkbox";
import { DataTableColumnHeader } from "@admin/components/data-table";
import { LongText } from "@admin/components/long-text";
import { EntityListRowActions } from "./entity-list-row-actions";

const MUTED_STATUS_VALUES = new Set([
  "inactive",
  "draft",
  "pending",
  "cancelled",
  "failed",
  "rejected",
  "suspended",
  "invited",
]);

export function renderStatusBadge(
  status: string,
  statusBadgeMap: Map<string, string>
) {
  const normalizedStatus = status.toLowerCase();
  const badgeColor = statusBadgeMap.get(normalizedStatus) ?? "";

  return (
    <Badge
      variant="outline"
      className={cn("inline-flex items-center gap-1.5 capitalize", badgeColor)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          MUTED_STATUS_VALUES.has(normalizedStatus)
            ? "bg-muted-foreground"
            : "bg-current opacity-80"
        )}
      />
      <span>{status}</span>
    </Badge>
  );
}

export function createSelectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

export function createActionsColumn<T extends { id: string }>(
  mode: "default" | "report"
): ColumnDef<T> {
  return {
    id: "actions",
    cell: ({ row }) => <EntityListRowActions row={row} mode={mode} />,
  };
}

export function createStatusColumn<T>(
  statusBadgeMap: Map<string, string>
): ColumnDef<T> {
  return {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = String(row.getValue("status"));
      return renderStatusBadge(status, statusBadgeMap);
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    enableHiding: false,
  };
}

export function createTextColumn<T>(
  accessorKey: keyof T & string,
  title: string,
  options?: { className?: string; sortable?: boolean }
): ColumnDef<T> {
  return {
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => (
      <LongText className={cn("max-w-40", options?.className)}>
        {String(row.getValue(accessorKey as string))}
      </LongText>
    ),
    enableSorting: options?.sortable ?? true,
  };
}
