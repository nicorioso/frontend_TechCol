import { useState } from "react";
import { Send } from "lucide-react";

// components
import LoginForm from "../../../components/auth/login/form";

export function LoginLayout() {
  return (
    <>
      <main>
        {/* contenido */}
        <LoginForm/>
      </main>
    </>
  );
}

export default LoginLayout;