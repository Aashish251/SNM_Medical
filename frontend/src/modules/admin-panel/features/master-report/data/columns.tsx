import type { ColumnDef } from "@tanstack/react-table";
import {
  createActionsColumn,
  createSelectColumn,
  createStatusColumn,
  createTextColumn,
} from "@admin-panel/components/entity-list";
import type { MasterReportRecord } from "./records";
import { masterReportStatusMap } from "./records";

export const masterReportColumns: ColumnDef<MasterReportRecord>[] = [
  createSelectColumn<MasterReportRecord>(),
  createTextColumn<MasterReportRecord>("id", "ID", { className: "font-mono" }),
  createTextColumn<MasterReportRecord>("reportName", "Report Name"),
  createTextColumn<MasterReportRecord>("createdBy", "Created By"),
  createTextColumn<MasterReportRecord>("createdDate", "Created Date"),
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">{String(row.getValue("type"))}</span>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  createStatusColumn<MasterReportRecord>(masterReportStatusMap),
  createActionsColumn<MasterReportRecord>("report"),
];
