import React from "react";
import { Button } from "@shared/components/ui/button";
import { TextField } from "@shared/components/FormInputs/TextField";
import { DUMMY } from "@shared/config/common";
import { UseFormReturn } from "react-hook-form";
import { FormValues, CityItem } from "@shared/types/CommonType";
import {
  DatePickerField,
  FileUploadField,
  NumberField,
  SelectField,
  TextareaField,
} from "@shared/components/FormInputs";
import { SearchableSelect } from "@shared/components/FormInputs/SearchableSelect";
import { handleAlphabeticInput } from "@shared/lib/utils";
import { useCheckRegistrationAvailabilityMutation } from "@features/register/services";
import { normalizeApiError } from "@shared/api/errors";
import { requiredFields } from "@shared/config/common";
import { createFileValidation, validationRules } from "@shared/lib/formValidation";

interface PersonalDetailsStepProps {
  form: UseFormReturn<FormValues>;
  dropdownOption?: any;
  cities: CityItem[];
  citiesLoading: boolean;
  nextStep: () => Promise<boolean>;
  reset: () => void;
  existingProfilePic?: string;
  checkDuplicates?: boolean;
}

export const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({
  form,
  dropdownOption,
  cities,
  citiesLoading,
  nextStep,
  reset,
  existingProfilePic,
  checkDuplicates = true,
}) => {
  const [checkAvailability, { isLoading: checkingAvailability }] = useCheckRegistrationAvailabilityMutation();
  const {
    control,
    register,
    formState: { errors },
    watch,
  } = form;


  const states = Array.isArray(dropdownOption?.data?.states)
    ? dropdownOption.data.states
    : [];

  const handleNext = async () => {
    const valid = await form.trigger(requiredFields[1]);
    if (!valid || !(await form.trigger(["email", "mobileNo"]))) return;
    if (!checkDuplicates) {
      await nextStep();
      return;
    }
    form.clearErrors("root");

    try {
      const result = await checkAvailability({
        email: String(form.getValues("email") || "").trim(),
        mobileNo: String(form.getValues("mobileNo") || "").trim(),
      }).unwrap();
      const availability = result.data;
      if (availability?.emailExists) {
        form.setError("email", { type: "server", message: "This email is already registered" });
      }
      if (availability?.mobileExists) {
        form.setError("mobileNo", { type: "server", message: "This phone number is already registered" });
      }
      if (availability?.available) {
        form.clearErrors(["email", "mobileNo"]);
        await nextStep();
      }
    } catch (error) {
      form.setError("root", { type: "server", message: normalizeApiError(error).message });
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Title */}
        <SelectField
          label="Title"
          name="title"
          control={control}
          options={DUMMY.titles}
          valueKey="value"
          labelKey="label"
          required
          placeholder="Select title"
        />

        {/* Full Name */}
        <TextField
          label="Full Name"
          required
          register={register("fullName", {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Full name must be at least 2 characters long",
            },
            ...validationRules.alphabetic("Full name"),
            onChange: (e: any) =>
              handleAlphabeticInput(e, "fullName", form.setValue),
          })}
          placeholder="Enter full name"
          error={errors.fullName}
        />

        {/* Contact */}
        <NumberField
          label="Contact Number"
          required
          maxLength={10}
          register={register("mobileNo", {
            required: "Contact number is required",
            pattern: {
              value: /^(?:\+91|91|0)?[-\s]?[6-9]\d{9}$/, // must start with 6–9 and be 10 digits
              message: "Enter a valid 10-digit mobile number",
            },
          })}
          placeholder="Enter 10-digit mobile number"
          error={errors.mobileNo}
        />

        {/* Gender */}
        <SelectField
          label="Gender"
          name="gender"
          control={control}
          options={DUMMY.genders}
          valueKey="id"
          labelKey="label"
          required
          placeholder="Select gender"
        />

        {/* Email */}
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

        {/* Birthdate & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <TextField
            label="Birthdate"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            required
            register={register("dateOfBirth", {
              required: "Birthdate is required",
            })}
            placeholder="DD/MM/YYYY"
            error={errors.dateOfBirth}
          />

          <TextField
            label="Age"
            readOnly
            register={register("age", { required: "Age is required" })}
            placeholder="Auto calculated"
            error={errors.age}
          />
        </div>

        {/* State */}
        <SearchableSelect
          control={control}
          name="stateId"
          label="State"
          options={states}
          labelKey="state_name"
          valueKey="id"
          required
          placeholder="Select state"
        />

        {/* City */}
        <SearchableSelect
          control={control}
          name="cityId"
          label="City"
          options={cities}
          labelKey="city_name"
          valueKey="id"
          required
          placeholder="Select city"
        />

        {/* Profile Picture */}
        <FileUploadField
          label="Profile Picture"
          existingUrl={existingProfilePic}
          accept=".jpg,.jpeg,.png,"
          selectedFile={watch("profilePic")}
          register={register("profilePic", {
            validate: createFileValidation({
              allowedExtensions: ["jpg", "jpeg", "png"],
              maxSizeMB: 2,
              requiredMessage: "Please upload a profile picture",
              existingUrl: existingProfilePic,
            }),
          })}
        />

        {/* Address */}
        <div className="col-span-1 sm:col-span-2 md:col-span-3">
          <TextareaField
            label="Address"
            placeholder="Enter address"
            required
            register={register("address", {
              required: "Address is required",
            })}
            error={errors.address}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
        <Button
          size="lg"
          type="button"
          className="bg-red-600 rounded-2xl font-bold text-white"
          onClick={reset}
        >
          Reset
        </Button>
        <Button type="button" size="lg" onClick={handleNext} disabled={checkingAvailability} className="bg-primary rounded-2xl font-bold text-white">{checkingAvailability ? "Checking..." : "Next"}</Button>
      </div>
      {errors.root?.message && <p role="alert" className="mt-3 text-sm text-red-600 text-right">{errors.root.message}</p>}
    </div>
  );
};
