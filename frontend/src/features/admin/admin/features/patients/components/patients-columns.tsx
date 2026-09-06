import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@admin/lib/utils";
import { Checkbox } from "@admin/components/ui/checkbox";
import { DataTableColumnHeader } from "@admin/components/data-table";
import { renderStatusBadge } from "@admin/components/entity-list";
import { LongText } from "@admin/components/long-text";
import { patientStatusBadgeStyles } from "../data/data";
import { type Patient } from "../data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const patientsColumns: ColumnDef<Patient>[] = [
  {
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
    meta: {
      className: cn("inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky"),
    },
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
  },
  {
    accessorKey: "regnNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reg. No." />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs font-semibold uppercase text-primary ps-3">
        {row.getValue("regnNo")}
      </div>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none"
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: "patientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Name" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36 font-medium">
        {row.getValue("patientName")}
      </LongText>
    ),
    meta: { className: "w-36" },
  },
  {
    accessorKey: "mobileNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mobile Number" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue("mobileNumber")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "guardianName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Father / Spouse Name" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.getValue("guardianName")}</LongText>
    ),
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => <div>{row.getValue("age")} yrs</div>,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("gender")}</span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "disease",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Disease / Reason" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.getValue("disease")}</LongText>
    ),
  },
  {
    accessorKey: "registrationDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reg. Date" />
    ),
    cell: ({ row }) => <div>{row.getValue("registrationDate")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <div className="flex space-x-2">
          {renderStatusBadge(status, patientStatusBadgeStyles)}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  },
];
