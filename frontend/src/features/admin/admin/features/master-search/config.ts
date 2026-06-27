import { Search, UserPlus } from "lucide-react";
import type { EntityListModuleConfig } from "@admin/components/entity-list";
import {
  masterSearchRecords,
  masterSearchStatusMap,
  masterSearchStatusOptions,
  recordTypeOptions,
} from "./data/records";
import { masterSearchColumns } from "./data/columns";
import type { MasterSearchRecord } from "./data/records";

export const masterSearchConfig: EntityListModuleConfig<MasterSearchRecord> = {
  title: "Master Search",
  description: "Search and manage master records.",
  searchPlaceholder: "Filter records...",
  searchKey: "name",
  secondaryAction: { label: "Advanced Search", icon: Search },
  primaryAction: { label: "Add Record", icon: UserPlus },
  secondaryDialogTitle: "Advanced Search",
  secondaryDialogDescription: "Search master records with advanced filters.",
  rowActions: "default",
  deleteConfirmKey: "id",
  deleteConfirmMessage: (row) =>
    `This will permanently delete record ${row.id} (${row.name}).`,
  statusBadgeMap: masterSearchStatusMap,
  filters: [
    { columnId: "status", title: "Status", options: masterSearchStatusOptions },
    { columnId: "recordType", title: "Type", options: recordTypeOptions },
  ],
  formFields: [
    {
      name: "recordType",
      label: "Record Type",
      type: "select",
      options: recordTypeOptions,
    },
    { name: "name", label: "Name", placeholder: "Enter name" },
    { name: "phone", label: "Phone", placeholder: "10-digit phone number" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: masterSearchStatusOptions,
    },
  ],
  secondaryFormFields: [
    { name: "keyword", label: "Keyword", placeholder: "Search keyword" },
    {
      name: "recordType",
      label: "Record Type",
      type: "select",
      options: recordTypeOptions,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: masterSearchStatusOptions,
    },
  ],
  columns: masterSearchColumns,
  data: masterSearchRecords,
};
