import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQueryWithAuth } from "@lib/customBaseQuery";
import { SearchResponse } from "@shared/types/CommonType";

export const MasterSearchApi = createApi({
  reducerPath: "MasterSearchApi",
  baseQuery: customBaseQueryWithAuth,
  tagTypes: ["MasterSearch"],
  endpoints: (builder) => ({
    // 🔍 POST /search/master
    masterSearch: builder.query<SearchResponse, any>({
      query: (payload) => ({
        url: "/api/search/master",
        method: "POST",
        body: payload,
      }),
      providesTags: (result) =>
        result
          ? [
            { type: "MasterSearch" as const, id: "LIST" },
            ...(Array.isArray(result)
              ? result.map(({ id }) => ({
                type: "MasterSearch" as const,
                id: id.toString(),
              }))
              : []),
          ]
          : [{ type: "MasterSearch" as const, id: "LIST" }],
    }),

    //  POST /approve/:regId
    getChangeStatus: builder.mutation({
      query: ({ regId }) => ({
        url: `/api/search/approve/${regId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "MasterSearch", id: "LIST" }],
    }),

    // 📤 Export search results
    exportSearch: builder.mutation<Blob, any>({
      query: (payload) => ({
        url: "/api/search/export",
        method: "POST",
        body: payload,
        responseHandler: async (response) => {
          return await response.blob();
        },
        cache: "no-cache",
      }),
    }),

    // 🧩 Update user role endpoint
    getChangeUsersRole: builder.mutation({
      query: (body) => ({
        url: "/api/user/update-role",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "MasterSearch", id: "LIST" }],
    }),
  }),
});

//  Export hooks
export const {
  useMasterSearchQuery,
  useExportSearchMutation,
  useGetChangeStatusMutation,
  useGetChangeUsersRoleMutation,
} = MasterSearchApi;

export default MasterSearchApi;
