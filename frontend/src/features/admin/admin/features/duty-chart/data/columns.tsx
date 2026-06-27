import type { ColumnDef } from "@tanstack/react-table";
import {
  createActionsColumn,
  createSelectColumn,
  createStatusColumn,
  createTextColumn,
} from "@admin/components/entity-list";
import type { DutyChartRecord } from "./records";
import { dutyStatusMap } from "./records";

export const dutyChartColumns: ColumnDef<DutyChartRecord>[] = [
  createSelectColumn<DutyChartRecord>(),
  createTextColumn<DutyChartRecord>("id", "ID", { className: "font-mono" }),
  createTextColumn<DutyChartRecord>("doctorName", "Doctor Name"),
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
  {
    accessorKey: "shift",
    header: "Shift",
    cell: ({ row }) => (
      <span className="capitalize">{String(row.getValue("shift"))}</span>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  createStatusColumn<DutyChartRecord>(dutyStatusMap),
  createActionsColumn<DutyChartRecord>("default"),
];
