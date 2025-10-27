import { SNM_WEBSITE_LOGO } from "@assets/index";
import { publicNav } from "@shared/config/navlinks";
import {
  SNM_SITE_ADDRESS,
  SNM_SITE_EMAIL,
  SNM_SITE_LOGO_DESCRIPTION,
  SNM_SITE_LOGO_TITLE,
  SNM_SITE_META_TITLE,
  SNM_SITE_PHONE,
} from "@shared/constants";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const services = [
    {
      title: "Free Health Check-ups",
      description:
        "Conducting free health check-ups and screenings for early detection of diseases.",
      icon: "🩺",
    },

    {
      title: " Mega Blood Donation",
      description:
        "Organizing regular blood donation camps to support local hospitals.",
      icon: "🩸",
    },
  ];
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-2 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src={SNM_WEBSITE_LOGO}
                alt={SNM_SITE_LOGO_TITLE}
                width={50}
                height={50}
                className="rounded-full border-2 border-white"
              />
              <span className="text-xl font-bold">{SNM_SITE_LOGO_TITLE}</span>
            </div>
            <p className="text-gray-400 mb-6">{SNM_SITE_LOGO_DESCRIPTION}</p>
            <div className="flex space-x-4">
              {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                <motion.a
                  key={social}
                  whileHover={{ scale: 1.1 }}
                  href={`#${social}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-base">
                      {social.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {publicNav.map((link, index) => (
                <li key={index}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.text}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.title}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to="/services"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {service.title}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <span className="mr-3 mt-1">📍</span>
                <span>{SNM_SITE_ADDRESS}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1">📞</span>
                <span>{SNM_SITE_PHONE}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1">✉️</span>
                <span>{SNM_SITE_EMAIL}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} {SNM_SITE_LOGO_TITLE}. All rights
            reserved.
          </p>
          <p className="mt-2">{SNM_SITE_META_TITLE} Initiative</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
