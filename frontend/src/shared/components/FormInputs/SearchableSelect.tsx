import React, { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { Label } from "@shared/components/ui/label";
import { Button } from "@shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@shared/components/ui/command";
import { RequiredMark } from "./FormHelpers";

interface Option {
  id: number;
  [key: string]: any;
}

interface SearchableSelectProps {
  control: any;
  name: string;
  label: string;
  options: Option[];
  labelKey: string;
  valueKey: string;
  placeholder?: string;
  required?: boolean;
  rules?: any;
  value?: number | string;
  allowClear?: boolean; // new: whether clear (×) button is shown
  disabled?: boolean; // new: disable the trigger
  noOptionsMessage?: string; // new: customize "no items" message
  onChange?: (val: any) => void; // optional callback when selection changes
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  control,
  name,
  label,
  options,
  labelKey,
  valueKey,
  placeholder = "Select option",
  required = false,
  rules = {},
  value,
  allowClear = true,
  disabled = false,
  noOptionsMessage,
  onChange,
}) => {
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </Label>

      <Controller
        name={name}
        control={control}
        defaultValue={value ?? ""}
        rules={required ? { required: `${label} is required`, ...rules } : rules}
        render={({ field, fieldState }) => {
          // safe effect for controlled prefill
          useEffect(() => {
            if (value !== undefined && value !== null && !field.value) {
              field.onChange(value);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [value]);

          // local query state to filter options
          const [query, setQuery] = useState("");

          // compute filtered options memoized for performance
          const filteredOptions = useMemo(() => {
            if (!Array.isArray(options)) return [];
            if (!query) return options;
            const q = String(query).trim().toLowerCase();
            return options.filter((opt) =>
              String(opt[labelKey]).toLowerCase().includes(q)
            );
          }, [options, labelKey, query]);

          // find selected option (safe)
          const selectedOption =
            Array.isArray(options) && field.value !== undefined && field.value !== ""
              ? options.find((opt) => opt[valueKey] === field.value) ?? null
              : null;

          // when selection changes, call optional onChange prop
          const handleSelect = (val: any) => {
            field.onChange(val);
            if (onChange) onChange(val);
            setOpenPopover(false);
            setQuery("");
          };

          const handleClear = (e?: React.MouseEvent) => {
            e?.stopPropagation();
            field.onChange("");
            if (onChange) onChange("");
            setQuery("");
            // keep popover closed
            setOpenPopover(false);
          };

          return (
            <>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPopover}
                      aria-controls={`${name}-listbox`}
                      aria-haspopup="listbox"
                      className={`w-full justify-between text-sm font-medium text-gray-700 ${
                        disabled ? "opacity-50 pointer-events-none" : ""
                      }`}
                      type="button"
                      onClick={() => !disabled && setOpenPopover((s) => !s)}
                    >
                      <span className="truncate">
                        {selectedOption ? selectedOption[labelKey] : placeholder}
                      </span>

                      <div className="ml-2 flex items-center gap-2">
                        

                        {/* simple caret */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        {/* clear button shown only when something is selected and allowClear */}
                        {allowClear && selectedOption && !disabled && (
                          <button
                            type="button"
                            aria-label="clear selection"
                            onClick={handleClear}
                            className="text-gray-400 hover:text-gray-600 -mr-1"
                            title="Clear"
                          >
                            &#x2715;
                          </button>
                        )}
                      </div>
                    </Button>
                  </div>
                </PopoverTrigger>

                <PopoverContent
                  className="w-full p-0 max-h-72 overflow-hidden"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder={`Search ${label?.toLowerCase()}...`}
                      value={query}
                      onValueChange={(val) => setQuery(val)}
                      aria-label={`Search ${label}`}
                    />
                    <CommandList id={`${name}-listbox`}>
                      {Array.isArray(filteredOptions) && filteredOptions.length > 0 ? (
                        filteredOptions.map((item) => (
                          <CommandItem
                            className={`text-sm font-medium text-gray-700 hover:text-grey-900 truncate ${
                              selectedOption && item[valueKey] === selectedOption[valueKey]
                                ? "bg-gray-100"
                                : ""
                            }`}
                            key={String(item[valueKey])}
                            value={String(item[labelKey])?.toLowerCase()}
                            onSelect={() => handleSelect(item[valueKey])}
                          >
                            {item[labelKey]}
                          </CommandItem>
                        ))
                      ) : (
                        <CommandEmpty>
                          {noOptionsMessage ?? `No ${label?.toLowerCase()} found.`}
                        </CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {fieldState?.error && (
                <p className="text-sm text-red-500 mt-1">{fieldState?.error?.message}</p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};
