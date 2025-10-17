import { useState } from "react";
import { Send } from "lucide-react";
import api from "../../../api/axios";

// components
import LoginForm from "../../../components/auth/login/form";

export function LoginLayout() {

  return (
    <LoginForm/>
  );
}

export default LoginForm;