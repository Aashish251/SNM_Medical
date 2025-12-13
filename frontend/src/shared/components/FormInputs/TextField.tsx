import React from "react";
import { Input } from "@shared/components/ui/input";
import { FieldErrorText, RequiredMark } from "./FormHelpers";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface TextFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  required?: boolean;
  error?: FieldError | null;
  type?: string;
  readOnly?: boolean;
  value?: string | number;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
}

export const TextField = ({
  label,
  register,
  placeholder,
  required = false,
  autoComplete,
  value,
  error,
  type = "text",
  readOnly = false,
  disabled = false,
  className = "",
}: TextFieldProps) => {
  const inputProps = value ? { defaultValue: value } : {};

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        autoComplete={autoComplete}
        max={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
        {...register}
        {...inputProps}
      />
      <FieldErrorText message={error?.message} />
    </div>
  );
};
