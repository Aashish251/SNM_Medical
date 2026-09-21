import { baseApi } from "@shared/api/baseApi";
import { LoginRequest, LoginResponse } from "../type";

export const loginApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        loginUser: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: "/api/auth/login",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Login"],
        }),
    }),
    overrideExisting: false,
});

export const { useLoginUserMutation } = loginApi;
