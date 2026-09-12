import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { showSubmittedData } from "@admin/lib/show-submitted-data";
import { Alert, AlertDescription, AlertTitle } from "@admin/components/ui/alert";
import { Input } from "@admin/components/ui/input";
import { Label } from "@admin/components/ui/label";
import { ConfirmDialog } from "@admin/components/confirm-dialog";
import { normalizeApiError } from "@shared/api/errors";
import { type Patient } from "../data/schema";
import { useDeletePatientMutation } from "../services/patientsApi";

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
  const [deletePatient, { isLoading: isDeleting }] =
    useDeletePatientMutation();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.regnNo) return;

    try {
      await deletePatient(currentRow.id).unwrap();
      onOpenChange(false);
      showSubmittedData(currentRow, "The following patient record has been deleted:");
      setValue("");
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form="patients-delete-form"
      disabled={value.trim() !== currentRow.regnNo || isDeleting}
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
      isLoading={isDeleting}
    />
  );
}

