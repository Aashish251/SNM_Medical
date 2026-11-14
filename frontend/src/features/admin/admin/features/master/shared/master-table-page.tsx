import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Database, Eye, Pencil, Trash2 } from "lucide-react";
import { EntityListPage } from "@admin/components/entity-list";
import {
  useEntityList,
} from "@admin/components/entity-list";
import { Button } from "@admin/components/ui/button";
import { normalizeApiError } from "@shared/api/errors";
import { DataTableColumnHeader } from "@admin/components/data-table";
import type { ColumnDef, Row } from "@tanstack/react-table";
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

/** Inline View + Edit + Delete buttons — used by all master table modules. */
function InlineRowActions({ row }: { row: Row<MasterRow> }) {
  const { setOpen, setCurrentRow } = useEntityList<MasterRow>();
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        title="View"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("view");
        }}
      >
        <Eye className="h-3.5 w-3.5" />
        <span className="sr-only">View</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        title="Edit"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("edit");
        }}
      >
        <Pencil className="h-3.5 w-3.5" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
        title="Delete"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("delete");
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}

/** Build the column definitions for a master table.
 *  All modules share the same layout:
 *  Sr. No. | [Name column(s) — no truncation] | Actions (View / Edit / Delete)
 */
function buildColumns(
  module: MasterModule,
  recordTitle: string
): ColumnDef<MasterRow>[] {
  const serialCol: ColumnDef<MasterRow> = {
    id: "serial",
    header: () => <span className="font-medium">Sr. No.</span>,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return (
        <span className="tabular-nums">
          {pageIndex * pageSize + row.index + 1}
        </span>
      );
    },
    enableSorting: false,
    enableHiding: false,
    meta: { className: "w-16 shrink-0" },
  };

  const nameCol: ColumnDef<MasterRow> = {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={`${recordTitle} Name`} />
    ),
    cell: ({ row }) => (
      <span className="whitespace-normal break-words">
        {String(row.getValue("value"))}
      </span>
    ),
    enableSorting: true,
  };

  const actionsCol: ColumnDef<MasterRow> = {
    id: "actions",
    header: () => <span className="font-medium">Actions</span>,
    cell: ({ row }) => <InlineRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
    meta: { className: "w-36 shrink-0" },
  };

  const cols: ColumnDef<MasterRow>[] = [serialCol, nameCol];

  if (module === "city") {
    cols.push({
      accessorKey: "state_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State Name" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-normal break-words">
          {String(row.getValue("state_name") ?? "-")}
        </span>
      ),
      enableSorting: true,
      filterFn: (row, id, value) =>
        value.includes(String(row.getValue(id) ?? "")),
    });
  }

  cols.push(actionsCol);
  return cols;
}

/** Build form fields for the add/edit dialog. */
function buildFormFields(
  module: MasterModule,
  recordTitle: string,
  stateOptions: { label: string; value: string }[]
): EntityFormField[] {
  const isAlphabeticModule = module === "state" || module === "qualification" || module === "department" || module === "availableday";

  const fields: EntityFormField[] = [
    {
      name: "value",
      label: `${recordTitle} Name`,
      placeholder: `Enter ${recordTitle.toLowerCase()} name`,
      rules: isAlphabeticModule
        ? {
          required: "This field is required",
          maxLength: { value: 100, message: "Max 100 characters" },
          pattern: {
            value: /^[A-Za-z\s]+$/,
            message: `${recordTitle} name should contain alphabets and spaces only`,
          },
          validate: (value: string) => {
            if (!value || value.trim().length === 0)
              return "This field is required";
            if (!/^[A-Za-z\s]+$/.test(value))
              return `${recordTitle} name should contain alphabets and spaces only`;
            return true;
          },
        }
        : {
          required: "This field is required",
          maxLength: { value: 100, message: "Max 100 characters" },
        },
    },
  ];

  // Country ID is intentionally hidden — always sent as 1 by the API handler.

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
          ...(module === "state"
            ? { countryId: 1 }
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
          ...(module === "state"
            ? { countryId: 1 }
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
        throw err;
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
    ...(module === "state" || module === "qualification" || module === "department" || module === "availableday"
      ? { searchTransform: (value: string) => value.replace(/[^A-Za-z\s]/g, "") }
      : {}),
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
