import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { showSubmittedData } from "@admin/lib/show-submitted-data";
import { cn } from "@admin/lib/utils";
import { Button } from "@admin/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@admin/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@admin/components/ui/form";
import { Input } from "@admin/components/ui/input";
import { Textarea } from "@admin/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import type { EntityFormField } from "./types";

type EntityFormDialogProps<T extends { id: string }> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: EntityFormField[];
  currentRow?: T;
  onSubmit?: (values: Record<string, string>) => void;
};

/**
 * Searchable dropdown built without Popover/Portal so it works
 * reliably inside a Radix Dialog. Uses plain DOM positioning.
 */
function SearchableSelect({
  options = [],
  value,
  placeholder,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const filtered = useMemo(() => {
    if (!search.trim()) return options.slice(0, 50);
    const q = search.toLowerCase();
    return options.filter((o) => (o.label || "").toLowerCase().includes(q)).slice(0, 50);
  }, [options, search]);

  // Reset highlighted index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filtered.length, search]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) {
      setSearch("");
      setHighlightedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightedIndex]) {
        onChange(filtered[highlightedIndex].value);
        setOpen(false);
        setSearch("");
      }
    }
  };

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between font-normal text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={cn("truncate", !selectedLabel && "text-muted-foreground")}>
          {selectedLabel || placeholder || "Select..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${placeholder || ""}...`}
              className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  inputRef.current?.focus();
                }}
                className="text-xs text-muted-foreground hover:text-foreground p-0.5 rounded"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Options list: max-h-[190px] accommodates ~5 items with smooth scrolling */}
          <div ref={listRef} className="max-h-[190px] overflow-y-auto p-1 divide-y divide-border/20">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              filtered.map((option, idx) => {
                const isSelected = value === option.value;
                const isHighlighted = highlightedIndex === idx;
                return (
                  <button
                    key={option.value}
                    type="button"
                    title={option.label}
                    className={cn(
                      "relative flex w-full cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors text-left",
                      (isSelected || isHighlighted) && "bg-accent text-accent-foreground font-medium",
                      !isSelected && !isHighlighted && "hover:bg-accent/60"
                    )}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        isSelected ? "opacity-100 text-primary" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function EntityFormDialog<T extends { id: string }>({
  open,
  onOpenChange,
  title,
  description,
  fields,
  currentRow,
  onSubmit,
}: EntityFormDialogProps<T>) {
  const defaultValues = useMemo(
    () =>
      fields.reduce<Record<string, string>>((acc, field) => {
        const rowValue = currentRow?.[field.name as keyof T];
        acc[field.name] =
          rowValue !== undefined && rowValue !== null ? String(rowValue) : "";
        return acc;
      }, {}),
    [fields, currentRow]
  );

  const form = useForm<Record<string, string>>({ defaultValues });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, defaultValues, form]);

  const handleOpenChange = (state: boolean) => {
    if (!state) form.reset(defaultValues);
    onOpenChange(state);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="entity-form"
            onSubmit={form.handleSubmit((values) => {
              if (onSubmit) {
                onSubmit(values);
              } else {
                showSubmittedData(values);
              }
              handleOpenChange(false);
            })}
            className="space-y-4"
          >
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                rules={field.rules ?? { required: `${field.label} is required.` }}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === "searchable-select" ? (
                        <SearchableSelect
                          options={field.options || []}
                          value={formField.value}
                          placeholder={field.placeholder}
                          onChange={(val) => {
                            formField.onChange(val);
                            field.onValueChange?.(val, form.setValue);
                          }}
                        />
                      ) : field.type === "select" ? (
                        <Select
                          onValueChange={(val) => {
                            formField.onChange(val);
                            field.onValueChange?.(val, form.setValue);
                          }}
                          value={formField.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={field.placeholder ?? `Select ${field.label}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          placeholder={field.placeholder}
                          rows={3}
                          {...formField}
                        />
                      ) : (
                        <Input
                          type={field.type ?? "text"}
                          placeholder={field.placeholder}
                          {...formField}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="entity-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
