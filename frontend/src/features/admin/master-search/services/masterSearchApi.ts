import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";

export const MasterSearchApi = createApi({
  reducerPath: "MasterSearchApi",
  baseQuery: customBaseQuery,
  tagTypes: ["MasterSearch"],
  endpoints: (builder) => ({
    masterSearch: builder.mutation({
      query: (body) => ({
        url: "/search/master",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MasterSearch"],
    }),

    getChangeStatus: builder.mutation({
      query: ({ regId }) => ({
        url: `/approve/${regId}`,
        method: "POST",
      }),
      invalidatesTags: ["MasterSearch"],
    }),
  }),
});

export const { useMasterSearchMutation, useGetChangeStatusMutation } =
  MasterSearchApi;

export default MasterSearchApi;
