import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@shared/components/ui";
import { PasswordField } from "@shared/components/FormInputs/PasswordField";
import { ResetPassword, UserRegIdObj } from "../type";
import { ANIM } from "../constants/constants";
import { useResetPasswordMutation } from "../service/ForgotPasswordApi";
import { toast } from "@shared/lib/toast";
import { SNM_NAV_LOGIN_LINK } from "@shared/constants";
interface Props {
  onReset: () => void;
  userRegIdObj: UserRegIdObj;
}

const ResetPasswordForm: React.FC<Props> = ({ onReset, userRegIdObj }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPassword>({ mode: "onTouched" });
  const navigate = useNavigate();
  const [triggerResetPassword] = useResetPasswordMutation();

  const passwordValue = watch("newPassword");

  const onSubmit = async (data: ResetPassword) => {
    try {
      const payload = { ...data, ...userRegIdObj };
      const promise = triggerResetPassword(payload).unwrap();

      const response = await toast.promise(promise, {
        loading: "Resetting password...",
        success: "Password reset successfully.",
        error: "Failed to reset password. Please try again.",
      });

      if (response) {
        onReset?.();
        reset();
        navigate(SNM_NAV_LOGIN_LINK);
      }
    } catch (error: any) {
      console.error("Reset password failed:", error);
      const serverMessage =
        error?.data?.message || error?.message || "Something went wrong.";
      toast.error(serverMessage);
    }
  };

  return (
    <motion.div
      {...ANIM.pop}
      className="flex flex-col items-center px-6 py-10 bg-white rounded-3xl shadow-lg mx-auto w-full max-w-md"
    >
      <h1 className="text-3xl font-extrabold mb-8 text-center bg-to-two-right-theme-gradient bg-clip-text text-transparent">
        Reset Your Password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <PasswordField
          label="New Password"
          required
          autoComplete="new-password"
          placeholder="Enter your password"
          register={register("newPassword", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.newPassword}
        />

        <PasswordField
          label="Confirm Password"
          required
          autoComplete="confirm-password"
          placeholder="Re-enter password"
          register={register("confirmPassword", {
            required: "Confirm password",
            validate: (value) =>
              value === passwordValue || "Passwords do not match",
          })}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg text-lg font-semibold"
        >
          {isSubmitting ? (
            <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full mx-auto" />
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      <Link
        to="/login"
        className="mt-6 text-sm text-teal-600 hover:underline text-center"
      >
        Go to Sign In
      </Link>
    </motion.div>
  );
};

export default ResetPasswordForm;
