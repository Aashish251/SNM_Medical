import { baseApi } from "@shared/api/baseApi";

export interface DutyChartEntry {
  id: string;
  chartId: number;
  entryId: number;
  title: string;
  department: string;
  date: string;
  year: number;
  name: string;
  contact: string;
  shift: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DutyChartListResponse {
  success?: boolean;
  message?: string;
  data?: {
    items?: DutyChartEntry[];
    count?: number;
  };
}

export interface CreateEntryPayload {
  title: string;
  department: string;
  date: string;
  name: string;
  contact: string;
  shift: string;
  status?: string;
}

export interface UpdateEntryPayload {
  name: string;
  contact: string;
  shift: string;
  status?: string;
}

export interface DutyDepartmentOption {
  id?: number;
  label: string;
  value: string;
}

export interface DutyDepartmentsResponse {
  success?: boolean;
  message?: string;
  data?: {
    items?: Array<{ id?: number; label?: string; value?: string; department_name?: string }>;
    count?: number;
  };
}

export const dutyChartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDutyEntries: builder.query<DutyChartListResponse, void>({
      query: () => ({
        url: "/api/dutychart/entries",
        method: "GET",
      }),
      providesTags: [{ type: "DutyChart", id: "LIST" }],
    }),

    getDutyDepartments: builder.query<DutyDepartmentOption[], void>({
      query: () => ({
        url: "/api/dutychart/departments",
        method: "GET",
      }),
      transformResponse: (response: DutyDepartmentsResponse) => {
        const rawItems = response?.data?.items || [];
        return rawItems.map((item) => {
          const name = item.department_name || item.label || item.value || "";
          return {
            id: item.id,
            label: name,
            value: name,
          };
        });
      },
      providesTags: [{ type: "DutyChart", id: "DEPARTMENTS" }],
    }),

    createDutyEntry: builder.mutation<DutyChartListResponse, CreateEntryPayload>({
      query: (body) => ({
        url: "/api/dutychart/entries",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DutyChart", id: "LIST" }],
    }),

    updateDutyEntry: builder.mutation<DutyChartListResponse, { chartId: number; entryId: number; body: UpdateEntryPayload }>({
      query: ({ chartId, entryId, body }) => ({
        url: `/api/dutychart/charts/${chartId}/entries/${entryId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "DutyChart", id: "LIST" }],
    }),

    deleteDutyEntry: builder.mutation<void, { chartId: number; entryId: number }>({
      query: ({ chartId, entryId }) => ({
        url: `/api/dutychart/charts/${chartId}/entries/${entryId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "DutyChart", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDutyEntriesQuery,
  useGetDutyDepartmentsQuery,
  useCreateDutyEntryMutation,
  useUpdateDutyEntryMutation,
  useDeleteDutyEntryMutation,
} = dutyChartApi;