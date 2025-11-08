import React from "react";
import { motion } from "framer-motion";

const SubmitCancel: React.FC<{
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}> = ({ isSubmitting = false, onCancel, submitLabel = "Submit" }) => (
  <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-center gap-4 mt-6">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="submit"
      disabled={isSubmitting}
      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      {isSubmitting ? (
        <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full mx-auto" />
      ) : (
        submitLabel
      )}
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={onCancel}
      className="w-full sm:w-auto bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      Cancel
    </motion.button>
  </div>
);

export default SubmitCancel;
