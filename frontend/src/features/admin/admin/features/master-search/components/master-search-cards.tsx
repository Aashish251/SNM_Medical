import { Link } from "react-router-dom";
import {
  MoreHorizontal,
  Building,
  MapPin,
  Phone,
  Mail,
  FileCheck,
} from "lucide-react";
import { Checkbox } from "@admin/components/ui/checkbox";
import { Button } from "@admin/components/ui/button";
import { Avatar, AvatarFallback } from "@admin/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu";
import { ROUTE_ADMIN_UPDATE_PROFILE } from "@admin/constants/routePaths";
import { ROUTE_ADMIN_PROFILE } from "@admin/constants/routePaths";
import { useAppSelector } from "@app/store/hooks";
import type { MasterSearchUser } from "../types";
import { openDocumentView } from "@shared/utils/documentHelper";

type MasterSearchCardsProps = {
  data: MasterSearchUser[];
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (
    updater:
      | Record<string, boolean>
      | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
  onApprove: (regId: string | number) => void;
  isApproving: boolean;
};

export function MasterSearchCards({
  data,
  rowSelection,
  onRowSelectionChange,
  onApprove,
  isApproving,
}: MasterSearchCardsProps) {
  const currentUserId = useAppSelector((state) => state.auth.userDetails?.id);

  const toggleSelect = (id: string, selected: boolean) => {
    onRowSelectionChange((prev) => ({
      ...prev,
      [id]: selected,
    }));
  };

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800">
        No users found matching your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((user) => {
        const isSelected = !!rowSelection[user.id];
        const isApproved =
          user.status === "approved" ||
          user.isApproved === 1 ||
          user.isApproved === ("1" as unknown);
        const name = `${user.title ? user.title + " " : ""}${user.fullName}`;
        const isCurrentUser = String(user.regId) === String(currentUserId);
        const profileRoute = isCurrentUser
          ? ROUTE_ADMIN_PROFILE
          : ROUTE_ADMIN_UPDATE_PROFILE;
        const initials =
          (user.fullName || "User")
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U";

        return (
          <div
            key={user.id}
            className={`group relative flex flex-col justify-between rounded-2xl border p-4.5 transition-all hover:shadow-md ${
              isSelected
                ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20"
                : "border-slate-200/80 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            {/* Top row: Checkbox, Status badge, and Actions menu */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    toggleSelect(user.id, !!checked)
                  }
                  className="border-slate-300"
                />
                {isApproved ? (
                  <span className="inline-flex items-center rounded-md border border-emerald-200/90 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md border border-amber-200/90 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    Pending
                  </span>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:text-slate-400"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 text-xs">
                  <DropdownMenuItem asChild>
                    <Link
                      to={profileRoute}
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
            </div>

            {/* Middle row: Avatar + Name + Qualification */}
            <div className="my-3 flex items-center gap-3">
              <Avatar className="h-11 w-11 shrink-0 rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <Link
                  to={profileRoute}
                  state={isCurrentUser ? undefined : { userId: user.regId }}
                  className="block truncate text-sm font-semibold text-slate-900 underline-offset-2 hover:text-blue-600 hover:underline dark:text-slate-100"
                >
                  {name}
                </Link>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user.qualificationName || "No qualification listed"}
                </p>
              </div>
            </div>

            {/* Details list */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800/80 dark:text-slate-400">
              <div className="flex items-center gap-2 truncate">
                <Building className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Dept:
                </span>
                <span className="truncate">
                  {user.departmentName || "General"}
                </span>
              </div>

              <div className="flex items-center gap-2 truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Location:
                </span>
                <span className="truncate">
                  {user.sewalocationName || "-"}
                </span>
              </div>

              <div className="flex items-center gap-2 truncate">
                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>{user.mobileNo || "-"}</span>
              </div>

              {user.email && (
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
            </div>

            {/* Bottom row: Certificate link */}
            {user.certificateDocPath && (
              <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => void openDocumentView(user.regId)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  View Certificate
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
