export const RECAPTCHA_SITE_KEY = String(import.meta.env.VITE_RECAPTCHA_SITE_KEY || "").trim();

export const RECAPTCHA_SCRIPT_ID = "google-recaptcha-script";
export const RECAPTCHA_SCRIPT_SRC = "https://www.google.com/recaptcha/api.js?render=explicit";
