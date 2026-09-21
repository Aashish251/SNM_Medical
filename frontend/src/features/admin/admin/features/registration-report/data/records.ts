export type RegistrationRecord = {
  id: string;
  patientName: string;
  registrationDate: string;
  department: string;
  status: string;
};

export const registrationRecords: RegistrationRecord[] = [
  { id: "REG001", patientName: "Rahul Sharma", registrationDate: "2026-06-01", department: "general-medicine", status: "approved" },
  { id: "REG002", patientName: "Priya Patel", registrationDate: "2026-06-02", department: "pediatrics", status: "pending" },
  { id: "REG003", patientName: "Amit Singh", registrationDate: "2026-06-02", department: "orthopedics", status: "approved" },
  { id: "REG004", patientName: "Sneha Reddy", registrationDate: "2026-06-03", department: "cardiology", status: "rejected" },
  { id: "REG005", patientName: "Vikram Mehta", registrationDate: "2026-06-03", department: "general-medicine", status: "approved" },
  { id: "REG006", patientName: "Anjali Desai", registrationDate: "2026-06-04", department: "pediatrics", status: "pending" },
  { id: "REG007", patientName: "Rohan Kapoor", registrationDate: "2026-06-04", department: "neurology", status: "approved" },
  { id: "REG008", patientName: "Meera Iyer", registrationDate: "2026-06-05", department: "cardiology", status: "approved" },
  { id: "REG009", patientName: "Arjun Nair", registrationDate: "2026-06-05", department: "orthopedics", status: "pending" },
  { id: "REG010", patientName: "Kavita Joshi", registrationDate: "2026-06-06", department: "general-medicine", status: "rejected" },
  { id: "REG011", patientName: "Sanjay Gupta", registrationDate: "2026-06-06", department: "neurology", status: "approved" },
  { id: "REG012", patientName: "Deepa Rao", registrationDate: "2026-06-07", department: "pediatrics", status: "approved" },
];

export const registrationStatusMap = new Map<string, string>([
  ["approved", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["pending", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
  ["rejected", "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10"],
]);

export const departmentOptions = [
  { label: "General Medicine", value: "general-medicine" },
  { label: "Pediatrics", value: "pediatrics" },
  { label: "Orthopedics", value: "orthopedics" },
  { label: "Cardiology", value: "cardiology" },
  { label: "Neurology", value: "neurology" },
];

export const registrationStatusOptions = [
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];
