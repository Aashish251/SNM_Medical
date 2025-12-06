import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQueryWithAuth } from "@lib/customBaseQuery";
import { GetUserProfileResponse } from "../type";

export const UpdateProfileApi = createApi({
  reducerPath: "UpdateProfileApi",
  baseQuery: customBaseQueryWithAuth,
  tagTypes: [],
  endpoints: (builder) => ({
    registerUser: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `/api/user/update-profile/${formData?.id}`,
        method: "PUT",
        body: formData,
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
