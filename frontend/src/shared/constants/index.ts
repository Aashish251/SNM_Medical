import {
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_REGISTER,
  ROUTE_FORGOT_PASSWORD,
  ROUTE_CONTACT,
  ROUTE_MS_ADMIN_DASHBOARD,
  ROUTE_MS_ADMIN_UPDATE_PROFILE,
  ROUTE_MS_ADMIN_DUTY_CHART,
  ROUTE_MS_ADMIN_MASTER_SEARCH,
  ROUTE_MS_ADMIN_DAILY_REPORT,
  ROUTE_MS_ADMIN_REGISTRATION_REPORT,
  ROUTE_MS_ADMIN_MASTER_REPORT,
  ROUTE_ADMIN_DASHBOARD,
} from "@app/router/routePaths";

export const SNM_SITE_LOGO_TITLE = "Medical Sewa";
export const SNM_SITE_META_TITLE = "Medical Sewa";
export const SNM_SITE_META_DESCRIPTION = "Providing compassionate healthcare services to under served communities.";
export const SNM_SITE_LOGO_DESCRIPTION = "Providing compassionate healthcare services to under served communities.";
export const SNM_SITE_LOGO_URL = "/img/snmlogo.svg";
export const SNM_SITE_ADDRESS = "Medical Selfless Service, Mumbai, Maharashtra 400074";
export const SNM_SITE_PHONE = "+91 8898209852";
export const SNM_SITE_EMAIL = "snmdispensary@gmail.com";

// Login Page
export const SNM_LOGIN_PAGE_TITLE = "Welcome to Medical Sewa";
export const SNM_LOGIN_PAGE_DNG = "Dhan Nirankar Ji";
export const SNM_LOGIN_PAGE_ADMIN_SUBTITLE = "Sign in to your Admin account."
export const SNM_LOGIN_PAGE_MEDICAL_STAFF_SUBTITLE = "Sign in to your Medical Staff account."
export const SNM_DONT_HAVE_ACCOUNT = "Don't have an account?"
export const SNM_LOGIN_LABEL_TITLE = "Sign Up / Registration"
export const SNM_MS_USERTYPE_LABEL = "Medical Staff"
export const SNM_ADMIN_USERTYPE_LABEL = "Admin"

// Home Page
export const HOME_ABOUT_PAGE_TITLE = "About Medical Sewa"
export const HOME_ABOUT_PAGE_CONTENT = "Providing compassionate healthcare services to underserved communities"
export const HOME_ABOUT_BUTTON_LABEL = "Learn More"
export const HOME_ABOUT_SECTION_TITLE = "Serving Humanity with Divine Inspiration";
export const HOME_ABOUT_SECTION_CONTENT = `Medical Sewa is a healthcare initiative dedicated to providing quality medical services to all sections of society. We strive to serve humanity with compassion and dedication.`;

// Contact Page
export const SNM_CONTACT_PAGE_HEADING = "Contact Us"
export const SNM_CONTACT_PAGE_SUBHEADING = "Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible."
export const SNM_CONTACT_PAGE_FORM_TITLE_LABEL = "Send Us a Message"
export const SNM_CONTACT_PAGE_FORM_SUCCESS_MESSAGE = "Thank you for your message! We'll get back to you soon."

{/** Routes and Labels start */ }
// User Type
export const SNM_ADMIN_USERTYPE = "admin"
export const SNM_MS_USERTYPE = "ms"
export const SNM_PUBLIC_USERTYPE = "all"

// Navigation Labels and Links
export const SNM_NAV_HOME_LABEL = "Home"
export const SNM_NAV_HOME_LINK = ROUTE_HOME
export const SNM_NAV_ABOUT_LABEL = "About"
export const SNM_NAV_ABOUT_LINK = "/about"
export const SNM_NAV_CONTACT_LABEL = "Contact"
export const SNM_NAV_CONTACT_LINK = ROUTE_CONTACT
export const SNM_NAV_GALLERY_LABEL = "Gallery"
export const SNM_NAV_GALLERY_LINK = "/gallery"
export const SNM_NAV_LOGIN_LABEL = "Login"
export const SNM_NAV_LOGIN_LINK = ROUTE_LOGIN
export const SNM_NAV_REGISTER_LABEL = "Register"
export const SNM_NAV_REGISTER_LINK = ROUTE_REGISTER
export const SNM_NAV_LOGOUT_LABEL = "Logout"
export const SNM_NAV_FORGOT_PASSWORD_LABEL = "Forget Password"
export const SNM_NAV_FORGOT_PASSWORD_LINK = ROUTE_FORGOT_PASSWORD

