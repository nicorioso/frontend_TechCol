import { useState } from "react";
import { Send } from "lucide-react";

import MainHeader from "../../../components/IU/headers/Main";
import LoginForm from "../../../components/auth/login/form";
import MainFooter from "../../../components/IU/footers/MainFooter";

function LoginLayout() {
  return (
    <>
      <main className="flex flex-col min-h-screen">
        <MainHeader/>
        <LoginForm/>
        <MainFooter/>
      </main>
    </>
  );
}

export default LoginLayout;