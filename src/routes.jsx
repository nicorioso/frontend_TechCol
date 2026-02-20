import { createBrowserRouter, Navigate } from "react-router-dom"
import App from "./App";

import LoginLayout from "./layouts/auth/login/login_form"
import RegisterLayout from "./layouts/auth/register/register_form"
// import PasswordRecovery from "./layouts/auth/passwordRecovery/password_recovery_form";
import UserProfile from "./components/dashboard/profile";
import UserSettings from "./layouts/dashboard/userSettings";

export const router = createBrowserRouter([
        {
                path: "/", element: <App/>
        },
        {
                path: "/auth/login", element: <LoginLayout/>
        },
        {
                path: "/auth/register", element: <RegisterLayout/>
        },
        {
                path: "/user/profile", element: <UserProfile/>
        },
        {
                path: "/user/settings", element: <UserSettings/>
        }
])

