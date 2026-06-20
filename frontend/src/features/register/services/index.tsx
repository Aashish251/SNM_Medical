import { baseApi } from "@shared/api/baseApi";

type RegisterUserResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
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
  }),
  overrideExisting: false,
});

export const {
  useRegisterUserMutation,
} = RegisterApi;