export const SNM_NAV_BLOOD_DONATION_LABEL = "Blood Donation"
export const SNM_NAV_BLOOD_DONATION_LINK = "/blood-donation"
export const SNM_NAV_FREE_HEALTH_CHECKUPS_LABEL = "Free Health Check-ups"
export const SNM_NAV_FREE_HEALTH_CHECKUPS_LINK = "/free-health-checkups"
export const SNM_NAV_PATIENT_REGISTRATION_LABEL = "Patient Registration"
export const SNM_NAV_PATIENT_REGISTRATION_LINK = "/patient-registration"

// Medical Staff Admin navigation (/ms-admin/*)
export const SNM_NAV_MS_DASHBOARD_LABEL = "Dashboard"
export const SNM_NAV_MS_DASHBOARD_LINK = ROUTE_MS_ADMIN_DASHBOARD
export const SNM_NAV_MS_UPDATE_PROFILE_LABEL = "Update Profile"
export const SNM_NAV_MS_UPDATE_PROFILE_LINK = ROUTE_MS_ADMIN_UPDATE_PROFILE
export const SNM_NAV_MS_MASTER_SEARCH_LABEL = "Master Search"
export const SNM_NAV_MS_MASTER_SEARCH_LINK = ROUTE_MS_ADMIN_MASTER_SEARCH
export const SNM_NAV_MS_DUTY_CHART_LABEL = "Duty Chart"
export const SNM_NAV_MS_DUTY_CHART_LINK = ROUTE_MS_ADMIN_DUTY_CHART
export const SNM_NAV_MS_REPORT_LABEL = "Report"
export const SNM_NAV_MS_DAILY_REPORT_LABEL = "Daily Report"
export const SNM_NAV_MS_DAILY_REPORT_LINK = ROUTE_MS_ADMIN_DAILY_REPORT
export const SNM_NAV_MS_REGISTRATION_REPORT_LABEL = "Registration Report"
export const SNM_NAV_MS_REGISTRATION_REPORT_LINK = ROUTE_MS_ADMIN_REGISTRATION_REPORT
export const SNM_NAV_MS_MASTER_REPORT_LABEL = "Master Report"
export const SNM_NAV_MS_MASTER_REPORT_LINK = ROUTE_MS_ADMIN_MASTER_REPORT

// Administrator portal default post-login route (/admin/*)
export const SNM_NAV_ADMIN_DASHBOARD_LINK = ROUTE_ADMIN_DASHBOARD

// Legacy aliases (backward compatibility for imports)
export const SNM_NAV_ADMIN_UPDATE_PROFILE_LABEL = SNM_NAV_MS_UPDATE_PROFILE_LABEL
export const SNM_NAV_ADMIN_UPDATE_PROFILE_LINK = SNM_NAV_MS_UPDATE_PROFILE_LINK
export const SNM_NAV_ADMIN_DASHBOARD_LABEL = SNM_NAV_MS_DASHBOARD_LABEL
export const SNM_NAV_ADMIN_MASTER_SEARCH_LABEL = SNM_NAV_MS_MASTER_SEARCH_LABEL
export const SNM_NAV_ADMIN_MASTER_SEARCH_LINK = SNM_NAV_MS_MASTER_SEARCH_LINK
export const SNM_NAV_ADMIN_DUTY_CHART_LABEL = SNM_NAV_MS_DUTY_CHART_LABEL
export const SNM_NAV_ADMIN_DUTY_CHART_LINK = SNM_NAV_MS_DUTY_CHART_LINK
export const SNM_NAV_ADMIN_REPORT_LABEL = SNM_NAV_MS_REPORT_LABEL
export const SNM_NAV_ADMIN_DAILY_REPORT_LABEL = SNM_NAV_MS_DAILY_REPORT_LABEL
export const SNM_NAV_ADMIN_DAILY_REPORT_LINK = SNM_NAV_MS_DAILY_REPORT_LINK
export const SNM_NAV_ADMIN_REGISTRATION_REPORT_LABEL = SNM_NAV_MS_REGISTRATION_REPORT_LABEL
export const SNM_NAV_ADMIN_REGISTRATION_REPORT_LINK = SNM_NAV_MS_REGISTRATION_REPORT_LINK
export const SNM_NAV_ADMIN_MASTER_REPORT_LABEL = SNM_NAV_MS_MASTER_REPORT_LABEL
export const SNM_NAV_ADMIN_MASTER_REPORT_LINK = SNM_NAV_MS_MASTER_REPORT_LINK

{/** Routes and Labels end */ }
