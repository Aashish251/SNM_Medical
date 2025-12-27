import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Settings } from 'lucide-react';
const MasterReport = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full filter blur-3xl opacity-50 -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full filter blur-3xl opacity-50 -ml-32 -mb-32" />

                    <div className="relative z-10">
                        {/* Animated Icons */}
                        <div className="flex justify-center gap-6 mb-8">
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg"
                            >
                                <Calendar className="w-8 h-8 text-white" />
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, -5, 5, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.2
                                }}
                                className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg"
                            >
                                <Clock className="w-8 h-8 text-white" />
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.4
                                }}
                                className="p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg"
                            >
                                <Users className="w-8 h-8 text-white" />
                            </motion.div>
                        </div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                        >
                            Coming Soon
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-xl md:text-2xl text-gray-600 mb-8 font-medium"
                        >
                            Master Report Management work in progress...
                        </motion.p>


                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default MasterReport