import { Download, Plus } from "lucide-react";
import type { EntityListModuleConfig } from "@admin-panel/components/entity-list";
import { createMasterColumns } from "./columns";
import { masterStatusMap, masterStatusOptions } from "./status";
import type { CreateMasterConfigOptions, MasterRecord } from "./types";

export function createMasterConfig(
  options: CreateMasterConfigOptions
): EntityListModuleConfig<MasterRecord> {
  const singularTitle = options.title.replace(/s$/, "");

  return {
    title: options.title,
    description: options.description,
    searchPlaceholder: options.searchPlaceholder,
    searchKey: "name",
    secondaryAction: { label: "Export", icon: Download },
    primaryAction: { label: `Add ${singularTitle}`, icon: Plus },
    secondaryDialogTitle: `Export ${options.title}`,
    secondaryDialogDescription: `Choose export options for ${options.title.toLowerCase()} records.`,
    rowActions: "default",
    deleteConfirmKey: "id",
    deleteConfirmMessage: (row) =>
      `This will permanently delete ${singularTitle.toLowerCase()} "${row.name}" (${row.id}).`,
    statusBadgeMap: masterStatusMap,
    filters: [
      { columnId: "status", title: "Status", options: masterStatusOptions },
    ],
    formFields: [
      {
        name: "name",
        label: options.nameLabel,
        placeholder: `Enter ${options.nameLabel.toLowerCase()}`,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: masterStatusOptions,
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
      {
        name: "status",
        label: "Status Filter",
        type: "select",
        options: [{ label: "All", value: "all" }, ...masterStatusOptions],
      },
    ],
    columns: createMasterColumns(options.nameLabel),
    data: options.records,
  };
}
