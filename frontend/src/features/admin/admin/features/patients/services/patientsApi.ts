import { baseApi } from "@shared/api/baseApi";

export interface PatientApiItem {
  id: number | string;
  regnNo: string;
  date?: string;
  patientName: string;
  mobileNumber: string;
  email: string;
  address: string;
  guardianName: string;
  age: number;
  gender: string;
  disease: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

export interface PatientListResponse {
  success?: boolean;
  message?: string;
  data?:
    | {
        items?: PatientApiItem[];
        count?: number;
      }
    | PatientApiItem[];
}

export interface PatientDetailResponse {
  success?: boolean;
  message?: string;
  data?: PatientApiItem;
}

export const patientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query<PatientListResponse, void>({
      query: () => ({
        url: "/api/patients",
        method: "GET",
      }),
      providesTags: [{ type: "Patients", id: "LIST" }],
    }),

    getPatientById: builder.query<PatientDetailResponse, string | number>({
      query: (id) => ({
        url: `/api/patients/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Patients", id }],
    }),

    savePatientRegistration: builder.mutation<
      PatientDetailResponse,
      Partial<PatientApiItem>
    >({
      query: (body) => ({
        url: "/save-patient-registration",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Patients", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useLazyGetPatientByIdQuery,
  useSavePatientRegistrationMutation,
} = patientsApi;
