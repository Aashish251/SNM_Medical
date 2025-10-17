import React from "react";
import { Button } from "@shared/components/ui/button";
import {
  SelectField
} from "@shared/components/FormInputs/SelectField";
import { DUMMY } from "../config";
import { FileUploadField, TextField } from "@shared/components/FormInputs";

export const ProfessionalDetailsStep = ({
  form,
  dropdownOption,
  nextStep,
  prevStep,
}: any) => {
  const { control, register, formState: { errors } } = form;

  return (
    <>
      <h3 className="text-2xl font-bold mb-6">Professional Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SelectField
          label="Highest Qualification"
          name="qualificationId"
          control={control}
          options={dropdownOption?.data?.qualifications || []}
          labelKey="qualification_name"
          valueKey="id"
          required
          placeholder="Select Qualification"
        />

        <SelectField
          label="Department"
          name="departmentId"
          control={control}
          options={dropdownOption?.data?.departments || []}
          labelKey="department_name"
          valueKey="id"
          required
          placeholder="Select Department"
        />

        <SelectField
          label="Available Days"
          name="availability"
          control={control}
          options={DUMMY.availabilities}
          labelKey="title"
          valueKey="id"
          required
          placeholder="Select Availability"
        />

        <SelectField
          label="Preferred Shift Time"
          name="shift"
          control={control}
          options={DUMMY.shifts}
          labelKey="title"
          valueKey="id"
          required
          placeholder="Select Shift"
        />

        <TextField
          label="Total Experience (Years)"
          register={register("experience")}
          placeholder="Enter your experience"
        />

        <TextField
          label="Sewa Performed During Last Samagam"
          register={register("lastSewa")}
          placeholder="Enter last Sewa performed"
        />

        <TextField
          label="Recommended By"
          register={register("recommendedBy")}
          placeholder="Enter recommender's name"
        />

        <FileUploadField
          label="Upload Certificate"
          accept="image/*"
          register={register("certificate")}
        />
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="secondary" onClick={prevStep}>
          Previous
        </Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </>
  );
};
