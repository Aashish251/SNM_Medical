"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import Logo from "@/public/snmlogo.jpeg";

const Navbar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 shadow-md fixed top-0 left-0 w-full z-50"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between py-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Image
            src="/snmlogo.jpeg"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full shadow-sm"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-wide text-center sm:text-left">
            Sant Nirankari Mission
          </h1>
        </div>
      </div>
    </motion.div>
  );
};

const ForgetPasswordPage = () => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const services = [
    { title: "Free Medical Camps", description: "Organizing free medical camps in underserved areas." },
    { title: "Health Awareness Programs", description: "Conducting health awareness programs on various topics." },
    { title: "Medical Consultations", description: "Providing free medical consultations to those in need." },
    { title: "Emergency Response", description: "Offering emergency medical response during disasters." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) {
      toast.error("Please enter your mobile number.", { icon: "\ud83d\udcf1" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Details have been sent successfully!", { icon: "\u2705" });
      setMobile("");
    }, 2000);
  };

  const handleCancel = () => {
    setMobile("");
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-200/20 to-yellow-200/10 min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-200/20 to-yellow-200/10 animate-pulse"></div>
        <div className="absolute animate-ping bg-pink-300/30 w-20 h-20 rounded-full bottom-10 left-10"></div>
      </div>

      {/* Main form */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="w-full">
              <input
                type="text"
                id="mobile"
                value={mobile}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d{0,10}$/.test(input)) {
                    setMobile(input);
                  }
                }}
                maxLength={10}
                className="w-full px-4 py-3 border border-purple-300 rounded-lg bg-gradient-to-br from-white to-purple-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                placeholder="Enter Mobile Number"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full mx-auto"></span>
                ) : (
                  "Submit"
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </form>

          <div className="text-sm text-purple-700 space-y-2 text-left mt-6">
            <p>Username: <span className="underline">______________________</span></p>
            <p>Password: <span className="underline">______________________</span></p>
          </div>

          <div className="text-center text-gray-500 mt-4">
            <a href="/login" className="text-sm text-teal-600 hover:underline">
              Click here to Sign In
            </a>
          </div>

          <p className="text-xs text-gray-400 text-center mt-8">
            © 2025 Sant Nirankari Mission. All rights reserved.
          </p>
        </motion.div>
      </div>
       {/* Footer */}
            <footer className="bg-gray-900 text-white pt-12 pb-6 md:pt-16 md:pb-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                      <Image
                        src={Logo}
                        alt="Sant Nirankari Mission Logo"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white"
                      />
                      <span className="text-lg md:text-xl font-bold">Medical Sewa</span>
                    </div>
                    <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
                      Providing compassionate healthcare services to underserved communities through the Sant Nirankari Mission.
                    </p>
                    <div className="flex space-x-3 md:space-x-4">
                      {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                        <motion.a 
                          key={social}
                          whileHover={{ scale: 1.1 }}
                          href={`#${social}`}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <span className="sr-only">{social}</span>
                          <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="text-sm md:text-base">{social === 'facebook' ? 'f' : social.charAt(0).toUpperCase()}</span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-6">Quick Links</h3>
                    <ul className="space-y-2 md:space-y-3">
                      {['Home', 'About', 'Services', 'Gallery', 'Contact'].map((link) => (
                        <li key={link}>
                          <motion.a 
                            whileHover={{ scale: 1.05 }}
                            href={`#${link.toLowerCase()}`}
                            className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
                          >
                            {link}
                          </motion.a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-6">Our Services</h3>
                    <ul className="space-y-2 md:space-y-3">
                      {services.map((service) => (
                        <li key={service.title}>
                          <motion.a 
                            whileHover={{ scale: 1.05 }}
                            href="#services"
                            className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
                          >
                            {service.title}
                          </motion.a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-6">Contact Us</h3>
                    <ul className="space-y-2 md:space-y-3 text-gray-400">
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5">📍</span>
                        <span className="text-sm md:text-base">123 Medical Street, Health District, New Delhi, India</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5">📞</span>
                        <span className="text-sm md:text-base">+91 98765 43210</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5">✉️</span>
                        <span className="text-sm md:text-base">info@medicalsewa.org</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-gray-500 text-xs md:text-sm">
                  <p>© {new Date().getFullYear()} Medical Sewa. All rights reserved.</p>
                  <p className="mt-1 md:mt-2">A Sant Nirankari Mission Initiative</p>
                </div>
              </div>
            </footer>
    </div>
  );
};

export default ForgetPasswordPage;
