// src/pages/Login/hooks/useLoginForm.ts

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../services/loginApi";
import { useAppDispatch } from "@app/store/hooks";
import { signIn } from "@entities/session";
import { normalizeApiError } from "@shared/api/errors";
import { reportError } from "@shared/lib/monitoring";
import { getDefaultRouteForUserType } from "@app/router/authRedirects";
import {
  SNM_ADMIN_USERTYPE,
  SNM_MS_USERTYPE,
} from "@shared/constants";

export type Role = "admin" | "ms";

export interface FormData {
  identifier: string;
  password: string;
}

export const useLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>(SNM_MS_USERTYPE);
  const [triggerLoginUser] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = useForm<FormData>();

  const handleRoleChange = (selectedRole: Role) => {
    setRole(selectedRole);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier);
      const isPhone = /^[6-9]\d{9}$/.test(data.identifier);

      const payload = {
        ...(isEmail
          ? { email: data.identifier }
          : { mobileNo: data.identifier }),
        password: data.password,
        role:
          role === SNM_ADMIN_USERTYPE ? SNM_ADMIN_USERTYPE : SNM_MS_USERTYPE,
      };

      // Show loading toast
      const loadingToast = toast.loading("Logging in...");

      // Call login API
      const response = await triggerLoginUser(payload).unwrap();

      if ("success" in response && !response.success) {
        throw new Error(response.message || "Login failed. Please try again.");
      }

      const loginData = "data" in response ? response.data : response;
      const { token, user } = loginData || {};

      if (
        typeof token !== "string" ||
        !token ||
        !user ||
        typeof user.userType !== "string"
      ) {
        throw new Error(
          "The server returned an incomplete login response. Please try again or contact support."
        );
      }

      toast.dismiss(loadingToast);
      toast.success("Login successful!");

      dispatch(
        signIn({
          token,
          userType: user.userType,
          userDetails: user,
          isSignedIn: true,
        })
      );

      navigate(getDefaultRouteForUserType(user.userType), { replace: true });
    } catch (error) {
      toast.dismiss();
      const { message } = normalizeApiError(error);
      toast.error(message, { duration: 20000 });
      reportError(error, { source: "login" });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    role,
    setRole,
    loading,
    handleRoleChange,
    onSubmit,
  };
};
