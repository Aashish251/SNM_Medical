import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { sleep } from "@admin-panel/lib/utils";
import { Button } from "@admin-panel/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@admin-panel/components/ui/tooltip";
import { DataTableBulkActions as BulkActionsToolbar } from "@admin-panel/components/data-table";
import { ConfirmDialog } from "@admin-panel/components/confirm-dialog";

type EntityListBulkActionsProps<TData> = {
  table: Table<TData>;
  entityLabel: string;
};

export function EntityListBulkActions<TData>({
  table,
  entityLabel,
}: EntityListBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const handleBulkDelete = () => {
    toast.promise(sleep(1500), {
      loading: `Deleting ${entityLabel.toLowerCase()} records...`,
      success: () => {
        table.resetRowSelection();
        return `Deleted ${selectedCount} record${selectedCount > 1 ? "s" : ""}`;
      },
      error: "Error deleting records",
    });
    setShowDeleteConfirm(false);
    table.resetRowSelection();
  };

  return (
    <>
      <BulkActionsToolbar table={table} entityName={entityLabel.toLowerCase()}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="Delete selected records"
            >
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected records</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete selected records"
        desc={`Are you sure you want to delete ${selectedCount} selected record${selectedCount > 1 ? "s" : ""}?`}
        confirmText="Delete"
        destructive
        handleConfirm={handleBulkDelete}
      />
    </>
  );
}
