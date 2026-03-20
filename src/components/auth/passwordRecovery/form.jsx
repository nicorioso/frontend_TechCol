import { useState } from "react";
import { Eye, EyeOff, MailCheck, ShieldCheck } from "lucide-react";
import Button from "../../IU/forms/button";
import { Input } from "../../IU/forms/input";
import { LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import VerifyCodeModal from "../../IU/modal/VerifyCodeModal";
import UserService from "../../../services/customer/UserService";

const getErrorMessage = (error, fallbackMessage) => {
  const dataMessage = typeof error?.response?.data === "string" ? error.response.data : "";
  return dataMessage || error?.message || fallbackMessage;
};

export default function PasswordRecovery() {
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const validateSendCode = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      setErrorMessage("El correo es obligatorio.");
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Ingresa un correo valido.");
      return false;
    }

    if (!formData.currentPassword) {
      setErrorMessage("Ingresa tu contrasena actual para validar la solicitud.");
      return false;
    }

    return true;
  };

  const validatePasswordChange = () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      setErrorMessage("Completa la nueva contrasena y su confirmacion.");
      return false;
    }

    if (formData.newPassword.length < 8) {
      setErrorMessage("La nueva contrasena debe tener al menos 8 caracteres.");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("La confirmacion no coincide con la nueva contrasena.");
      return false;
    }

    if (formData.newPassword === formData.currentPassword) {
      setErrorMessage("La nueva contrasena debe ser diferente a la actual.");
      return false;
    }

    if (!isCodeVerified) {
      setErrorMessage("Primero verifica el codigo enviado a tu correo.");
      return false;
    }

    return true;
  };

  const handleSendCode = async (event) => {
    event.preventDefault();
    setSuccessMessage("");

    if (!validateSendCode()) {
      return;
    }

    setLoading(true);
    try {
      await UserService.startPasswordChange(formData.email, formData.currentPassword);
      setVerifyOpen(true);
      setIsCodeVerified(false);
      setSuccessMessage("Enviamos un codigo de verificacion a tu correo.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "No se pudo iniciar la recuperacion de contrasena."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    await UserService.verifyPasswordChangeCode(formData.email, code);
  };

  const handleCodeVerified = () => {
    setIsCodeVerified(true);
    setErrorMessage("");
    setSuccessMessage("Codigo verificado. Ya puedes definir tu nueva contrasena.");
  };

  const handleResendCode = async () => {
    await UserService.startPasswordChange(formData.email, formData.currentPassword);
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setSuccessMessage("");

    if (!validatePasswordChange()) {
      return;
    }

    setLoading(true);
    try {
      await UserService.changePassword(formData.email, formData.newPassword);
      setSuccessMessage("Tu contrasena fue actualizada correctamente. Ya puedes iniciar sesion.");
      setErrorMessage("");
      setIsCodeVerified(false);
      setFormData({
        email: formData.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "No se pudo actualizar la contrasena."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardForm
        title="TechCol"
        subtitle="Recupera y actualiza tu contrasena"
        content={
          <>
            {errorMessage && (
              <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                {successMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSendCode}>
              <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-600 dark:border-cyan-900/40 dark:bg-cyan-950/20 dark:text-slate-300">
                <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <MailCheck className="h-4 w-4" />
                  Validacion por correo
                </div>
                <p>
                  Ingresa el correo de tu cuenta y confirma tu identidad para recibir un codigo de
                  verificacion.
                </p>
              </div>

              <Input
                type="email"
                name="email"
                label="Correo"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Contrasena actual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    placeholder="********"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button variant="secondary" size="md" type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando codigo..." : "Enviar codigo al correo"}
              </Button>
            </form>

            <form className="mt-6 space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700" onSubmit={handlePasswordChange}>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-slate-600 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-slate-300">
                <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <ShieldCheck className="h-4 w-4" />
                  Nueva contrasena
                </div>
                <p>
                  {isCodeVerified
                    ? "Tu correo ya fue verificado. Ahora define una nueva contrasena."
                    : "Despues de verificar el codigo, podras actualizar la contrasena de tu cuenta."}
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nueva contrasena
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Minimo 8 caracteres"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Confirmar nueva contrasena
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Repite tu nueva contrasena"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button variant="primary" size="md" type="submit" className="w-full" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar contrasena"}
              </Button>
            </form>

            <div className="mt-6">
              <LabelLinkTo
                label="Recordaste tu acceso?"
                linkPlaceholder="Volver a iniciar sesion"
                pathname="/auth/login"
              />
            </div>
          </>
        }
      />

      <VerifyCodeModal
        isOpen={verifyOpen}
        email={formData.email}
        onClose={() => setVerifyOpen(false)}
        onVerified={handleCodeVerified}
        onSubmitCode={handleVerifyCode}
        onResendCode={handleResendCode}
        title="Verifica tu correo"
        descriptionPrefix="Enviamos un codigo de seguridad a"
        submitLabel="Validar codigo"
        backLabel="Volver al formulario"
      />
    </>
  );
}
