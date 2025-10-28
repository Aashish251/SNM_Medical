import { ColumnDef } from "@tanstack/react-table";
import { availableMemory } from "process";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        className="h-4 w-4"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="h-4 w-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "regId",
    header: "Reg_id",
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "contact",
    header: "Contact",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "qualification",
    header: "Qualification",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "sewaLocation",
    header: "Sewa Location",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "shiftTime",
    header: "Shift Time",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "department",
    header: "Department",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "birthdate",
    header: "Birthdate",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "passEntry",
    header: "Pass Entry",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "isPresent",
    header: "Is Present",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    id: "certificate",
    header: "Certificate",
    cell: () => (
      <a href="#" className="text-blue-600 hover:underline">
        View
      </a>
    ),
    enableColumnFilter: false,
  },
];

// config.ts

// config.ts

export const DUMMY = {
  SevaLocation: [
    { id: 1, label: "D1", value: "D1" },
    { id: 2, label: "D2", value: "D2" },
    { id: 3, label: "D3", value: "D3" },
  ],
  availabilities: [
    { id: 1, label: "Yes", value: "Yes" },
    { id: 2, label: "No", value: "No" },
    { id: 3, label: "Maybe", value: "Maybe" },
  ],
  PassEntry: [
    { id: 1, label: "Yes", value: "Yes" },
    { id: 2, label: "No", value: "No" },
  ],
  UserRoleChecks: [
    { id: 1, name: "isPresent", label: "Is Present", defaultChecked: true },
    { id: 2, name: "passEntry", label: "Pass Entry", defaultChecked: true },
    { id: 3, name: "isAdmin", label: "Is Admin", defaultChecked: false },
    { id: 4, name: "isActive", label: "Is Active", defaultChecked: true },
  ],
  SamagamHeldIn: [
    { id: 1, label: "Delhi", value: "Delhi" },
    { id: 2, label: "Ahmedabad", value: "Ahmedabad" },
    { id: 3, label: "Mumbai", value: "Mumbai" },
  ],
};


