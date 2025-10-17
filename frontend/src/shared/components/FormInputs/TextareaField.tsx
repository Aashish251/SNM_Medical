import React from "react";
import { Textarea } from "@shared/components/ui/textarea";
import { FieldErrorText, RequiredMark } from "./FormHelpers";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface TextareaFieldProps {
    label: string;
    register: UseFormRegisterReturn;
    placeholder?: string;
    required?: boolean;
    error?: FieldError | null;
    readOnly?: boolean;
    rows?: number;
}

export const TextareaField = ({
    label,
    register,
    placeholder,
    required,
    error,
    readOnly = false,
    rows = 4,
}: TextareaFieldProps) => {
    return (
        <div className="space-y-2">
            <label>
                {label} {required && <RequiredMark />}
            </label>
            <Textarea
                placeholder={placeholder}
                readOnly={readOnly}
                rows={rows}
                {...register} // ✅ spread react-hook-form register
            />
            <FieldErrorText message={error?.message} />
        </div>
    );
};
