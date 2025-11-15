import { motion } from "framer-motion";
import React from "react";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "red" | "green" | "gray";
};

const sizeClasses = {
  sm: "w-6 h-6 border-2",   // small, thin
  md: "w-12 h-12 border-2", // medium, thin
  lg: "w-16 h-16 border-2", // large, thin line
};

const colorClasses = {
  blue: "border-blue-500 border-t-transparent",
  red: "border-red-500 border-t-transparent",
  green: "border-green-500 border-t-transparent",
  gray: "border-gray-500 border-t-transparent",
};

const Spinner: React.FC<SpinnerProps> = ({ size = "md", color = "blue" }) => {
  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  );
};

export default Spinner;
