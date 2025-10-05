import React, { useState } from "react";
import { FieldErrorText, RequiredMark } from "./FormHelpers";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { Button } from "@shared/components/ui/button";

interface FileUploadFieldProps {
    label: string;
    register: UseFormRegisterReturn;
    required?: boolean;
    error?: FieldError | null;
    accept?: string;
}

export const FileUploadField = ({
    label,
    register,
    required,
    error,
    accept = "image/*",
}: FileUploadFieldProps) => {
    const [fileName, setFileName] = useState<string>("No file chosen");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFileName(file ? file.name : "No file chosen");
    };

    return (
        <div className="space-y-2">
            <label className="block font-medium text-sm text-gray-700">
                {label} {required && <RequiredMark />}
            </label>

            <div className="flex items-center gap-3">
                {/* Hidden input field */}
                <input
                    type="file"
                    id={label.replace(/\s+/g, "_").toLowerCase()}
                    accept={accept}
                    className="hidden"
                    {...register}
                    onChange={handleChange}
                />

                {/* Custom styled button */}
                <label
                    htmlFor={label.replace(/\s+/g, "_").toLowerCase()}
                    className="cursor-pointer"
                >
                    <Button type="button" variant="default">
                        Choose File
                    </Button>
                </label>

                {/* Display selected filename */}
                <span className="text-gray-600 text-sm truncate max-w-[200px]">
                    {fileName}
                </span>
            </div>

            {/* Error message */}
            <FieldErrorText message={error?.message} />
        </div>
    );
};
