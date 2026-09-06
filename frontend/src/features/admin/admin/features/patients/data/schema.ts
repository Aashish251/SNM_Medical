export type PatientStatus = "active" | "outpatient" | "discharged" | "follow-up";

export type PatientGender = "Male" | "Female" | "Other";

export type Patient = {
  id: string;
  regnNo: string;
  patientName: string;
  mobileNumber: string;
  email: string;
  address: string;
  guardianName: string;
  age: number;
  gender: PatientGender;
  disease: string;
  registrationDate: string;
  status: PatientStatus;
  createdAt: Date;
  updatedAt: Date;
};
