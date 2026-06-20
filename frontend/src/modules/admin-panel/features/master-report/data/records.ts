export type MasterReportRecord = {
  id: string;
  reportName: string;
  createdBy: string;
  createdDate: string;
  type: string;
  status: string;
};

export const masterReportRecords: MasterReportRecord[] = [
  { id: "MR001", reportName: "Monthly Summary", createdBy: "Admin", createdDate: "2026-06-01", type: "summary", status: "generated" },
  { id: "MR002", reportName: "Patient Statistics Q1", createdBy: "Dr. Rao", createdDate: "2026-06-02", type: "analytics", status: "generated" },
  { id: "MR003", reportName: "Revenue Analysis", createdBy: "Admin", createdDate: "2026-06-02", type: "financial", status: "pending" },
  { id: "MR004", reportName: "Department Performance", createdBy: "Manager", createdDate: "2026-06-03", type: "analytics", status: "generated" },
  { id: "MR005", reportName: "Inventory Audit", createdBy: "Admin", createdDate: "2026-06-03", type: "operational", status: "failed" },
  { id: "MR006", reportName: "Staff Attendance", createdBy: "HR Admin", createdDate: "2026-06-04", type: "operational", status: "generated" },
  { id: "MR007", reportName: "Annual Health Review", createdBy: "Admin", createdDate: "2026-06-04", type: "summary", status: "pending" },
  { id: "MR008", reportName: "Lab Test Volume", createdBy: "Lab Head", createdDate: "2026-06-05", type: "analytics", status: "generated" },
  { id: "MR009", reportName: "Insurance Claims", createdBy: "Admin", createdDate: "2026-06-05", type: "financial", status: "generated" },
  { id: "MR010", reportName: "Equipment Maintenance", createdBy: "Facilities", createdDate: "2026-06-06", type: "operational", status: "failed" },
  { id: "MR011", reportName: "Quarterly Outcomes", createdBy: "Admin", createdDate: "2026-06-06", type: "summary", status: "generated" },
  { id: "MR012", reportName: "Budget Forecast", createdBy: "Finance", createdDate: "2026-06-07", type: "financial", status: "pending" },
];

export const masterReportStatusMap = new Map<string, string>([
  ["generated", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["pending", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
  ["failed", "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10"],
]);

export const masterReportTypeOptions = [
  { label: "Summary", value: "summary" },
  { label: "Analytics", value: "analytics" },
  { label: "Financial", value: "financial" },
  { label: "Operational", value: "operational" },
];

export const masterReportStatusOptions = [
  { label: "Generated", value: "generated" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];
