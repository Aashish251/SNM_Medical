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
  tagTypes: ["RegistrationDropdown", "Cities"],
  endpoints: (builder) => ({
    getRegistrationDropdownData: builder.query<
      RegistrationDropdownResponse,
      void
    >({
      query: () => ({
        url: "/registration/dropdown-data",
        method: "GET",
      }),
      providesTags: ["RegistrationDropdown"],
    }),

    getCitiesByState: builder.query<
      CitiesByStateResponse,
      CitiesByStateRequest
    >({
      query: ({ stateId }) => ({
        url: `/registration/cities/${stateId}`,
        method: "GET",
      }),
      providesTags: ["Cities"],
    }),
    registerUser: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "registration/register",
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
  useGetRegistrationDropdownDataQuery,
  useLazyGetCitiesByStateQuery,
  useRegisterUserMutation,
} = RegisterApi;
