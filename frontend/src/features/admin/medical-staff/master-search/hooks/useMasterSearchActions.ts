import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  useExportSearchMutation,
  useGetChangeStatusMutation,
  useGetChangeUsersRoleMutation,
  useMasterSearchQuery,
} from "../services/masterSearchApi";
import { toast } from "@shared/lib/toast";
import { normalizeApiError } from "@shared/api/errors";
import { MASTER_SEARCH_EXPORT_LIMIT } from "../constants";
import type { MasterSearchPayload } from "../services/masterSearchApi";

export type RoleFormValues = Record<string, unknown> & {
  isPresent: unknown;
  passEntry: unknown;
  isAdmin: unknown;
  isDeleted: unknown;
  onDuty: string;
  sewaLocation: string;
  samagamHeldIn: string;
  remark: string;
};

type UseMasterSearchActionsParams = {
  searchPayload: MasterSearchPayload;
  searchTriggered: boolean;
  selectedIds: (string | number)[];
  onClearSelection: () => void;
};

export function useMasterSearchActions({
  searchPayload,
  searchTriggered,
  selectedIds,
  onClearSelection,
}: UseMasterSearchActionsParams) {
  const { data: masterSearchData, refetch: triggerMasterSearch, isFetching } =
    useMasterSearchQuery(searchPayload, { skip: !searchTriggered });

  const [triggerGetChangeStatus] = useGetChangeStatusMutation();
  const [triggerChangeUsersRole, { isLoading: isUpdatingRole }] =
    useGetChangeUsersRoleMutation();
  const [triggerExportSearch, { isLoading: isExporting }] =
    useExportSearchMutation();

  const safeUsers = Array.isArray(masterSearchData?.data)
    ? masterSearchData.data
    : [];

  const changeUserStatue = useCallback(
    async (regId: string | number) => {
      try {
        await toast.promise(
          triggerGetChangeStatus({ regId: Number(regId) }).unwrap(),
          {
            loading: "Updating status...",
            success: "User approved successfully",
            error: "Failed to update status",
          }
        );
        await triggerMasterSearch();
      } catch (error) {
        toast.error(normalizeApiError(error).message);
      }
    },
    [triggerGetChangeStatus, triggerMasterSearch]
  );

  const onExport = useCallback(async () => {
    try {
      const blob = await toast.promise(
        triggerExportSearch({
          ...searchPayload,
          limit: MASTER_SEARCH_EXPORT_LIMIT,
          page: 1,
        }).unwrap(),
        {
          loading: "Preparing export...",
          success: "Export completed successfully!",
          error: "Failed to export data. Please try again.",
        }
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `master_search_export_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  }, [searchPayload, triggerExportSearch]);

  const {
    control: roleControl,
    handleSubmit: handleRoleSubmit,
    reset: resetRoleForm,
    watch: roleWatch,
    register: registerRole,
    formState: { errors: roleErrors },
  } = useForm<RoleFormValues>({
    mode: "onBlur",
    defaultValues: {
      isPresent: null,
      passEntry: null,
      isAdmin: null,
      isDeleted: null,
      onDuty: "",
      sewaLocation: "",
      samagamHeldIn: "",
      remark: "",
    },
  });

  const onRoleSubmit = useCallback(
    async (data: RoleFormValues) => {
      try {
        if (!selectedIds.length) {
          toast.error("Please select at least one user to update roles.");
          return;
        }

        const normalized: Record<string, unknown> = { ...data };
        ["isPresent", "passEntry", "isAdmin", "isDeleted"].forEach((key) => {
          const val = normalized[key];

          if (val === "" || val === undefined || val === null) {
            normalized[key] = null;
            return;
          }

          if (typeof val === "number" && !Number.isNaN(val)) {
            return;
          }

          const num = Number(val);
          normalized[key] = Number.isNaN(num) ? val : num;
        });

        await toast.promise(
          triggerChangeUsersRole({
            ...normalized,
            regId: selectedIds.join(","),
          }).unwrap(),
          {
            loading: "Updating users' roles...",
            success: "User roles updated successfully!",
            error: "Failed to update user roles. Please try again.",
          }
        );

        await triggerMasterSearch();
        onClearSelection();
        resetRoleForm();
      } catch (error) {
        toast.error(normalizeApiError(error).message);
      }
    },
    [
      onClearSelection,
      resetRoleForm,
      selectedIds,
      triggerChangeUsersRole,
      triggerMasterSearch,
    ]
  );

  return {
    safeUsers,
    masterSearchData,
    isFetching,
    isUpdatingRole,
    isExporting,
    changeUserStatue,
    onExport,
    roleControl,
    handleRoleSubmit,
    resetRoleForm,
    roleWatch,
    registerRole,
    roleErrors,
    onRoleSubmit,
  };
}
