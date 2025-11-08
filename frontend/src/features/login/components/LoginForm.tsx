import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TextField } from "@shared/components/FormInputs/TextField";
import { FormData, Role } from "../hooks/useLoginForm";
import { RoleButton } from "./RoleButton";
import {
  SNM_ADMIN_USERTYPE,
  SNM_ADMIN_USERTYPE_LABEL,
  SNM_MS_USERTYPE,
  SNM_MS_USERTYPE_LABEL,
  SNM_NAV_FORGOT_PASSWORD_LINK,
} from "@shared/constants";
import { PasswordField } from "@shared/components/FormInputs/PasswordField";

interface LoginFormProps {
  form: UseFormReturn<FormData>;
  role: Role;
  handleRoleChange: (role: Role) => void;
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  form,
  role,
  handleRoleChange,
  onSubmit,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Role Selector */}
      <div className="flex justify-center gap-2 flex-wrap mb-2">
        <RoleButton
          roleName={SNM_ADMIN_USERTYPE}
          label={SNM_ADMIN_USERTYPE_LABEL}
          currentRole={role}
          onClick={handleRoleChange}
          loading={loading}
        />
        <RoleButton
          roleName={SNM_MS_USERTYPE}
          label={SNM_MS_USERTYPE_LABEL}
          currentRole={role}
          onClick={handleRoleChange}
          loading={loading}
        />
      </div>

      {/* Email */}
      <TextField
        label="Email ID / Contact No."
        placeholder="Enter your email or mobile number"
        required
        autoComplete="off"
        register={register("identifier", {
          required: "Email or Contact Number is required",
          validate: (value) => {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            const isPhone = /^[6-9]\d{9}$/.test(value);
            return (
              isEmail ||
              isPhone ||
              "Enter a valid email or 10-digit mobile number"
            );
          },
        })}
        error={errors.identifier}
      />

      {/* Password */}
      <PasswordField
        label="Password"
        required
        autoComplete="off"
        placeholder="Enter your password"
        register={register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        error={errors.password}
      />

      {/* Forgot Password */}
      <div className="text-right">
        <a
          href={SNM_NAV_FORGOT_PASSWORD_LINK}
          className="text-xs sm:text-sm text-teal-600 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-full bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-200 shadow-md text-white font-bold text-base transition-transform duration-300 ${
          loading
            ? "opacity-70 cursor-not-allowed"
            : "hover:scale-105 hover:from-purple-600 hover:to-indigo-600"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Signing In...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};
