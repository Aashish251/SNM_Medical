import type { MasterRecord } from "./types";

export const masterStatusMap = new Map<string, string>([
  ["active", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["inactive", "bg-muted text-muted-foreground border-border"],
]);

export const masterStatusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export function createMasterRecords(
  prefix: string,
  names: string[]
): MasterRecord[] {
  const baseDate = new Date("2026-01-15");

  return names.map((name, index) => {
    const created = new Date(baseDate);
    created.setDate(created.getDate() + index);
    const updated = new Date(created);
    updated.setDate(updated.getDate() + (index % 3));

    return {
      id: `${prefix}${String(index + 1).padStart(3, "0")}`,
      name,
      status: index % 4 === 0 ? "inactive" : "active",
      createdAt: created.toISOString().slice(0, 10),
      updatedAt: updated.toISOString().slice(0, 10),
    };
  });
}
