import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateAge = (dobString: string) => {
  const birthDate = new Date(dobString);
  const today = new Date();

  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }

  return calculatedAge;
};

export const handleAlphabeticInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  fieldName: any,
  setValue: any
) => {
  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
  setValue(fieldName, value, { shouldValidate: true });
};

