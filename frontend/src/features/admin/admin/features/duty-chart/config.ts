import { CalendarPlus, UserCog } from "lucide-react";
import type { EntityListModuleConfig } from "@admin/components/entity-list";
import {
  dutyStatusMap,
  dutyStatusOptions,
  shiftOptions,
} from "./data/records";
import { dutyChartColumns } from "./data/columns";
import type { DutyChartEntry } from "./services/dutyChartApi";

export interface DutyChartHandlers {
  onCreate: (values: Record<string, string>) => void | Promise<void>;
  onUpdate: (row: DutyChartEntry, values: Record<string, string>) => void | Promise<void>;
  onDelete: (row: DutyChartEntry) => void | Promise<void>;
}

export function createDutyChartConfig(
  data: DutyChartEntry[],
  handlers: DutyChartHandlers,
  departmentOptions: Array<{ label: string; value: string }> = []
): EntityListModuleConfig<DutyChartEntry> {
  return {
    title: "Duty Chart",
    description: "Manage and monitor staff duty assignments.",
    searchPlaceholder: "Filter duties by name...",
    searchKey: "name",
    secondaryAction: { label: "Assign Staff", icon: UserCog },
    primaryAction: { label: "Add Duty", icon: CalendarPlus },
    secondaryDialogTitle: "Assign Staff",
    secondaryDialogDescription: "Assign staff members to duty shifts.",
    rowActions: "default",
    deleteConfirmKey: "id",
    deleteConfirmMessage: (row) =>
      `This will permanently delete duty assignment for ${row.name}.`,
    statusBadgeMap: dutyStatusMap,
    filters: [
      { columnId: "status", title: "Status", options: dutyStatusOptions },
      { columnId: "shift", title: "Shift", options: shiftOptions },
      { columnId: "department", title: "Department", options: departmentOptions },
    ],
    formFields: [
      {
        name: "title",
        label: "Samagam Title",
        placeholder: "e.g., 58TH MAHARASHTRA NIRANKARI SANT SAMAGAM",
      },
      {
        name: "department",
        label: "Department",
        type: "select",
        options: departmentOptions,
      },
      {
        name: "date",
        label: "Date",
        type: "date",
      },
      {
        name: "name",
        label: "Staff Name",
        placeholder: "Full Name",
      },
      {
        name: "contact",
        label: "Contact Number",
        placeholder: "10-digit mobile number",
      },
      {
        name: "shift",
        label: "Shift",
        type: "select",
        options: shiftOptions,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: dutyStatusOptions,
      },
    ],
    secondaryFormFields: [
      {
        name: "name",
        label: "Staff Name",
        placeholder: "Select staff",
      },
      {
        name: "shift",
        label: "Shift",
        type: "select",
        options: shiftOptions,
      },
      {
        name: "department",
        label: "Department",
        type: "select",
        options: departmentOptions,
      },
      {
        name: "title",
        label: "Samagam Title",
        placeholder: "e.g., 58TH MAHARASHTRA NIRANKARI SANT SAMAGAM",
      },
      {
        name: "date",
        label: "Date",
        type: "date",
      },
      {
        name: "contact",
        label: "Contact Number",
        placeholder: "10-digit mobile number",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: dutyStatusOptions,
      },
    ],
    columns: dutyChartColumns,
    data,
    onCreate: handlers.onCreate,
    onUpdate: handlers.onUpdate,
    onDelete: handlers.onDelete,
  };
}