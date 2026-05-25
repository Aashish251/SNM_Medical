import { useEffect, useMemo, useState } from "react";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import type { BloodDonationCamp } from "../types";

type DonationRegistrationDialogProps = {
  open: boolean;
  camp: BloodDonationCamp | null;
  onOpenChange: (open: boolean) => void;
};

const EMPTY_REGISTRATION = {
  name: "",
  email: "",
  phone: "",
  preferredTime: "",
};

export function DonationRegistrationDialog({ open, camp, onOpenChange }: DonationRegistrationDialogProps) {
  const [form, setForm] = useState(EMPTY_REGISTRATION);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_REGISTRATION);
      setSubmitted(false);
    }
  }, [open]);

  const canSubmit = useMemo(
    () => !!form.name && !!form.email && !!form.phone && !!form.preferredTime,
    [form]
  );

  const actionLabel = camp?.entryType === "walk-in" ? "Donate Blood" : "Book Appointment";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{camp ? actionLabel : "Register for donation"}</DialogTitle>
          <div className="text-sm leading-relaxed text-muted-foreground">
            {camp
              ? `Complete this registration to reserve your slot for ${camp.title}.`
              : "Select a camp to continue your donation registration."}
          </div>
        </DialogHeader>

        {camp ? (
          submitted ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Registration complete</p>
                <h2 className="mt-4 text-2xl font-semibold text-foreground">Thank you, {form.name}!</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Your {camp.entryType === "walk-in" ? "visit" : "appointment"} request for {camp.title} has been recorded. The camp organizing team will contact you soon.
                </p>
              </div>
              <DialogFooter>
                <Button variant="secondary" type="button" onClick={() => setSubmitted(false)}>
                  Register another camp
                </Button>
                <Button type="button" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="donation-name">Full name</Label>
                  <Input
                    id="donation-name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donation-email">Email address</Label>
                  <Input
                    id="donation-email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donation-phone">Phone number</Label>
                  <Input
                    id="donation-phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donation-time">Preferred time</Label>
                  <Input
                    id="donation-time"
                    placeholder="e.g. 10:00 AM"
                    value={form.preferredTime}
                    onChange={(event) => setForm({ ...form, preferredTime: event.target.value })}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5">
                <p className="text-sm font-semibold text-foreground">Camp details</p>
                <p className="mt-2 text-sm text-muted-foreground">{camp.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{camp.fullAddress}</p>
                <p className="mt-1 text-sm text-muted-foreground">{camp.driveDate} · {camp.startTime} – {camp.endTime}</p>
              </div>

              <DialogFooter>
                <Button variant="secondary" type="button" onClick={() => setForm(EMPTY_REGISTRATION)}>
                  Reset
                </Button>
                <Button type="submit" disabled={!canSubmit}>
                  {actionLabel}
                </Button>
              </DialogFooter>
            </form>
          )
        ) : (
          <div className="rounded-3xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">No camp selected.</p>
            <p className="mt-3 text-sm text-foreground">Choose a camp card to see the registration form.</p>
            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
