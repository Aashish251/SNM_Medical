export const campStatusMap = new Map<string, string>([
  [
    "published",
    "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  ],
  ["draft", "bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200"],
]);

export const campStatusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
];

export const campEntryTypeOptions = [
  { label: "Walk-in", value: "walk-in" },
  { label: "Appointment", value: "appointment" },
];
