import React from "react";
import { Button } from "@shared/components/ui/button";
import { SelectField } from "@shared/components/FormInputs/SelectField";
import {
  FileUploadField,
  NumberField,
  TextField,
} from "@shared/components/FormInputs";
import { SearchableSelect } from "@shared/components/FormInputs/SearchableSelect";
import { createFileValidation, createTrimOnBlurHandler, validationRules } from "@shared/lib/formValidation";
import { toast } from "@shared/lib/toast";
import { requiredFields, STEP_FIELDS } from "@shared/config/common";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "@shared/types/CommonType";

interface ProfessionalDetailsStepProps {
  form: UseFormReturn<FormValues>;
  dropdownOption: any;
  nextStep: (skipValidation?: boolean) => Promise<boolean>;
  prevStep: () => void;
  reset: () => void;
  existingCertificate?: string;
  regId?: string | number;
}

export const ProfessionalDetailsStep: React.FC<ProfessionalDetailsStepProps> = ({
  form,
  dropdownOption,
  nextStep,
  prevStep,
  reset,
  existingCertificate,
  regId,
}) => {
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

  const handleNext = async () => {
    form.clearErrors("root");
    const fieldsToValidate = STEP_FIELDS[2] || requiredFields[2];
    const valid = await form.trigger(fieldsToValidate);
    if (!valid) {
      toast.error("Please fill all required fields correctly before proceeding.");
      return;
    }
    await nextStep(true);
  };

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
          maxLength={4}
          allowDecimal
          maxWholeDigits={2}
          maxDecimals={1}
          register={register("experience", {
            ...validationRules.experienceYears("Experience"),
            onBlur: (e) => {
              const val = e.target.value.trim().replace(/\.$/, "");
              form.setValue("experience", val, { shouldValidate: true, shouldDirty: true });
            },
          })}
          placeholder="Enter your experience (e.g. 5 or 2.5)"
          error={errors.experience}
        />

        <TextField
          label="Samagam Held In"
          className="max-w-xs"
          inputClassName="h-8 px-2"
          register={register(
            "samagamHeldIn",
            validationRules.trimmedAlphabetic(
              "Samagam Held In",
              "samagamHeldIn",
              form.setValue,
              { maxLength: 100 }
            )
          )}
          placeholder="Enter samagam held in"
          error={errors.samagamHeldIn}
        />

        <TextField
          label="Sewa Performed During Last Samagam"
          className="max-w-xs"
          inputClassName="h-8 px-2"
          register={register(
            "lastSewa",
            validationRules.trimmedAlphabetic(
              "Sewa Performed During Last Samagam",
              "lastSewa",
              form.setValue,
              { maxLength: 100 }
            )
          )}
          placeholder="Enter last Sewa performed"
          error={errors.lastSewa}
        />

        <TextField
          label="Recommended By"
          className="max-w-xs"
          inputClassName="h-8 px-2"
          register={register(
            "recommendedBy",
            validationRules.trimmedAlphabetic(
              "Recommended By",
              "recommendedBy",
              form.setValue,
              { maxLength: 100 }
            )
          )}
          placeholder="Enter recommender's name"
          error={errors.recommendedBy}
        />

        <FileUploadField
          label="Upload Certificate"
          existingUrl={existingCertificate}
          regId={regId}
          accept=".jpg,.jpeg,.png,.pdf"
          selectedFile={watch("certificate")}
          register={register("certificate", {
            validate: createFileValidation({
              allowedExtensions: ["jpg", "jpeg", "png", "pdf"],
              maxSizeMB: 2,
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
            onClick={handleNext}
            className="bg-primary rounded-2xl font-bold text-white w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
