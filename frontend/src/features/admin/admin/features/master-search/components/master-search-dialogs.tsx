import type { UseFormReturn } from "react-hook-form";
import { MasterSearchFiltersDialog } from "./master-search-filters-dialog";
import { MasterSearchRoleDialog } from "./master-search-role-dialog";
import { useMasterSearchDialogs } from "./use-master-search-dialogs";
import type {
  MasterSearchFilterValues,
  MasterSearchRoleFormValues,
  SelectOption,
} from "../types";

type MasterSearchDialogsProps = {
  filterForm: UseFormReturn<MasterSearchFilterValues>;
  onFilterSubmit: (values: MasterSearchFilterValues) => void;
  isFetching: boolean;
  departmentOptions: SelectOption[];
  qualificationOptions: SelectOption[];
  sewaLocationOptions: SelectOption[];
  stateOptions: SelectOption[];
  cityOptions: SelectOption[];
  roleForm: UseFormReturn<MasterSearchRoleFormValues>;
  onRoleSubmit: (values: MasterSearchRoleFormValues) => Promise<boolean>;
  isUpdatingRole: boolean;
  selectedCount: number;
  isDeleteSelected: boolean;
};

export function MasterSearchDialogs({
  filterForm,
  onFilterSubmit,
  isFetching,
  departmentOptions,
  qualificationOptions,
  sewaLocationOptions,
  stateOptions,
  cityOptions,
  roleForm,
  onRoleSubmit,
  isUpdatingRole,
  selectedCount,
  isDeleteSelected,
}: MasterSearchDialogsProps) {
  const { open, setOpen } = useMasterSearchDialogs();

  return (
    <>
      <MasterSearchFiltersDialog
        open={open === "filters"}
        onOpenChange={(state) => setOpen(state ? "filters" : null)}
        form={filterForm}
        onSubmit={onFilterSubmit}
        isFetching={isFetching}
        departmentOptions={departmentOptions}
        qualificationOptions={qualificationOptions}
        sewaLocationOptions={sewaLocationOptions}
        stateOptions={stateOptions}
        cityOptions={cityOptions}
      />
      <MasterSearchRoleDialog
        open={open === "role"}
        onOpenChange={(state) => setOpen(state ? "role" : null)}
        form={roleForm}
        onSubmit={onRoleSubmit}
        isUpdatingRole={isUpdatingRole}
        selectedCount={selectedCount}
        sewaLocationOptions={sewaLocationOptions}
        isDeleteSelected={isDeleteSelected}
      />
    </>
  );
}
