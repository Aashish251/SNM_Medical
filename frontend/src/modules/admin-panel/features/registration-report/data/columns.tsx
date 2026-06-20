import type { ColumnDef } from "@tanstack/react-table";
import {
  createActionsColumn,
  createSelectColumn,
  createStatusColumn,
  createTextColumn,
} from "@admin-panel/components/entity-list";
import type { RegistrationRecord } from "./records";
import { registrationStatusMap } from "./records";

export const registrationColumns: ColumnDef<RegistrationRecord>[] = [
  createSelectColumn<RegistrationRecord>(),
  createTextColumn<RegistrationRecord>("id", "ID", { className: "font-mono" }),
  createTextColumn<RegistrationRecord>("patientName", "Patient Name"),
  createTextColumn<RegistrationRecord>("registrationDate", "Registration Date"),
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const dept = String(row.getValue("department")).replace(/-/g, " ");
      return <span className="capitalize">{dept}</span>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  createStatusColumn<RegistrationRecord>(registrationStatusMap),
  createActionsColumn<RegistrationRecord>("default"),
];
