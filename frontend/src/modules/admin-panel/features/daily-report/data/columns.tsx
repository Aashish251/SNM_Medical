import type { ColumnDef } from "@tanstack/react-table";
import {
  createActionsColumn,
  createSelectColumn,
  createStatusColumn,
  createTextColumn,
} from "@admin-panel/components/entity-list";
import type { DailyReportRecord } from "./records";
import { dailyReportStatusMap } from "./records";

export const dailyReportColumns: ColumnDef<DailyReportRecord>[] = [
  createSelectColumn<DailyReportRecord>(),
  createTextColumn<DailyReportRecord>("id", "ID", { className: "font-mono" }),
  createTextColumn<DailyReportRecord>("reportName", "Report Name"),
  createTextColumn<DailyReportRecord>("date", "Date"),
  {
    accessorKey: "totalPatients",
    header: "Total Patients",
    cell: ({ row }) => row.getValue("totalPatients"),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = String(row.getValue("type")).replace(/-/g, " ");
      return <span className="capitalize">{type}</span>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  createStatusColumn<DailyReportRecord>(dailyReportStatusMap),
  createActionsColumn<DailyReportRecord>("default"),
];
