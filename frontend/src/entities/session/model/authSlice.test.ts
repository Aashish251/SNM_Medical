import { describe, expect, it } from "vitest";
import authReducer, { signIn, signOut } from "./authSlice";

describe("authSlice", () => {
  const initialState = authReducer(undefined, { type: "@@INIT" });

  it("signs in with token and user details", () => {
    const nextState = authReducer(
      initialState,
      signIn({
        isSignedIn: true,
        token: "jwt-token",
        userType: "admin",
        userDetails: { id: 1, name: "Admin User", email: "admin@test.com" },
      })
    );

    expect(nextState.isSignedIn).toBe(true);
    expect(nextState.token).toBe("jwt-token");
    expect(nextState.userType).toBe("admin");
    expect(nextState.userDetails?.name).toBe("Admin User");
  });

  it("clears session on sign out", () => {
    const signedIn = authReducer(
      initialState,
      signIn({
        isSignedIn: true,
        token: "jwt-token",
        userType: "ms",
        userDetails: { id: 2, name: "Staff User", email: "staff@test.com" },
      })
    );

    const signedOut = authReducer(signedIn, signOut());

    expect(signedOut.isSignedIn).toBe(false);
    expect(signedOut.token).toBeUndefined();
    expect(signedOut.userType).toBeUndefined();
    expect(signedOut.userDetails).toBeNull();
  });
});
