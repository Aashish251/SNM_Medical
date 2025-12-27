
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

interface AboutItem {
  image: string;
  title: string;
  content: string;
}

interface AboutSectionProps {
  aboutImages: AboutItem[];
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
          slides={aboutImages.map((item, index) => (
            <div key={index} className="outline-none p-4">
              {/* Card wrapper with shadow and border */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
                <div className="grid md:grid-cols-2 gap-0 items-center">
                  {/* Image Side */}
                  <div className="relative h-80 md:h-96 w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6">
                    <img
                      src={item?.image}
                      alt={`About Slide ${index + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply rounded-2xl"
                    />
                  </div>

                  {/* Content Side */}
                  <div className="p-10 md:p-14 text-left bg-white">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 bg-to-two-right-theme-gradient bg-clip-text text-transparent">
                      {item?.title}
                    </h3>
                    <p className="text-gray-600 mb-8 whitespace-pre-line leading-relaxed text-base">
                      {item?.content}
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to=""
                        className="inline-flex items-center justify-center bg-to-two-right-theme-gradient text-white px-10 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-2xl hover:opacity-90 transition-all duration-300"
                      >
                        Learn More
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          autoPlay
          dots={false}
          interval={2000}
          className="pb-12"
          settings={{
            arrows: false,
          }}
        />
      </div>
    </section>
  );
}
