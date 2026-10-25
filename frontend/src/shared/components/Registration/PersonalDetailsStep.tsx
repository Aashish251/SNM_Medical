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
import { handleAlphabeticInput, isValidBirthdate } from "@shared/lib/utils";
import { useCheckRegistrationAvailabilityMutation } from "@features/register/services";
import { normalizeApiError } from "@shared/api/errors";
import { requiredFields } from "@shared/config/common";
import { createFileValidation, validationRules } from "@shared/lib/formValidation";
import { toast } from "@shared/lib/toast";

interface PersonalDetailsStepProps {
  form: UseFormReturn<FormValues>;
  dropdownOption?: any;
  cities: CityItem[];
  citiesLoading: boolean;
  nextStep: (skipValidation?: boolean) => Promise<boolean>;
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
    form.clearErrors("root");
    const valid = await form.trigger(requiredFields[1]);
    if (!valid) {
      toast.error("Please fill all required fields correctly before proceeding.");
      return;
    }

    if (!checkDuplicates) {
      await nextStep(true);
      return;
    }

    try {
      const emailVal = String(form.getValues("email") || "").trim();
      const mobileVal = String(form.getValues("mobileNo") || "").trim();

      const result = await checkAvailability({
        email: emailVal,
        mobileNo: mobileVal,
      }).unwrap();

      const availability = result.data;
      let hasDuplicate = false;
      const duplicateMessages: string[] = [];

      if (availability?.emailExists) {
        form.setError("email", { type: "server", message: "This email is already registered" });
        duplicateMessages.push("This email is already registered");
        hasDuplicate = true;
      } else {
        form.clearErrors("email");
      }

      if (availability?.mobileExists) {
        form.setError("mobileNo", { type: "server", message: "This phone number is already registered" });
        duplicateMessages.push("This phone number is already registered");
        hasDuplicate = true;
      } else {
        form.clearErrors("mobileNo");
      }

      if (hasDuplicate || !availability?.available) {
        toast.error(duplicateMessages.join(". ") || "Email or mobile number is already registered");
        return;
      }

      form.clearErrors(["email", "mobileNo"]);
      form.clearErrors("root");
      await nextStep(true);
    } catch (error) {
      const errorMsg = normalizeApiError(error).message;
      form.setError("root", { type: "server", message: errorMsg });
      toast.error(errorMsg || "Failed to validate email and mobile number");
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
            ...validationRules.fullName("Full name"),
            onChange: (e: any) =>
              handleAlphabeticInput(e, "fullName", form.setValue),
            onBlur: (e: any) => {
              const raw = e?.target?.value;
              if (typeof raw === "string") {
                const trimmed = raw.trim().replace(/\s+/g, " ");
                if (trimmed && trimmed !== raw) {
                  form.setValue("fullName", trimmed, { shouldValidate: true });
                }
              }
            },
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
            ...validationRules.mobileNumber,
            onChange: () => {
              if (errors.mobileNo) {
                form.clearErrors("mobileNo");
              }
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
          type="email"
          autoComplete="email"
          required
          register={register("email", {
            ...validationRules.requiredEmail("Email address"),
            onChange: () => {
              if (errors.email) {
                form.clearErrors("email");
              }
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
              validate: {
                validDate: (value) => {
                  if (!value) return true;
                  return isValidBirthdate(value)
                    || "Enter a valid birthdate no more than 120 years ago";
                },
              },
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
          accept=".jpg,.jpeg,.png"
          selectedFile={watch("profilePic")}
          register={register("profilePic", {
            validate: createFileValidation({
              allowedExtensions: ["jpg", "jpeg", "png"],
              maxSizeMB: 2,
              existingUrl: existingProfilePic,
            }),
          })}
          error={errors.profilePic}
        />

        {/* Address */}
        <div className="col-span-1 sm:col-span-2 md:col-span-3">
          <TextareaField
            label="Address"
            placeholder="Enter address"
            required
            register={register("address", validationRules.required("Address"))}
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
