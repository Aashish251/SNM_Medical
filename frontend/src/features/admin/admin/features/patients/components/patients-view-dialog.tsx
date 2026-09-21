import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@admin/components/ui/dialog";
import { renderStatusBadge } from "@admin/components/entity-list";
import { patientStatusBadgeStyles } from "../data/data";
import { mapApiPatientToPatient, type Patient } from "../data/schema";
import { useGetPatientByIdQuery } from "../services/patientsApi";

type PatientViewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Patient;
};

export function PatientsViewDialog({
  open,
  onOpenChange,
  currentRow,
}: PatientViewDialogProps) {
  const { data: response, isLoading, isFetching } = useGetPatientByIdQuery(
    currentRow.id,
    {
      skip: !open || !currentRow?.id,
    }
  );

  const patient = response?.data
    ? mapApiPatientToPatient(response.data)
    : currentRow;

  const isBusy = isLoading || isFetching;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pe-6">
            <span>Patient Record</span>
            {renderStatusBadge(patient.status, patientStatusBadgeStyles)}
          </DialogTitle>
        </DialogHeader>

        {isBusy ? (
          <div className="flex h-48 items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Fetching patient details...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 py-2 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs font-medium">Reg. Number</span>
              <span className="font-mono font-semibold text-primary">{patient.regnNo}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs font-medium">Reg. Date</span>
              <span>{patient.registrationDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs font-medium">Patient Name</span>
              <span className="font-medium">{patient.patientName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs font-medium">Father / Spouse Name</span>
              <span>{patient.guardianName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs font-medium">Age & Gender</span>
              <span>{patient.age} yrs, {patient.gender}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs font-medium">Mobile Number</span>
              <span>{patient.mobileNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs font-medium">Email</span>
              <span className="break-all">{patient.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs font-medium">Disease / Reason</span>
              <span>{patient.disease}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground block text-xs font-medium">Address</span>
              <span>{patient.address}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
