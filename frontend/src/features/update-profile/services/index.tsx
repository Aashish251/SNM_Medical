import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";
import { GetUserProfileResponse } from "../type";

export const RegisterApi = createApi({
  reducerPath: "RegisterApi",
  baseQuery: customBaseQuery,
  tagTypes: [],
  endpoints: (builder) => ({
    registerUser: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/api/registration/register",
        method: "POST",
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

export const { useRegisterUserMutation, useLazyGetUserDetailsQueryQuery } =
  RegisterApi;
