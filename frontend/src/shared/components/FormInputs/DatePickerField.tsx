import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@shared/lib/utils";
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "../ui";
import { FieldErrorText, RequiredMark } from "./FormHelpers";
import { Label } from "../ui/label";

import { Matcher } from "react-day-picker";

interface DatePickerFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  fromYear?: number;
  toYear?: number;
  disabledDates?: Matcher | Matcher[];
}

export const DatePickerField = <T extends FieldValues>({
  label,
  name,
  control,
  placeholder = "DD/MM/YYYY",
  required = false,
  disabled = false,
  className = "",
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  disabledDates,
}: DatePickerFieldProps<T>) => {
  const id = `datepicker-${String(name).replace(/\./g, "-")}`;
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field, fieldState }) => {
          const selectedDate = field.value ? new Date(field.value) : undefined;
          const hasValue = !!field.value;
          const [inputValue, setInputValue] = React.useState(
            selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""
          );

          // Parse DD/MM/YYYY format to ISO string
          const parseDate = (dateString: string): string | null => {
            const parts = dateString.split("/");
            if (parts.length !== 3) return null;

            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);

            if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
            if (day < 1 || day > 31 || month < 1 || month > 12) return null;

            const date = new Date(year, month - 1, day);
            if (date.getDate() !== day || date.getMonth() !== month - 1) return null;

            return date.toISOString();
          };

          // Handle manual input change with auto-formatting and validation
          const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let value = e.target.value;

            // Remove all non-numeric characters except slashes
            value = value.replace(/[^\d/]/g, "");

            // Remove existing slashes for reformatting
            const digitsOnly = value.replace(/\//g, "");

            // Validate and format with slashes: DD/MM/YYYY
            let formattedValue = "";
            let isValid = true;

            for (let i = 0; i < digitsOnly.length && i < 8; i++) {
              const digit = digitsOnly[i];

              // Day validation (position 0-1)
              if (i === 0 && parseInt(digit) > 3) {
                isValid = false;
                break;
              }
              if (i === 1) {
                const day = parseInt(digitsOnly.substring(0, 2));
                if (day < 1 || day > 31) {
                  isValid = false;
                  break;
                }
                formattedValue += digit + "/";
                continue;
              }

              // Month validation (position 2-3)
              if (i === 2 && parseInt(digit) > 1) {
                isValid = false;
                break;
              }
              if (i === 3) {
                const month = parseInt(digitsOnly.substring(2, 4));
                if (month < 1 || month > 12) {
                  isValid = false;
                  break;
                }
                formattedValue += digit + "/";
                continue;
              }

              // Year (position 4-7)
              formattedValue += digit;
            }

            // Only update if valid input
            if (isValid) {
              setInputValue(formattedValue);

              // Try to parse and update field if complete (10 characters with slashes)
              if (formattedValue.length === 10) {
                const parsedDate = parseDate(formattedValue);
                if (parsedDate) {
                  field.onChange(parsedDate);
                }
              } else if (formattedValue === "") {
                field.onChange(null);
              }
            }
          };

          // Sync input value when field value changes from calendar
          React.useEffect(() => {
            if (field.value) {
              const date = new Date(field.value);
              setInputValue(format(date, "dd/MM/yyyy"));
            } else {
              setInputValue("");
            }
          }, [field.value]);

          return (
            <div className="flex flex-col gap-1">
              <div className="relative">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <input
                        id={id}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        maxLength={10}
                        className={cn(
                          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                          "pl-9",
                          fieldState.error && "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={disabled}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 z-50 animate-in fade-in-0 zoom-in-95"
                    align="start"
                    sideOffset={8}
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        field.onChange(date ? date.toISOString() : null);
                        setOpen(false); // Close popover after selection
                      }}
                      disabled={disabledDates}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={fromYear}
                      toYear={toYear}
                    />
                  </PopoverContent>
                </Popover>

                {/* {hasValue && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange(null);
                    }}
                    className="absolute right-9 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                    title="Clear date"
                  >
                    <X size={14} />
                  </button>
                )} */}
              </div>
              <FieldErrorText message={fieldState.error?.message} />
            </div>
          );
        }}
      />
    </div>
  );
};
