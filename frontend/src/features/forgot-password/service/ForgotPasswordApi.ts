import { baseApi } from "@shared/api/baseApi";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../type";

export const ForgotPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (payload) => ({
        url: "/api/auth/forgot-password-validate",
        method: "POST",
        body: payload,
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (payload) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useForgotPasswordMutation, useResetPasswordMutation } =
  ForgotPasswordApi;

export default ForgotPasswordApi;
