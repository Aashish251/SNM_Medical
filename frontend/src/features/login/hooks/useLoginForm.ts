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
import {
  SNM_ADMIN_USERTYPE,
  SNM_MS_USERTYPE,
  SNM_NAV_ADMIN_DASHBOARD_LINK,
  SNM_NAV_MS_DASHBOARD_LINK,
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

      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      toast.success("Login successful!");

      const { token, user } = response?.data;

      dispatch(
        signIn({
          token,
          userType: user.userType,
          userDetails: user,
          isSignedIn: true,
        })
      );

      if (user.userType === SNM_ADMIN_USERTYPE) {
        navigate(SNM_NAV_ADMIN_DASHBOARD_LINK, { replace: true });
      } else {
        navigate(SNM_NAV_MS_DASHBOARD_LINK, { replace: true });
      }
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
