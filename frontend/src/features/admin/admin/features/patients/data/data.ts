import { UserCheck, UserX, Clock, CheckCircle2 } from "lucide-react";
import { type PatientStatus, type PatientGender } from "./schema";

export const patientStatusBadgeStyles = new Map<PatientStatus, string>([
  [
    "active",
    "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  ],
  [
    "outpatient",
    "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300",
  ],
  [
    "discharged",
    "bg-neutral-300/40 text-neutral-800 dark:text-neutral-200 border-neutral-300",
  ],
  [
    "follow-up",
    "bg-amber-200/40 text-amber-900 dark:text-amber-100 border-amber-300",
  ],
]);

export const patientStatusOptions = [
  {
    label: "Active",
    value: "active",
    icon: UserCheck,
  },
  {
    label: "Outpatient",
    value: "outpatient",
    icon: Clock,
  },
  {
    label: "Discharged",
    value: "discharged",
    icon: CheckCircle2,
  },
  {
    label: "Follow-up",
    value: "follow-up",
    icon: UserX,
  },
] as const;

export const patientGenderOptions: { label: string; value: PatientGender }[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
