import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../type";

export const ForgotPasswordApi = createApi({
  reducerPath: "ForgotPasswordApi",
  baseQuery: customBaseQuery,
  tagTypes: [],
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
});

export const { useForgotPasswordMutation, useResetPasswordMutation } =
  ForgotPasswordApi;

export default ForgotPasswordApi;
