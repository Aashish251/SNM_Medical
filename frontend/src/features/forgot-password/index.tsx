import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@shared/components/ui";
import { NumberField, TextField } from "@shared/components/FormInputs";
import { PasswordField } from "@shared/components/FormInputs/PasswordField";
import {
  SNM_NAV_FORGOT_PASSWORD_LABEL,
  SNM_LOGIN_PAGE_DNG,
  SNM_DONT_HAVE_ACCOUNT,
  SNM_NAV_REGISTER_LINK,
  SNM_SIGNUP_LABEL_TITLE,
} from "@shared/constants/index.constant";

type SecurityQuestions = {
  email: string;
  contact: string;
  favoriteFood: string;
  childhoodNickname: string;
  motherMaidenName: string;
  hobbies: string;
};

type ResetPassword = {
  password: string;
  confirmPassword: string;
};

/* ---------------- Security Form Component ---------------- */
const SecurityForm: React.FC<{
  onSuccess: (data: SecurityQuestions) => void;
}> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SecurityQuestions>();

  const onSubmit = (data: SecurityQuestions) => {
    console.log("Security Questions Submitted:", data);
    onSuccess(data);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto bg-white/70 rounded-3xl shadow-2xl p-8"
    >
      <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-teal-700 bg-clip-text text-transparent mb-6">
        {SNM_NAV_FORGOT_PASSWORD_LABEL}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5"
      >
        <TextField
          label="Email"
          required
          register={register("email", {
            required: "Email address is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Enter a valid email",
            },
          })}
          placeholder="Enter email address"
          error={errors.email}
        />

        <NumberField
          label="Contact Number"
          required
          maxLength={13}
          register={register("contact", {
            required: "Contact number is required",
            pattern: {
              value: /^(?:\+91|91|0)?[-\s]?[6-9]\d{9}$/, // must start with 6–9 and be 10 digits
              message: "Enter a valid 10-digit mobile number",
            },
          })}
          placeholder="Enter 10-digit mobile number"
          error={errors.contact}
        />

        <TextField
          label="What is your favorite food?"
          required
          register={register("favoriteFood", {
            required: "Favorite food is required",
          })}
          placeholder="Enter favorite food"
          error={errors.favoriteFood}
        />

        <TextField
          label="What was your childhood nickname?"
          required
          register={register("childhoodNickname", {
            required: "Childhood nickname is required",
          })}
          placeholder="Enter childhood nickname"
          error={errors.childhoodNickname}
        />

        <TextField
          label="What is your mother's maiden name?"
          required
          register={register("motherMaidenName", {
            required: "Mother's maiden name is required",
          })}
          placeholder="Enter mother's maiden name"
          error={errors.motherMaidenName}
        />

        <TextField
          label="What are your hobbies?"
          required
          register={register("hobbies", {
            required: "Hobbies are required",
          })}
          placeholder="Enter hobbies"
          error={errors.hobbies}
        />

        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? (
              <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full mx-auto" />
            ) : (
              "Submit"
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Cancel
          </motion.button>
        </div>

        <div className="col-span-1 md:col-span-2 text-center text-gray-500 mt-2">
          <Link to="/login" className="text-sm text-teal-600 hover:underline">
            Click here to Sign In
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

/* ---------------- Reset Password Form Component ---------------- */
const ResetPasswordForm: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ResetPassword>();

  const onSubmit = (data: ResetPassword) => {
    console.log("Password Reset Data:", data);
    reset();
    onReset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center px-6 py-10 bg-white rounded-3xl shadow-lg mx-auto w-full max-w-md"
    >
      <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-500 to-teal-700 bg-clip-text text-transparent">
        Reset Your Password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <PasswordField
          label="New Password"
          required
          autoComplete="new-password"
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

        <PasswordField
          label="Confirm Password"
          required
          autoComplete="confirm-password"
          placeholder="Re-enter password"
          register={register("confirmPassword", {
            required: "Confirm password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          className="w-full py-3 rounded-lg text-lg font-semibold"
        >
          Reset Password
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

/* ---------------- Main Wrapper Component ---------------- */
const ForgetPassword: React.FC = () => {
  const [formStage, setFormStage] = useState<"security" | "reset">("security");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-200/20 to-yellow-200/10 flex flex-col py-8">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-200/20 to-yellow-200/10 animate-pulse" />
        <div className="absolute animate-ping bg-pink-300/30 w-20 h-20 rounded-full bottom-10 left-10" />
      </div>

      <div className="bg-[#f9f9f6] flex flex-col min-h-screen overflow-hidden relative z-10">
        <div className="pt-24 flex-1 flex items-center justify-center w-full px-2 sm:px-6">
          {formStage === "security" ? (
            <SecurityForm onSuccess={() => setFormStage("reset")} />
          ) : (
            <ResetPasswordForm onReset={() => setFormStage("security")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
