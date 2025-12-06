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
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { LuStethoscope } from "react-icons/lu";
import { MdOutlineWaterDrop } from "react-icons/md";
import { City, FormValues } from "@shared/types/CommonType";

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

export const STEPS = [
  { id: 1, title: "Personal" },
  { id: 2, title: "Professional" },
  { id: 3, title: "Login" },
];

export const DUMMY = {
  availabilities: [
    { id: 1, label: "Pre-Samagam", value: "Pre-Samagam" },
    { id: 2, label: "First-Day", value: "First-Day" },
    { id: 3, label: "Second-Day", value: "Second-Day" },
    { id: 4, label: "Third-Day", value: "Third-Day" },
    { id: 5, label: "Fourth-Day", value: "Fourth-Day" },
    { id: 6, label: "Post-Samagam", value: "Post-Samagam" },
    { id: 7, label: "All-Day", value: "All-Day" },
  ],

  shifts: [
    {
      id: 1,
      label: "Morning - 8.00 AM to 4.00 PM",
      value: "Morning - 8.00 AM to 4.00 PM",
    },
    {
      id: 2,
      label: "Evening - 4.00 PM to 10.00 PM",
      value: "Evening - 4.00 PM to 10.00 PM",
    },
    {
      id: 3,
      label: "Night - 10.00 PM to 8.00 AM",
      value: "Night - 10.00 PM to 8.00 AM",
    },
    { id: 4, label: "All-Time", value: "All-Time" },
  ],

  titles: [
    { id: 1, label: "Mr.", value: "Mr" },
    { id: 2, label: "Mrs.", value: "Mrs" },
    { id: 3, label: "Ms.", value: "Ms" },
    { id: 4, label: "Dr.", value: "Dr" },
  ],
  genders: [
    { id: 1, label: "Male", value: "Male" },
    { id: 2, label: "Female", value: "Female" },
    { id: 3, label: "Other", value: "Other" },
  ],
};

export const requiredFields: Record<number, (keyof FormValues)[]> = {
  1: [
    "title",
    "fullName",
    "mobileNo",
    "gender",
    "email",
    "dateOfBirth",
    "address",
    "stateId",
    "cityId",
  ],
  2: ["qualificationId", "departmentId", "availability", "shift"],
  3: ["password", "confirmPassword"],
};
