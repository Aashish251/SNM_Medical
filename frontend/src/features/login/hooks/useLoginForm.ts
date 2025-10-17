// src/pages/Login/hooks/useLoginForm.ts

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../services/loginApi";
import { useDispatch } from "react-redux";
import { signIn } from "../redux/authSlice";

export type Role = "Admin" | "Medical Staff";

export interface FormData {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>("Admin");
  const [error, setError] = useState("");
  const [triggerLoginUser] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm<FormData>();

  const handleRoleChange = (selectedRole: Role) => {
    setRole(selectedRole);
    if (error) setError("");
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        role: role === "Admin" ? "admin" : "ms",
      };

      const response = await toast.promise(triggerLoginUser(payload).unwrap(), {
        loading: "Logging in...",
        success: "Login successful!",
        error: "Login failed",
      });

      dispatch(
        signIn({
          token: response?.token,
          isSignedIn: true,
        })
      );

      navigate(role === "Admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    role,
    setRole,
    loading,
    error,
    setError,
    handleRoleChange,
    onSubmit,
  };
};
