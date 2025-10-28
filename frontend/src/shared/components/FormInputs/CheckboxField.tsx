import React from "react";
import { Controller, Control } from "react-hook-form";

interface CheckboxFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  control,
  name,
  label,
  className = "",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label
          className={`flex items-center justify-between gap-2 border rounded px-3 py-2 w-full ${className}`}
        >
          <span>{label}</span>
          <input
            type="checkbox"
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
        </label>
      )}
    />
  );
};
