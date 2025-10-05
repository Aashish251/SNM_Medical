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
import {
  Controller,
  Control,
  FieldValues,
  Path,
  useFormState,
  FieldError,
} from "react-hook-form";
import { get } from "lodash";

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

export const SelectField = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  placeholder = "Select",
  required = false,
}: SelectFieldProps<T>) => {
  // Extract errors from react-hook-form safely
  const { errors } = useFormState({ control });

  // Get error using lodash `get` to support nested names like "user.city"
  const fieldError = get(errors, name) as FieldError | undefined;

  // Generate unique id
  const id = `select-${name.replace(/\./g, "-")}`;

  return (
    <div className="space-y-2">
      {/* Label */}
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </Label>

      {/* Controlled Select */}
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value ?? ""}>
            <SelectTrigger id={id} name={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {/* Error Text */}
      {fieldError?.message && <FieldErrorText message={fieldError.message} />}
    </div>
  );
};
