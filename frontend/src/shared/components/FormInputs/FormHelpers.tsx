import React from "react";

export const RequiredMark: React.FC = () => (
  <span className="text-red-500">*</span>
);

export interface FieldErrorTextProps {
  message?: string | null;
}

export const FieldErrorText: React.FC<FieldErrorTextProps> = ({ message }) =>
  message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;
