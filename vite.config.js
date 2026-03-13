import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import { prerenderRoutes } from "./src/seo/prerender-routes";
import { SECURITY_HEADERS } from "./src/config/security";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const securityHeaders = isDev ? {} : SECURITY_HEADERS;

  return {
    plugins: [
      react(),
      vitePrerenderPlugin({
        renderTarget: "#root",
        prerenderScript: path.resolve(__dirname, "src/seo/prerender.js"),
        additionalPrerenderRoutes: prerenderRoutes,
      }),
    ],
    server: {
      hmr: true,
      open: true,
      headers: securityHeaders,
    },
    preview: {
      headers: securityHeaders,
    },
  };
});
