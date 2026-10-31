import React from "react";

export const RequiredMark: React.FC = () => (
  <span className="text-red-500">*</span>
);

export interface FieldErrorTextProps {
  message?: string | null;
  className?: string;
}

export const FieldErrorText: React.FC<FieldErrorTextProps> = ({ message, className = "" }) =>
  message ? <p className={`text-red-500 text-xs mt-1 ${className}`.trim()}>{message}</p> : null;

