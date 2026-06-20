import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { signOut } from "@entities/session";
import {
  SNM_ADMIN_USERTYPE,
  SNM_NAV_HOME_LINK,
  SNM_NAV_LOGIN_LINK,
  SNM_PUBLIC_USERTYPE,
} from "@shared/constants";
import {
  adminNav,
  msNav,
  navLinksByPage,
} from "@shared/config/navlinks";
import type { NavLink } from "@shared/types/NavLinksType";

function filterNavByUserType(links: NavLink[], userType?: string): NavLink[] {
  return links
    .filter(
      (link) => link.type === userType || link.type === SNM_PUBLIC_USERTYPE
    )
    .map((link) => {
      if (!link.children) return link;
      return {
        ...link,
        children: link.children.filter(
          (child) =>
            child.type === userType || child.type === SNM_PUBLIC_USERTYPE
        ),
      };
    });
}

export function useHeaderNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector((state) => state.auth.isSignedIn);
  const authUserType = useAppSelector((state) => state.auth.userType);
  const loggedInUserDetails = useAppSelector((state) => state.auth.userDetails);

  const pathname = location.pathname;

  const filteredNavLinks = useMemo(() => {
    const rawNavLinks =
      navLinksByPage[pathname] || navLinksByPage[SNM_NAV_HOME_LINK];
    return filterNavByUserType(rawNavLinks, authUserType);
  }, [authUserType, pathname]);

  const filteredDashboardNav = useMemo(
    () => (authUserType === SNM_ADMIN_USERTYPE ? adminNav : msNav),
    [authUserType]
  );

  const toggleDropdown = useCallback((menu: string) => {
    setOpenDropdown((current) => (current === menu ? null : menu));
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(signOut());
    navigate(SNM_NAV_LOGIN_LINK);
  }, [dispatch, navigate]);

  useEffect(() => {
    setActiveMenu(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    scrolled,
    openDropdown,
    drawerOpen,
    setDrawerOpen,
    activeMenu,
    isAuthenticated,
    authUserType,
    loggedInUserDetails,
    filteredNavLinks,
    filteredDashboardNav,
    toggleDropdown,
    handleLogout,
  };
}
