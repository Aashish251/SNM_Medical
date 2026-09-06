import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@admin/components/ui/dialog";
import { renderStatusBadge } from "@admin/components/entity-list";
import { patientStatusBadgeStyles } from "../data/data";
import { type Patient } from "../data/schema";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pe-6">
            <span>Patient Record</span>
            {renderStatusBadge(currentRow.status, patientStatusBadgeStyles)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs font-medium">Reg. Number</span>
            <span className="font-mono font-semibold text-primary">{currentRow.regnNo}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs font-medium">Reg. Date</span>
            <span>{currentRow.registrationDate}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs font-medium">Patient Name</span>
            <span className="font-medium">{currentRow.patientName}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs font-medium">Father / Spouse Name</span>
            <span>{currentRow.guardianName}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs font-medium">Age & Gender</span>
            <span>{currentRow.age} yrs, {currentRow.gender}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs font-medium">Mobile Number</span>
            <span>{currentRow.mobileNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs font-medium">Email</span>
            <span className="break-all">{currentRow.email}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs font-medium">Disease / Reason</span>
            <span>{currentRow.disease}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground block text-xs font-medium">Address</span>
            <span>{currentRow.address}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
