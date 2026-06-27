import { Download, UserPlus } from "lucide-react";
import type { EntityListModuleConfig } from "@admin/components/entity-list";
import {
  departmentOptions,
  registrationRecords,
  registrationStatusMap,
  registrationStatusOptions,
} from "./data/records";
import { registrationColumns } from "./data/columns";
import type { RegistrationRecord } from "./data/records";

export const registrationReportConfig: EntityListModuleConfig<RegistrationRecord> =
  {
    title: "Registration Report",
    description: "Manage and review all registration records.",
    searchPlaceholder: "Filter registrations...",
    searchKey: "patientName",
    secondaryAction: { label: "Export Data", icon: Download },
    primaryAction: { label: "Add Registration", icon: UserPlus },
    secondaryDialogTitle: "Export Registration Data",
    secondaryDialogDescription:
      "Choose export options for registration records.",
    rowActions: "default",
    deleteConfirmKey: "id",
    deleteConfirmMessage: (row) =>
      `This will permanently delete registration ${row.id} for ${row.patientName}.`,
    statusBadgeMap: registrationStatusMap,
    filters: [
      { columnId: "status", title: "Status", options: registrationStatusOptions },
      { columnId: "department", title: "Department", options: departmentOptions },
    ],
    formFields: [
      { name: "patientName", label: "Patient Name", placeholder: "Enter patient name" },
      { name: "registrationDate", label: "Registration Date", type: "date" },
      {
        name: "department",
        label: "Department",
        type: "select",
        options: departmentOptions,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: registrationStatusOptions,
      },
    ],
    secondaryFormFields: [
      {
        name: "format",
        label: "Export Format",
        type: "select",
        options: [
          { label: "CSV", value: "csv" },
          { label: "Excel", value: "xlsx" },
          { label: "PDF", value: "pdf" },
        ],
      },
      { name: "dateRange", label: "Date Range", placeholder: "e.g. 2026-06-01 to 2026-06-30" },
    ],
    columns: registrationColumns,
    data: registrationRecords,
  };
