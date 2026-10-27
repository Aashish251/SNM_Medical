import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getAge = (dobString: string): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dobString);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
    return null;
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  if (
    year > currentYear ||
    (year === currentYear && month > currentMonth) ||
    (year === currentYear && month === currentMonth && day > currentDay)
  ) {
    return null;
  }

  let age = currentYear - year;
  if (currentMonth < month || (currentMonth === month && currentDay < day)) age--;

  return age <= 120 ? age : null;
};

export const calculateAge = (dobString: string) => getAge(dobString || "") ?? 0;

export const isValidBirthdate = (dobString: string) => getAge(dobString) !== null;
