import React, { useMemo, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@admin/components/ui/popover";
import { Button } from "@admin/components/ui/button";
import { cn } from "@admin/lib/utils";
import { SELECT_NONE_VALUE } from "../constants";
import type { SelectOption } from "../types";

type MasterSearchSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  icon?: React.ElementType;
  iconColor?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
};

export function MasterSearchSelect({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  iconColor = "text-blue-500",
  searchable = true,
  disabled = false,
  className,
}: MasterSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine if searchable should be enabled (true if explicitly true or more than 2 options)
  const isSearchable = searchable && options.length > 2;

  // Separate the "none/all" option if present, and sort all other options in ascending order
  const { noneOption, sortedOptions } = useMemo(() => {
    let none: SelectOption | null = null;
    const others: SelectOption[] = [];

    for (const opt of options) {
      if (
        opt.value === SELECT_NONE_VALUE ||
        opt.label.toLowerCase().startsWith("all ") ||
        opt.label.toLowerCase().startsWith("select ")
      ) {
        if (!none) {
          none = opt;
          continue;
        }
      }
      others.push(opt);
    }

    // Sort ascending by label
    others.sort((a, b) =>
      a.label.localeCompare(b.label, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );

    return { noneOption: none, sortedOptions: others };
  }, [options]);

  // Filter options based on user typing
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedOptions;
    }
    const query = searchQuery.trim().toLowerCase();
    return sortedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(query)
    );
  }, [searchQuery, sortedOptions]);

  // Currently selected option
  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.value) === String(value)),
    [options, value]
  );

  const isValueSelected =
    value !== undefined &&
    value !== null &&
    value !== "" &&
    value !== SELECT_NONE_VALUE;

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(SELECT_NONE_VALUE);
    setSearchQuery("");
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setSearchQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-9.5 w-full justify-between rounded-lg border-slate-200 bg-white px-3 text-xs font-normal shadow-none transition-colors hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-800/80",
            className
          )}
        >
          <div className="flex min-w-0 items-center gap-2 truncate">
            {Icon && (
              <Icon
                className={cn("h-3.5 w-3.5 shrink-0", iconColor || "text-blue-500")}
              />
            )}
            <span
              className={cn(
                "truncate",
                isValueSelected
                  ? "font-medium text-slate-800 dark:text-slate-200"
                  : "text-slate-400 dark:text-slate-400"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {isValueSelected && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400 opacity-60" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width,240px)] min-w-[200px] p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900"
      >
        {isSearchable && (
          <div className="mb-1.5 flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50/70 px-2 py-1 text-xs dark:border-slate-800 dark:bg-slate-800/50">
            <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        <div className="max-h-56 overflow-y-auto space-y-0.5">
          {noneOption && !searchQuery.trim() && (
            <button
              type="button"
              onClick={() => handleSelect(noneOption.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition-colors",
                String(value) === String(noneOption.value)
                  ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-950/60 dark:text-blue-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <span className="truncate">{noneOption.label}</span>
              {String(value) === String(noneOption.value) && (
                <Check className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          )}

          {filteredOptions.map((opt) => {
            const isSelected = String(value) === String(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition-colors",
                  isSelected
                    ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-950/60 dark:text-blue-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                )}
              </button>
            );
          })}

          {filteredOptions.length === 0 && (!noneOption || searchQuery.trim()) && (
            <div className="px-2 py-3 text-center text-xs text-slate-400">
              No matching options
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
