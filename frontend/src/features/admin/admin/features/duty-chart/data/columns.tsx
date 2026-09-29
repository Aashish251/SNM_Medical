import type { ColumnDef, Row } from "@tanstack/react-table";
import { MoreVertical, Eye, UserPen, Trash2 } from "lucide-react";
import {
  createSelectColumn,
  createStatusColumn,
  createTextColumn,
  useEntityList,
} from "@admin/components/entity-list";
import { Button } from "@admin/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu";
import type { DutyChartEntry } from "../services/dutyChartApi";
import { dutyStatusMap } from "./records";

function DutyChartRowActions({ row }: { row: Row<DutyChartEntry> }) {
  const { setOpen, setCurrentRow } = useEntityList<DutyChartEntry>();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted ml-auto"
          title="Available actions"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open actions menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("view");
          }}
          className="cursor-pointer"
        >
          View
          <DropdownMenuShortcut>
            <Eye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("edit");
          }}
          className="cursor-pointer"
        >
          Edit
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("delete");
          }}
          className="text-red-500! cursor-pointer"
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const dutyChartColumns: ColumnDef<DutyChartEntry>[] = [
  createSelectColumn<DutyChartEntry>(),
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
  {
    id: "actions",
    header: () => <div className="text-right pr-2 font-medium">Action</div>,
    cell: ({ row }) => <DutyChartRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];