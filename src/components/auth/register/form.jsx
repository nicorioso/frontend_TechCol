import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../IU/forms/button";
import { Input } from "../../IU/forms/input";
import { LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import useRegister from "../../../hooks/auth/useRegisterHook";
import Alert from "../../IU/alerts/Alerts";
import { useNavigate } from "react-router-dom";
import { loginWithGoogleCredential } from "../../../services/auth/googleAuth";
import GoogleLoginConsent from "../GoogleLoginConsent";

export default function RegisterForm() {
  const navigate = useNavigate();
  const {
    formData,
    loading,
    handleInputChange,
    errorMessage,
    successMessage,
    registerCustomer,
  } = useRegister();

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [firstName, ...lastNameParts] = fullName.trim().split(/\s+/);
    const lastName = lastNameParts.join(" ");
    const payload = {
      ...formData,
      customerName: firstName || "",
      customerLastName: lastName || "",
    };

    if (payload.customerPassword !== payload.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    await registerCustomer(e, payload);
  };

  return (
    <CardForm
      title="TechCol"
      subtitle="Crea tu cuenta"
      content={
        <>
          {successMessage && <Alert type="success" message="Registro exitoso" />}

          {errorMessage && <Alert type="error" message={errorMessage} />}

          {passwordMismatch && <Alert type="error" message="Las contrasenas no coinciden" />}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="text"
              name="fullName"
              label="Nombre Completo"
              placeholder="Juan Perez"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />

            <Input
              type="email"
              name="customerEmail"
              label="Email"
              placeholder="tu@email.com"
              value={formData.customerEmail}
              onChange={handleInputChange}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Contrasena
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="customerPassword"
                  placeholder="********"
                  value={formData.customerPassword}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Confirmar Contrasena
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button variant="primary" size="md" type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>

            <p className="text-center text-sm text-gray-400">O continua con</p>

            <div className="flex justify-center">
              <GoogleLoginConsent
                buttonLabel="Habilitar registro con Google"
                onSuccess={(credentialResponse) => {
                  loginWithGoogleCredential(credentialResponse, navigate);
                }}
              />
            </div>
          </form>

          <LabelLinkTo
            label="¿Ya tienes cuenta?"
            linkPlaceholder="Inicia sesion aqui"
            pathname="/auth/login"
          />
        </>
      }
    />
  );
}
