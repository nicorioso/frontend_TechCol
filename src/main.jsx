import React from 'react'
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./routes"
import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="TU_CLIENT_ID_DE_GOOGLE">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
