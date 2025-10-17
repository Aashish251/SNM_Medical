import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { navLinksByPage } from "@shared/config/navlinks";
import { NavLink } from "@shared/types/NavLinksType";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { SNM_WEBSITE_LOGO } from "@assets/index";
import { SNM_SITE_LOGO_TITLE } from "@shared/constants";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const navLinks: NavLink[] = navLinksByPage[pathname] || navLinksByPage["/"];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("scroll", handleScroll);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 shadow-xl py-1 md:py-2"
          : "bg-gradient-to-r from-purple-700/90 via-pink-500/90 to-yellow-400/90 py-2 md:py-4"
        }`}
    >
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 md:gap-4">
            <img
              src={SNM_WEBSITE_LOGO}
              alt={SNM_SITE_LOGO_TITLE}
              width={isMobile ? 40 : 50}
              height={isMobile ? 40 : 50}
              className="rounded-full border-2 border-white shadow-lg"
            />
            <Link
              to="/"
              className="text-lg md:text-xl lg:text-2xl font-serif font-bold text-white tracking-tight"
            >
              {SNM_SITE_LOGO_TITLE}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.slice(0, -1).map((link, index) =>
              link.children ? (
                <div
                  key={`${link.text}-${index}`}
                  className="relative"
                  ref={dropdownRef}
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown(link.text)}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-white font-bold hover:bg-white hover:text-purple-700 transition"
                  >
                    {link.text}
                    <span className="inline-block">
                      {openDropdown === link.text ? (
                        <IoIosArrowUp className="transition-transform duration-200" />
                      ) : (
                        <IoIosArrowDown className="transition-transform duration-200" />
                      )}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === link.text && (
                    <div className="absolute bg-white shadow-lg rounded mt-2 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={`${link.href}-${index}`}
                  to={link.href}
                  className="px-4 py-2 rounded-full text-sm font-bold text-white hover:bg-white hover:text-purple-700 transition"
                >
                  {link.text}
                </Link>
              )
            )}
            {/* Login Button */}
            <motion.div whileHover={{ scale: 1.05 }} className="hidden md:block">
              <Link
                to="/login"
                className="bg-white text-indigo-700 px-4 py-1.5 lg:px-5 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-md hover:bg-indigo-50 transition-colors duration-300"
              >
                Login
              </Link>
            </motion.div>
          </div>



          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`md:hidden overflow-hidden ${isMenuOpen ? "block" : "hidden"
            }`}
        >
          <div className="pt-4 pb-3 flex flex-col bg-gradient-to-b from-purple-800 to-pink-700 rounded-lg mt-2">
            {navLinks.map((link, index) =>
              link.children ? (
                <div
                  key={`mobile-${link.text}-${index}`}
                  className="relative"
                  ref={dropdownRef}
                >
                  {/* Parent Button */}
                  <button
                    type="button"
                    onClick={() => toggleDropdown(link.text)}
                    className="flex w-full justify-between items-center px-4 py-3 text-base font-medium text-white hover:bg-purple-600/30 transition"
                  >
                    {link.text}
                    {openDropdown === link.text ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </button>

                  {/* Dropdown Items */}
                  {openDropdown === link.text && (
                    <div className="flex flex-col bg-purple-900/80">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="px-6 py-2 text-sm text-white hover:bg-purple-700/50 transition"
                          onClick={() => {
                            setOpenDropdown(null);
                            setIsMenuOpen(false);
                          }}
                        >
                          {child.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <motion.div
                  key={`mobile-${link.href}-${index}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link
                    to={link.href}
                    className="block px-4 py-3 text-base font-medium text-white hover:bg-purple-600/30 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Header;
