import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CTASection() {
    return (
        <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    Join Us in Making a Difference
                </h2>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                    Your support helps us bring healthcare to those who need it most.
                </p>
                <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                        to="/donate"
                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all"
                    >
                        Donate Now
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
