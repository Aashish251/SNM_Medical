import React from "react";
import { Input } from "@shared/components/ui/input";
import { FieldErrorText, RequiredMark } from "./FormHelpers";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface TextFieldProps {
    label: string;
    register: UseFormRegisterReturn;
    placeholder?: string;
    required?: boolean;
    error?: FieldError | null;
    type?: string;
    readOnly?: boolean;
}

export const TextField = ({
    label,
    register,
    placeholder,
    required,
    error,
    type = "text",
    readOnly = false,
}: TextFieldProps) => {
    return (
        <div className="space-y-2">
            <label>
                {label} {required && <RequiredMark />}
            </label>
            <Input
                type={type}
                placeholder={placeholder}
                readOnly={readOnly}
                {...register} // 👈 use register as an object
            />
            <FieldErrorText message={error?.message} />
        </div>
    );
};
