import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { TextField, NumberField } from "@shared/components/FormInputs";
import FormCard from "./FormCard";
import SubmitCancel from "./SubmitCancel";
import { SecurityQuestions } from "../type";
import {
  emailPattern,
  mobilePattern,
  ANIM,
  SNM_NAV_FORGOT_PASSWORD_LABEL,
} from "../constants/constants";
import { useForgotPasswordMutation } from "@features/forgot-password/service/ForgotPasswordApi";
import { toast } from "@shared/lib/toast";

interface Props {
  onSuccess: (data: SecurityQuestions) => void;
}

const SecurityForm: React.FC<Props> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SecurityQuestions>({ mode: "onTouched" });

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (data: SecurityQuestions) => {
    try {
      const response = await toast.promise(forgotPassword(data).unwrap(), {
        loading: "Verifying your details...",
        success: "Password reset link sent to your email!",
        error: "Failed to process your request. Please try again.",
      });

      if (response?.success) {
        onSuccess(data);
        reset();
      }
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  return (
    <FormCard motionProps={ANIM.fadeUp}>
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
            pattern: { value: emailPattern, message: "Enter a valid email" },
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
              value: mobilePattern,
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
          register={register("hobbies", { required: "Hobbies are required" })}
          placeholder="Enter hobbies"
          error={errors.hobbies}
        />

        <SubmitCancel
          isSubmitting={isSubmitting || isLoading}
          onCancel={() => reset()}
        />

        <div className="col-span-1 md:col-span-2 text-center text-gray-500 mt-2">
          <Link to="/login" className="text-sm text-teal-600 hover:underline">
            Click here to Sign In
          </Link>
        </div>
      </form>
    </FormCard>
  );
};

export default SecurityForm;
