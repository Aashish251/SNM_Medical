import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Label } from "@shared/components/ui/label";
import { Button } from "@shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@shared/components/ui/command";
import { RequiredMark } from "./FormHelpers";

interface Option {
  id: number;
  [key: string]: any;
}

interface SearchableSelectProps {
  control: any;
  name: string;
  label: string;
  options: Option[];
  labelKey: string;
  valueKey: string;
  placeholder?: string;
  required?: boolean;
  rules?: any;
  value?: number | string; // ✅ optional prefilled value
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  control,
  name,
  label,
  options,
  labelKey,
  valueKey,
  placeholder = "Select option",
  required = false,
  rules = {},
  value,
}) => {
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {required && <RequiredMark />}
      </Label>

      <Controller
        name={name}
        control={control}
        defaultValue={value ?? ""} // ✅ prefill RHF with provided value
        rules={required ? { required: `${label} is required`, ...rules } : rules}
        render={({ field, fieldState }) => {
          // Ensure RHF picks up external default value changes
          useEffect(() => {
            if (value && !field.value) {
              field.onChange(value);
            }
          }, [value]);

          const selectedOption = options.find(
            (opt) => opt[valueKey] === field.value
          );

          return (
            <>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    type="button"
                  >
                    {selectedOption ? selectedOption[labelKey] : placeholder}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0 max-h-72 overflow-hidden">
                  <Command>
                    <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                    <CommandList>
                      <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                      {options.map((item) => (
                        <CommandItem
                          key={item[valueKey]}
                          value={String(item[labelKey]).toLowerCase()}
                          onSelect={() => {
                            field.onChange(item[valueKey]);
                            setOpenPopover(false);
                          }}
                        >
                          {item[labelKey]}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};
