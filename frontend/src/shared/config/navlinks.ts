import { NavLink } from "@shared/types/NavLinksType";
import {
  SNM_MS_USERTYPE,
  SNM_PUBLIC_USERTYPE,
  SNM_NAV_HOME_LABEL,
  SNM_NAV_HOME_LINK,
  SNM_NAV_ABOUT_LINK,
  SNM_NAV_CONTACT_LINK,
  SNM_NAV_CONTACT_LABEL,
  SNM_NAV_MS_UPDATE_PROFILE_LINK,
  SNM_NAV_MS_UPDATE_PROFILE_LABEL,
  SNM_NAV_MS_MASTER_SEARCH_LABEL,
  SNM_NAV_MS_MASTER_SEARCH_LINK,
  SNM_NAV_MS_DUTY_CHART_LABEL,
  SNM_NAV_MS_DUTY_CHART_LINK,
  SNM_NAV_MS_DAILY_REPORT_LABEL,
  SNM_NAV_MS_DAILY_REPORT_LINK,
  SNM_NAV_MS_REGISTRATION_REPORT_LABEL,
  SNM_NAV_MS_REGISTRATION_REPORT_LINK,
  SNM_NAV_MS_MASTER_REPORT_LABEL,
  SNM_NAV_MS_MASTER_REPORT_LINK,
  SNM_NAV_LOGIN_LINK,
  SNM_NAV_REGISTER_LINK,
  SNM_NAV_MS_REPORT_LABEL,
  SNM_NAV_MS_DASHBOARD_LINK,
  SNM_NAV_MS_DASHBOARD_LABEL,
  SNM_NAV_BLOOD_DONATION_LINK,
  SNM_NAV_FREE_HEALTH_CHECKUPS_LINK,
  SNM_NAV_FORGOT_PASSWORD_LINK,
} from "@shared/constants";

export const publicNav: NavLink[] = [
  {
    href: SNM_NAV_HOME_LINK,
    text: SNM_NAV_HOME_LABEL,
    type: SNM_PUBLIC_USERTYPE,
  },
  {
    href: SNM_NAV_CONTACT_LINK,
    text: SNM_NAV_CONTACT_LABEL,
    type: SNM_PUBLIC_USERTYPE,
  },
];

export const reportsNav: NavLink = {
  text: SNM_NAV_MS_REPORT_LABEL,
  type: SNM_MS_USERTYPE,
  children: [
    {
      href: SNM_NAV_MS_DAILY_REPORT_LINK,
      text: SNM_NAV_MS_DAILY_REPORT_LABEL,
      type: SNM_MS_USERTYPE,
    },
    {
      href: SNM_NAV_MS_REGISTRATION_REPORT_LINK,
      text: SNM_NAV_MS_REGISTRATION_REPORT_LABEL,
      type: SNM_MS_USERTYPE,
    },
    {
      href: SNM_NAV_MS_MASTER_REPORT_LINK,
      text: SNM_NAV_MS_MASTER_REPORT_LABEL,
      type: SNM_MS_USERTYPE,
    },
  ],
};

export const msNav: NavLink[] = [
  {
    href: SNM_NAV_MS_DASHBOARD_LINK,
    text: SNM_NAV_MS_DASHBOARD_LABEL,
    type: SNM_MS_USERTYPE,
  },
  {
    href: SNM_NAV_MS_UPDATE_PROFILE_LINK,
    text: SNM_NAV_MS_UPDATE_PROFILE_LABEL,
    type: SNM_MS_USERTYPE,
  },
  {
    href: SNM_NAV_MS_MASTER_SEARCH_LINK,
    text: SNM_NAV_MS_MASTER_SEARCH_LABEL,
    type: SNM_MS_USERTYPE,
  },
  {
    href: SNM_NAV_MS_DUTY_CHART_LINK,
    text: SNM_NAV_MS_DUTY_CHART_LABEL,
    type: SNM_MS_USERTYPE,
  },
  reportsNav,
];

const buildNavLinks = (): NavLink[] => [...publicNav, ...msNav];

export const navLinksByPage: Record<string, NavLink[]> = {
  [SNM_NAV_HOME_LINK]: buildNavLinks(),
  [SNM_NAV_ABOUT_LINK]: buildNavLinks(),
  [SNM_NAV_CONTACT_LINK]: buildNavLinks(),
  [SNM_NAV_BLOOD_DONATION_LINK]: buildNavLinks(),
  [SNM_NAV_FREE_HEALTH_CHECKUPS_LINK]: buildNavLinks(),
  [SNM_NAV_MS_DUTY_CHART_LINK]: buildNavLinks(),
  [SNM_NAV_LOGIN_LINK]: buildNavLinks(),
  [SNM_NAV_REGISTER_LINK]: buildNavLinks(),
  [SNM_NAV_FORGOT_PASSWORD_LINK]: buildNavLinks(),
};

/** Administrator users use sidebar navigation at /admin/* */
export const adminNav: NavLink[] = [];
