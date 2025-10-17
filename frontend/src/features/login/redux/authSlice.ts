import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, SignInPayload } from "../type";

const initialState: AuthState = {
  isSignedIn: false,
  token: undefined,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<SignInPayload>) {
      state.isSignedIn = true;
      state.token = action.payload.token;
      state.error = null;
    },
    signOut(state) {
      state.isSignedIn = false;
      state.token = undefined;
      state.error = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
