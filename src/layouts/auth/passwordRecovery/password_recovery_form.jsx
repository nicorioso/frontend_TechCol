import { useState } from "react";
import { Send } from "lucide-react";
import api from "../../../api/axios";

// components
import PasswordRecovery from "../../../components/auth/passwordRecovery/form";

export function PasswordRecoveryLayout() {
  return (
    <>
      <main>
        {/* contenido */}
        <PasswordRecovery/>
      </main>
    </>
  );
}

export default PasswordRecoveryLayout;