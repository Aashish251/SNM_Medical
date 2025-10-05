import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { SNM_WEBSITE_LOGO } from "@assets/index";
import { TextField } from "@shared/components/FormInputs/TextField";

type FormData = {
    email: string;
    password: string;
};

type Role = "Admin" | "Medical Staff";

const RoleButton: React.FC<{
    roleName: Role;
    currentRole: Role;
    onClick: (role: Role) => void;
    loading: boolean;
}> = ({ roleName, currentRole, onClick, loading }) => {
    const isActive = currentRole === roleName;
    const baseClasses =
        "px-6 py-2 rounded-full font-semibold transition-all shadow-md text-center text-xs sm:text-sm";
    const activeClasses =
        roleName === "Admin" ? "bg-teal-600 text-white" : "bg-cyan-600 text-white";
    const inactiveClasses =
        roleName === "Admin"
            ? "bg-gray-200 text-gray-700 hover:bg-teal-400 hover:text-white"
            : "bg-gray-200 text-gray-700 hover:bg-cyan-400 hover:text-white";

    return (
        <button
            type="button"
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} w-24 sm:w-28`}
            onClick={() => onClick(roleName)}
            disabled={loading}
        >
            {roleName}
        </button>
    );
};

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<Role>("Admin");
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError("");

        try {
            console.log("Form Data:", { ...data, role });
            await new Promise((resolve) => setTimeout(resolve, 2000));
            alert("Login successful!");
            reset();
        } catch {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (selectedRole: Role) => {
        setRole(selectedRole);
        if (error) setError("");
    };

    return (
        <div className="bg-[#f9f9f6] min-h-screen flex flex-col overflow-hidden">
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
                                Welcome to Medical Sewa
                            </h1>
                            <p className="text-center text-gray-600 text-sm sm:text-base">
                                Sign in to your {role} account.
                            </p>

                            {/* Role Selector */}
                            <div className="flex justify-center gap-2 flex-wrap">
                                <RoleButton roleName="Admin" currentRole={role} onClick={handleRoleChange} loading={loading} />
                                <RoleButton roleName="Medical Staff" currentRole={role} onClick={handleRoleChange} loading={loading} />
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <TextField
                                    label="Email"
                                    placeholder="Enter your email"
                                    register={register("email", {
                                        required: true,
                                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    })}
                                    error={errors.email}
                                    type="email"
                                    required
                                />

                                <TextField
                                    label="Password"
                                    placeholder="Enter your password"
                                    register={register("password", {
                                        required: true,
                                        minLength: 6,
                                    })}
                                    error={errors.password}
                                    type="password"
                                    required
                                />

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs">
                                        {error}
                                    </div>
                                )}

                                <div className="text-right">
                                    <a href="/forgot-password" className="text-xs sm:text-sm text-teal-600 hover:underline">
                                        Forgot password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-2 rounded-full bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-200 shadow-md text-white font-bold text-base transition-transform duration-300 ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 hover:from-purple-600 hover:to-indigo-600"}`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing In...
                                        </span>
                                    ) : "Sign In"}
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right Section */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-white p-6 sm:p-8 space-y-5 bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-500 shadow-md relative overflow-hidden">
                        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
                            className="text-xl sm:text-2xl font-extrabold tracking-wide text-center drop-shadow-2xl animate-bounce"
                        >
                            Dhan Nirankar Ji
                        </motion.h2>
                        <p className="text-xs sm:text-sm font-light tracking-wider text-center">Don't have an account?</p>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <a
                                href="/register"
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

export default Login;
