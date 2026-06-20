export type MasterSearchRecord = {
  id: string;
  recordType: string;
  name: string;
  phone: string;
  status: string;
};

export const masterSearchRecords: MasterSearchRecord[] = [
  { id: "MS001", recordType: "patient", name: "Anita Verma", phone: "9876543210", status: "active" },
  { id: "MS002", recordType: "doctor", name: "Dr. Ravi Shankar", phone: "9876543211", status: "active" },
  { id: "MS003", recordType: "patient", name: "Suresh Kumar", phone: "9876543212", status: "inactive" },
  { id: "MS004", recordType: "staff", name: "Lata Menon", phone: "9876543213", status: "active" },
  { id: "MS005", recordType: "patient", name: "Geeta Pillai", phone: "9876543214", status: "archived" },
  { id: "MS006", recordType: "doctor", name: "Dr. Mohan Das", phone: "9876543215", status: "active" },
  { id: "MS007", recordType: "patient", name: "Harish Chandra", phone: "9876543216", status: "active" },
  { id: "MS008", recordType: "staff", name: "Nirmala Devi", phone: "9876543217", status: "inactive" },
  { id: "MS009", recordType: "patient", name: "Bharat Singh", phone: "9876543218", status: "active" },
  { id: "MS010", recordType: "doctor", name: "Dr. Asha Prasad", phone: "9876543219", status: "archived" },
  { id: "MS011", recordType: "patient", name: "Chitralekha Roy", phone: "9876543220", status: "active" },
  { id: "MS012", recordType: "staff", name: "Prakash Tiwari", phone: "9876543221", status: "active" },
];

export const masterSearchStatusMap = new Map<string, string>([
  ["active", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["inactive", "bg-neutral-300/40 border-neutral-300"],
  ["archived", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
]);

export const recordTypeOptions = [
  { label: "Patient", value: "patient" },
  { label: "Doctor", value: "doctor" },
  { label: "Staff", value: "staff" },
];

export const masterSearchStatusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
];
