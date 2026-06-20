import { Download, FileBarChart } from "lucide-react";
import type { EntityListModuleConfig } from "@admin-panel/components/entity-list";
import {
  masterReportRecords,
  masterReportStatusMap,
  masterReportStatusOptions,
  masterReportTypeOptions,
} from "./data/records";
import { masterReportColumns } from "./data/columns";
import type { MasterReportRecord } from "./data/records";

export const masterReportConfig: EntityListModuleConfig<MasterReportRecord> = {
  title: "Master Report",
  description: "View consolidated master reports.",
  searchPlaceholder: "Filter reports...",
  searchKey: "reportName",
  secondaryAction: { label: "Export Report", icon: Download },
  primaryAction: { label: "Generate Report", icon: FileBarChart },
  secondaryDialogTitle: "Export Master Report",
  secondaryDialogDescription: "Export consolidated master report data.",
  rowActions: "report",
  deleteConfirmKey: "id",
  deleteConfirmMessage: (row) =>
    `This will permanently delete report ${row.id} (${row.reportName}).`,
  statusBadgeMap: masterReportStatusMap,
  filters: [
    { columnId: "status", title: "Status", options: masterReportStatusOptions },
    { columnId: "type", title: "Type", options: masterReportTypeOptions },
  ],
  formFields: [
    { name: "reportName", label: "Report Name", placeholder: "Enter report name" },
    { name: "createdBy", label: "Created By", placeholder: "Author name" },
    { name: "createdDate", label: "Created Date", type: "date" },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: masterReportTypeOptions,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: masterReportStatusOptions,
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
        { label: "Excel", value: "xlsx" },
      ],
    },
    {
      name: "type",
      label: "Report Type",
      type: "select",
      options: masterReportTypeOptions,
    },
  ],
  columns: masterReportColumns,
  data: masterReportRecords,
};
