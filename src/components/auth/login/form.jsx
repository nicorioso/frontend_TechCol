import Button from "../../IU/forms/button";
import { Input } from "../../IU/forms/input";
import { LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import useLoginForm from "../../../hooks/auth/useLoginHook";
import VerifyCodeModal from "../../IU/modal/VerifyCodeModal";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogleCredential } from "../../../services/auth/googleAuth";
import GoogleLoginConsent from "../GoogleLoginConsent";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    formData,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleSubmit,
    verify,
  } = useLoginForm();

  return (
    <CardForm
      title="TechCol"
      subtitle="Inicia sesion en tu cuenta"
      content={
        <>
          <form className="space-y-4" onSubmit={handleSubmit}>

            {error && (
              <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                {successMessage}
              </div>
            )}

            <Input
              type="email"
              name="customerEmail"
              label="Email"
              placeholder="tu@email.com"
              value={formData.customerEmail}
              onChange={handleInputChange}
              disabled={loading}
              required
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
                  disabled={loading}
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

            <Button variant="primary" size="md" type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesion..." : "Iniciar sesion"}
            </Button>

            <p className="text-center text-sm text-gray-400">O continua con</p>

            <div className="flex justify-center">
              <GoogleLoginConsent
                buttonLabel="Habilitar login con Google"
                onSuccess={(credentialResponse) => {
                  loginWithGoogleCredential(credentialResponse, navigate);
                }}
              />
            </div>
          </form>

          <VerifyCodeModal
            isOpen={verify.open}
            email={verify.email}
            originalPassword={verify.password}
            onClose={() => verify.setOpen(false)}
            onVerified={verify.onVerified}
          />

          <LabelLinkTo
            label="No tienes cuenta?"
            linkPlaceholder="Registrate aqui"
            pathname="/auth/register"
          />
        </>
      }
    />
  );
}
