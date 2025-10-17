import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

type FormValues = {
  mobile: string;
};

const ForgetPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    toast.success("Details have been sent successfully!", { icon: "✅" });

    // Simulate API call
    setTimeout(() => {
      reset(); // reset form after success
    }, 2000);
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-200/20 to-yellow-200/10 min-h-screen flex flex-col">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-200/20 to-yellow-200/10 animate-pulse"></div>
        <div className="absolute animate-ping bg-pink-300/30 w-20 h-20 rounded-full bottom-10 left-10"></div>
      </div>

      {/* Form Container */}
      <div className="pt-28 flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="bg-white/80 backdrop-blur-md border border-purple-200 shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md space-y-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 text-center">
            Forgot Password
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="w-full">
              <input
                type="text"
                id="mobile"
                maxLength={10}
                placeholder="Enter Mobile Number"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Mobile number must be 10 digits",
                  },
                })}
                className={`w-full px-4 py-3 border ${
                  errors.mobile ? "border-red-500" : "border-purple-300"
                } rounded-lg bg-gradient-to-br from-white to-purple-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.mobile
                    ? "focus:ring-red-400"
                    : "focus:ring-purple-400"
                } transition`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full mx-auto"></span>
                ) : (
                  "Submit"
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => reset()}
                className="w-full sm:w-auto bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </form>

          {/* Dummy Credentials Placeholder */}
          <div className="text-sm text-purple-700 space-y-2 text-left mt-6">
            <p>Username: <span className="underline">______________________</span></p>
            <p>Password: <span className="underline">______________________</span></p>
          </div>

          {/* Sign In Link */}
          <div className="text-center text-gray-500 mt-4">
            <Link to="/login" className="text-sm text-teal-600 hover:underline">
              Click here to Sign In
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-400 text-center mt-8">
            © 2025 Sant Nirankari Mission. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgetPassword;
