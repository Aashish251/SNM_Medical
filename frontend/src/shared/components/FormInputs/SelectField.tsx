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
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface SelectOption {
  id: number;
  [key: string]: any;
  state_name?: string;
  department_name?: string;
  qualification_name?: string;
}

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
  valueKey?: keyof SelectOption;  
  labelKey?: keyof SelectOption;  
  placeholder?: string;
  required?: boolean;
}

export const SelectField = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  valueKey = "id",
  labelKey = getDefaultLabelKey(options),
  placeholder = "Select",
  required = false,
}: SelectFieldProps<T>) => {
  const id = `select-${name.replace(/\./g, "-")}`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field, fieldState }) => (
          <>
            <Select 
              onValueChange={(val) => field.onChange(Number(val))} 
              value={field.value ? String(field.value) : ""}
            >
              <SelectTrigger id={id}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((opt) => (
                  <SelectItem 
                    key={opt[valueKey]} 
                    value={String(opt[valueKey])}
                  >
                    {opt[labelKey]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.error?.message && (
              <FieldErrorText message={fieldState.error.message} />
            )}
          </>
        )}
      />
    </div>
  );
};

function getDefaultLabelKey(options: SelectOption[]): keyof SelectOption {
  if (!options?.length) return "name";
  
  const firstOption = options[0];
  if ("state_name" in firstOption) return "state_name";
  if ("department_name" in firstOption) return "department_name";
  if ("qualification_name" in firstOption) return "qualification_name";
  return "name";
}