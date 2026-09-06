import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@admin/components/ui/button";
import {
  createSelectColumn,
  createStatusColumn,
  createTextColumn,
} from "@admin/components/entity-list";
import { DataTableColumnHeader } from "@admin/components/data-table";
import { LongText } from "@admin/components/long-text";
import { masterSearchStatusMap } from "../data/status";
import type { MasterSearchUser } from "../types";

type CreateMasterSearchColumnsOptions = {
  onApprove: (regId: string | number) => void;
  isApproving: boolean;
};

function yesNo(value: unknown) {
  return value === 1 || value === "1" ? "Yes" : "No";
}

export function createMasterSearchColumns({
  onApprove,
  isApproving,
}: CreateMasterSearchColumnsOptions): ColumnDef<MasterSearchUser>[] {
  return [
    createSelectColumn<MasterSearchUser>(),
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Full Name" />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Link
            to={`/${user.userType}/update-profile`}
            state={{ userId: user.regId }}
            className="font-medium text-primary underline underline-offset-2"
          >
            {user.title} {user.fullName}
          </Link>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "certificateDocPath",
      header: "Certificate",
      cell: ({ row }) => {
        const path = row.original.certificateDocPath;
        if (!path) {
          return <span className="text-muted-foreground">No File</span>;
        }
        return (
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            View
          </a>
        );
      },
      enableSorting: false,
    },
    createTextColumn<MasterSearchUser>("mobileNo", "Contact", {
      sortable: false,
    }),
    {
      accessorKey: "departmentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
      cell: ({ row }) => (
        <LongText className="max-w-40">
          {String(row.getValue("departmentName") ?? "")}
        </LongText>
      ),
      enableSorting: true,
    },
    createTextColumn<MasterSearchUser>("sewalocationName", "Sewa Location", {
      sortable: false,
    }),
    {
      accessorKey: "isPresent",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Is Present" />
      ),
      cell: ({ row }) => yesNo(row.original.isPresent),
      enableSorting: true,
    },
    {
      accessorKey: "passEntry",
      header: "Pass Entry",
      cell: ({ row }) => yesNo(row.original.passEntry),
      enableSorting: false,
    },
    createTextColumn<MasterSearchUser>("shifttime", "Shift Time", {
      sortable: false,
    }),
    createTextColumn<MasterSearchUser>("onduty", "On Duty", {
      sortable: false,
    }),
    createTextColumn<MasterSearchUser>("qualificationName", "Qualification", {
      sortable: false,
    }),
    createTextColumn<MasterSearchUser>("email", "Email", { sortable: false }),
    createTextColumn<MasterSearchUser>("cityName", "City", { sortable: false }),
    createTextColumn<MasterSearchUser>("stateName", "State", {
      sortable: false,
    }),
    createStatusColumn<MasterSearchUser>(masterSearchStatusMap),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        if (user.status === "deleted") {
          return (
            <span className="text-sm text-muted-foreground">Inactive</span>
          );
        }
        if (user.status === "pending") {
          return (
            <Button
              size="sm"
              disabled={isApproving}
              onClick={() => {
                void onApprove(user.regId);
              }}
            >
              Approve
            </Button>
          );
        }
        return null;
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
