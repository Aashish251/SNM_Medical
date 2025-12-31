import React, { useEffect, useState } from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Control, Controller, FieldValues, Path, useWatch } from "react-hook-form";
import { cn } from "@shared/lib/utils";
import {
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Label,
} from "@shared/components/ui";
import { FieldErrorText, RequiredMark } from "./FormHelpers";
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

/**
 * DatePickerField
 * A professional, scalable date picker component.
 * Features:
 * - Manual masking (DD/MM/YYYY) for fast keyboard entry.
 * - shadcn Calendar selection.
 * - Full synchronization between manual entry and calendar.
 * - Premium UI with consistent styling.
 */
export const DatePickerField = <T extends FieldValues>({
  label,
  name,
  control,
  placeholder = "DD/MM/YYYY",
  required = false,
  disabled = false,
  className = "",
  fromYear = 1900,
  toYear = new Date().getFullYear() + 20,
  disabledDates,
}: DatePickerFieldProps<T>) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputId = `datepicker-${String(name).replace(/\./g, "-")}`;

  // Watch the field value to sync it back to the local text input when it changes (e.g. from calendar)
  const fieldValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    if (fieldValue) {
      const date = (fieldValue as any) instanceof Date ? (fieldValue as Date) : new Date(fieldValue as any);
      if (isValid(date)) {
        setInputValue(format(date, "dd/MM/yyyy"));
      }
    } else {
      setInputValue("");
    }
  }, [fieldValue]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field: { onChange }, fieldState: { error } }) => {

          const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let val = e.target.value.replace(/\D/g, "");
            let formatted = "";

            if (val.length > 0) {
              formatted += val.substring(0, 2);
              if (val.length > 2) {
                formatted += "/" + val.substring(2, 4);
                if (val.length > 4) {
                  formatted += "/" + val.substring(4, 8);
                }
              }
            }

            setInputValue(formatted);

            // If we have a complete date string, update the form state
            if (formatted.length === 10) {
              const parsedDate = parse(formatted, "dd/MM/yyyy", new Date());
              if (isValid(parsedDate)) {
                onChange(parsedDate.toISOString());
              }
            } else if (formatted.length === 0) {
              onChange(null);
            }
          };

          const handleCalendarSelect = (date: Date | undefined) => {
            if (date) {
              onChange(date.toISOString());
              setOpen(false);
            }
          };

          return (
            <div className="relative group/datepicker">
              <Popover open={open} onOpenChange={setOpen}>
                <div className="relative">
                  <Input
                    id={inputId}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                      "pl-10 pr-10 font-medium text-gray-700 h-10 transition-all duration-200",
                      error
                        ? "border-red-500 focus-visible:ring-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]"
                        : "hover:border-gray-400 focus:border-primary",
                      "bg-white rounded-md"
                    )}
                    maxLength={10}
                  />

                  {/* Calendar Icon */}
                  {/* Calendar Icon - Trigger */}
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      disabled={disabled}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover/datepicker:text-primary transition-colors focus:outline-none"
                    >
                      <CalendarIcon size={18} />
                    </button>
                  </PopoverTrigger>
                </div>

                <PopoverContent
                  className="w-auto p-0 border border-gray-100 shadow-2xl rounded-2xl animate-in fade-in-0 zoom-in-95 duration-200"
                  align="start"
                  sideOffset={8}
                >
                  <Calendar
                    mode="single"
                    selected={fieldValue ? ((fieldValue as any) instanceof Date ? (fieldValue as Date) : new Date(fieldValue as any)) : undefined}
                    onSelect={handleCalendarSelect}
                    disabled={disabledDates}
                    initialFocus
                    fromYear={fromYear}
                    toYear={toYear}
                    captionLayout="dropdown"
                    className="rounded-2xl bg-white p-4"
                  />
                </PopoverContent>
              </Popover>
              <FieldErrorText message={error?.message} />
            </div>
          );
        }}
      />
    </div>
  );
};
