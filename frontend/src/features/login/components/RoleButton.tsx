import React from "react";
import { Role } from "../hooks/useLoginForm";
import { SNM_ADMIN_USERTYPE } from "@shared/constants/index.constant";

interface RoleButtonProps {
  roleName: Role;
  label: string;
  currentRole: Role;
  onClick: (role: Role) => void;
  loading: boolean;
}

export const RoleButton: React.FC<RoleButtonProps> = ({
  roleName,
  currentRole,
  onClick,
  label,
  loading,
}) => {
  const isActive = currentRole === roleName;

  const baseClasses =
    "px-6 py-2 rounded-full font-semibold transition-all shadow-md text-center text-xs sm:text-sm";
  const activeClasses =
    roleName === SNM_ADMIN_USERTYPE
      ? "bg-teal-600 text-white"
      : "bg-cyan-600 text-white";
  const inactiveClasses =
    roleName === SNM_ADMIN_USERTYPE
      ? "bg-gray-200 text-gray-700 hover:bg-teal-400 hover:text-white"
      : "bg-gray-200 text-gray-700 hover:bg-cyan-400 hover:text-white";

  return (
    <button
      type="button"
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={() => onClick(roleName)}
      disabled={loading}
    >
      {label}
    </button>
  );
};
