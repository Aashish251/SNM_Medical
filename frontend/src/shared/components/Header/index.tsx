import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@app/store";
import { DEFAULT_PROFILE_IMAGE, SNM_WEBSITE_LOGO } from "@assets/index";
import {
  SNM_ADMIN_USERTYPE,
  SNM_NAV_HOME_LINK,
  SNM_NAV_LOGIN_LABEL,
  SNM_NAV_LOGIN_LINK,
  SNM_NAV_LOGOUT_LABEL,
  SNM_PUBLIC_USERTYPE,
  SNM_SITE_LOGO_TITLE,
} from "@shared/constants/index.constant";
import {
  adminNav,
  msNav,
  navLinksByPage,
  publicNav,
} from "@shared/config/navlinks";
import { Button } from "../ui/button";
import { signOut } from "@features/login/redux/authSlice";

// ✅ Shadcn Components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { handleNavigate } from "@shared/config/common";

// ✅ Mobile Drawer remains unchanged
const MobileDrawer = ({
  isOpen,
  onClose,
  navLinks,
  userName,
  handleLogout,
  isAuthenticated,
  openDropdown,
  loggedInUserDetailesId,
  toggleDropdown,
}: any) => {
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
            className="fixed right-0 top-0 h-full w-72 z-50 bg-gradient-to-b from-purple-800 to-pink-700 text-white p-4 shadow-lg"
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
              {navLinks.map((link: any, index: number) =>
                link.children && link.children.length > 0 ? (
                  <div key={index}>
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
                        {link.children.map((child: any) => (
                          <Link
                            key={child.href}
                            to={child.href}
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
                    key={index}
                    to={handleNavigate(
                      link.href,
                      isAuthenticated,
                      loggedInUserDetailesId
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
                  className="block w-full text-center bg-white text-purple-700 py-2 rounded-full font-bold shadow hover:bg-purple-100 transition"
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
                  className="block w-full text-center bg-white text-purple-700 py-2 rounded-full font-bold shadow hover:bg-purple-100 transition"
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
};

// ✅ Header with Shadcn Profile Dropdown
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isSignedIn
  );
  const authUserType = useSelector((state: RootState) => state.auth.userType);
  const loggedInUserDetails = useSelector(
    (state: RootState) => state.auth.userDetails
  );

  const rawNavLinks =
    navLinksByPage[pathname] || navLinksByPage[SNM_NAV_HOME_LINK];

  const filteredNavLinks = rawNavLinks
    .filter(
      (link) => link.type === authUserType || link.type === SNM_PUBLIC_USERTYPE
    )
    .map((link) => {
      if (link.children) {
        const filteredChildren = link.children.filter(
          (child) =>
            child.type === authUserType || child.type === SNM_PUBLIC_USERTYPE
        );
        return { ...link, children: filteredChildren };
      }
      return link;
    });

  const filteredDashboardNav =
    authUserType === SNM_ADMIN_USERTYPE ? adminNav : msNav;

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLogout = () => {
    dispatch(signOut());
    navigate(SNM_NAV_LOGIN_LINK);
  };

  useEffect(() => {
    setActiveMenu(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 shadow-lg py-4"
            : "bg-gradient-to-r from-purple-700/90 via-pink-500/90 to-yellow-400/90 py-4"
        }`}
      >
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Logo */}
          <div className="flex items-center gap-2 md:gap-4">
            <img
              src={SNM_WEBSITE_LOGO}
              alt={SNM_SITE_LOGO_TITLE}
              className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
            />
            <Link
              to={SNM_NAV_HOME_LINK}
              className="text-xl colors-pro\im font-serif font-bold text-white"
            >
              {SNM_SITE_LOGO_TITLE}
            </Link>
          </div>

          {/* ✅ Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {publicNav.map((link: any, index: number) => (
              <Link
                key={index}
                to={link.href}
                className={`px-4 py-2 text-white font-semibold ${
                  activeMenu === link.href && "text-yellow-200"
                } hover:text-yellow-200 transition`}
              >
                {link.text}
              </Link>
            ))}

            {/* ✅ Profile Dropdown (Shadcn UI) */}
            {isAuthenticated && (
              <>
                <span className=" py-2 text-white font-semibold transition capitalize">
                  {loggedInUserDetails?.name &&
                    `Welcome ${loggedInUserDetails?.name} Ji`}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="w-10 h-10 ring-2 ring-white cursor-pointer">
                        <AvatarImage
                          src={loggedInUserDetails?.name && DEFAULT_PROFILE_IMAGE}
                          alt="User Avatar"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-48 mt-2 bg-gradient-to-b from-purple-800 to-pink-700 text-white shadow-lg rounded-md font-semibold transition">
                    {filteredDashboardNav.map((link) => {
                      if (link.children && link.children.length > 0) {
                        return (
                          <DropdownMenuSub key={link.text}>
                            <DropdownMenuSubTrigger
                              className="hover:text-black data-[state=open]:bg-white 
              data-[state=open]:text-black"
                            >
                              {link.text}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="w-48 mt-2 bg-gradient-to-b from-purple-800 to-pink-700 text-white shadow-lg rounded-md font-semibold transition">
                                {link.children.map((child) => (
                                  <DropdownMenuItem
                                    key={child.href}
                                    onClick={() => navigate(child.href)}
                                  >
                                    {child.text}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        );
                      } else {
                        return (
                          <DropdownMenuItem
                            key={link.href}
                            onClick={() =>
                              navigate(
                                handleNavigate(
                                  link.href,
                                  authUserType,
                                  loggedInUserDetails.id
                                )
                              )
                            }
                          >
                            {link.text}
                          </DropdownMenuItem>
                        );
                      }
                    })}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!isAuthenticated && (
              <Link
                to={SNM_NAV_LOGIN_LINK}
                className="bg-white text-purple-700 font-bold px-4 py-2 rounded-full shadow hover:bg-purple-100 transition"
              >
                {SNM_NAV_LOGIN_LABEL}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-white focus:outline-none"
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

      {/* ✅ Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        isAuthenticated={isAuthenticated}
        onClose={() => setDrawerOpen(false)}
        handleLogout={handleLogout}
        navLinks={filteredNavLinks}
        userName={loggedInUserDetails?.name}
        openDropdown={openDropdown}
        loggedInUserDetailesId={loggedInUserDetails?.id}
        toggleDropdown={toggleDropdown}
      />
    </>
  );
};

export default Header;
