import type { MasterSearchSortState } from "./types";

/** Server-side export requests all matching rows; not used for client pagination. */
export const MASTER_SEARCH_EXPORT_LIMIT = 1_000_000;

export const MASTER_SEARCH_DEFAULT_PAGE_LIMIT = 10;

export const MASTER_SEARCH_DEFAULT_SORT: MasterSearchSortState = {
  column: "fullName",
  direction: "ASC",
};

/** Radix Select forbids empty string values — map this sentinel to null/empty. */
export const SELECT_NONE_VALUE = "__none__";

export const YES_NO_OPTIONS = [
  { label: "Yes", value: "1" },
  { label: "No", value: "0" },
];

export const ON_DUTY_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const DEFAULT_FILTER_VALUES = {
  searchTerm: "",
  departmentId: SELECT_NONE_VALUE,
  qualificationId: SELECT_NONE_VALUE,
  sewaLocation: SELECT_NONE_VALUE,
  stateId: SELECT_NONE_VALUE,
  cityId: SELECT_NONE_VALUE,
  passEntry: SELECT_NONE_VALUE,
  isPresent: SELECT_NONE_VALUE,
};

export const DEFAULT_ROLE_FORM_VALUES = {
  isPresent: SELECT_NONE_VALUE,
  passEntry: SELECT_NONE_VALUE,
  isAdmin: SELECT_NONE_VALUE,
  isDeleted: SELECT_NONE_VALUE,
  onDuty: SELECT_NONE_VALUE,
  sewaLocation: SELECT_NONE_VALUE,
  samagamHeldIn: "",
  remark: "",
};
