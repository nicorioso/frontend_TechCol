import Button from "../../IU/forms/button";
import { Input, InputLink } from "../../IU/forms/input";
import { LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import useLoginForm from "../../../hooks/auth/useLoginHook";
import { GoogleLogin } from "@react-oauth/google";
import VerifyCodeModal from "../../IU/modal/VerifyCodeModal";

export default function LoginForm() {
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
      content={
        <>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col items-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log("Google credential:", credentialResponse);
                }}
                onError={() => {
                  console.log("Login con Google fallo");
                }}
                width="100%"
              />
              <span className="mb-2 mt-2 text-sm text-gray-400">o ingresa con tu correo</span>
            </div>

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
              label="Correo electronico"
              placeholder="Ingresa tu correo electronico"
              value={formData.customerEmail}
              onChange={handleInputChange}
              disabled={loading}
              required
            />

            <InputLink
              type="password"
              name="customerPassword"
              label="Contrasena"
              pathname="/auth/passwordRecovery"
              placeholder="Ingresa tu contrasena"
              linkPlaceholder="Olvidaste tu contrasena?"
              value={formData.customerPassword}
              onChange={handleInputChange}
              disabled={loading}
              required
            />

            <Button variant="primary" size="sm" type="submit" disabled={loading}>
              {loading ? "Iniciando sesion..." : "Iniciar sesion"}
            </Button>
          </form>

          <VerifyCodeModal
            isOpen={verify.open}
            email={verify.email}
            originalPassword={verify.password}
            onClose={() => verify.setOpen(false)}
            onVerified={verify.onVerified}
          />

          <LabelLinkTo
            label="No tienes una cuenta?"
            linkPlaceholder="Registrate"
            pathname="/auth/register"
          />
        </>
      }
    />
  );
}
