import { emailPattern, fullMobilePattern as mobilePattern } from "@shared/lib/formValidation";
export { emailPattern, mobilePattern };

export const ANIM = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  pop: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 },
  },
};

export const SNM_NAV_FORGOT_PASSWORD_LABEL = "Forgot Password";
