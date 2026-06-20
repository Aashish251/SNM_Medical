import { useEffect, useMemo, useState } from "react";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";

type EligibilityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EMPTY_FORM = {
  age: "",
  weight: "",
  haemoglobin: "",
  illness: "no",
  lastDonationDate: "",
};

export function EligibilityDialog({ open, onOpenChange }: EligibilityDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [result, setResult] = useState<"eligible" | "not-eligible" | null>(null);

  const isFormComplete = useMemo(
    () =>
      !!form.age && !!form.weight && !!form.haemoglobin && !!form.illness && !!form.lastDonationDate,
    [form]
  );

  const isEligible = useMemo(() => {
    const age = Number(form.age);
    const weight = Number(form.weight);
    const haemoglobin = Number(form.haemoglobin);

    if (!age || !weight || !haemoglobin) {
      return false;
    }

    if (age < 18 || age > 65) {
      return false;
    }

    if (weight < 50 || haemoglobin < 12) {
      return false;
    }

    if (form.illness === "yes") {
      return false;
    }

    return true;
  }, [form]);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM);
      setResult(null);
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormComplete) {
      return;
    }
    setResult(isEligible ? "eligible" : "not-eligible");
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Blood donation eligibility check</DialogTitle>
          <DialogDescription>
            Enter your details to see a quick eligibility summary. This is a UI-only check for planning.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-6">
            <div
              className={`rounded-3xl border p-6 shadow-sm ${
                result === "eligible"
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-destructive/30 bg-destructive/10"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Eligibility result
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-foreground">
                {result === "eligible" ? "Eligible to donate" : "Not eligible at this time"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {result === "eligible"
                  ? "Based on the information entered, you appear to meet the basic donation criteria for a safe donation visit."
                  : "Some eligibility details indicate you should review the requirements before visiting a camp. Please consult the camp organizers or a health professional for confirmation."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-muted-foreground">Age</p>
                <p className="mt-3 text-xl font-semibold text-foreground">{form.age} years</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-muted-foreground">Haemoglobin</p>
                <p className="mt-3 text-xl font-semibold text-foreground">{form.haemoglobin} g/dL</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-muted-foreground">Weight</p>
                <p className="mt-3 text-xl font-semibold text-foreground">{form.weight} kg</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-muted-foreground">Recent illness</p>
                <p className="mt-3 text-xl font-semibold text-foreground">
                  {form.illness === "yes" ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="secondary" type="button" onClick={handleReset}>
                Start new check
              </Button>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eligibility-age">Age</Label>
                <Input
                  id="eligibility-age"
                  name="age"
                  type="number"
                  min={1}
                  placeholder="Enter age"
                  value={form.age}
                  onChange={(event) => setForm({ ...form, age: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eligibility-weight">Weight (kg)</Label>
                <Input
                  id="eligibility-weight"
                  name="weight"
                  type="number"
                  min={1}
                  placeholder="Enter weight"
                  value={form.weight}
                  onChange={(event) => setForm({ ...form, weight: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eligibility-haemoglobin">Haemoglobin (g/dL)</Label>
                <Input
                  id="eligibility-haemoglobin"
                  name="haemoglobin"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="Enter value"
                  value={form.haemoglobin}
                  onChange={(event) => setForm({ ...form, haemoglobin: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eligibility-last-donation">Last donation date</Label>
                <Input
                  id="eligibility-last-donation"
                  name="lastDonationDate"
                  type="date"
                  value={form.lastDonationDate}
                  onChange={(event) => setForm({ ...form, lastDonationDate: event.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibility-illness">Recent illness?</Label>
              <Select
                value={form.illness}
                onValueChange={(value) => setForm({ ...form, illness: value })}
              >
                <SelectTrigger id="eligibility-illness" className="w-full" aria-label="Recent illness">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="secondary" type="button" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" disabled={!isFormComplete}>
                Check eligibility
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
