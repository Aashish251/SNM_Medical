import React from "react";
import { Button } from "@shared/components/ui/button";
import { TextareaField, TextField } from "@shared/components/FormInputs";
import { PasswordField } from "@shared/components/FormInputs/PasswordField";
import { RootState } from "@app/store";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { handleAlphabeticInput } from "@shared/lib/utils";
import { validationRules } from "@shared/lib/formValidation";

export const LoginDetailsStep = ({ form, prevStep, reset, disabled, setDisabled }: any) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const userType = useSelector((state: RootState) => state.auth.userType);
  const { state: regId } = useLocation();
  return (
    <>
      {/* Responsive grid for inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
        {!regId?.userId && (
          <>
            <PasswordField
              label="Password"
              autoComplete="new-password"
              required
              placeholder="Enter your password"
              register={register(
                "password",
                validationRules.password({ minLength: 6 })
              )}
              error={errors.password}
            />

            <PasswordField
              label="Confirm Password"
              autoComplete="confirm-password"
              required
              register={register(
                "confirmPassword",
                validationRules.confirmPassword(() => watch("password"))
              )}
              placeholder="Re-enter password"
              error={errors.confirmPassword}
            />
          </>
        )}

        <TextField
          label="What is your favorite food?"
          required
          register={register(
            "favoriteFood",
            validationRules.trimmedText(
              "Favorite food",
              "favoriteFood",
              form.setValue,
              { required: true }
            )
          )}
          placeholder="Enter favorite food"
          error={errors.favoriteFood}
        />

        <TextField
          label="What was your childhood nickname?"
          required
          register={register(
            "childhoodNickname",
            validationRules.trimmedText(
              "Childhood nickname",
              "childhoodNickname",
              form.setValue,
              { required: true }
            )
          )}
          placeholder="Enter childhood nickname"
          error={errors.childhoodNickname}
        />

        <TextField
          label="What is your mother's maiden name?"
          required
          register={register(
            "motherMaidenName",
            validationRules.trimmedText(
              "Mother's maiden name",
              "motherMaidenName",
              form.setValue,
              { required: true }
            )
          )}
          placeholder="Enter mother's maiden name"
          error={errors.motherMaidenName}
        />

        <TextField
          label="What are your hobbies?"
          required
          register={register(
            "hobbies",
            validationRules.trimmedText(
              "Hobbies",
              "hobbies",
              form.setValue,
              { required: true }
            )
          )}
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
          type="button"
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
