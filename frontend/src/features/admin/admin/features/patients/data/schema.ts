import type { PatientApiItem } from "../services/patientsApi";

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

export function mapApiPatientToPatient(item: PatientApiItem): Patient {
  const genderMap: Record<string, PatientGender> = {
    male: "Male",
    female: "Female",
    other: "Other",
    Male: "Male",
    Female: "Female",
    Other: "Other",
  };

  return {
    id: String(item.id),
    regnNo: item.regnNo || "",
    patientName: item.patientName || "",
    mobileNumber: item.mobileNumber || "",
    email: item.email || "",
    address: item.address || "",
    guardianName: item.guardianName || "",
    age: Number(item.age) || 0,
    gender: genderMap[item.gender] || (item.gender as PatientGender) || "Male",
    disease: item.disease || "",
    registrationDate: item.date || (item.createdAt ? item.createdAt.split("T")[0] : ""),
    status: (item.status as PatientStatus) || "active",
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  };
}

