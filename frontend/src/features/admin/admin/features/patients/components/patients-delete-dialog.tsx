import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { showSubmittedData } from "@admin/lib/show-submitted-data";
import { Alert, AlertDescription, AlertTitle } from "@admin/components/ui/alert";
import { Input } from "@admin/components/ui/input";
import { Label } from "@admin/components/ui/label";
import { ConfirmDialog } from "@admin/components/confirm-dialog";
import { type Patient } from "../data/schema";

type PatientDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Patient;
};

export function PatientsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: PatientDeleteDialogProps) {
  const [value, setValue] = useState("");

  const handleDelete = () => {
    if (value.trim() !== currentRow.regnNo) return;

    onOpenChange(false);
    showSubmittedData(currentRow, "The following patient record has been deleted:");
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form="patients-delete-form"
      disabled={value.trim() !== currentRow.regnNo}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{" "}
          Delete Patient Record
        </span>
      }
      desc={
        <form
          id="patients-delete-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          className="space-y-4"
        >
          <p className="mb-2">
            Are you sure you want to delete patient record for{" "}
            <span className="font-bold">{currentRow.patientName}</span> ({currentRow.regnNo})?
            <br />
            This action will permanently remove the patient record from the system.
          </p>

          <Label className="my-2">
            Registration Number:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${currentRow.regnNo}" to confirm.`}
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
