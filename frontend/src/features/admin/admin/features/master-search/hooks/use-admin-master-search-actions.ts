import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { normalizeApiError } from "@shared/api/errors";
import {
  useExportSearchMutation,
  useGetChangeStatusMutation,
  useGetChangeUsersRoleMutation,
  useMasterSearchQuery,
  type MasterSearchPayload,
} from "@shared/services/masterSearchApi";
import {
  DEFAULT_ROLE_FORM_VALUES,
  MASTER_SEARCH_EXPORT_LIMIT,
} from "../constants";
import { normalizeRolePayload, toMasterSearchUser } from "../lib/mappers";
import type { MasterSearchRoleFormValues, MasterSearchUser } from "../types";

type UseAdminMasterSearchActionsParams = {
  searchPayload: MasterSearchPayload;
  selectedIds: string[];
  onClearSelection: () => void;
};

export function useAdminMasterSearchActions({
  searchPayload,
  selectedIds,
  onClearSelection,
}: UseAdminMasterSearchActionsParams) {
  const {
    data: masterSearchData,
    refetch,
    isFetching,
    isLoading,
    isError,
    error,
  } = useMasterSearchQuery(searchPayload);

  const [triggerGetChangeStatus, { isLoading: isApproving }] =
    useGetChangeStatusMutation();
  const [triggerChangeUsersRole, { isLoading: isUpdatingRole }] =
    useGetChangeUsersRoleMutation();
  const [triggerExportSearch, { isLoading: isExporting }] =
    useExportSearchMutation();

  const users: MasterSearchUser[] = useMemo(() => {
    if (!Array.isArray(masterSearchData?.data)) return [];
    return masterSearchData.data.map(toMasterSearchUser);
  }, [masterSearchData?.data]);

  const totalRecords = masterSearchData?.total ?? users.length;

  const roleForm = useForm<MasterSearchRoleFormValues>({
    mode: "onBlur",
    defaultValues: DEFAULT_ROLE_FORM_VALUES,
  });

  const approveUser = useCallback(
    async (regId: string | number) => {
      try {
        const approvePromise = triggerGetChangeStatus({
          regId: Number(regId),
        }).unwrap();

        toast.promise(approvePromise, {
          loading: "Updating status...",
          success: "User approved successfully",
          error: "Failed to update status",
        });

        await approvePromise;
        await refetch();
      } catch (err) {
        toast.error(normalizeApiError(err).message);
      }
    },
    [refetch, triggerGetChangeStatus]
  );

  const onExport = useCallback(async () => {
    try {
      const exportPromise = triggerExportSearch({
        ...searchPayload,
        limit: MASTER_SEARCH_EXPORT_LIMIT,
        page: 1,
      }).unwrap();

      toast.promise(exportPromise, {
        loading: "Preparing export...",
        success: "Export completed successfully!",
        error: "Failed to export data. Please try again.",
      });

      const blob = await exportPromise;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `master_search_export_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  }, [searchPayload, triggerExportSearch]);

  const onRoleSubmit = useCallback(
    async (data: MasterSearchRoleFormValues) => {
      try {
        if (!selectedIds.length) {
          toast.error("Please select at least one user to update.");
          return false;
        }

        const normalized = normalizeRolePayload(data);
        const updatePromise = triggerChangeUsersRole({
          ...normalized,
          regId: selectedIds.join(","),
        }).unwrap();

        toast.promise(updatePromise, {
          loading: "Updating users' status...",
          success: "User status updated successfully!",
          error: "Failed to update user status. Please try again.",
        });

        await updatePromise;
        await refetch();
        onClearSelection();
        roleForm.reset(DEFAULT_ROLE_FORM_VALUES);
        return true;
      } catch (err) {
        toast.error(normalizeApiError(err).message);
        return false;
      }
    },
    [onClearSelection, refetch, roleForm, selectedIds, triggerChangeUsersRole]
  );

  const isDeletedValue = roleForm.watch("isDeleted");

  return {
    users,
    totalRecords,
    isFetching,
    isLoading,
    isError,
    error,
    isApproving,
    isUpdatingRole,
    isExporting,
    approveUser,
    onExport,
    roleForm,
    onRoleSubmit,
    isDeleteSelected: String(isDeletedValue) === "1",
  };
}
