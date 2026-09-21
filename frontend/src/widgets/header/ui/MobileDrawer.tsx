import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from "react-icons/io";
import {
  SNM_NAV_LOGIN_LABEL,
  SNM_NAV_LOGIN_LINK,
  SNM_NAV_LOGOUT_LABEL,
} from "@shared/constants";
import { handleNavigate } from "@shared/config/common";
import { Button } from "@shared/components/ui/button";
import type { MobileDrawerProps } from "../model/types";

export function MobileDrawer({
  isOpen,
  onClose,
  navLinks,
  userName,
  handleLogout,
  isAuthenticated,
  openDropdown,
  loggedInUserDetailsId,
  authUserType,
  toggleDropdown,
}: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-72 z-50 bg-to-bottom-theme-gradient text-white p-4 shadow-lg"
          >
            <div className="font-bold text-lg mb-4 flex justify-between w-full">
              <span className="text-white font-semibold transition capitalize">
                {userName && `${userName} Ji`}
              </span>
              <button onClick={onClose}>
                <IoMdClose className="text-[25px] cursor-pointer" />
              </button>
            </div>

            <div className="flex flex-col space-y-1">
              {navLinks.map((link, index) =>
                link.children && link.children.length > 0 ? (
                  <div key={link.text ?? index}>
                    <button
                      className="flex justify-between w-full px-4 py-3 text-left hover:bg-purple-600/30 transition"
                      onClick={() => toggleDropdown(link.text)}
                    >
                      {link.text}
                      {openDropdown === link.text ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </button>
                    {openDropdown === link.text && (
                      <div className="bg-purple-900/80 rounded-md">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href ?? "#"}
                            className="block px-6 py-2 text-sm hover:bg-purple-700/50 transition"
                            onClick={onClose}
                          >
                            {child.text}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href ?? index}
                    to={handleNavigate(
                      link.href ?? "",
                      authUserType,
                      loggedInUserDetailsId ? String(loggedInUserDetailsId) : ""
                    )}
                    className="block px-4 py-3 hover:bg-purple-600/30 transition"
                    onClick={onClose}
                  >
                    {link.text}
                  </Link>
                )
              )}
            </div>

            <div className="mt-4">
              {isAuthenticated ? (
                <Button
                  className="block w-full text-center bg-white text-primary py-2 rounded-full font-bold shadow hover:bg-purple-100 transition"
                  onClick={() => {
                    onClose();
                    handleLogout();
                  }}
                >
                  {SNM_NAV_LOGOUT_LABEL}
                </Button>
              ) : (
                <Link
                  to={SNM_NAV_LOGIN_LINK}
                  className="block w-full text-center bg-white text-primary py-2 rounded-full font-bold shadow hover:bg-purple-100 transition"
                  onClick={onClose}
                >
                  {SNM_NAV_LOGIN_LABEL}
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
