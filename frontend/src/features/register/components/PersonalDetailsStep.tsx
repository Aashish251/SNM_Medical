import React from "react";
import { Button } from "@shared/components/ui/button";
import {
  TextField,
} from "@shared/components/FormInputs/TextField";
import { DUMMY } from "../config";
import { UseFormReturn } from "react-hook-form";
import { FormValues, CityItem } from "../type";
import { FileUploadField, SelectField, TextareaField } from "@shared/components/FormInputs";

interface PersonalDetailsStepProps {
  form: UseFormReturn<FormValues>;
  dropdownOption?: any;
  cities: CityItem[];
  citiesLoading: boolean;
  nextStep: () => void;
  reset: () => void;
}

export const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({
  form,
  dropdownOption,
  cities,
  citiesLoading,
  nextStep,
  reset,
}) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <h3 className="text-2xl font-bold mb-6">Personal Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Title */}
        <SelectField
          label="Title"
          name="title"
          control={control}
          options={DUMMY.titles}
          valueKey="id"
          labelKey="title"
          required
          placeholder="Select title"
        />

        {/* Full Name */}
        <TextField
          label="Full Name"
          required
          register={register("fullName", {
            required: "Full name is required",
          })}
          placeholder="Enter full name"
          error={errors.fullName}
        />

        {/* Contact */}
        <TextField
          label="Contact"
          required
          register={register("contact", {
            required: "Contact number is required",
            pattern: {
              value: /^[6-9][0-9]{9}$/,
              message: "Enter valid 10-digit number",
            },
          })}
          placeholder="10-digit mobile number"
          error={errors.contact}
        />

        {/* Gender */}
        <SelectField
          label="Gender"
          name="gender"
          control={control}
          options={DUMMY.genders}
          valueKey="id"
          labelKey="title"
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
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          placeholder="Enter email address"
          error={errors.email}
        />

        {/* Birthdate + Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <TextField
            label="Birthdate"
            type="date"
            required
            register={register("birthdate", {
              required: "Birthdate is required",
            })}
            placeholder="Select birthdate"
            error={errors.birthdate}
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
        <SelectField
          label="State"
          name="stateId"
          control={control}
          options={dropdownOption?.data?.states || []}
          valueKey="id"
          labelKey="state_name"
          required
          placeholder="Select State"
        />

        {/* City */}
        <SelectField
          label="City"
          name="cityId"
          control={control}
          options={cities}
          valueKey="id"
          labelKey="city_name"
          required
          placeholder={citiesLoading ? "Loading cities..." : "Select City"}
        />

        {/* Profile Picture */}
        <FileUploadField
          label="Profile Picture"
          accept="image/*"
          register={register("profilePic")}
        />

        {/* Address */}
        <div className="col-span-3">
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

      <div className="mt-8 flex justify-end gap-4">
        <Button variant="secondary" onClick={() => reset()}>
          Reset
        </Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </>
  );
};
