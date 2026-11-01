import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Database } from "lucide-react";
import { EntityListPage } from "@admin/components/entity-list";
import {
  createSelectColumn,
  createTextColumn,
} from "@admin/components/entity-list";
import { normalizeApiError } from "@shared/api/errors";
import { DataTableColumnHeader } from "@admin/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { EntityListModuleConfig, EntityFormField } from "@admin/components/entity-list";
import {
  type MasterModule,
  useGetMasterRecordsQuery,
  useCreateMasterRecordMutation,
  useUpdateMasterRecordMutation,
  useDeleteMasterRecordMutation,
} from "../services/masterDataApi";

/** Normalised row type required by EntityListPage (id must be string). */
export interface MasterRow {
  id: string;
  value: string;
  state_id?: number;
  state_name?: string | null;
  country_id?: number;
}

type MasterTablePageProps = {
  module: MasterModule;
  title: string;
  description: string;
};

/** Singular record label lookup. */
const SINGULAR_TITLE: Record<MasterModule, string> = {
  city: "City",
  state: "State",
  qualification: "Qualification",
  department: "Department",
  sewalocation: "Location",
  availableday: "Availability",
  shifttime: "Shift Time",
};

/** Build the column definitions for a master table. */
function buildColumns(
  module: MasterModule,
  recordTitle: string
): ColumnDef<MasterRow>[] {
  const cols: ColumnDef<MasterRow>[] = [
    createSelectColumn<MasterRow>(),
    createTextColumn<MasterRow>("value", `${recordTitle} Name`),
  ];

  if (module === "city") {
    cols.push({
      accessorKey: "state_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State Name" />
      ),
      cell: ({ row }) => (
        <span>{String(row.getValue("state_name") ?? "-")}</span>
      ),
      enableSorting: true,
      filterFn: (row, id, value) =>
        value.includes(String(row.getValue(id) ?? "")),
      meta: { className: "w-28" },
    });
  }

  return cols;
}

/** Build form fields for the add/edit dialog. */
function buildFormFields(
  module: MasterModule,
  recordTitle: string,
  stateOptions: { label: string; value: string }[]
): EntityFormField[] {
  const fields: EntityFormField[] = [
    {
      name: "value",
      label: `${recordTitle} Name`,
      placeholder: `Enter ${recordTitle.toLowerCase()} name`,
      rules: { required: "This field is required", maxLength: { value: 100, message: "Max 100 characters" } },
    },
  ];

  if (module === "state") {
    fields.push({
      name: "countryId",
      label: "Country ID",
      type: "number",
      placeholder: "e.g. 1",
      rules: { required: "Country ID is required", min: { value: 1, message: "Must be ≥ 1" } },
    });
  }

  if (module === "city") {
    fields.push({
      name: "stateId",
      label: "State",
      type: "searchable-select",
      options: stateOptions,
      rules: { required: "State is required" },
    });
  }

  return fields;
}

export function MasterTablePage({
  module,
  title,
  description,
}: MasterTablePageProps) {
  const recordTitle = SINGULAR_TITLE[module];

  const { data, isLoading, isFetching, isError, error } =
    useGetMasterRecordsQuery({ module, search: "" });

  /* Fetch state list only when module is "city" (needed for the state dropdown). */
  const { data: statesData, isLoading: areStatesLoading } =
    useGetMasterRecordsQuery(
      { module: "state", search: "" },
      { skip: module !== "city" }
    );

  const [createMasterRecord] = useCreateMasterRecordMutation();
  const [updateMasterRecord] = useUpdateMasterRecordMutation();
  const [deleteMasterRecord] = useDeleteMasterRecordMutation();

  useEffect(() => {
    if (isError && error) {
      toast.error(normalizeApiError(error).message);
    }
  }, [error, isError]);

  /** Normalise raw records: stringify id so EntityListPage is happy. */
  const rows = useMemo<MasterRow[]>(() => {
    const raw = data?.data?.items ?? [];
    return raw.map((r) => ({
      ...r,
      id: String(r.id),
    }));
  }, [data]);

  /** State options for city "stateId" select field. */
  const stateOptions = useMemo(() => {
    if (areStatesLoading) return [{ label: "Loading states…", value: "" }];
    const items = statesData?.data?.items ?? [];
    return items.map((s) => ({ label: s.value, value: String(s.id) }));
  }, [statesData, areStatesLoading]);

  const stateNameOptions = useMemo(() => {
    const items = statesData?.data?.items ?? [];
    return items.map((state) => ({
      label: state.value,
      value: state.value,
    }));
  }, [statesData]);

  const formFields = useMemo(
    () => buildFormFields(module, recordTitle, stateOptions),
    [module, recordTitle, stateOptions]
  );

  const columns = useMemo(
    () => buildColumns(module, recordTitle),
    [module, recordTitle]
  );

  const handleCreate = useCallback(
    async (values: Record<string, string>) => {
      try {
        await createMasterRecord({
          module,
          value: values.value.trim(),
          ...(module === "state" && values.countryId
            ? { countryId: Number(values.countryId) }
            : {}),
          ...(module === "city" && values.stateId
            ? { stateId: Number(values.stateId) }
            : {}),
        }).unwrap();
        toast.success(`${recordTitle} added successfully.`);
      } catch (err) {
        toast.error(normalizeApiError(err).message);
      }
    },
    [createMasterRecord, module, recordTitle]
  );

  const handleUpdate = useCallback(
    async (row: MasterRow, values: Record<string, string>) => {
      try {
        await updateMasterRecord({
          module,
          id: row.id,
          value: values.value.trim(),
          ...(module === "state" && values.countryId
            ? { countryId: Number(values.countryId) }
            : {}),
          ...(module === "city" && values.stateId
            ? { stateId: Number(values.stateId) }
            : {}),
        }).unwrap();
        toast.success(`${recordTitle} updated successfully.`);
      } catch (err) {
        toast.error(normalizeApiError(err).message);
      }
    },
    [updateMasterRecord, module, recordTitle]
  );

  const handleDelete = useCallback(
    async (row: MasterRow) => {
      try {
        await deleteMasterRecord({ module, id: row.id }).unwrap();
        toast.success(`${recordTitle} deleted successfully.`);
      } catch (err) {
        toast.error(normalizeApiError(err).message);
      }
    },
    [deleteMasterRecord, module, recordTitle]
  );

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const config: EntityListModuleConfig<MasterRow> = {
    title,
    description,
    searchPlaceholder: `Filter ${title.toLowerCase()} by name…`,
    searchKey: "value",
    primaryAction: { label: `Add ${recordTitle}`, icon: Database },
    rowActions: "default",
    deleteConfirmKey: "value",
    deleteConfirmMessage: (row) =>
      `This will permanently delete "${row.value}" from the ${title.toLowerCase()} master table.`,
    statusBadgeMap: new Map(),
    filters:
      module === "city" && stateOptions.length > 0 && stateOptions[0].value !== ""
        ? [
            {
              columnId: "state_name",
              title: "State",
              options: stateNameOptions,
            },
          ]
        : [],
    formFields,
    columns,
    data: rows,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };

  return <EntityListPage config={config} />;
}
