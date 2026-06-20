import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { showSubmittedData } from "@admin-panel/lib/show-submitted-data";
import { Alert, AlertDescription, AlertTitle } from "@admin-panel/components/ui/alert";
import { Input } from "@admin-panel/components/ui/input";
import { Label } from "@admin-panel/components/ui/label";
import { ConfirmDialog } from "@admin-panel/components/confirm-dialog";

type EntityDeleteDialogProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: T;
  confirmKey: keyof T & string;
  message: string;
  title?: string;
  onDelete?: () => void;
};

export function EntityDeleteDialog<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  currentRow,
  confirmKey,
  message,
  title = "Delete Record",
  onDelete,
}: EntityDeleteDialogProps<T>) {
  const [value, setValue] = useState("");
  const confirmValue = String(currentRow[confirmKey] ?? "");

  const handleDelete = () => {
    if (value.trim() !== confirmValue) return;
    if (onDelete) {
      onDelete();
    } else {
      showSubmittedData(currentRow, "The following record has been deleted:");
    }
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form="entity-delete-form"
      disabled={value.trim() !== confirmValue}
      title={
        <span className="text-destructive">
          <AlertTriangle className="me-1 inline-block stroke-destructive" size={18} />{" "}
          {title}
        </span>
      }
      desc={
        <form
          id="entity-delete-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          className="space-y-4"
        >
          <p className="mb-2">{message}</p>
          <Label className="my-2">
            Type <span className="font-bold">{confirmValue}</span> to confirm:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter ${confirmKey} to confirm deletion.`}
              autoFocus
            />
          </Label>
          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText="Delete"
      destructive
    />
  );
}
