import { motion } from "framer-motion";

const TestimonialCard = ({
    content,
    author,
    role,
  }: {
    content: string;
    author: string;
    role: string;
  }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md p-6"
    >
      <div className="text-yellow-400 text-xl mb-3">★★★★★</div>
      <p className="text-gray-700 italic mb-4">"{content}"</p>
      <div>
        <p className="font-bold text-gray-800">{author}</p>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </motion.div>
  );

export default TestimonialCard;