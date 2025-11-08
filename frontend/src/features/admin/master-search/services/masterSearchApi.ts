import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";

export const MasterSearchApi = createApi({
  reducerPath: "MasterSearchApi",
  baseQuery: customBaseQuery,
  tagTypes: ["MasterSearch"],
  endpoints: (builder) => ({
    // 🔍 POST /search/master
    masterSearch: builder.mutation({
      query: (body) => ({
        url: "/search/master",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MasterSearch"],
    }),

    // ✅ POST /approve/:regId
    getChangeStatus: builder.mutation({
      query: ({ regId }) => ({
        url: `/approve/${regId}`,
        method: "POST",
      }),
      invalidatesTags: ["MasterSearch"],
    }),

    // 🧩 NEW endpoint — POST /search/update
    getChangeUsersRole: builder.mutation({
      query: (body) => ({
        url: "/search/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MasterSearch"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useMasterSearchMutation,
  useGetChangeStatusMutation,
  useGetChangeUsersRoleMutation, // ← new hook
} = MasterSearchApi;

export default MasterSearchApi;
