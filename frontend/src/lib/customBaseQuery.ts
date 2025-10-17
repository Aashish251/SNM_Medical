import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@app/store"; // adjust path

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const customBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "omit",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
