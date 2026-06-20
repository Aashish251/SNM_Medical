import { Download, FilePlus } from "lucide-react";
import type { EntityListModuleConfig } from "@admin-panel/components/entity-list";
import {
  dailyReportRecords,
  dailyReportStatusMap,
  dailyReportStatusOptions,
  reportTypeOptions,
} from "./data/records";
import { dailyReportColumns } from "./data/columns";
import type { DailyReportRecord } from "./data/records";

export const dailyReportConfig: EntityListModuleConfig<DailyReportRecord> = {
  title: "Daily Report",
  description: "View and manage daily operational reports.",
  searchPlaceholder: "Filter reports...",
  searchKey: "reportName",
  secondaryAction: { label: "Export Report", icon: Download },
  primaryAction: { label: "Add Report", icon: FilePlus },
  secondaryDialogTitle: "Export Daily Report",
  secondaryDialogDescription: "Select report export options.",
  rowActions: "default",
  deleteConfirmKey: "id",
  deleteConfirmMessage: (row) =>
    `This will permanently delete report ${row.id} (${row.reportName}).`,
  statusBadgeMap: dailyReportStatusMap,
  filters: [
    { columnId: "status", title: "Status", options: dailyReportStatusOptions },
    { columnId: "type", title: "Type", options: reportTypeOptions },
  ],
  formFields: [
    { name: "reportName", label: "Report Name", placeholder: "Enter report name" },
    { name: "date", label: "Date", type: "date" },
    { name: "totalPatients", label: "Total Patients", type: "number" },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: reportTypeOptions,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: dailyReportStatusOptions,
    },
  ],
  secondaryFormFields: [
    {
      name: "format",
      label: "Export Format",
      type: "select",
      options: [
        { label: "CSV", value: "csv" },
        { label: "PDF", value: "pdf" },
      ],
    },
    { name: "reportDate", label: "Report Date", type: "date" },
  ],
  columns: dailyReportColumns,
  data: dailyReportRecords,
};
