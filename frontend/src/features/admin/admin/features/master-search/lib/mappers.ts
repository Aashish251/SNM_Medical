import type { User } from "@shared/types/CommonType";
import type { MasterSearchPayload } from "@shared/services/masterSearchApi";
import {
  MASTER_SEARCH_DEFAULT_PAGE_LIMIT,
  SELECT_NONE_VALUE,
} from "../constants";
import type {
  MasterSearchFilterValues,
  MasterSearchRoleFormValues,
  MasterSearchUser,
  SelectOption,
} from "../types";

export function resolveUserStatus(
  user: User
): MasterSearchUser["status"] {
  if (user.isDeleted == 1 || user.isDeleted == "1") return "deleted";
  if (user.isApproved) return "approved";
  return "pending";
}

export function toMasterSearchUser(user: User): MasterSearchUser {
  return {
    ...user,
    id: String(user.regId),
    status: resolveUserStatus(user),
  };
}

export function createDefaultSearchPayload(
  pageLimit = MASTER_SEARCH_DEFAULT_PAGE_LIMIT
): MasterSearchPayload {
  return {
    searchKey: "",
    departmentId: null,
    qualificationId: null,
    sewaLocationId: null,
    cityId: null,
    stateId: null,
    isPresent: null,
    passEntry: null,
    limit: pageLimit,
    page: 1,
    sortBy: "fullName",
    sortOrder: "ASC",
  };
}

export function normalizeSelectValue(value: string): string | null {
  if (!value || value === SELECT_NONE_VALUE) return null;
  return value;
}

export function filterValuesToPayload(
  data: MasterSearchFilterValues,
  pageLimit: number,
  sortBy: string | null,
  sortOrder: "ASC" | "DESC"
): MasterSearchPayload {
  return {
    searchKey: data.searchTerm.trim() || "",
    departmentId: normalizeSelectValue(data.departmentId),
    qualificationId: normalizeSelectValue(data.qualificationId),
    sewaLocationId: normalizeSelectValue(data.sewaLocation),
    cityId: normalizeSelectValue(data.cityId),
    stateId: normalizeSelectValue(data.stateId),
    isPresent: normalizeSelectValue(data.isPresent),
    passEntry: normalizeSelectValue(data.passEntry),
    limit: pageLimit,
    page: 1,
    sortBy,
    sortOrder,
  };
}

export function normalizeRolePayload(
  data: MasterSearchRoleFormValues
): Record<string, unknown> {
  const normalized: Record<string, unknown> = {
    onDuty: normalizeSelectValue(data.onDuty) ?? "",
    sewaLocation: normalizeSelectValue(data.sewaLocation) ?? "",
    samagamHeldIn: data.samagamHeldIn,
    remark: data.remark,
  };

  (["isPresent", "passEntry", "isAdmin", "isDeleted"] as const).forEach(
    (key) => {
      const raw = normalizeSelectValue(data[key]);
      if (raw === null) {
        normalized[key] = null;
        return;
      }
      const num = Number(raw);
      normalized[key] = Number.isNaN(num) ? raw : num;
    }
  );

  return normalized;
}

type NamedOption = {
  id?: number | string;
  department_name?: string;
  qualification_name?: string;
  sewalocation_name?: string;
  state_name?: string;
  city_name?: string;
  label?: string;
  value?: string | number;
};

export function toSelectOptions(
  items: unknown[] | undefined,
  labelKey: keyof NamedOption,
  valueKey: keyof NamedOption = "id"
): SelectOption[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (item === null || item === undefined) return null;

      if (typeof item === "string" || typeof item === "number") {
        return { label: String(item), value: String(item) };
      }

      if (typeof item !== "object") return null;

      const record = item as NamedOption;
      const label = record[labelKey] ?? record.label;
      const value = record[valueKey] ?? record.value ?? record.id;

      if (label === undefined || value === undefined) return null;

      return { label: String(label), value: String(value) };
    })
    .filter((option): option is SelectOption => option !== null);
}

export function withNoneOption(
  options: SelectOption[],
  noneLabel = "All"
): SelectOption[] {
  return [{ label: noneLabel, value: SELECT_NONE_VALUE }, ...options];
}
