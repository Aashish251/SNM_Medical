export type DailyReportRecord = {
  id: string;
  reportName: string;
  date: string;
  totalPatients: number;
  type: string;
  status: string;
};

export const dailyReportRecords: DailyReportRecord[] = [
  { id: "DR001", reportName: "Daily Health Camp", date: "2026-06-01", totalPatients: 150, type: "health-camp", status: "completed" },
  { id: "DR002", reportName: "OPD Summary", date: "2026-06-01", totalPatients: 320, type: "opd", status: "completed" },
  { id: "DR003", reportName: "Emergency Ward Report", date: "2026-06-02", totalPatients: 45, type: "emergency", status: "in-progress" },
  { id: "DR004", reportName: "Lab Diagnostics", date: "2026-06-02", totalPatients: 89, type: "lab", status: "completed" },
  { id: "DR005", reportName: "Pharmacy Dispensing", date: "2026-06-03", totalPatients: 210, type: "pharmacy", status: "draft" },
  { id: "DR006", reportName: "Vaccination Drive", date: "2026-06-03", totalPatients: 175, type: "health-camp", status: "completed" },
  { id: "DR007", reportName: "IPD Admissions", date: "2026-06-04", totalPatients: 28, type: "ipd", status: "in-progress" },
  { id: "DR008", reportName: "Radiology Scans", date: "2026-06-04", totalPatients: 62, type: "lab", status: "completed" },
  { id: "DR009", reportName: "Blood Donation Camp", date: "2026-06-05", totalPatients: 95, type: "health-camp", status: "draft" },
  { id: "DR010", reportName: "OPD Evening Shift", date: "2026-06-05", totalPatients: 140, type: "opd", status: "completed" },
  { id: "DR011", reportName: "ICU Daily Log", date: "2026-06-06", totalPatients: 12, type: "ipd", status: "in-progress" },
  { id: "DR012", reportName: "Community Outreach", date: "2026-06-07", totalPatients: 200, type: "health-camp", status: "completed" },
];

export const dailyReportStatusMap = new Map<string, string>([
  ["completed", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["in-progress", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
  ["draft", "bg-neutral-300/40 border-neutral-300"],
]);

export const reportTypeOptions = [
  { label: "Health Camp", value: "health-camp" },
  { label: "OPD", value: "opd" },
  { label: "Emergency", value: "emergency" },
  { label: "Lab", value: "lab" },
  { label: "Pharmacy", value: "pharmacy" },
  { label: "IPD", value: "ipd" },
];

export const dailyReportStatusOptions = [
  { label: "Completed", value: "completed" },
  { label: "In Progress", value: "in-progress" },
  { label: "Draft", value: "draft" },
];
