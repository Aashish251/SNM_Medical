export type DutyChartRecord = {
  id: string;
  doctorName: string;
  department: string;
  shift: string;
  status: string;
};

export const dutyChartRecords: DutyChartRecord[] = [
  { id: "DC001", doctorName: "Dr. Amit Kumar", department: "pediatrics", shift: "morning", status: "assigned" },
  { id: "DC002", doctorName: "Dr. Sunita Rao", department: "cardiology", shift: "evening", status: "assigned" },
  { id: "DC003", doctorName: "Dr. Rajesh Verma", department: "orthopedics", shift: "night", status: "pending" },
  { id: "DC004", doctorName: "Dr. Neha Gupta", department: "general-medicine", shift: "morning", status: "assigned" },
  { id: "DC005", doctorName: "Dr. Karan Malhotra", department: "neurology", shift: "evening", status: "cancelled" },
  { id: "DC006", doctorName: "Dr. Pooja Shah", department: "pediatrics", shift: "morning", status: "assigned" },
  { id: "DC007", doctorName: "Dr. Manish Joshi", department: "cardiology", shift: "night", status: "pending" },
  { id: "DC008", doctorName: "Dr. Ritu Agarwal", department: "orthopedics", shift: "morning", status: "assigned" },
  { id: "DC009", doctorName: "Dr. Vivek Sinha", department: "general-medicine", shift: "evening", status: "assigned" },
  { id: "DC010", doctorName: "Dr. Lakshmi Nair", department: "neurology", shift: "morning", status: "pending" },
  { id: "DC011", doctorName: "Dr. Arun Deshmukh", department: "pediatrics", shift: "night", status: "assigned" },
  { id: "DC012", doctorName: "Dr. Kiran Bhat", department: "cardiology", shift: "morning", status: "cancelled" },
];

export const dutyStatusMap = new Map<string, string>([
  ["assigned", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["pending", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
  ["cancelled", "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10"],
]);

export const shiftOptions = [
  { label: "Morning", value: "morning" },
  { label: "Evening", value: "evening" },
  { label: "Night", value: "night" },
];

export const dutyDepartmentOptions = [
  { label: "Pediatrics", value: "pediatrics" },
  { label: "Cardiology", value: "cardiology" },
  { label: "Orthopedics", value: "orthopedics" },
  { label: "General Medicine", value: "general-medicine" },
  { label: "Neurology", value: "neurology" },
];

export const dutyStatusOptions = [
  { label: "Assigned", value: "assigned" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];
