// ...existing code...
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, SignInPayload } from "../type";

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
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;