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

          return (
            <div className="flex flex-col gap-1">
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={id}
                      variant="outline"
                      disabled={disabled}
                      className={cn(
                        "w-full justify-start text-left font-normal h-10 px-3",
                        !selectedDate && "text-muted-foreground",
                        fieldState.error && "border-red-500 focus-visible:ring-red-500",
                        hasValue && "pr-10"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      {selectedDate ? (
                        format(selectedDate, "dd/MM/yyyy")
                      ) : (
                        <span>{placeholder}</span>
                      )}

                    </Button>
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
                      }}
                      disabled={disabledDates}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={fromYear}
                      toYear={toYear}
                    />
                  </PopoverContent>
                </Popover>

                {hasValue && !disabled && (
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
                )}
              </div>
              <FieldErrorText message={fieldState.error?.message} />
            </div>
          );
        }}
      />
    </div>
  );
};
