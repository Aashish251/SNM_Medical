import React from "react";
import { Textarea } from "@shared/components/ui/textarea";
import { FieldErrorText, RequiredMark } from "./FormHelpers";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface TextareaFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  required?: boolean;
  error?: FieldError | null;
  readOnly?: boolean;
  rows?: number;
  value?: string | number;
  className?: string;
}

export const TextareaField = ({
  label,
  register,
  placeholder,
  required = false,
  value,
  error,
  readOnly = false,
  rows = 4,
  className = "",
}: TextareaFieldProps) => {
  const inputProps = value ? { defaultValue: value } : {};

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </label>
      <Textarea
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        {...register}
        {...inputProps}
      />
      <FieldErrorText message={error?.message} />
    </div>
  );
};
