import React from "react";
import { Button } from "@shared/components/ui/button";
import { TextareaField, TextField } from "@shared/components/FormInputs";
import { PasswordField } from "@shared/components/FormInputs/PasswordField";
import { RootState } from "@app/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { handleAlphabeticInput } from "@shared/lib/utils";

export const LoginDetailsStep = ({ form, prevStep, reset, disabled, setDisabled }: any) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const userType = useSelector((state: RootState) => state.auth.userType);
  const { id: regId } = useParams();
  return (
    <>
      {/* Responsive grid for inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
        {!regId && <><PasswordField
          label="Password"
          autoComplete="new-password"
          required
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
            autoComplete="confirm-password"
            required
            register={register("confirmPassword", {
              required: "Confirm password",
              validate: (v: string) =>
                v === watch("password") || "Passwords do not match",
            })}
            placeholder="Re-enter password"
            error={errors.confirmPassword}
          /></>}

        <TextField
          label="What is your favorite food?"
          required
          register={register("favoriteFood", {
            required: "Favorite food is required",
            pattern: {
              value: /^[A-Za-z\s]+$/, //  Only letters and spaces allowed
              message:
                "Favorite food should contain only alphabets and spaces (no numbers or symbols)",
            },
            onChange: (e: any) =>
              handleAlphabeticInput(e, "favoriteFood", form.setValue),
          })}
          placeholder="Enter favorite food"
          error={errors.favoriteFood}
        />

        <TextField
          label="What was your childhood nickname?"
          required
          register={register("childhoodNickname", {
            required: "Childhood nickname is required",
            pattern: {
              value: /^[A-Za-z\s]+$/, //  Only letters and spaces allowed
              message:
                "Childhood nickname should contain only alphabets and spaces (no numbers or symbols)",
            },
            onChange: (e: any) =>
              handleAlphabeticInput(e, "childhoodNickname", form.setValue),
          })}
          placeholder="Enter childhood nickname"
          error={errors.childhoodNickname}
        />

        <TextField
          label="What is your mother's maiden name?"
          required
          register={register("motherMaidenName", {
            required: "Mother's maiden name is required",
            pattern: {
              value: /^[A-Za-z\s]+$/, //  Only letters and spaces allowed
              message:
                "Mother's maiden name should contain only alphabets and spaces (no numbers or symbols)",
            },
            onChange: (e: any) =>
              handleAlphabeticInput(e, "motherMaidenName", form.setValue),
          })}
          placeholder="Enter mother's maiden name"
          error={errors.motherMaidenName}
        />

        <TextField
          label="What are your hobbies?"
          required
          register={register("hobbies", {
            required: "Hobbies are required",
            pattern: {
              value: /^[A-Za-z\s]+$/, //  Only letters and spaces allowed
              message:
                "Hobbies should contain only alphabets and spaces (no numbers or symbols)",
            },
            onChange: (e: any) =>
              handleAlphabeticInput(e, "hobbies", form.setValue),
          })}
          placeholder="What are your hobbies?"
          error={errors.hobbies}
        />

        {/* Note Section - spans both columns */}
        <p className="col-span-1 sm:col-span-2 text-red-500 text-sm sm:text-md italic mt-2">
          <strong>Note:</strong> Please remember these questions and answers, as
          they are required to recover your login ID or password if forgotten.
        </p>

        {/* Textarea Field - full width */}
        <div className="col-span-1 sm:col-span-2">
          <TextareaField
            disabled={userType === "admin" ? false : true}
            label="Remark (Added by Administration Team)"
            placeholder="This field will be filled by the administration team after review"
            register={register("remark")}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 w-full">
        <Button
          size="lg"
          onClick={prevStep}
          className="w-full sm:w-auto px-6 py-2 bg-primary rounded-2xl font-bold text-white"
        >
          Previous
        </Button>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            onClick={reset}
            type="button"
            className="w-full sm:w-auto px-6 py-2 bg-red-600 rounded-2xl font-bold text-white"
          >
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={disabled}
            className="w-full sm:w-auto px-6 py-2 bg-green-600 rounded-2xl font-bold text-white"
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};
