import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, MailCheck, ShieldCheck, Smartphone } from "lucide-react";
import Button from "../../IU/forms/button";
import { Input } from "../../IU/forms/input";
import { LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import VerifyCodeModal from "../../IU/modal/VerifyCodeModal";
import UserService from "../../../services/customer/UserService";
import { normalizePhoneToE164 } from "../../../utils/phone";

const CHANNELS = [
  {
    value: "EMAIL",
    label: "Correo electronico",
    icon: MailCheck,
    placeholder: "tu@email.com",
    inputLabel: "Correo",
    inputType: "email",
  },
  {
    value: "SMS",
    label: "Numero de telefono",
    icon: Smartphone,
    placeholder: "+57 300 123 4567",
    inputLabel: "Telefono",
    inputType: "tel",
  },
];

const getErrorMessage = (error, fallbackMessage) => {
  const dataMessage = typeof error?.response?.data === "string" ? error.response.data : "";
  return dataMessage || error?.message || fallbackMessage;
};

export default function PasswordRecovery() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    channel: "EMAIL",
    identifier: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const selectedChannel = CHANNELS.find((item) => item.value === formData.channel) || CHANNELS[0];
  const canSendCode = formData.identifier.trim().length > 0 && !loading;
  const canUpdatePassword =
    !resetLoading &&
    passwordData.newPassword.length >= 8 &&
    passwordData.confirmPassword.length >= 8;

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "channel") {
      setVerifyOpen(false);
      setResetOpen(false);
      setFormData((prev) => ({
        ...prev,
        channel: value,
        identifier: prev.channel === value ? prev.identifier : "",
      }));
      setErrorMessage("");
      setSuccessMessage("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handlePasswordFieldChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setResetError("");
    setResetSuccess("");
  };

  const validateSendCode = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedPhone = normalizePhoneToE164(formData.identifier, { defaultCountryCode: "+57" });

    if (!formData.identifier.trim()) {
      setErrorMessage(formData.channel === "EMAIL" ? "El correo es obligatorio." : "El numero de telefono es obligatorio.");
      return false;
    }

    if (formData.channel === "EMAIL" && !emailRegex.test(formData.identifier)) {
      setErrorMessage("Ingresa un correo valido.");
      return false;
    }

    if (formData.channel === "SMS" && !normalizedPhone) {
      setErrorMessage("Ingresa un telefono valido en formato internacional, ejemplo +573001234567.");
      return false;
    }

    return true;
  };

  const validatePasswordChange = () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setResetError("Completa la nueva contrasena y su confirmacion.");
      return false;
    }

    if (passwordData.newPassword.length < 8) {
      setResetError("La nueva contrasena debe tener al menos 8 caracteres.");
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setResetError("La confirmacion no coincide con la nueva contrasena.");
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

    const normalizedIdentifier =
      formData.channel === "SMS"
        ? normalizePhoneToE164(formData.identifier, { defaultCountryCode: "+57" })
        : formData.identifier.trim();

    setLoading(true);
    try {
      await UserService.requestPasswordRecovery(normalizedIdentifier, formData.channel);
      setVerifyOpen(true);
      setResetOpen(false);
      setSuccessMessage(
        formData.channel === "EMAIL"
          ? "Enviamos un codigo de verificacion a tu correo."
          : "Enviamos un codigo de verificacion a tu telefono."
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "No se pudo iniciar la recuperacion de contrasena."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    const normalizedIdentifier =
      formData.channel === "SMS"
        ? normalizePhoneToE164(formData.identifier, { defaultCountryCode: "+57" })
        : formData.identifier.trim();
    await UserService.verifyPasswordRecoveryCodeByChannel(normalizedIdentifier, formData.channel, code);
  };

  const handleCodeVerified = () => {
    setVerifyOpen(false);
    setResetOpen(true);
    setResetError("");
    setResetSuccess("");
    setErrorMessage("");
    setSuccessMessage("Codigo verificado correctamente.");
  };

  const handleResendCode = async () => {
    const normalizedIdentifier =
      formData.channel === "SMS"
        ? normalizePhoneToE164(formData.identifier, { defaultCountryCode: "+57" })
        : formData.identifier.trim();
    await UserService.requestPasswordRecovery(normalizedIdentifier, formData.channel);
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setResetSuccess("");
    setResetError("");

    if (!validatePasswordChange()) {
      return;
    }

    setResetLoading(true);
    try {
      const normalizedIdentifier =
        formData.channel === "SMS"
          ? normalizePhoneToE164(formData.identifier, { defaultCountryCode: "+57" })
          : formData.identifier.trim();
      await UserService.resetPasswordByRecovery(normalizedIdentifier, formData.channel, passwordData.newPassword);
      setResetSuccess("Contrasena actualizada correctamente. Redirigiendo al login...");
      setTimeout(() => {
        navigate("/auth/login");
      }, 1200);
    } catch (error) {
      setResetError(getErrorMessage(error, "No se pudo actualizar la contrasena."));
    } finally {
      setResetLoading(false);
    }
  };

  useEffect(() => {
    if (!resetOpen) {
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setResetError("");
      setResetSuccess("");
    }
  }, [resetOpen]);

  return (
    <>
      <CardForm
        title="TechCol"
        subtitle="Recupera y actualiza tu contrasena"
        content={
          <>
            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                Recuperacion segura en 2 pasos
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                1. Elige el canal de verificacion y solicita tu codigo. 2. Verifica el codigo y define tu nueva contrasena.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status" aria-live="polite">
                {successMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSendCode}>
              <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-600 dark:border-cyan-900/40 dark:bg-cyan-950/20 dark:text-slate-300">
                <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <selectedChannel.icon className="h-4 w-4" />
                  Validacion por {formData.channel === "EMAIL" ? "correo" : "telefono"}
                </div>
                <p>
                  Selecciona el canal de recuperacion. Te enviaremos un codigo para confirmar tu identidad.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Metodo de verificacion
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CHANNELS.map((channel) => {
                    const active = formData.channel === channel.value;
                    return (
                      <button
                        key={channel.value}
                        type="button"
                        disabled={loading}
                        onClick={() => handleInputChange({ target: { name: "channel", value: channel.value } })}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          active
                            ? "border-cyan-400 bg-cyan-50 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200"
                            : "border-slate-300 bg-white text-slate-600 hover:border-cyan-300 hover:bg-slate-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-cyan-800"
                        }`}
                      >
                        <channel.icon className="h-4 w-4" />
                        {channel.value === "EMAIL" ? "Correo" : "SMS"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Input
                type={selectedChannel.inputType}
                name="identifier"
                label={selectedChannel.inputLabel}
                placeholder={selectedChannel.placeholder}
                value={formData.identifier}
                onChange={handleInputChange}
                disabled={loading}
                required
              />

              <Button variant="secondary" size="md" type="submit" className="w-full" disabled={!canSendCode}>
                {loading
                  ? "Enviando codigo..."
                  : `Enviar codigo por ${formData.channel === "EMAIL" ? "correo" : "SMS"}`}
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
        email={
          formData.channel === "SMS"
            ? normalizePhoneToE164(formData.identifier, { defaultCountryCode: "+57" }) || formData.identifier
            : formData.identifier
        }
        channel={formData.channel}
        onClose={() => setVerifyOpen(false)}
        onVerified={handleCodeVerified}
        onSubmitCode={handleVerifyCode}
        onResendCode={handleResendCode}
        title={formData.channel === "EMAIL" ? "Verifica tu correo" : "Verifica tu telefono"}
        descriptionPrefix={formData.channel === "EMAIL" ? "Enviamos un codigo de seguridad a" : "Enviamos un codigo de seguridad al numero"}
        submitLabel="Validar codigo"
        backLabel="Volver al formulario"
      />

      {resetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
              Nueva contrasena
            </h3>
            <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
              Codigo verificado. Define una nueva contrasena para tu cuenta.
            </p>

            {resetError && (
              <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status" aria-live="polite">
                {resetSuccess}
              </div>
            )}

            <form className="mt-5 space-y-4" onSubmit={handlePasswordChange}>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nueva contrasena
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Minimo 8 caracteres"
                    value={passwordData.newPassword}
                    onChange={handlePasswordFieldChange}
                    disabled={resetLoading}
                    minLength={8}
                    autoComplete="new-password"
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
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordFieldChange}
                    disabled={resetLoading}
                    minLength={8}
                    autoComplete="new-password"
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

              <Button variant="primary" size="md" type="submit" className="w-full" disabled={!canUpdatePassword}>
                {resetLoading ? "Actualizando..." : "Actualizar contrasena"}
              </Button>

              <button
                type="button"
                onClick={() => setResetOpen(false)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                disabled={resetLoading}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
