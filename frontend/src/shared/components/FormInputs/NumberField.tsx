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
  allowDecimal?: boolean;
  maxDecimals?: number;
  maxWholeDigits?: number;
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
  allowDecimal = false,
  maxDecimals,
  maxWholeDigits,
}: NumberFieldProps) => {
  const inputProps = value ? { defaultValue: value } : {};

  // Compute effective maxLength if not explicitly provided
  const effectiveMaxLength =
    maxLength ??
    (allowDecimal && maxWholeDigits !== undefined
      ? maxWholeDigits + (maxDecimals !== undefined && maxDecimals > 0 ? maxDecimals + 1 : 0)
      : undefined);

  // Allow only valid numbers (and one dot with decimal constraints if allowDecimal)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Enter"];

    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;

    const input = e.currentTarget;
    const val = input.value;
    const selStart = input.selectionStart ?? val.length;
    const selEnd = input.selectionEnd ?? val.length;
    const hasSelection = selStart !== selEnd;

    // Decimal point (only one allowed, and only if maxDecimals !== 0)
    if (allowDecimal && e.key === ".") {
      if (maxDecimals === 0) {
        e.preventDefault();
        return;
      }
      if (val.includes(".")) {
        const dotIndex = val.indexOf(".");
        // If selection does not replace the existing dot, reject
        if (!hasSelection || !(selStart <= dotIndex && selEnd > dotIndex)) {
          e.preventDefault();
          return;
        }
      }
      return;
    }

    // Digits (0-9)
    if (/^[0-9]$/.test(e.key)) {
      if (hasSelection) return; // Replacing selected text is allowed

      if (allowDecimal) {
        const dotIndex = val.indexOf(".");
        if (dotIndex === -1) {
          // No dot yet: typing whole number part
          if (maxWholeDigits !== undefined && val.length >= maxWholeDigits) {
            e.preventDefault();
            return;
          }
        } else {
          // Dot exists
          if (selStart <= dotIndex) {
            // Typing in whole number part before dot
            const wholePart = val.slice(0, dotIndex);
            if (maxWholeDigits !== undefined && wholePart.length >= maxWholeDigits) {
              e.preventDefault();
              return;
            }
          } else {
            // Typing in decimal part after dot
            const decimalPart = val.slice(dotIndex + 1);
            if (maxDecimals !== undefined && decimalPart.length >= maxDecimals) {
              e.preventDefault();
              return;
            }
          }
        }
      } else {
        if (effectiveMaxLength !== undefined && val.length >= effectiveMaxLength) {
          e.preventDefault();
          return;
        }
      }
      return;
    }

    e.preventDefault();
  };

  // Sanitize on change (paste, virtual keyboard, autofill)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (allowDecimal) {
      val = val.replace(/[^0-9.]/g, "");
      const parts = val.split(".");
      if (parts.length > 2) {
        val = parts[0] + "." + parts.slice(1).join("");
      }
      const [whole, decimal] = val.split(".");
      const cappedWhole = maxWholeDigits !== undefined ? whole.slice(0, maxWholeDigits) : whole;
      let finalVal = cappedWhole;
      if (decimal !== undefined) {
        const cappedDec = maxDecimals !== undefined ? decimal.slice(0, maxDecimals) : decimal;
        finalVal = `${cappedWhole}.${cappedDec}`;
      }
      if (e.target.value !== finalVal) {
        e.target.value = finalVal;
      }
    } else {
      let cleaned = val.replace(/[^0-9]/g, "");
      if (effectiveMaxLength !== undefined) {
        cleaned = cleaned.slice(0, effectiveMaxLength);
      }
      if (e.target.value !== cleaned) {
        e.target.value = cleaned;
      }
    }

    register.onChange(e);
  };

  // Prevent pasting invalid non-numeric characters
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    const regex = allowDecimal ? /^[0-9.]*$/ : /^[0-9]*$/;
    if (!regex.test(pasted)) {
      e.preventDefault();
    }
  };

  const inputId = register?.name || "number-field";

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </label>

      <Input
        id={inputId}
        type="text"
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        maxLength={effectiveMaxLength}
        autoComplete={autoComplete}
        inputMode={allowDecimal ? "decimal" : "numeric"}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        {...register}
        onChange={handleChange}
        {...inputProps}
      />

      <FieldErrorText message={error?.message} />
    </div>
  );
};
