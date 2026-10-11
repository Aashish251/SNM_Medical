import { type PatientGender } from "./schema";

export const patientGenderOptions: { label: string; value: PatientGender }[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
