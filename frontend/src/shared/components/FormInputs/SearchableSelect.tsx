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
  value?: number | string;
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
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <RequiredMark />}
      </Label>

      <Controller
        name={name}
        control={control}
        defaultValue={value ?? ""}
        rules={required ? { required: `${label} is required`, ...rules } : rules}
        render={({ field, fieldState }) => {
          // ✅ Safe effect for controlled prefill
          useEffect(() => {
            if (value && !field.value) {
              field.onChange(value);
            }
          }, [value]);

          // ✅ Compute selected option safely
          const selectedOption = Array.isArray(options)
            ? options.find((opt) => opt[valueKey] === field.value)
            : null;

          return (
            <>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between text-sm font-medium text-gray-700"
                    type="button"
                  >
                    {selectedOption ? selectedOption[labelKey] : placeholder}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0 max-h-72 overflow-hidden">
                  <Command>
                    <CommandInput
                      placeholder={`Search ${label?.toLowerCase()}...`}
                    />
                    <CommandList>
                      {Array.isArray(options) && options.length > 0 ? (
                        options.map((item) => (
                          <CommandItem
                            className="text-sm font-medium text-gray-700 hover:text-grey-900"
                            key={item[valueKey]}
                            value={String(item[labelKey])?.toLowerCase()}
                            onSelect={() => {
                              field.onChange(item[valueKey]);
                              setOpenPopover(false);
                            }}
                          >
                            {item[labelKey]}
                          </CommandItem>
                        ))
                      ) : (
                        <CommandEmpty>
                          No {label?.toLowerCase()} found.
                        </CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {fieldState?.error && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldState?.error?.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};
