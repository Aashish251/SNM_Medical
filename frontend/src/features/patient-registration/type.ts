export interface PatientRegistrationPayload {
  regnNo: string;
  date: string;
  patientName: string;
  mobileNumber: string;
  email: string;
  address: string;
  guardianName: string;
  age: number;
  gender: string;
  disease: string;
}

export interface PatientRegistrationResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}
