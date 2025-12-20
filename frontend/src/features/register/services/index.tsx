import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";
import {
  CitiesByStateRequest,
  CitiesByStateResponse,
  RegistrationDropdownResponse,
} from "@shared/types/CommonType";

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
        formData: true,
        headers: {
          "x-is-form-data": "true",
          // Don't set Content-Type here, browser will set it with correct boundary
        },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
} = RegisterApi;
