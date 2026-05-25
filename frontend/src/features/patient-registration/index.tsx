import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@shared/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { TextField } from "@shared/components/FormInputs/TextField";
import { TextareaField } from "@shared/components/FormInputs/TextareaField";
import { SelectField } from "@shared/components/FormInputs/SelectField";
import { DatePickerField } from "@shared/components/FormInputs/DatePickerField";
import { validationRules } from "@shared/lib/formValidation";

type PatientRegistrationFormValues = {
  regnNo: string;
  date: string | null;
  patientName: string;
  mobileNumber: string;
  email: string;
  address: string;
  fatherOrSpouseName: string;
  age: string;
  gender: "male" | "female" | "other" | "";
  diseaseSymptoms: string;
};

const genderOptions = [
  { id: "male", title: "Male" },
  { id: "female", title: "Female" },
  { id: "other", title: "Other" },
];

export default function PatientRegistration() {
  const [submittedData, setSubmittedData] = useState<PatientRegistrationFormValues | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientRegistrationFormValues>({
    defaultValues: {
      regnNo: "",
      date: null,
      patientName: "",
      mobileNumber: "",
      email: "",
      address: "",
      fatherOrSpouseName: "",
      age: "",
      gender: "",
      diseaseSymptoms: "",
    },
  });

  const onSubmit = (values: PatientRegistrationFormValues) => {
    setSubmittedData(values);
  };

  const onReset = () => {
    reset();
    setSubmittedData(null);
  };

  return (
    <div className="mx-auto max-w-7xl pt-[120px] md:pt-[90px] lg:pt-[100px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Patient Registration</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Register patients quickly and accurately with the volunteer patient registration form.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="space-y-2 border-b border-border bg-background px-6 py-5">
          <h2 className="text-lg font-semibold text-foreground">Patient Details</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the patient information below. Required fields are marked with an asterisk.
          </p>
        </CardHeader>

        <CardContent className="px-6 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <TextField
                label="Regn No"
                register={register("regnNo")}
                placeholder="Enter registration number"
                error={errors.regnNo ?? null}
              />

              <DatePickerField
                label="Date"
                name="date"
                control={control}
                placeholder="DD/MM/YYYY"
                required={false}
                className="w-full"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <TextField
                label="Name of Patient"
                register={register("patientName", {
                  ...validationRules.required("Name of Patient"),
                })}
                placeholder="Enter patient name"
                error={errors.patientName ?? null}
              />

              <TextField
                label="Mobile Number"
                register={register("mobileNumber", {
                  ...validationRules.mobileNumber,
                })}
                placeholder="Enter 10-digit mobile number"
                error={errors.mobileNumber ?? null}
                type="tel"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <TextField
                label="Email"
                register={register("email", {
                  ...validationRules.email,
                })}
                placeholder="Enter email address"
                error={errors.email ?? null}
                type="email"
              />

              <SelectField
                label="Gender"
                name="gender"
                control={control}
                options={genderOptions}
                placeholder="Select gender"
                required
                className="w-full"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <TextareaField
                label="Address"
                register={register("address", {
                  ...validationRules.required("Address"),
                })}
                placeholder="Enter patient address"
                error={errors.address ?? null}
                rows={4}
                className="lg:col-span-2"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <TextField
                label="Father / Spouse Name"
                register={register("fatherOrSpouseName")}
                placeholder="Enter father or spouse name"
                error={errors.fatherOrSpouseName ?? null}
              />

              <TextField
                label="Age"
                register={register("age", {
                  ...validationRules.age,
                })}
                placeholder="Enter age"
                error={errors.age ?? null}
                type="number"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <TextareaField
                label="Disease / Symptoms"
                register={register("diseaseSymptoms")}
                placeholder="Describe disease or symptoms"
                error={errors.diseaseSymptoms ?? null}
                rows={4}
                className="lg:col-span-2"
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              {submittedData ? (
                <p className="text-sm text-success">
                  Patient registration saved successfully.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Review your input before submitting.
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onReset}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
