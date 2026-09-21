import { baseApi } from "@shared/api/baseApi";
import { StatItem, UserDetails } from "../type";

// shape your API actually returns
type DashboardStatsResponse = { data: { stats: StatItem[] } };
type UserDetailsResponse = { data: UserDetails };

export const AdminApi = baseApi.injectEndpoints({
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
  overrideExisting: false,
});

export const { useGetDashboardStatsQuery, useGetUserDetailsQuery } = AdminApi;
