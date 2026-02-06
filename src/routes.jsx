import { BrowserRouter, Navigate } from "react-router-dom";
import {createBrowserRouter} from "react-router-dom"
import App from "./App";

import LoginLayout from "./layouts/auth/login/login_form"
import RegisterLayout from "./layouts/auth/register/register_form"
// import PasswordRecovery from "./layouts/auth/passwordRecovery/password_recovery_form";
import UserProfile from "./components/dashboard/profile";

export const router = createBrowserRouter([
        {
                path: "/", element: <App/>
        },
        {
                path: "/auth",  
                children:[
                        { index: true, element: <Navigate to="login" replace /> },
                        {path: "login", element: <LoginLayout/>},
                        {path: "register", element: <RegisterLayout/>},
                        // {path: "passwordRecovery", element: <PasswordRecovery/>},
                ],  
        },
        {
                path: "/user",
                children:[
                        { index: true, element: <Navigate to="profile" replace /> },
                        {path: "profile", element: <UserProfile/>},
                ]
        }
])

