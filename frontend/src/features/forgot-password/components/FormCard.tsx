import React from "react";
import { motion } from "framer-motion";

const FormCard: React.FC<
  React.PropsWithChildren<{ className?: string; motionProps?: any }>
> = ({ children, className = "", motionProps = {} }) => (
  <motion.div
    {...motionProps}
    className={`w-full max-w-3xl mx-auto bg-white/70 rounded-3xl shadow-2xl p-8 ${className}`}
  >
    {children}
  </motion.div>
);

export default FormCard;
