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
  valueKey?: keyof SelectOption; // e.g. "value" or "id"
  labelKey?: keyof SelectOption; // e.g. "label" or "title"
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  defaultValue?: number | string | null;
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
  defaultValue = null,
  disabled = false,
  className = "",
}: SelectFieldProps<T>) => {
  const id = `select-${String(name).replace(/\./g, "-")}`;

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
          const currentValue = field.value ? String(field.value) : "";
          const hasValue = Boolean(currentValue);

          const resetSelection = () => {
            field.onChange(defaultValue);
          };

          return (
            <>
              <div className="relative">
                <Select
                  disabled={disabled}
                  onValueChange={field.onChange}
                  value={currentValue}
                >
                  {/* Only add right padding when clear button will be shown (hasValue && not readOnly).
                      Otherwise keep normal padding so no extra empty space appears on the right. */}
                  <SelectTrigger
                    id={id}
                    className={hasValue && !readOnly ? "pr-8" : "pr-2"}
                  >
                    <SelectValue placeholder={placeholder}>
                      {options.find(
                        (opt) => String(opt[valueKey]) === currentValue
                      )?.[labelKey] || placeholder}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem
                        key={String(opt[valueKey])}
                        value={String(opt[valueKey])}
                      >
                        {opt[labelKey]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Show clear button only if there is a selected value */}
                {hasValue && !readOnly && (
                  <button
                    type="button"
                    onClick={resetSelection}
                    aria-label="Clear selection"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      lineHeight: 1,
                    }}
                  >
                    &#x2715;
                  </button>
                )}
              </div>

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
