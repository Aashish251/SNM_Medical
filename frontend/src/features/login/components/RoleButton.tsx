import React from "react";
import { Role } from "../hooks/useLoginForm";

interface RoleButtonProps {
  roleName: Role;
  currentRole: Role;
  onClick: (role: Role) => void;
  loading: boolean;
}

export const RoleButton: React.FC<RoleButtonProps> = ({
  roleName,
  currentRole,
  onClick,
  loading,
}) => {
  const isActive = currentRole === roleName;

  const baseClasses =
    "px-6 py-2 rounded-full font-semibold transition-all shadow-md text-center text-xs sm:text-sm w-24 sm:w-28";
  const activeClasses =
    roleName === "Admin"
      ? "bg-teal-600 text-white"
      : "bg-cyan-600 text-white";
  const inactiveClasses =
    roleName === "Admin"
      ? "bg-gray-200 text-gray-700 hover:bg-teal-400 hover:text-white"
      : "bg-gray-200 text-gray-700 hover:bg-cyan-400 hover:text-white";

  return (
    <button
      type="button"
      className={`${baseClasses} ${
        isActive ? activeClasses : inactiveClasses
      }`}
      onClick={() => onClick(roleName)}
      disabled={loading}
    >
      {roleName}
    </button>
  );
};
