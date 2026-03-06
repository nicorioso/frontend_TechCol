const SITE_URL = globalThis?.process?.env?.VITE_SITE_URL || "https://techcol.com";
const SITE_ORIGIN = (() => {
  try {
    return new URL(SITE_URL).origin;
  } catch {
    return "https://techcol.com";
  }
})();

const GOOGLE_ORIGINS = [
  "https://accounts.google.com",
  "https://apis.google.com",
  "https://*.gstatic.com",
];

const CLOUDINARY_ORIGINS = ["https://res.cloudinary.com"];

export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' ${GOOGLE_ORIGINS.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${CLOUDINARY_ORIGINS.join(" ")}`,
  `connect-src 'self' ${SITE_ORIGIN} ${GOOGLE_ORIGINS.join(" ")}`,
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
  "block-all-mixed-content",
].join("; ");

export const SECURITY_HEADERS = {
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy":
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()",
};
