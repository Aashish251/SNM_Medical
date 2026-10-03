import { baseApi } from "@shared/api/baseApi";

export type MasterModule =
  | "city"
  | "state"
  | "qualification"
  | "department"
  | "sewalocation"
  | "availableday"
  | "shifttime";

export interface MasterRecord {
  id: number | string;
  value: string;
  state_id?: number;
  country_id?: number;
}

interface MasterRecordsResponse {
  success?: boolean;
  message?: string;
  data?: {
    items?: MasterRecord[];
    count?: number;
  };
}

export const masterDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMasterRecords: builder.query<
      MasterRecordsResponse,
      { module: MasterModule; search: string }
    >({
      query: ({ module, search }) => ({
        url: `/api/masters/${module}`,
        method: "GET",
        params: search.trim() ? { search: search.trim() } : undefined,
      }),
      providesTags: (_result, _error, { module }) => [
        { type: "Masters", id: module },
      ],
    }),
    createMasterRecord: builder.mutation<
      MasterRecordsResponse,
      {
        module: MasterModule;
        value: string;
        stateId?: number;
        countryId?: number;
      }
    >({
      query: ({ module, ...body }) => ({
        url: `/api/masters/${module}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { module }) => [
        { type: "Masters", id: module },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateMasterRecordMutation,
  useGetMasterRecordsQuery,
} = masterDataApi;
