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
      render={({ field }) => {
        const isChecked =
          field.value === true ||
          field.value === "true" ||
          field.value === 1;

        return (
          <label
            className={`flex items-center justify-between gap-2 border rounded px-3 py-2 w-full cursor-pointer hover:bg-gray-50 transition ${className}`}
          >
            <span>{label}</span>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
          </label>
        );
      }}
    />
  );
};
