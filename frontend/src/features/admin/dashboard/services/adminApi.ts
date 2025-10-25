import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";

// Admin API boilerplate
export const AdminApi = createApi({
  reducerPath: "AdminApi",
  baseQuery: customBaseQuery,
  tagTypes: ["AdminStats", "UserDetails"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<void, void>({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),
    getUserDetails: builder.query<void, void>({
      query: () => ({
        url: "/dashboard/profile",
        method: "GET",
      }),
      providesTags: ["UserDetails"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetUserDetailsQuery } = AdminApi;
