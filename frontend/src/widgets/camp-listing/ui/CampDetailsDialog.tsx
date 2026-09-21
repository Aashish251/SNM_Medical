import React from "react";
import { Calendar, Clock, MapPin, Phone, Mail, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@shared/components/ui/dialog";
import { SNM_NAV_PATIENT_REGISTRATION_LINK } from "@shared/constants";
import type { Camp, CampListingLabels } from "../model/types";

type CampDetailsDialogProps = {
  open: boolean;
  camp: Camp | null;
  labels: CampListingLabels;
  onOpenChange: (open: boolean) => void;
  onRegister: (camp: Camp) => void;
};

function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
      {children}
    </span>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-primary">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ContactBlock({ phone, email }: { phone: string; email: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InfoItem
        icon={<Phone className="size-4" />}
        label="Phone"
        value={phone}
      />
      <InfoItem
        icon={<Mail className="size-4" />}
        label="Email"
        value={email}
      />
    </div>
  );
}

function EntryTypeBadge({
  entryType,
}: {
  entryType: Camp["entryType"];
}) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
      {entryType === "walk-in" ? "Walk-in Allowed" : "Appointment Required"}
    </span>
  );
}

export function CampDetailsDialog({
  open,
  camp,
  labels,
  onOpenChange,
  onRegister,
}: CampDetailsDialogProps) {
  const navigate = useNavigate();

  if (!camp) return null;

  const actionLabel =
    camp.entryType === "walk-in" ? labels.walkInAction : labels.appointmentAction;
  const city = camp.fullAddress.split(",").pop()?.trim() || "Location";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(90vw,1120px)] max-w-[1120px] max-h-[90vh] p-0 overflow-hidden">
        <div className="bg-to-right-theme-gradient px-6 py-5 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                {camp.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90">
                {camp.shortDescription}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                
                <StatusBadge>
                 {camp.entryType === "walk-in" ? "Walk-in allowed" : "Appointment required"}
                </StatusBadge>
              </div>
            </div>

            <DialogClose className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
              <X />
            </DialogClose>
          </div>
        </div>

        <div className="flex h-[calc(90vh-6.5rem)] flex-col bg-background">
          <div className="overflow-y-auto px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <DetailSection title="Overview">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    icon={<Calendar className="size-4 text-primary" />}
                    label="Drive Date"
                    value={camp.driveDate}
                  />
                  <InfoItem
                    icon={<Clock className="size-4 text-primary" />}
                    label="Start Time"
                    value={camp.startTime}
                  />
                  <InfoItem
                    icon={<Clock className="size-4 text-primary" />}
                    label="End Time"
                    value={camp.endTime}
                  />
                </div>
              </DetailSection>

              <DetailSection title="Location">
                <div className="grid gap-4">
                  <InfoItem
                    icon={<MapPin className="size-4 text-primary" />}
                    label="Full Address"
                    value={camp.fullAddress}
                  />
                  <InfoItem
                    icon={<MapPin className="size-4 text-primary" />}
                    label="Landmark"
                    value={camp.landmark}
                  />
                </div>
              </DetailSection>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <DetailSection title="Organizer">
                <InfoItem
                  icon={<MapPin className="size-4 text-primary" />}
                  label="Organizer Name"
                  value={camp.organizerName}
                />
              </DetailSection>

              <DetailSection title="Contact">
                <ContactBlock phone={camp.phone} email={camp.email} />
              </DetailSection>
            </div>

            <DetailSection title="Entry Information">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <EntryTypeBadge entryType={camp.entryType} />
                <p className="max-w-xl text-sm text-muted-foreground">
                  {camp.entryType === "walk-in"
                    ? "Donors can arrive anytime during the camp hours without prior booking."
                    : "Please book an appointment to confirm your slot and avoid waiting time."}
                </p>
              </div>
            </DetailSection>
          </div>

          <DialogFooter className="sticky bottom-0 z-20 border-t border-border/70 bg-background/95 px-6 py-4 backdrop-blur-sm">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="link"
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  navigate(SNM_NAV_PATIENT_REGISTRATION_LINK);
                }}
                className="justify-start"
              >
                Patient Registration
              </Button>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button type="button" onClick={() => onRegister(camp)}>
                  {actionLabel}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
