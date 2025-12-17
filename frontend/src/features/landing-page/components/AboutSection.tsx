
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Carousel } from "@shared/components/Carousel";
import { HOME_ABOUT_TITLE, HOME_ABOUT_CONTENT } from "../config";
import {
  HOME_ABOUT_PAGE_CONTENT,
  HOME_ABOUT_PAGE_TITLE,
  HOME_ABOUT_SECTION_CONTENT,
  HOME_ABOUT_SECTION_TITLE,
} from "@shared/constants";

interface AboutSectionProps {
  aboutImages: string[];
}

export default function AboutSection({ aboutImages }: AboutSectionProps) {


  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {HOME_ABOUT_PAGE_TITLE}
        </h2>
        <div className="w-24 h-1 bg-to-two-right-theme-gradient mx-auto mb-6" />
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {HOME_ABOUT_PAGE_CONTENT}
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 overflow-hidden">
        <Carousel
          slides={aboutImages.map((src, index) => (
            <div key={index} className="outline-none">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Image Side */}
                <div className="relative rounded-xl overflow-hidden h-80 md:h-96">
                  <img
                    src={src}
                    alt={`About Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content Side */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {HOME_ABOUT_SECTION_TITLE}
                  </h3>
                  <p className="text-gray-600 mb-6">{HOME_ABOUT_SECTION_CONTENT}</p>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to="/about"
                      className="inline-block bg-to-two-right-theme-gradient text-white px-6 py-3 rounded-lg font-medium shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
          autoPlay
          dots={true}
          interval={4000}
          className="pb-12"
          settings={{
            arrows: false,
          }}
        />
      </div>
    </section>
  );
}
