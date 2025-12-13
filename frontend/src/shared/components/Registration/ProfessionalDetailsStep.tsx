import React, { useState } from "react";
import { Button } from "@shared/components/ui/button";
import { SelectField } from "@shared/components/FormInputs/SelectField";
import { DUMMY } from "@shared/config/common";
import {
  FileUploadField,
  NumberField,
  RequiredMark,
  TextField,
} from "@shared/components/FormInputs";
import { SearchableSelect } from "@shared/components/FormInputs/SearchableSelect";

export const ProfessionalDetailsStep = ({
  form,
  dropdownOption,
  nextStep,
  prevStep,
  reset,
}: any) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = form;
  const qualifications = Array.isArray(dropdownOption?.data?.qualifications)
    ? dropdownOption.data.qualifications
    : [];

  const departments = Array.isArray(dropdownOption?.data?.departments)
    ? dropdownOption.data.departments
    : [];

  const availableDays = Array.isArray(dropdownOption?.data?.availableDays)
    ? dropdownOption.data.availableDays
    : [];

  const shiftTimes = Array.isArray(dropdownOption?.data?.shiftTimes)
    ? dropdownOption.data.shiftTimes
    : [];

  const handleAlphabeticInput = (
    e: any,
    registration: any
  ) => {
    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    registration.onChange(e);
  };

  const lastSewaRegister = register("lastSewa", {
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message:
        "Last Sewa should contain only alphabets and spaces (no numbers or symbols)",
    },
  });

  const recommendedByRegister = register("recommendedBy", {
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message:
        "Recommended By should contain only alphabets and spaces (no numbers or symbols)",
    },
  });

  const samagamHeldInRegister = register("samagamHeldIn", {
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "Enter Samagam held In (no numbers or symbols)",
    },
  });

  return (
    <div className="p-4 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <SearchableSelect
          control={control}
          name="qualificationId"
          label="Qualification"
          options={qualifications}
          labelKey="qualification_name"
          valueKey="id"
          required
          placeholder="Select qualification"
        />

        <SearchableSelect
          control={control}
          name="departmentId"
          label="Department"
          options={departments}
          labelKey="department_name"
          valueKey="id"
          required
          placeholder="Select department"
        />

        <SelectField
          label="Available Days"
          name="availability"
          control={control}
          options={availableDays}
          labelKey="available_day"
          valueKey="id"
          required
          placeholder="Select Availability"
        />

        <SelectField
          label="Preferred Shift Time"
          name="shift"
          control={control}
          options={shiftTimes}
          labelKey="shifttime"
          valueKey="id"
          required
          placeholder="Select Shift"
        />

        <NumberField
          label="Total Experience (Years)"
          maxLength={3}
          allowDecimal
          register={register("experience")}
          placeholder="Enter your experience"
        />

        <TextField
          label="Samagam Held In"
          register={{
            ...samagamHeldInRegister,
            onChange: (e) => handleAlphabeticInput(e, samagamHeldInRegister),
          }}
          placeholder="Enter samagam held in"
          error={errors.samagamHeldIn}
        />

        <TextField
          label="Sewa Performed During Last Samagam"
          register={{
            ...lastSewaRegister,
            onChange: (e) => handleAlphabeticInput(e, lastSewaRegister),
          }}
          placeholder="Enter last Sewa performed"
          error={errors.lastSewa}
        />

        <TextField
          label="Recommended By"
          register={{
            ...recommendedByRegister,
            onChange: (e) => handleAlphabeticInput(e, recommendedByRegister),
          }}
          placeholder="Enter recommender's name"
          error={errors.recommendedBy}
        />

        <FileUploadField
          label="Upload Certificate"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf"
          required
          register={register("certificate", {
            required: "Please upload a certificate",
            validate: {
              fileType: (fileList) => {
                if (!fileList || fileList.length === 0)
                  return "Please upload a certificate";

                const allowedExtensions = [
                  "jpg",
                  "jpeg",
                  "png",
                  "gif",
                  "bmp",
                  "webp",
                  "pdf",
                ];
                const file = fileList[0];
                const ext = file.name.split(".").pop()?.toLowerCase();

                return (
                  allowedExtensions.includes(ext || "") ||
                  "File type not supported. Please upload an image (jpg, png, etc)"
                );
              },
              fileSize: (fileList) => {
                if (!fileList || fileList.length === 0) return true;
                const file = fileList[0];
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
          error={errors.certificate}
        />
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          size="lg"
          className="bg-primary rounded-2xl font-bold text-white"
          onClick={prevStep}
        >
          Previous
        </Button>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            className="bg-red-600 rounded-2xl font-bold text-white"
            onClick={reset}
          >
            Reset
          </Button>
          <Button
            size="lg"
            onClick={nextStep}
            className="bg-primary rounded-2xl font-bold text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
