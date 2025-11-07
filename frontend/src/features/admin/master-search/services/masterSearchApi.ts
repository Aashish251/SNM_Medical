import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";

export const MasterSearchApi = createApi({
  reducerPath: "MasterSearchApi",
  baseQuery: customBaseQuery,
  tagTypes: ["MasterSearch"],
  endpoints: (builder) => ({
    // 🔍 Master Search API
    masterSearch: builder.mutation({
      query: (body) => ({
        url: "/search/master",
        method: "POST",
        body,
        invalidatesTags: ["MasterSearch"],
      }),
    }),
    getChangeStatus: builder.mutation({
      query: (body) => ({
        url: "/search/master",
        method: "POST",
        body,
      }),
    }),
  }),
});

// ✅ Export hook for component usage
export const { useMasterSearchMutation } = MasterSearchApi;
