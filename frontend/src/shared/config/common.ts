import {
  DASHBOARD_BANNER1,
  DASHBOARD_BANNER2,
  DASHBOARD_BANNER3,
} from "@assets/index";
import {
  SNM_ADMIN_USERTYPE,
  SNM_MS_USERTYPE,
  SNM_NAV_ADMIN_UPDATE_PROFILE_LINK,
  SNM_NAV_MS_UPDATE_PROFILE_LINK,
} from "@shared/constants";

export const handleNavigate = (
  href: string,
  authUserType: string,
  loggedInUserId: string
) => {
  // console.log("href: ",href, authUserType, loggedInUserId, SNM_NAV_ADMIN_UPDATE_PROFILE_LINK,SNM_ADMIN_USERTYPE);
  if (
    href == SNM_NAV_ADMIN_UPDATE_PROFILE_LINK &&
    SNM_ADMIN_USERTYPE === authUserType
  ) {
    return `${SNM_NAV_ADMIN_UPDATE_PROFILE_LINK}/${loggedInUserId}`;
  } else if (
    href === SNM_NAV_MS_UPDATE_PROFILE_LINK &&
    SNM_MS_USERTYPE === authUserType
  ) {
    return `${SNM_NAV_MS_UPDATE_PROFILE_LINK}/${loggedInUserId}`;
  } else {
    return href;
  }
};

export const imagesDashBoard = [
  DASHBOARD_BANNER1,
  DASHBOARD_BANNER2,
  DASHBOARD_BANNER3,
];
