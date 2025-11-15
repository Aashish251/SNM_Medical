import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";
import {
  CitiesByStateRequest,
  CitiesByStateResponse,
  RegistrationDropdownResponse,
} from "@shared/types/CommonType";

// Create a single API slice for all common endpoints
export const CommonApi = createApi({
  reducerPath: "CommonApi",
  baseQuery: customBaseQuery,
  tagTypes: ["RegistrationDropdown", "Cities"],

  endpoints: (builder) => ({
    // ✅ Dropdown master data
    getRegistrationDropdownData: builder.query<
      RegistrationDropdownResponse,
      void
    >({
      query: () => ({
        url: "/api/registration/dropdown-data",
        method: "GET",
      }),
      providesTags: ["RegistrationDropdown"],
    }),

    // ✅ Get cities by selected state
    getCitiesByState: builder.query<
      CitiesByStateResponse,
      CitiesByStateRequest
    >({
      query: ({ stateId }) => ({
        url: `/api/registration/cities/${stateId}`,
        method: "GET",
      }),
      providesTags: ["Cities"],
    }),
  }),
});

// ✅ Export auto-generated hooks
export const {
  useGetRegistrationDropdownDataQuery,
  useLazyGetCitiesByStateQuery,
} = CommonApi;
