import type { LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { RegisterOptions } from "react-hook-form";

export type EntityFormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "select" | "date" | "textarea";
  placeholder?: string;
  options?: { label: string; value: string }[];
  rules?: RegisterOptions;
};

export type EntityListHandlers<T extends { id: string }> = {
  onCreate?: (values: Record<string, string>) => void;
  onUpdate?: (row: T, values: Record<string, string>) => void;
  onDelete?: (row: T) => void;
  onPublishToggle?: (row: T) => void;
};

export type EntityFilterConfig = {
  columnId: string;
  title: string;
  options: { label: string; value: string }[];
};

export type EntityListModuleConfig<T extends { id: string }> = {
  title: string;
  description: string;
  searchPlaceholder: string;
  searchKey: string;
  secondaryAction: { label: string; icon: LucideIcon };
  primaryAction: { label: string; icon: LucideIcon };
  secondaryDialogTitle: string;
  secondaryDialogDescription: string;
  rowActions: "default" | "report";
  deleteConfirmKey: keyof T & string;
  deleteConfirmMessage: (row: T) => string;
  statusBadgeMap: Map<string, string>;
  filters: EntityFilterConfig[];
  formFields: EntityFormField[];
  secondaryFormFields: EntityFormField[];
  columns: ColumnDef<T>[];
  data: T[];
} & EntityListHandlers<T>;
