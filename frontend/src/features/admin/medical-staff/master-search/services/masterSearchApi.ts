import { baseApi } from "@shared/api/baseApi";
import { SearchResponse } from "@shared/types/CommonType";

export type MasterSearchPayload = {
  searchKey?: string;
  departmentId?: string | number | null;
  qualificationId?: string | number | null;
  sewaLocationId?: string | number | null;
  cityId?: string | number | null;
  stateId?: string | number | null;
  isPresent?: string | number | boolean | null;
  passEntry?: string | number | boolean | null;
  limit: number;
  page: number;
  sortBy?: string | null;
  sortOrder?: "ASC" | "DESC";
};

type ChangeStatusPayload = {
  regId: number;
};

type ChangeUsersRolePayload = Record<string, unknown> & {
  regId: string;
};

export const MasterSearchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    masterSearch: builder.query<SearchResponse, MasterSearchPayload>({
      query: (payload) => ({
        url: "/api/search/master",
        method: "POST",
        body: payload,
      }),
      providesTags: [{ type: "MasterSearch", id: "LIST" }],
    }),

    getChangeStatus: builder.mutation<unknown, ChangeStatusPayload>({
      query: ({ regId }) => ({
        url: `/api/search/approve/${regId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "MasterSearch", id: "LIST" }],
    }),

    exportSearch: builder.mutation<Blob, MasterSearchPayload>({
      query: (payload) => ({
        url: "/api/search/export",
        method: "POST",
        body: payload,
        responseHandler: async (response) => response.blob(),
        cache: "no-cache",
      }),
    }),

    getChangeUsersRole: builder.mutation<unknown, ChangeUsersRolePayload>({
      query: (body) => ({
        url: "/api/user/update-role",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "MasterSearch", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useMasterSearchQuery,
  useExportSearchMutation,
  useGetChangeStatusMutation,
  useGetChangeUsersRoleMutation,
} = MasterSearchApi;

export default MasterSearchApi;
