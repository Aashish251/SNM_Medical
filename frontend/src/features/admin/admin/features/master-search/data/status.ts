export const masterSearchStatusMap = new Map<string, string>([
  [
    "approved",
    "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  ],
  ["pending", "bg-amber-100/40 text-amber-900 dark:text-amber-100 border-amber-300"],
  ["deleted", "bg-red-100/40 text-red-900 dark:text-red-100 border-red-300"],
]);

export const masterSearchStatusOptions = [
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Deleted", value: "deleted" },
];
