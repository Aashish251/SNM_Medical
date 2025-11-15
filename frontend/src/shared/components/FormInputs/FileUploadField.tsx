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
          "h-auto border border-gray-300 rounded-md px-3 py-2 file:border-0 file:rounded-sm file:bg-blue-100 file:mr-3 file:px-4 file:py-2 file:cursor-pointer",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
      />

       {/* Helper Text */}
        {/* <p className="text-xs text-gray-500">
          Supported formats: JPG, PNG, GIF, BMP, WEBP (max 5MB)
        </p> */}

      {error?.message && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
};
