/**
 * Re-export shared Master Search API so Medical Staff imports stay stable.
 * Canonical definition: `@shared/services/masterSearchApi`.
 */
export {
  MasterSearchApi,
  useMasterSearchQuery,
  useExportSearchMutation,
  useGetChangeStatusMutation,
  useGetChangeUsersRoleMutation,
  type MasterSearchPayload,
} from "@shared/services/masterSearchApi";

export { default } from "@shared/services/masterSearchApi";
