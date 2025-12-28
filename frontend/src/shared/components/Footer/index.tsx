// components/Footer.tsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SlLocationPin } from "react-icons/sl";
import { FiPhone } from "react-icons/fi";
import { GoMail } from "react-icons/go";

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
import { services, SNMSocialMedia } from "@shared/config/common";

const Footer: React.FC = () => {
  return (
    <footer className="bg-to-two-right-theme-gradient text-white">
      {/* Top wave / decorative separator (optional) */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={SNM_WEBSITE_LOGO}
                alt={SNM_SITE_LOGO_TITLE}
                width={56}
                height={56}
                className="rounded-full border-2 border-white/30 shadow-sm flex-shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-base sm:text-lg font-bold leading-tight ">
                  {SNM_SITE_LOGO_TITLE}
                </h4>
                <p className="text-xs sm:text-sm text-white/80 mt-1 ">
                  {SNM_SITE_LOGO_DESCRIPTION}
                </p>
              </div>
            </div>

            {/* social icons */}
            <div className="flex items-center gap-2 mt-2">
              {SNMSocialMedia.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.a
                    key={s.id}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.06 }}
                    whileFocus={{ scale: 1.03 }}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/25 transition"
                    aria-label={s.title}
                    title={s.title}
                  >
                    <Icon size={16} />
                  </motion.a>
                );
              })}
            </div>

            {/* brief trust / CTA */}
            <p className="text-xs text-white/75 mt-3">
              Serving the community with health & welfare initiatives. Join our
              mission.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:mx-auto lg:mx-auto">
            <h5 className="text-sm sm:text-base font-semibold mb-2">
              Quick Links
            </h5>
            <ul className="space-y-2">
              {publicNav.slice(0, 6).map((link, i) => (
                <li key={i}>
                  <motion.div whileHover={{ x: 6 }} className="inline-block">
                    <Link
                      to={link.href}
                      className="text-sm sm:text-sm text-white/90 hover:text-yellow-200 transition"
                    >
                      {link.text}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <h5 className="text-sm sm:text-base font-semibold mb-2">
              Our Services
            </h5>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base flex-shrink-0">
                    <s.icon size={24} />
                  </div>
                  <div>
                    <Link
                      to=""
                      className="text-sm font-medium block hover:text-yellow-200 transition"
                    >
                      {s.title}
                    </Link>
                    <p className="text-xs text-white/70">{s.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-2">
            <h5 className="text-sm sm:text-base font-semibold mb-2">
              Contact Us
            </h5>

            <address className="not-italic text-sm space-y-3 text-white/90">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-lg text-white/80">
                  <SlLocationPin />
                </span>
                <span className="text-sm">{SNM_SITE_ADDRESS}</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-lg text-white/80">
                  <FiPhone />
                </span>
                <Link
                  to={`tel:${SNM_SITE_PHONE}`}
                  className="text-sm hover:text-yellow-200 transition"
                >
                  {SNM_SITE_PHONE}
                </Link>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-lg text-white/80">
                  <GoMail />
                </span>
                <Link
                  to={`mailto:${SNM_SITE_EMAIL}`}
                  className="text-sm hover:text-yellow-200 transition"
                >
                  {SNM_SITE_EMAIL}
                </Link>
              </div>
            </address>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col-reverse sm:flex-row items-center sm:items-center justify-between gap-3">
          <div className="text-sm text-white/80 text-center sm:text-left mt-3 sm:mt-0">
            © {new Date().getFullYear()} {SNM_SITE_LOGO_TITLE}. All rights
            reserved.
            <span className="block text-xs text-white/60 mt-1">
              {SNM_SITE_META_TITLE} Initiative
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to=""
              className="text-sm text-white/70 hover:text-white transition"
            >
              Privacy Policy
            </Link>
            <Link
              to=""
              className="text-sm text-white/70 hover:text-white transition"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
