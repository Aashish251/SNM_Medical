import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { EntityListPage } from "@admin/components/entity-list";
import { normalizeApiError } from "@shared/api/errors";
import {
  useGetDutyEntriesQuery,
  useCreateDutyEntryMutation,
  useUpdateDutyEntryMutation,
  useDeleteDutyEntryMutation,
} from "./services/dutyChartApi";
import { createDutyChartConfig } from "./config";
import { useDutyDepartmentOptions, useDutyStaffOptions } from "./data/records";
import type { DutyChartEntry } from "./services/dutyChartApi";

export function DutyChart() {
  const { data: response, isLoading, isFetching, isError, error } = useGetDutyEntriesQuery();
  const departmentOptions = useDutyDepartmentOptions();
  const staffOptions = useDutyStaffOptions();
  const [createEntry] = useCreateDutyEntryMutation();
  const [updateEntry] = useUpdateDutyEntryMutation();
  const [deleteEntry] = useDeleteDutyEntryMutation();

  const entries = useMemo(() => {
    const rawItems = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.items)
        ? response.data.items
        : [];
    return rawItems as DutyChartEntry[];
  }, [response]);

  useEffect(() => {
    if (isError && error) {
      toast.error(normalizeApiError(error).message);
    }
  }, [error, isError]);

  /** Look up the contact number for the selected staff name */
  const resolveContact = useCallback(
    (staffName: string, formContact?: string) => {
      if (formContact) return formContact;
      const match = staffOptions.find((s) => s.value === staffName);
      return match?.contact || "";
    },
    [staffOptions]
  );

  const handleCreate = async (values: Record<string, string>) => {
    try {
      await createEntry({
        title: values.title,
        department: values.department,
        date: values.date,
        name: values.name,
        contact: resolveContact(values.name, values.contact),
        shift: values.shift,
        status: values.status || "assigned",
      }).unwrap();
      toast.success("Duty entry created successfully");
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  const handleUpdate = async (row: DutyChartEntry, values: Record<string, string>) => {
    try {
      await updateEntry({
        chartId: row.chartId,
        entryId: row.entryId,
        body: {
          name: values.name,
          contact: resolveContact(values.name, values.contact),
          shift: values.shift,
          status: values.status,
        },
      }).unwrap();
      toast.success("Duty entry updated successfully");
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  const handleDelete = async (row: DutyChartEntry) => {
    try {
      await deleteEntry({
        chartId: row.chartId,
        entryId: row.entryId,
      }).unwrap();
      toast.success("Duty entry deleted successfully");
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const config = createDutyChartConfig(
    entries,
    {
      onCreate: handleCreate,
      onUpdate: handleUpdate,
      onDelete: handleDelete,
    },
    departmentOptions,
    staffOptions
  );

  return <EntityListPage config={config} />;
}

export default DutyChart;