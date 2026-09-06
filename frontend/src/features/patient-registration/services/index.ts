import { baseApi } from "@shared/api/baseApi";
import type {
  PatientRegistrationPayload,
  PatientRegistrationResponse,
} from "../type";

export const PatientRegistrationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerPatient: builder.mutation<
      PatientRegistrationResponse,
      PatientRegistrationPayload
    >({
      query: (body) => ({
        url: "/api/api/patients",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useRegisterPatientMutation } = PatientRegistrationApi;
