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
import type { IconType } from "react-icons";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, } from "react-icons/fa";
import { LuStethoscope } from "react-icons/lu";
import { MdOutlineWaterDrop } from "react-icons/md";

type Service = { title: string; description: string; icon?: IconType };

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

export const services: Service[] = [
  {
    title: "Free Health Check-ups",
    description: "Community health camps & screenings for early detection.",
    icon: LuStethoscope,
  },
  {
    title: "Mega Blood Donation",
    description: "Regular blood drives supporting local hospitals.",
    icon: MdOutlineWaterDrop,
  },
];

export const SNMSocialMedia = [
  {
    id: 1,
    title: "facebook",
    link: "https://www.facebook.com/santnirankarimission",
    icon: FaFacebook,
  },
  {
    id: 2,
    title: "twitter",
    link: "https://x.com/santnirankari",
    icon: FaTwitter,
  },
  {
    id: 3,
    title: "instagram",
    link: "https://www.instagram.com/santnirankariofficial/",
    icon: FaInstagram,
  },
  {
    id: 4,
    title: "youtube",
    link: "https://www.youtube.com/user/SantNirankariMission",
    icon: FaYoutube,
  },
];


// export const 