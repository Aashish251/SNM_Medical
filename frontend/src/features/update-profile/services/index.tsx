import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";
import {
  CitiesByStateRequest,
  CitiesByStateResponse,
  RegistrationDropdownResponse,
} from "../type";

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
  }),
});

export const {
  useRegisterUserMutation,
} = RegisterApi;
