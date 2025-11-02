import React, { useState } from "react";
import { Input } from "@shared/components/ui/input";
import { FieldErrorText, RequiredMark } from "./FormHelpers";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@shared/components/ui/button";

interface PasswordFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  required?: boolean;
  error?: FieldError | null;
  readOnly?: boolean;
  value?: string | number;
  autoComplete?: string;
  className?: string;
}

export const PasswordField = ({
  label,
  register,
  placeholder,
  required = false,
  autoComplete,
  value,
  error,
  readOnly = false,
  className = "",
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputProps = value ? { defaultValue: value } : {};

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </label>

      {/* Password Input Wrapper */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          readOnly={readOnly}
          autoComplete={autoComplete}
          {...register}
          {...inputProps}
          className="pr-x`0" // space for the icon
        />

        {/* Toggle Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-600 hover:text-gray-800"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
        </Button>
      </div>

      {/* Error message */}
      <FieldErrorText message={error?.message} />
    </div>
  );
};
