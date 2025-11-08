import React from "react";
import { Controller, Control, UseFormRegisterReturn } from "react-hook-form";

interface CheckboxFieldProps {
  control?: Control<any>;
  register?: ReturnType<any>;
  name: string;
  label: string;
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  control,
  register,
  name,
  label,
  className = "",
}) => {
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const isChecked = field.value === 1;
          return (
            <label
              className={`flex items-center justify-between gap-2 border rounded px-3 py-2 w-full cursor-pointer hover:bg-gray-50 transition ${className}`}
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                className="h-4 w-4 accent-blue-600"
              />
            </label>
          );
        }}
      />
    );
  }

  return (
    <label
      className={`flex items-center justify-between gap-2 border rounded px-3 py-2 w-full cursor-pointer hover:bg-gray-50 transition ${className}`}
    >
      <span>{label}</span>
      <input
        type="checkbox"
        {...(register as any)}
        className="h-4 w-4 accent-blue-600"
      />
    </label>
  );
};
