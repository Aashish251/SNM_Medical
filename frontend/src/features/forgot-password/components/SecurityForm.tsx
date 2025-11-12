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
  setUserRegIDObj: (userRegIdObj: { status?: string; regId?: number }) => void;
}

const SecurityForm: React.FC<Props> = ({ onSuccess, setUserRegIDObj }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SecurityQuestions>({ mode: "onTouched" });

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (data: SecurityQuestions) => {
    try {
      // 1️⃣ Show a loading toast (optional)
      const loadingToast = toast.loading("Verifying your details...");

      // 2️⃣ Await API call
      const response = await forgotPassword(data).unwrap();

      // 4️⃣ Show success or error message based on API reply
      if (response?.data?.status === "PASS") {
        toast.success(
          response?.message || "You may now change or update your password."
        );
        console.log(response?.data?.reg_id);
        setUserRegIDObj({
          status: response?.data?.status,
          regId: response?.data?.reg_id,
        });
        onSuccess(data);
        reset();
      } else {
        toast.error(
          response?.message ||
            "Failed to process your request. Please try again."
        );
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  return (
    <FormCard motionProps={ANIM.fadeUp}>
      <h1 className="text-3xl font-extrabold text-center bg-to-two-right-theme-gradient bg-clip-text text-transparent mb-6">
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
          register={register("mobileNo", {
            required: "Contact number is required",
            pattern: {
              value: mobilePattern,
              message: "Enter a valid 10-digit mobile number",
            },
          })}
          placeholder="Enter 10-digit mobile number"
          error={errors.mobileNo}
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
