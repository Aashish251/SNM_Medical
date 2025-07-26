"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ApiService from "@/lib/api"; // Add this import

const Navbar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 shadow-md fixed top-0 left-0 w-full z-50 h-16"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <Image
            src="/snmlogo.jpeg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full shadow-sm"
          />
          <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white tracking-wide">
            Medical Sewa 
          </h1>
        </div>
        
        <div className="flex space-x-4 sm:space-x-6">
          <Link href="/" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-yellow-200 transition-colors font-medium text-sm sm:text-base"
            >
              Home
            </motion.button>
          </Link>
          <Link href="/gallery" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-yellow-200 transition-colors font-medium text-sm sm:text-base"
            >
              Gallery
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const LoginPage = () => {
  // Updated state management
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [role, setRole] = useState<"Admin" | "Medical Staff">("Admin");
  
  const router = useRouter(); // Use Next.js router

  // Updated handleSubmit with API integration
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setError("Please enter email and password!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call your backend API
      const response = await ApiService.login({
        email: formData.email,
        password: formData.password,
        role: role // Include role in the request
      });

      console.log('Login successful:', response);

      // Store authentication token if provided
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('role', role);
      }

      // Redirect based on role
      if (role === "Admin") {
        router.push('/dashboard');
      } else if (role === "Medical Staff") {
        router.push('/medical-dashboard'); // You can create a different dashboard
      }

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Updated input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-[#f9f9f6] min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      <div className="pt-24 flex-1 flex flex-col md:flex-col lg:flex-row items-center justify-center w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 w-full max-w-5xl mx-auto shadow-2xl rounded-3xl bg-white/60 flex-col md:flex-col lg:flex-row max-h-[90vh] overflow-hidden">
          
          {/* Left Section */}
          <div className="w-full md:w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-[#f9f9f6]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md space-y-5"
            >
              <div className="flex justify-center">
                <Image src="/snmlogo.jpeg" alt="MedicalSewa Logo" width={60} height={60} className="rounded-full shadow-2xl" />
              </div>
              <h1 className="text-lg sm:text-3xl md:text-2xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-teal-700 bg-clip-text text-transparent">
                Welcome to Medical Sewa Login
              </h1>
              <p className="text-center text-gray-600 text-sm sm:text-base">
                Sign in to your {role} account.
              </p>

              {/* Role Buttons */}
              <div className="flex justify-center gap-2 flex-wrap">
                <button
                  className={`px-4 py-2 rounded-full font-semibold transition-all shadow-md ${
                    role === "Admin"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-teal-400 hover:text-white"
                  } w-24 sm:w-28 text-center text-xs sm:text-sm`}
                  onClick={() => setRole("Admin")}
                  disabled={loading} // Disable during loading
                >
                  Admin
                </button>
                <button
                  className={`px-2 py-2 rounded-full font-semibold transition-all shadow-md ${
                    role === "Medical Staff"
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-cyan-400 hover:text-white"
                  } w-50 sm:w-50 text-center text-xs sm:text-sm`}
                  onClick={() => setRole("Medical Staff")}
                  disabled={loading} // Disable during loading
                >
                  Medical Staff
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email" // Added name attribute
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300 text-sm"
                    placeholder="Enter your email"
                    disabled={loading} // Disable during loading
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password" // Added name attribute
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300 text-sm"
                    placeholder="Enter your password"
                    disabled={loading} // Disable during loading
                    required
                  />
                </div>

                {/* Enhanced error display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs text-center">
                    {error}
                  </div>
                )}

                <div className="text-right">
                  <a href="/forgot-password" className="text-xs sm:text-sm text-teal-600 hover:underline">
                    Forgot password?
                  </a>
                </div>

                {/* Updated submit button with loading state */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-full bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-200 shadow-md text-white font-bold text-base transition-transform duration-300 ${
                    loading 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:scale-105 hover:from-purple-600 hover:to-indigo-600'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Right Section - unchanged */}
          <div className="w-full md:w-full lg:w-1/2 flex flex-col items-center justify-center text-white p-6 sm:p-8 space-y-5 bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-500 shadow-md relative overflow-hidden">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="text-xl sm:text-2xl font-extrabold tracking-wide text-center drop-shadow-2xl animate-bounce"
            >
              Dhan Nirankar Ji
            </motion.h2>
            <p className="text-xs sm:text-sm font-light tracking-wider text-center">
              Don&apos;t have an account?
            </p>

            <motion.div whileHover={{ scale: 1.05 }}>
              <a
                href="/registrationpage"
                className="border-2 border-white px-5 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-bold hover:bg-white hover:text-indigo-700 transition-all duration-300 shadow-lg text-center"
              >
                Sign Up / Registration
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

export default LoginPage;
