import { Link } from "react-router-dom";
import { SNM_WEBSITE_LOGO } from "@assets/index";
import {
  SNM_NAV_HOME_LINK,
  SNM_NAV_LOGIN_LABEL,
  SNM_NAV_LOGIN_LINK,
  SNM_SITE_LOGO_TITLE,
} from "@shared/constants";
import { publicNav } from "@shared/config/navlinks";
import { HeaderProfileDropdown } from "./HeaderProfileDropdown";
import type { NavLink } from "@shared/types/NavLinksType";

type HeaderShellProps = {
  scrolled: boolean;
  activeMenu: string | null;
  isAuthenticated: boolean;
  authUserType?: string;
  userName?: string;
  profilePic?: string;
  userId?: string | number;
  dashboardNav: NavLink[];
  onLogout: () => void;
  onOpenDrawer: () => void;
};

export function HeaderShell({
  scrolled,
  activeMenu,
  isAuthenticated,
  authUserType,
  userName,
  profilePic,
  userId,
  dashboardNav,
  onLogout,
  onOpenDrawer,
}: HeaderShellProps) {
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-to-right-theme-gradient shadow-lg py-4"
          : "bg-to-right-theme-gradient py-4"
      }`}
    >
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to={SNM_NAV_HOME_LINK} className="flex items-center gap-2 md:gap-4">
          <img
            src={SNM_WEBSITE_LOGO}
            alt={SNM_SITE_LOGO_TITLE}
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
          />
          <span className="text-xl colors-pro\im font-serif font-bold text-white">
            {SNM_SITE_LOGO_TITLE}
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {publicNav.map((link, index) => (
            <Link
              key={link.href ?? index}
              to={link.href ?? SNM_NAV_HOME_LINK}
              className={`px-4 py-2 text-white font-semibold ${
                activeMenu === link.href && "text-yellow-200"
              } hover:text-yellow-200 transition`}
            >
              {link.text}
            </Link>
          ))}

          {isAuthenticated && (
            <HeaderProfileDropdown
              dashboardNav={dashboardNav}
              authUserType={authUserType}
              userId={userId}
              userName={userName}
              profilePic={profilePic}
              onLogout={onLogout}
            />
          )}

          {!isAuthenticated && (
            <Link
              to={SNM_NAV_LOGIN_LINK}
              className="bg-white text-primary font-bold px-4 py-2 rounded-full shadow hover:bg-purple-100 transition"
            >
              {SNM_NAV_LOGIN_LABEL}
            </Link>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={onOpenDrawer}
            className="text-white focus:outline-none"
            aria-label="Open navigation menu"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
