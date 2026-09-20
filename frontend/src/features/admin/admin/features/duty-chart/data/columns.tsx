import type { ColumnDef } from "@tanstack/react-table";
import {
  createActionsColumn,
  createSelectColumn,
  createStatusColumn,
  createTextColumn,
} from "@admin/components/entity-list";
import type { DutyChartEntry } from "../services/dutyChartApi";
import { dutyStatusMap } from "./records";

export const dutyChartColumns: ColumnDef<DutyChartEntry>[] = [
  createSelectColumn<DutyChartEntry>(),
  createTextColumn<DutyChartEntry>("id", "ID", { className: "font-mono" }),
  createTextColumn<DutyChartEntry>("name", "Name"),
  createTextColumn<DutyChartEntry>("department", "Department"),
  createTextColumn<DutyChartEntry>("date", "Date", { className: "font-mono" }),
  {
    accessorKey: "shift",
    header: "Shift",
    cell: ({ row }) => (
      <span className="capitalize">{String(row.getValue("shift"))}</span>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  createStatusColumn<DutyChartEntry>(dutyStatusMap),
  createActionsColumn<DutyChartEntry>("default"),
];