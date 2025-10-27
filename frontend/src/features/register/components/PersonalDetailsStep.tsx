import React, { useState } from "react";
import { Button } from "@shared/components/ui/button";
import { TextField } from "@shared/components/FormInputs/TextField";
import { DUMMY } from "../config";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormValues, CityItem } from "../type";
import {
  FileUploadField,
  RequiredMark,
  SelectField,
  TextareaField,
} from "@shared/components/FormInputs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@shared/components/ui/command";
import { Label } from "@shared/components/ui/label";
import { SearchableSelect } from "@shared/components/FormInputs/SearchableSelect";

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
    watch,
  } = form;

  const states = Array.isArray(dropdownOption?.data?.states)
    ? dropdownOption.data.states
    : [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          valueKey="value"
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
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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

        {/* State (Searchable with Popover) */}
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

        {/* City (Searchable with Popover) */}
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

      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </>
  );
};
