import { Download, Plus } from "lucide-react";
import type { CampAdminRecord } from "@entities/camp";
import type { CampType } from "@entities/camp";
import type { EntityListModuleConfig } from "@admin-panel/components/entity-list";
import { campColumns } from "./columns";
import { campFormFields } from "./form-fields";
import { campEntryTypeOptions, campStatusMap, campStatusOptions } from "./status";

type CreateCampConfigOptions = {
  campType: CampType;
  records: CampAdminRecord[];
  onCreate: (values: Record<string, string>) => void;
  onUpdate: (row: CampAdminRecord, values: Record<string, string>) => void;
  onDelete: (row: CampAdminRecord) => void;
  onPublishToggle: (row: CampAdminRecord) => void;
};

const campMeta: Record<
  CampType,
  { title: string; description: string; singular: string; searchPlaceholder: string }
> = {
  "health-checkup": {
    title: "Free Health Checkup",
    description: "Manage free health check-up camps shown on the public website.",
    singular: "Health Checkup Camp",
    searchPlaceholder: "Filter health checkup camps...",
  },
  "blood-donation": {
    title: "Blood Donation",
    description: "Manage blood donation camps shown on the public website.",
    singular: "Blood Donation Camp",
    searchPlaceholder: "Filter blood donation camps...",
  },
};

export function createCampConfig(
  options: CreateCampConfigOptions
): EntityListModuleConfig<CampAdminRecord> {
  const meta = campMeta[options.campType];

  return {
    title: meta.title,
    description: meta.description,
    searchPlaceholder: meta.searchPlaceholder,
    searchKey: "title",
    secondaryAction: { label: "Export", icon: Download },
    primaryAction: { label: `Add ${meta.singular}`, icon: Plus },
    secondaryDialogTitle: `Export ${meta.title}`,
    secondaryDialogDescription: `Choose export options for ${meta.title.toLowerCase()} records.`,
    rowActions: "default",
    deleteConfirmKey: "id",
    deleteConfirmMessage: (row) =>
      `This will permanently delete camp "${row.title}" (${row.id}).`,
    statusBadgeMap: campStatusMap,
    filters: [
      { columnId: "status", title: "Status", options: campStatusOptions },
      { columnId: "entryType", title: "Entry Type", options: campEntryTypeOptions },
    ],
    formFields: campFormFields,
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
        options: [{ label: "All", value: "all" }, ...campStatusOptions],
      },
    ],
    columns: campColumns,
    data: options.records,
    onCreate: options.onCreate,
    onUpdate: options.onUpdate,
    onDelete: options.onDelete,
    onPublishToggle: options.onPublishToggle,
  };
}
