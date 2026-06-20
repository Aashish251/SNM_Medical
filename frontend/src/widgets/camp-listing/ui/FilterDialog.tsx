import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";
import type { Camp, CampFilters } from "../model/types";

type FilterDialogProps = {
  open: boolean;
  filters: CampFilters;
  filterCities: string[];
  filterDescription: string;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: CampFilters) => void;
  onReset: () => void;
};

const categories = [
  { key: "city", label: "City" },
  { key: "donationType", label: "Entry Type" },
] as const;

export function FilterDialog({
  open,
  filters,
  filterCities,
  filterDescription,
  onOpenChange,
  onApply,
  onReset,
}: FilterDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>(categories[0]);
  const [localFilters, setLocalFilters] = useState<CampFilters>(filters);

  const optionsMap: Record<keyof CampFilters, string[]> = {
    city: filterCities,
    donationType: ["walk-in", "appointment"],
  };

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const currentOptions = useMemo(
    () => optionsMap[selectedCategory.key],
    [selectedCategory.key]
  );

  const setValue = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, [selectedCategory.key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] lg:max-w-4xl">
        <DialogHeader className="gap-3 pb-4">
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>{filterDescription}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-8 lg:self-start">
            <div className="mb-4 px-1">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Categories</p>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  className={`flex h-12 w-full items-center rounded-2xl px-4 text-left text-sm font-medium transition ${
                    selectedCategory.key === category.key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-background text-foreground hover:border-primary/70 hover:text-primary"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-foreground">{selectedCategory.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">Select a donation type.</p>
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-primary transition hover:text-primary/80"
                onClick={() => setValue("all")}
              >
                Select all
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {currentOptions.map((option) => {
                const isActive = localFilters[selectedCategory.key] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm text-left transition ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted"
                    }`}
                    onClick={() => setValue(option)}
                  >
                    <span className={`grid h-5 w-5 place-items-center rounded-full border transition ${
                      isActive ? "border-primary bg-primary text-white" : "border-border bg-transparent text-muted-foreground"
                    }`}>
                      {isActive ? <Check className="size-4" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    </span>
                    <span className="truncate">{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl border border-border bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">Active filters</p>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preview</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(localFilters).map(([key, value]) => (
                  <span
                    key={key}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-foreground"
                  >
                    {value === "all" ? `${key}: all` : `${key}: ${value}`}
                  </span>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-6 flex flex-col-reverse gap-3 border-t border-border/80 pt-5 sm:flex-row sm:justify-between sm:items-center">
              <Button variant="secondary" type="button" onClick={onReset}>
                Reset filters
              </Button>
              <Button type="button" onClick={() => onApply(localFilters)}>
                Apply filters
              </Button>
            </DialogFooter>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
