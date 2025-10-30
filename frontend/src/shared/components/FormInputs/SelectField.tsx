import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@shared/components/ui/select";
import { Label } from "@shared/components/ui/label";
import { RequiredMark, FieldErrorText } from "./FormHelpers";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface SelectOption {
  id: number | string;
  [key: string]: any;
}

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options?: SelectOption[];
  valueKey?: keyof SelectOption;  // e.g. "value" or "id"
  labelKey?: keyof SelectOption;  // e.g. "label" or "title"
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
}

export const SelectField = <T extends FieldValues>({
  label,
  name,
  control,
  options = [],
  valueKey = "id",
  labelKey = "title",
  placeholder = "Select",
  required = false,
  readOnly = false,
  className = "",
}: SelectFieldProps<T>) => {
  const id = `select-${name.replace(/\./g, "-")}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field, fieldState }) => {
          // Ensure value is always a string for Select
          const currentValue = field.value
            ? String(field.value)
            : "";

          return (
            <>
              <Select
                disabled={readOnly}
                onValueChange={field.onChange}
                value={currentValue}
              >
                <SelectTrigger id={id}>
                  <SelectValue placeholder={placeholder}>
                    {
                      // ✅ show label of prefilled value if available
                      options.find(
                        (opt) =>
                          String(opt[valueKey]) === currentValue
                      )?.[labelKey] || placeholder
                    }
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem
                      key={opt[valueKey]}
                      value={String(opt[valueKey])}
                    >
                      {opt[labelKey]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.error?.message && (
                <FieldErrorText message={fieldState.error.message} />
              )}
            </>
          );
        }}
      />
    </div>
  );
};
