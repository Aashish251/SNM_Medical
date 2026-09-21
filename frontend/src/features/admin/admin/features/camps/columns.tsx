import type { ColumnDef } from "@tanstack/react-table";
import type { CampAdminRecord } from "@entities/camp";
import {
  createActionsColumn,
  createSelectColumn,
  createStatusColumn,
  createTextColumn,
} from "@admin/components/entity-list";
import { campStatusMap } from "./status";

export const campColumns: ColumnDef<CampAdminRecord>[] = [
  createSelectColumn<CampAdminRecord>(),
  createTextColumn<CampAdminRecord>("title", "Title"),
  createTextColumn<CampAdminRecord>("organizerName", "Organizer"),
  createTextColumn<CampAdminRecord>("driveDate", "Date", { sortable: false }),
  {
    accessorKey: "entryType",
    header: "Entry Type",
    cell: ({ row }) => (
      <span className="capitalize">{String(row.getValue("entryType"))}</span>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  createStatusColumn<CampAdminRecord>(campStatusMap),
  createActionsColumn<CampAdminRecord>("default"),
];
