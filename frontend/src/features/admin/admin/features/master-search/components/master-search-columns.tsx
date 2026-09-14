import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@admin/components/ui/button";
import { Checkbox } from "@admin/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@admin/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu";
import {
  ROUTE_ADMIN_PROFILE,
  ROUTE_ADMIN_UPDATE_PROFILE,
} from "@admin/constants/routePaths";
import type { MasterSearchUser } from "../types";
import { openDocumentView } from "@shared/utils/documentHelper";

type CreateMasterSearchColumnsOptions = {
  onApprove: (regId: string | number) => void;
  isApproving: boolean;
  currentUserId?: string | number;
};

function yesNo(value: unknown) {
  return value === 1 || value === "1" ? "Yes" : "No";
}

export function createMasterSearchColumns({
  onApprove,
  isApproving,
  currentUserId,
}: CreateMasterSearchColumnsOptions): ColumnDef<MasterSearchUser>[] {
  return [
    // 1. Select Checkbox
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5 border-slate-300"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5 border-slate-300"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // 2. Row index (#)
    {
      id: "index",
      header: "#",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return (
          <span className="text-xs text-slate-500">
            {pageIndex * pageSize + row.index + 1}
          </span>
        );
      },
      enableSorting: false,
    },

    // 3. Status
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentUser = String(user.regId) === String(currentUserId);
        const isApproved =
          user.status === "approved" ||
          user.isApproved === 1 ||
          user.isApproved === ("1" as unknown);

        if (isApproved) {
          return (
            <span className="inline-flex items-center rounded-md border border-emerald-200/90 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              Approved
            </span>
          );
        }
        return (
          <span className="inline-flex items-center rounded-md border border-amber-200/90 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            Pending
          </span>
        );
      },
      enableSorting: false,
    },

    // 4. Full Name (with Avatar thumbnail & blue link)
    {
      accessorKey: "fullName",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Full Name</span>
            {isSorted === "asc" ? (
              <ArrowUp className="ml-1 h-3.5 w-3.5" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="ml-1 h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentUser = String(user.regId) === String(currentUserId);
        const name = `${user.title ? user.title + " " : ""}${user.fullName}`;
        const initials =
          (user.fullName || "User")
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U";

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6.5 w-6.5 shrink-0 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
              <Link
                to={isCurrentUser ? ROUTE_ADMIN_PROFILE : ROUTE_ADMIN_UPDATE_PROFILE}
                state={isCurrentUser ? undefined : { userId: user.regId }}
              className="text-xs font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400"
            >
              {name}
            </Link>
          </div>
        );
      },
      enableSorting: true,
    },

    // 5. Certificate
    {
      accessorKey: "certificateDocPath",
      header: "Certificate",
      cell: ({ row }) => {
        const path = row.original.certificateDocPath;
        if (!path) {
          return <span className="text-xs text-slate-400">-</span>;
        }
        return (
          <button
            type="button"
            onClick={() => void openDocumentView(row.original.regId)}
            className="text-xs font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400"
          >
            View
          </button>
        );
      },
      enableSorting: false,
    },

    // 6. Contact
    {
      accessorKey: "mobileNo",
      header: "Contact",
      cell: ({ row }) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {row.original.mobileNo || "-"}
        </span>
      ),
      enableSorting: false,
    },

    // 7. Department
    {
      accessorKey: "departmentName",
      header: "Department",
      cell: ({ row }) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {row.original.departmentName || "-"}
        </span>
      ),
      enableSorting: true,
    },

    // 8. Sewa Location
    {
      accessorKey: "sewalocationName",
      header: "Sewa Location",
      cell: ({ row }) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {row.original.sewalocationName || "-"}
        </span>
      ),
      enableSorting: false,
    },

    // 9. Is Present
    {
      accessorKey: "isPresent",
      header: "Is Present",
      cell: ({ row }) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {yesNo(row.original.isPresent)}
        </span>
      ),
      enableSorting: true,
    },

    // 10. Pass Entry
    {
      accessorKey: "passEntry",
      header: "Pass Entry",
      cell: ({ row }) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {yesNo(row.original.passEntry)}
        </span>
      ),
      enableSorting: false,
    },

    // 11. Shift Time
    {
      accessorKey: "shifttime",
      header: "Shift Time",
      cell: ({ row }) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {row.original.shifttime || "All-Time"}
        </span>
      ),
      enableSorting: false,
    },

    // 12. On Duty
    {
      accessorKey: "onduty",
      header: "On Duty",
      cell: ({ row }) => {
        const val = row.original.onduty;
        const display =
          val === "Yes" || val === 1 || val === "1" ? "Yes" : "-";
        return (
          <span className="text-xs text-slate-700 dark:text-slate-300">
            {display}
          </span>
        );
      },
      enableSorting: false,
    },

    // 13. Qualification
    {
      accessorKey: "qualificationName",
      header: "Qualification",
      cell: ({ row }) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {row.original.qualificationName || "-"}
        </span>
      ),
      enableSorting: false,
    },

    // 14. Email
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.original.email || "-";
        return (
          <span
            className="block max-w-[130px] truncate text-xs text-slate-700 dark:text-slate-300"
            title={email}
          >
            {email}
          </span>
        );
      },
      enableSorting: false,
    },

    // 15. Actions
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentUser = String(user.regId) === String(currentUserId);
        const isApproved =
          user.status === "approved" ||
          user.isApproved === 1 ||
          user.isApproved === ("1" as unknown);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 text-xs">
              <DropdownMenuItem asChild>
                <Link
                  to={isCurrentUser ? ROUTE_ADMIN_PROFILE : ROUTE_ADMIN_UPDATE_PROFILE}
                  state={isCurrentUser ? undefined : { userId: user.regId }}
                >
                  View Profile
                </Link>
              </DropdownMenuItem>
              {!isApproved && (
                <DropdownMenuItem
                  disabled={isApproving}
                  onClick={() => onApprove(user.regId)}
                  className="font-medium text-emerald-600 focus:text-emerald-700"
                >
                  Approve User
                </DropdownMenuItem>
              )}
              {user.certificateDocPath && (
                <DropdownMenuItem
                  onSelect={() => {
                    void openDocumentView(user.regId);
                  }}
                >
                    View Certificate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
