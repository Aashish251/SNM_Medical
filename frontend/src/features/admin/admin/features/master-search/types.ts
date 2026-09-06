import type { User } from "@shared/types/CommonType";

/** Table row shape — `id` required by Admin selection/table conventions. */
export type MasterSearchUser = Omit<User, "id"> & {
  id: string;
  status: "approved" | "pending" | "deleted";
};

export type MasterSearchFilterValues = {
  searchTerm: string;
  departmentId: string;
  qualificationId: string;
  sewaLocation: string;
  stateId: string;
  cityId: string;
  passEntry: string;
  isPresent: string;
};

export type MasterSearchRoleFormValues = {
  isPresent: string;
  passEntry: string;
  isAdmin: string;
  isDeleted: string;
  onDuty: string;
  sewaLocation: string;
  samagamHeldIn: string;
  remark: string;
};

export type MasterSearchSortState = {
  column: string | null;
  direction: "ASC" | "DESC";
};

export type MasterSearchDialogType = "filters" | "role";

export type SelectOption = {
  label: string;
  value: string;
};
