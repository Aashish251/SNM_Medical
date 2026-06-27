import { CalendarPlus, UserCog } from "lucide-react";
import type { EntityListModuleConfig } from "@admin/components/entity-list";
import {
  dutyChartRecords,
  dutyDepartmentOptions,
  dutyStatusMap,
  dutyStatusOptions,
  shiftOptions,
} from "./data/records";
import { dutyChartColumns } from "./data/columns";
import type { DutyChartRecord } from "./data/records";

export const dutyChartConfig: EntityListModuleConfig<DutyChartRecord> = {
  title: "Duty Chart",
  description: "Manage and monitor staff duty assignments.",
  searchPlaceholder: "Filter duties...",
  searchKey: "doctorName",
  secondaryAction: { label: "Assign Staff", icon: UserCog },
  primaryAction: { label: "Add Duty", icon: CalendarPlus },
  secondaryDialogTitle: "Assign Staff",
  secondaryDialogDescription: "Assign staff members to duty shifts.",
  rowActions: "default",
  deleteConfirmKey: "id",
  deleteConfirmMessage: (row) =>
    `This will permanently delete duty assignment ${row.id} for ${row.doctorName}.`,
  statusBadgeMap: dutyStatusMap,
  filters: [
    { columnId: "status", title: "Status", options: dutyStatusOptions },
    { columnId: "shift", title: "Shift", options: shiftOptions },
  ],
  formFields: [
    { name: "doctorName", label: "Doctor Name", placeholder: "Dr. Full Name" },
    {
      name: "department",
      label: "Department",
      type: "select",
      options: dutyDepartmentOptions,
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
    { name: "doctorName", label: "Doctor Name", placeholder: "Select doctor" },
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
      options: dutyDepartmentOptions,
    },
  ],
  columns: dutyChartColumns,
  data: dutyChartRecords,
};
