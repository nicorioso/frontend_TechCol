import { useState } from "react";
import { Send } from "lucide-react";
import api from "../../../api/axios";

// components
import LoginForm from "../../../components/auth/login/form";

export function LoginLayout() {

  const [darkMode, setDarkMode] = useState(true);
  return (
<>
    <div className={darkMode ? "dark" : ""}>
      <button onClick={() => setDarkMode(!darkMode)}>
        Cambiar a {darkMode ? "claro" : "oscuro"}
      </button>

      <main className="bg-white dark:bg-gray-900 text-black dark:text-white">
        {/* contenido */}
        <LoginForm/>
      </main>
    </div>
</>
  );
}

export default LoginLayout;