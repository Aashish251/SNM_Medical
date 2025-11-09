import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";

interface User {
  id: number;
  regId: string;
  fullName: string;
  title: string;
  mobileNo: string;
  qualificationName: string;
  sewalocationName: string;
  shifttime: string;
  departmentName: string;
  email: string;
  dob: string;
  passEntry: string;
  isPresent: string;
  userType: string;
  isApproved: number;
  stateName: string;
  cityName: string;
  certificateDocPath: string;
}

interface SearchResponse {
  status: boolean;
  message: string;
  data: User[];
}

export const MasterSearchApi = createApi({
  reducerPath: "MasterSearchApi",
  baseQuery: customBaseQuery,
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

    // ✅ POST /approve/:regId
    getChangeStatus: builder.mutation({
      query: ({ regId }) => ({
        url: `/api/search/approve/${regId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "MasterSearch", id: "LIST" }],
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

// ✅ Export hooks
export const {
  useMasterSearchQuery,
  useGetChangeStatusMutation,
  useGetChangeUsersRoleMutation,
} = MasterSearchApi;

export default MasterSearchApi;
