import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@lib/customBaseQuery"
import { LoginRequest, LoginResponse } from "../type";

export const loginApi = createApi({
    reducerPath: "loginApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Login"],
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
});

export const { useLoginUserMutation } = loginApi;
