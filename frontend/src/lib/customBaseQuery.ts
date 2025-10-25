import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@app/store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const customBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "omit", // optional, keep if you don't use cookies
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Always set JSON content-type by default
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});
