import { baseApi } from "@shared/api/baseApi";
import {
  CitiesByStateRequest,
  CitiesByStateResponse,
  RegistrationDropdownResponse,
} from "@shared/types/CommonType";

export const CommonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //  Dropdown master data
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

    //  Get cities by selected state
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
  overrideExisting: false,
});

//  Export auto-generated hooks
export const {
  useGetRegistrationDropdownDataQuery,
  useLazyGetCitiesByStateQuery,
} = CommonApi;
