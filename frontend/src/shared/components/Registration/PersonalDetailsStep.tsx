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

interface PersonalDetailsStepProps {
  form: UseFormReturn<FormValues>;
  dropdownOption?: any;
  cities: CityItem[];
  citiesLoading: boolean;
  nextStep: () => void;
  reset: () => void;
  existingProfilePic?: string;
}

export const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({
  form,
  dropdownOption,
  cities,
  citiesLoading,
  nextStep,
  reset,
  existingProfilePic,
}) => {
  const {
    control,
    register,
    formState: { errors },
    watch,
  } = form;


  const states = Array.isArray(dropdownOption?.data?.states)
    ? dropdownOption.data.states
    : [];

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
            pattern: {
              value: /^[A-Za-z\s]+$/, //  Only letters and spaces allowed
              message:
                "Full name should contain only alphabets and spaces (no numbers or symbols)",
            },
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
          <DatePickerField
            label="Birthdate"
            name="dateOfBirth"
            control={control}
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
          accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
          register={register("profilePic", {
            validate: {
              fileType: (fileInput) => {
                let file: File | undefined;

                if (!fileInput || (fileInput instanceof FileList && fileInput.length === 0)) {
                  // If we have an existing picture and no new file is selected, it's valid
                  if (existingProfilePic) return true;
                  return "Please upload a profile picture";
                }

                if (fileInput instanceof FileList) {
                  file = fileInput[0];
                } else if (fileInput instanceof File) {
                  file = fileInput;
                } else {
                  return "Please upload a profile picture";
                }

                const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
                const ext = file.name.split(".").pop()?.toLowerCase();

                return (
                  allowedExtensions.includes(ext || "") ||
                  "File type not supported. Please upload an image (jpg, png, etc)"
                );
              },
              fileSize: (fileInput) => {
                if (!fileInput) return true;
                let file: File | undefined;

                if (fileInput instanceof FileList) {
                  if (fileInput.length === 0) return true;
                  file = fileInput[0];
                } else if (fileInput instanceof File) {
                  file = fileInput;
                } else {
                  return true;
                }

                const MAX_SIZE = 5 * 1024 * 1024; // 5MB

                return (
                  file.size <= MAX_SIZE ||
                  `File size must be under 5MB (current size: ${(
                    file.size /
                    1024 /
                    1024
                  ).toFixed(2)}MB)`
                );
              },
            },
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
        <Button size="lg" onClick={nextStep} className="bg-primary rounded-2xl font-bold text-white">Next</Button>
      </div>
    </div>
  );
};
