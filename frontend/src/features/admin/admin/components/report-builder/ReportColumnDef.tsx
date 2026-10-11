export interface ReportColumn {
  key: string;
  label: string;
  type?: "metric" | "custom" | "date" | "location" | "department" | "string" | "number";
  customFieldKey?: string;
  align?: "left" | "center" | "right";
  width?: number;
  minWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
}

export interface CustomField {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: string[];
  description?: string;
  defaultValue?: string | number;
}

export interface ReportBuilderConfig {
  title: string;
  columns: ReportColumn[];
  rows: ReportColumn[];
  customFields: CustomField[];
}