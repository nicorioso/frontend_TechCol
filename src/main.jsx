import React from 'react'
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./routes"
import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";

try {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = storedTheme ? storedTheme === "dark" : prefersDark;
  document.documentElement.classList.toggle("dark", dark);
} catch {
  // Ignore storage access failures (private mode / blocked storage).
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
