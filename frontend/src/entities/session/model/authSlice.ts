import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, SignInPayload } from "./types";

const initialState: AuthState = {
  isSignedIn: false,
  token: undefined,
  userType: undefined,
  userDetails: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<SignInPayload>) {
      state.isSignedIn = true;
      state.token = action.payload.token;
      state.userType = action.payload.userType;
      state.userDetails = action.payload.userDetails ?? null;
      state.error = null;
    },
    signOut(state) {
      state.isSignedIn = false;
      state.token = undefined;
      state.userType = undefined;
      state.userDetails = null;
      state.error = null;
    },
    refreshToken(state, action: PayloadAction<string>) {
      if (state.isSignedIn) state.token = action.payload;
    },
  },
});

export const { signIn, signOut, refreshToken } = authSlice.actions;
export default authSlice.reducer;
