import * as React from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { Label } from "@shared/components/ui/label";
import { Input } from "@shared/components/ui/input";
import { cn } from "@shared/lib/utils";

interface FileUploadFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  accept?: string;
  error?: FieldError | null;
  disabled?: boolean;
}

export const FileUploadField = ({
  label,
  register,
  required,
  disabled = false,
  accept = ".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf",
  error,
}: FileUploadFieldProps) => {
  return (
    <div className="space-y-1">
      <Label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Input
        type="file"
        accept={accept}
        disabled={disabled}
        {...register}
        className={cn(
          "h-9 border border-gray-300 rounded-md px-2 py-1 file:border-0 file:rounded-sm file:bg-blue-100 file:mr-3 file:px-4 file:py-1 file:cursor-pointer"
        )}
      />

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Upload Certificate ({accept.toLocaleUpperCase().replace(/\./g, " ")}) (max 5MB)
      </p>

      {error?.message && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
};
