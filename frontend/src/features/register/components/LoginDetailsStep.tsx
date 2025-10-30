import React from "react";
import { Button } from "@shared/components/ui/button";
import { TextareaField, TextField } from "@shared/components/FormInputs";
import { PasswordField } from "@shared/components/FormInputs/PasswordField";

export const LoginDetailsStep = ({ form, prevStep }: any) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PasswordField
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
          placeholder="What are your hobbies?"
          error={errors.hobbies}
        />

        <p className="col-span-2 text-red-500 text-md italic">
          <strong>Note:</strong> Please remember these questions and answers, as
          they are required to recover your login ID or password if forgotten.
        </p>

        <div className="col-span-2">
          <TextareaField
            label="Remark (Added by Administration Team)"
            placeholder="This field will be filled by the administration team after review"
            register={register("remark")}
          />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button variant="secondary" onClick={prevStep}>
          Previous
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </>
  );
};
