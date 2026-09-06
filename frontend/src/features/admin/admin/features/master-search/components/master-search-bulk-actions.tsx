import type { Table } from "@tanstack/react-table";
import { UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@admin/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@admin/components/ui/tooltip";
import { DataTableBulkActions as BulkActionsToolbar } from "@admin/components/data-table";
import type { MasterSearchUser } from "../types";
import { useMasterSearchDialogs } from "./use-master-search-dialogs";

type MasterSearchBulkActionsProps = {
  table: Table<MasterSearchUser>;
};

export function MasterSearchBulkActions({
  table,
}: MasterSearchBulkActionsProps) {
  const { setOpen } = useMasterSearchDialogs();
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const handleUpdateStatus = () => {
    if (!selectedCount) {
      toast.error("Please select at least one user to update.");
      return;
    }
    setOpen("role");
  };

  return (
    <BulkActionsToolbar table={table} entityName="user">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleUpdateStatus}
            className="size-8"
            aria-label="Update status for selected users"
            title="Update status"
          >
            <UserCog />
            <span className="sr-only">Update status</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Update status</p>
        </TooltipContent>
      </Tooltip>
    </BulkActionsToolbar>
  );
}
