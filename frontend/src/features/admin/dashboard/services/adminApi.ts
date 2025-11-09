// src/services/adminApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";
import { StatItem, UserDetails } from "../type"; // <- adjust path

// shape your API actually returns
type DashboardStatsResponse = { data: { stats: StatItem[] } };
type UserDetailsResponse = { data: UserDetails };

export const AdminApi = createApi({
  reducerPath: "AdminApi",
  baseQuery: customBaseQuery,
  tagTypes: ["AdminStats", "UserDetails"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({ url: "/api/dashboard/stats", method: "GET" }),
      providesTags: ["AdminStats"],
    }),
    getUserDetails: builder.query<UserDetailsResponse, void>({
      query: () => ({ url: "/api/dashboard/profile", method: "GET" }),
      providesTags: ["UserDetails"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetUserDetailsQuery } = AdminApi;
