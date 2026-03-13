const apiTimeout = 0;
const defaultApiBaseURL = import.meta.env.DEV ? "http://localhost:8080/api" : "/api";

export const API_URL = import.meta.env.VITE_API_URL || defaultApiBaseURL;

const config = Object.freeze({
  api: {
    baseURL: API_URL,
    // 0 means no timeout in Axios.
    timeout: apiTimeout,
  },
  // Path where uploaded files are served from, relative to baseURL host.
  uploadsPath: import.meta.env.VITE_UPLOADS_PATH || "/uploads/products",
  environment: import.meta.env.MODE || "development",
  debug: import.meta.env.VITE_DEBUG === "true",
});

if (config.debug) {
  console.log("Config loaded:", config);
}

export default config;
