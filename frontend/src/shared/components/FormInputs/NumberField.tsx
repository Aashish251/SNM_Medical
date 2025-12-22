import React from "react";
import { Input } from "@shared/components/ui/input";
import { FieldErrorText, RequiredMark } from "./FormHelpers";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface NumberFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  required?: boolean;
  error?: FieldError | null;
  readOnly?: boolean;
  value?: string | number;
  autoComplete?: string;
  className?: string;
  maxLength?: number;
  allowDecimal?: boolean; //  NEW prop
  disabled?: boolean;
}

export const NumberField = ({
  label,
  register,
  placeholder,
  required = false,
  autoComplete,
  value,
  error,
  readOnly = false,
  disabled = false,
  className = "",
  maxLength,
  allowDecimal = false, //  default: false
}: NumberFieldProps) => {
  const inputProps = value ? { defaultValue: value } : {};

  //  Allow only numbers (and one dot if allowDecimal)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

    if (allowedKeys.includes(e.key)) return;

    // Digits
    if (/^[0-9]$/.test(e.key)) return;

    // Decimal point (only one allowed)
    if (allowDecimal && e.key === ".") {
      const input = e.currentTarget;
      if (!input.value.includes(".")) return;
    }

    e.preventDefault();
  };

  //  Prevent invalid paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    const regex = allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]+$/;
    if (!regex.test(pasted)) {
      e.preventDefault();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </label>

      <Input
        type="text"
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        inputMode={allowDecimal ? "decimal" : "numeric"}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        {...register}
        {...inputProps}
      />

      <FieldErrorText message={error?.message} />
    </div>
  );
};
