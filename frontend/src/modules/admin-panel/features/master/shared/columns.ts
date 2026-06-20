import type { ColumnDef } from "@tanstack/react-table";
import {
  createActionsColumn,
  createSelectColumn,
  createStatusColumn,
  createTextColumn,
} from "@admin-panel/components/entity-list";
import type { MasterRecord } from "./types";
import { masterStatusMap } from "./status";

export function createMasterColumns(
  nameColumnTitle: string
): ColumnDef<MasterRecord>[] {
  return [
    createSelectColumn<MasterRecord>(),
    createTextColumn<MasterRecord>("id", "ID", { className: "font-mono" }),
    createTextColumn<MasterRecord>("name", nameColumnTitle),
    createStatusColumn<MasterRecord>(masterStatusMap),
    createTextColumn<MasterRecord>("createdAt", "Created Date"),
    createTextColumn<MasterRecord>("updatedAt", "Updated Date"),
    createActionsColumn<MasterRecord>("default"),
  ];
}
