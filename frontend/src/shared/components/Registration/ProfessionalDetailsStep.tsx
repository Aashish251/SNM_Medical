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
import { handleAlphabeticInput } from "@shared/lib/utils";
import { createFileValidation, validationRules } from "@shared/lib/formValidation";

export const ProfessionalDetailsStep = ({
  form,
  dropdownOption,
  nextStep,
  prevStep,
  reset,
  existingCertificate,
  regId,
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
          name="availableDayId"
          control={control}
          options={availableDays}
          labelKey="available_day"
          valueKey="id"
          required
          placeholder="Select Availability"
        />

        <SelectField
          label="Preferred Shift Time"
          name="shiftTimeId"
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
          register={register("samagamHeldIn", {
            ...validationRules.alphabetic("Samagam Held In"),
            onChange: (e: any) =>
              handleAlphabeticInput(e, "samagamHeldIn", form.setValue),
          })}
          placeholder="Enter samagam held in"
          error={errors.samagamHeldIn}
        />

        <TextField
          label="Sewa Performed During Last Samagam"
          register={register("lastSewa", {
            ...validationRules.alphabetic("Last Sewa"),
            onChange: (e: any) =>
              handleAlphabeticInput(e, "lastSewa", form.setValue),
          })}
          placeholder="Enter last Sewa performed"
          error={errors.lastSewa}
        />

        <TextField
          label="Recommended By"
          register={register("recommendedBy", {
            ...validationRules.alphabetic("Recommended By"),
            onChange: (e: any) =>
              handleAlphabeticInput(e, "recommendedBy", form.setValue),
          })}
          placeholder="Enter recommender's name"
          error={errors.recommendedBy}
        />

        <FileUploadField
          label="Upload Certificate"
          existingUrl={existingCertificate}
          regId={regId}
          accept=".jpg,.jpeg,.png,.pdf"
          required
          selectedFile={watch("certificate")}
          register={register("certificate", {
            validate: createFileValidation({
              allowedExtensions: ["jpg", "jpeg", "png", "pdf"],
              maxSizeMB: 2,
              requiredMessage: "Please upload a certificate",
              existingUrl: existingCertificate,
            }),
          })}
          error={errors.certificate}
        />
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <Button
          type="button"
          size="lg"
          className="bg-primary rounded-2xl font-bold text-white w-full sm:w-auto"
          onClick={prevStep}
        >
          Previous
        </Button>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            type="button"
            className="bg-red-600 rounded-2xl font-bold text-white w-full sm:w-auto"
            onClick={reset}
          >
            Reset
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={nextStep}
            className="bg-primary rounded-2xl font-bold text-white w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
