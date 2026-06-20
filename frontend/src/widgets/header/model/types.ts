import type { NavLink } from "@shared/types/NavLinksType";

export type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  userName?: string;
  handleLogout: () => void;
  isAuthenticated: boolean;
  openDropdown: string | null;
  loggedInUserDetailsId?: string | number;
  authUserType?: string;
  toggleDropdown: (menu: string) => void;
};

export type ProfileDropdownProps = {
  dashboardNav: NavLink[];
  authUserType?: string;
  userId?: string | number;
  onLogout: () => void;
};
