import React from "react";
import { motion } from "framer-motion";
import { SNM_WEBSITE_LOGO } from "@assets/index";
import { useLoginForm } from "./hooks/useLoginForm";
import { LoginForm } from "./components/LoginForm";
import {
  SNM_ADMIN_USERTYPE,
  SNM_DONT_HAVE_ACCOUNT,
  SNM_LOGIN_PAGE_ADMIN_SUBTITLE,
  SNM_LOGIN_PAGE_DNG,
  SNM_LOGIN_PAGE_MEDICAL_STAFF_SUBTITLE,
  SNM_LOGIN_PAGE_TITLE,
  SNM_NAV_REGISTER_LINK,
  SNM_LOGIN_LABEL_TITLE,
} from "@shared/constants";

const Login = () => {
  const { form, role, handleRoleChange, onSubmit, loading } =
    useLoginForm();

  return (
    <div className="bg-[#f9f9f6] min-h-screen flex flex-col overflow-hidden space-y-6">
      <div className="pt-24 flex-1 flex flex-col lg:flex-row items-center justify-center w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 w-full max-w-5xl mx-auto shadow-2xl rounded-3xl bg-white/60 flex-col lg:flex-row max-h-[90vh] overflow-hidden">
          {/* Left Section */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-[#f9f9f6]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md space-y-5"
            >
              <div className="flex justify-center">
                <img
                  src={SNM_WEBSITE_LOGO}
                  alt="MedicalSewa Logo"
                  className="w-16 h-16 rounded-full shadow-2xl"
                />
              </div>

              <h1 className="text-lg sm:text-3xl md:text-2xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-teal-700 bg-clip-text text-transparent">
                {SNM_LOGIN_PAGE_TITLE}
              </h1>

              <p className="text-center text-gray-600 text-sm sm:text-base">
                {role == SNM_ADMIN_USERTYPE
                  ? SNM_LOGIN_PAGE_ADMIN_SUBTITLE
                  : SNM_LOGIN_PAGE_MEDICAL_STAFF_SUBTITLE}
              </p>

              <LoginForm
                form={form}
                role={role}
                handleRoleChange={handleRoleChange}
                onSubmit={onSubmit}
                loading={loading}
              />
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-white p-6 sm:p-8 space-y-5 bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-500 shadow-md relative overflow-hidden">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="text-xl sm:text-2xl font-extrabold tracking-wide text-center drop-shadow-2xl animate-bounce"
            >
              {SNM_LOGIN_PAGE_DNG}
            </motion.h2>

            <p className="text-xs sm:text-sm font-light tracking-wider text-center">
              {SNM_DONT_HAVE_ACCOUNT}
            </p>

            <motion.div whileHover={{ scale: 1.05 }}>
              <a
                href={SNM_NAV_REGISTER_LINK}
                className="border-2 border-white px-5 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-bold hover:bg-white hover:text-indigo-700 transition-all duration-300 shadow-lg text-center"
              >
                {SNM_LOGIN_LABEL_TITLE}
              </a>
            </motion.div>

            <motion.div
              className="absolute -bottom-10 -right-10 bg-white opacity-10 rounded-full w-32 sm:w-40 h-32 sm:h-40"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
              transition={{ repeat: Infinity, duration: 20 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
