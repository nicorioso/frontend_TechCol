const apiTimeout = 0;
const defaultApiBaseURL = import.meta.env.DEV ? "http://localhost:8080/api" : "/api";
const defaultAnalyticsBaseURL = import.meta.env.DEV
  ? "http://127.0.0.1:8000"
  : "/analytics";

export const API_URL =
  import.meta.env.VITE_API_URL || import.meta.env.API_URL || defaultApiBaseURL;
export const ANALYTICS_API_URL =
  import.meta.env.VITE_ANALYTICS_API_URL ||
  import.meta.env.ANALYTICS_API_URL ||
  defaultAnalyticsBaseURL;

const config = Object.freeze({
  api: {
    baseURL: API_URL,
    // In production Railway serves the SPA and proxies /api to the backend service.
    timeout: apiTimeout,
  },
  analytics: {
    baseURL: ANALYTICS_API_URL,
    timeout: apiTimeout,
  },
  // Path where uploaded files are served from, relative to baseURL host.
  uploadsPath:
    import.meta.env.VITE_UPLOADS_PATH ||
    import.meta.env.UPLOADS_PATH ||
    "/uploads/products",
  environment: import.meta.env.MODE || "development",
  debug: String(import.meta.env.VITE_DEBUG || import.meta.env.DEBUG || "").toLowerCase() === "true",
});

if (config.debug) {
  console.log("Config loaded:", config);
}

export default config;
