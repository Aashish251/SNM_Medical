import React, { useRef } from "react";
import { Input } from "@shared/components/ui/input";
import { FieldErrorText, RequiredMark } from "./FormHelpers";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { Calendar } from "lucide-react";

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
  const localRef = useRef<HTMLInputElement>(null);
  const { ref: registerRef, ...restRegister } = register;

  const handleIconClick = () => {
    if (localRef.current && !disabled && !readOnly) {
      localRef.current.showPicker();
    }
  };

  const isDate = type === "date";

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </label>
      <div className="relative">
        <Input
          type={type}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          autoComplete={autoComplete}
          max={isDate ? new Date().toISOString().split("T")[0] : undefined}
          className={
            isDate
              ? "[&::-webkit-calendar-picker-indicator]:hidden pr-10"
              : undefined
          }
          {...restRegister}
          ref={(e) => {
            registerRef(e);
            localRef.current = e;
          }}
          {...inputProps}
        />
        {isDate && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer pointer-events-auto"
            onClick={handleIconClick}
          >
            <Calendar size={18} />
          </div>
        )}
      </div>
      <FieldErrorText message={error?.message} />
    </div>
  );
};
