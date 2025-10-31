import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HOME_ABOUT_TITLE, HOME_ABOUT_CONTENT } from "../config";
import {
  HOME_ABOUT_PAGE_CONTENT,
  HOME_ABOUT_PAGE_TITLE,
  HOME_ABOUT_SECTION_CONTENT,
  HOME_ABOUT_SECTION_TITLE,
} from "@shared/constants/index.constant";

interface AboutSectionProps {
  aboutImages: string[];
}

export default function AboutSection({ aboutImages }: AboutSectionProps) {
  const [aboutCurrentIndex, setAboutCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAboutCurrentIndex((prev) => (prev + 1) % aboutImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [aboutImages.length]);

  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {HOME_ABOUT_PAGE_TITLE}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6" />
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {HOME_ABOUT_PAGE_CONTENT}
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Image Slider */}
        <div className="relative rounded-xl overflow-hidden shadow-xl h-80 md:h-96">
          <div
            className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${aboutCurrentIndex * 100}%)` }}
          >
            {aboutImages.map((src, index) => (
              <div key={index} className="min-w-full flex-shrink-0 relative">
                <img
                  src={src}
                  alt={`About Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {HOME_ABOUT_SECTION_TITLE}
          </h3>
          <p className="text-gray-600 mb-6">{HOME_ABOUT_SECTION_CONTENT}</p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/about"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
