import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQueryWithAuth } from "@lib/customBaseQuery";
import { GetUserProfileResponse } from "../type";

export const UpdateProfileApi = createApi({
  reducerPath: "UpdateProfileApi",
  baseQuery: customBaseQueryWithAuth,
  tagTypes: [],
  endpoints: (builder) => ({
    registerUser: builder.mutation<any, { id: string | number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/user/update-profile/${id}`,
        method: "PUT",
        body: formData,
        headers: {
          "x-is-form-data": "true",
        },
      }),
    }),
    getUserDetailsQuery: builder.query<GetUserProfileResponse, number>({
      query: (id) => ({
        url: `/api/user/update-profile/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useGetUserDetailsQueryQuery } =
  UpdateProfileApi;
