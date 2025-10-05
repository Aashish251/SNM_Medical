import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, SignInPayload } from "../type";

const initialState: AuthState = {
    isSignedIn: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signIn(state, action: PayloadAction<SignInPayload>) {
            state.isSignedIn = true;
            state.token = action.payload.token;
        },
        signOut(state) {
            state.isSignedIn = false;
            state.error = null;
        },
    },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
