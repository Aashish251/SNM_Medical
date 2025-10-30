import React from "react";
import { Button } from "@shared/components/ui/button";
import { TextareaField, TextField } from "@shared/components/FormInputs";

export const LoginDetailsStep = ({ form, prevStep }: any) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          register={register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Min 8 characters required" },
          })}
          placeholder="Enter password"
          error={errors.password}
        />

        <TextField
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          required
          register={register("confirmPassword", {
            required: "Confirm password",
            validate: (v: string) =>
              v === watch("password") || "Passwords do not match",
          })}
          placeholder="Re-enter password"
          error={errors.confirmPassword}
        />

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
