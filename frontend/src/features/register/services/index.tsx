import { baseApi } from "@shared/api/baseApi";

type RegisterUserResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

type AvailabilityResponse = {
  success?: boolean;
  message?: string;
  data?: { emailExists: boolean; mobileExists: boolean; available: boolean };
};

export const RegisterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterUserResponse, FormData>({
      query: (formData) => ({
        url: "/api/registration/register",
        method: "POST",
        body: formData,
        headers: {
          "x-is-form-data": "true",
        },
      }),
    }),
    checkRegistrationAvailability: builder.mutation<AvailabilityResponse, { email: string; mobileNo: string }>({
      query: (body) => ({
        url: "/api/registration/check-availability",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterUserMutation,
  useCheckRegistrationAvailabilityMutation,
} = RegisterApi;
