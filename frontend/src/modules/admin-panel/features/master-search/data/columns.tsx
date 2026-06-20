import type { ColumnDef } from "@tanstack/react-table";
import {
  createActionsColumn,
  createSelectColumn,
  createStatusColumn,
  createTextColumn,
} from "@admin-panel/components/entity-list";
import type { MasterSearchRecord } from "./records";
import { masterSearchStatusMap } from "./records";

export const masterSearchColumns: ColumnDef<MasterSearchRecord>[] = [
  createSelectColumn<MasterSearchRecord>(),
  createTextColumn<MasterSearchRecord>("id", "ID", { className: "font-mono" }),
  {
    accessorKey: "recordType",
    header: "Record Type",
    cell: ({ row }) => (
      <span className="capitalize">{String(row.getValue("recordType"))}</span>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  createTextColumn<MasterSearchRecord>("name", "Name"),
  createTextColumn<MasterSearchRecord>("phone", "Phone", { sortable: false }),
  createStatusColumn<MasterSearchRecord>(masterSearchStatusMap),
  createActionsColumn<MasterSearchRecord>("default"),
];
