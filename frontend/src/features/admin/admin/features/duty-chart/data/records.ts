import { useGetDutyDepartmentsQuery } from "../services/dutyChartApi";
import type { DutyDepartmentOption } from "../services/dutyChartApi";

export type { DutyDepartmentOption };

export const dutyStatusMap = new Map<string, string>([
  ["assigned", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["pending", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
  ["cancelled", "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10"],
]);

export const shiftOptions = [
  { label: "Morning (8.00 AM to 4.00 PM)", value: "Morning (8.00 AM to 4.00 PM)" },
  { label: "Evening (4.00 PM to 10.00 PM)", value: "Evening (4.00 PM to 10.00 PM)" },
  { label: "Night (10.00 PM to 6.00 AM)", value: "Night (10.00 PM to 6.00 AM)" },
  { label: "General Shift", value: "General Shift" },
  { label: "Emergency Shift", value: "Emergency Shift" },
  { label: "On-Call", value: "On-Call" },
];

export const dutyStatusOptions = [
  { label: "Assigned", value: "assigned" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

/**
 * Hook to retrieve department options directly from sp_department_master.
 */
export function useDutyDepartmentOptions(): DutyDepartmentOption[] {
  const { data = [] } = useGetDutyDepartmentsQuery();
  return data;
}