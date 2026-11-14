import React, { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@shared/components/ui/command";
import { cn } from "@shared/lib/utils";

export interface TableSearchableSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export const TableSearchableSelect: React.FC<TableSearchableSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  disabled = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "table-searchable-trigger w-full flex items-center justify-between rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium transition-all text-left",
            disabled && "cursor-not-allowed opacity-50 bg-slate-100 text-slate-400",
            className
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-1.5 size-3.5 shrink-0 text-slate-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[260px] p-0 shadow-lg border border-slate-200 bg-white z-50"
        align="start"
      >
        <Command shouldFilter={false} className="w-full">
          <CommandInput
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={setQuery}
            className="h-9 text-xs"
          />
          <CommandList className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500">
                No results found.
              </div>
            ) : (
              filtered.map((opt) => {
                const isSelected = value === opt;
                return (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={() => {
                      onChange(opt);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex items-center justify-between text-xs py-2 px-2.5 rounded-md cursor-pointer font-medium transition-colors",
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-800 hover:bg-slate-100"
                    )}
                  >
                    <span className="truncate">{opt}</span>
                    {isSelected && (
                      <Check className="size-3.5 text-blue-600 shrink-0 ml-2" />
                    )}
                  </CommandItem>
                );
              })
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

