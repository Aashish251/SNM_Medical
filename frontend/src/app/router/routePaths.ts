/**
 * Centralized route path definitions.
 * Single source of truth for all application routes.
 */

// ── Public ──────────────────────────────────────────────────────────────────
export const ROUTE_HOME = "/";
export const ROUTE_LOGIN = "/login";
export const ROUTE_REGISTER = "/register";
export const ROUTE_FORGOT_PASSWORD = "/forgot-password";
export const ROUTE_CONTACT = "/contact";
export const ROUTE_BLOOD_DONATION = "/blood-donation";
export const ROUTE_FREE_HEALTH_CHECKUPS = "/free-health-checkups";
export const ROUTE_PATIENT_REGISTRATION = "/patient-registration";

// ── Medical Staff Admin (header-nav experience at /ms-admin/*) ──────────────
export const ROUTE_MS_ADMIN_BASE = "/ms-admin";
export const ROUTE_MS_ADMIN_DASHBOARD = `${ROUTE_MS_ADMIN_BASE}/dashboard`;
export const ROUTE_MS_ADMIN_UPDATE_PROFILE = `${ROUTE_MS_ADMIN_BASE}/update-profile`;
export const ROUTE_MS_ADMIN_DUTY_CHART = `${ROUTE_MS_ADMIN_BASE}/duty-chart`;
export const ROUTE_MS_ADMIN_MASTER_SEARCH = `${ROUTE_MS_ADMIN_BASE}/master-search`;
export const ROUTE_MS_ADMIN_DAILY_REPORT = `${ROUTE_MS_ADMIN_BASE}/daily-report`;
export const ROUTE_MS_ADMIN_REGISTRATION_REPORT = `${ROUTE_MS_ADMIN_BASE}/registration-report`;
export const ROUTE_MS_ADMIN_MASTER_REPORT = `${ROUTE_MS_ADMIN_BASE}/master-report`;

// ── Administrator Portal (sidebar experience at /admin/*) ─────────────────
export const ROUTE_ADMIN_BASE = "/admin";
export const ROUTE_ADMIN_DASHBOARD = `${ROUTE_ADMIN_BASE}/dashboard`;
export const ROUTE_ADMIN_USERS = `${ROUTE_ADMIN_BASE}/users`;
export const ROUTE_ADMIN_REGISTRATION_REPORT = `${ROUTE_ADMIN_BASE}/registration-report`;
export const ROUTE_ADMIN_DAILY_REPORT = `${ROUTE_ADMIN_BASE}/daily-report`;
export const ROUTE_ADMIN_DUTY_CHART = `${ROUTE_ADMIN_BASE}/duty-chart`;
export const ROUTE_ADMIN_MASTER_SEARCH = `${ROUTE_ADMIN_BASE}/master-search`;
export const ROUTE_ADMIN_MASTER_REPORT = `${ROUTE_ADMIN_BASE}/master-report`;
export const ROUTE_ADMIN_FREE_HEALTH_CHECKUP = `${ROUTE_ADMIN_BASE}/free-health-checkup`;
export const ROUTE_ADMIN_BLOOD_DONATION = `${ROUTE_ADMIN_BASE}/blood-donation`;
export const ROUTE_ADMIN_PATIENTS = `${ROUTE_ADMIN_BASE}/patients`;
export const ROUTE_ADMIN_PROFILE = `${ROUTE_ADMIN_BASE}/profile`;

// ── Administrator Portal — Master sub-routes ──────────────────────────────
export const ROUTE_ADMIN_MASTER_BASE = `${ROUTE_ADMIN_BASE}/master`;
export const ROUTE_ADMIN_MASTER_CITY = `${ROUTE_ADMIN_MASTER_BASE}/city`;
export const ROUTE_ADMIN_MASTER_STATE = `${ROUTE_ADMIN_MASTER_BASE}/state`;
export const ROUTE_ADMIN_MASTER_QUALIFICATION = `${ROUTE_ADMIN_MASTER_BASE}/qualification`;
export const ROUTE_ADMIN_MASTER_DEPARTMENT = `${ROUTE_ADMIN_MASTER_BASE}/department`;
export const ROUTE_ADMIN_MASTER_AVAILABILITY = `${ROUTE_ADMIN_MASTER_BASE}/availability`;
export const ROUTE_ADMIN_MASTER_SHIFT_TIME = `${ROUTE_ADMIN_MASTER_BASE}/shift-time`;

// ── Legacy path redirects (backward compatibility) ────────────────────────────
/** @deprecated Use ROUTE_MS_ADMIN_* — redirects handled in legacyRedirectRoutes */
export const ROUTE_MS_BASE = "/ms";
export const ROUTE_MS_DASHBOARD = `${ROUTE_MS_BASE}/dashboard`;
export const ROUTE_MS_UPDATE_PROFILE = `${ROUTE_MS_BASE}/update-profile`;
