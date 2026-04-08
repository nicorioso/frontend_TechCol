import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, MailCheck, ShieldCheck, Smartphone } from "lucide-react";
import Button from "../../IU/forms/button";
import { Input } from "../../IU/forms/input";
import { LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import useRegister from "../../../hooks/auth/useRegisterHook";
import Alert from "../../IU/alerts/Alerts";
import { loginWithGoogleCredential } from "../../../services/auth/googleAuth";
import GoogleLoginConsent from "../GoogleLoginConsent";
import GooglePasswordSetupModal from "../../IU/modal/GooglePasswordSetupModal";
import RecaptchaCheckbox from "../../IU/forms/RecaptchaCheckbox";
import VerifyCodeModal from "../../IU/modal/VerifyCodeModal";

const CHANNELS = [
  {
    value: "EMAIL",
    label: "Correo electronico",
    shortLabel: "Correo",
    icon: MailCheck,
    description: "Recibiras el codigo de verificacion en tu correo.",
    placeholder: "tu@email.com",
  },
  {
    value: "SMS",
    label: "Numero de telefono",
    shortLabel: "SMS",
    icon: Smartphone,
    description: "Recibiras el codigo de verificacion por mensaje de texto.",
    placeholder: "+57 300 123 4567",
  },
];

export default function RegisterForm() {
  const navigate = useNavigate();
  const {
    formData,
    loading,
    handleInputChange,
    errorMessage,
    successMessage,
    registerCustomer,
    verify,
    recaptcha,
  } = useRegister();

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGooglePasswordModal, setShowGooglePasswordModal] = useState(false);

  const selectedChannel = CHANNELS.find((item) => item.value === formData.channel) || CHANNELS[0];

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    await registerCustomer(event, payload);
  };

  const handleVerified = () => {
    verify.complete();
    setFullName("");
    setPasswordMismatch(false);
    setTimeout(() => {
      navigate("/auth/login");
    }, 1200);
  };

  return (
    <CardForm
      title="TechCol"
      subtitle="Crea tu cuenta"
      content={
        <>
          <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              Registro con verificacion segura
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Completa tus datos, elige el canal para recibir el OTP y confirma tu cuenta antes de iniciar sesion.
            </p>
          </div>

          {successMessage && <Alert type="success" message={successMessage} />}
          {errorMessage && <Alert type="error" message={errorMessage} />}
          {passwordMismatch && <Alert type="error" message="Las contrasenas no coinciden" />}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Canal de verificacion
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
                      {channel.shortLabel}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedChannel.description}
              </p>
            </div>

            <Input
              type="text"
              name="fullName"
              label="Nombre completo"
              placeholder="Juan Perez"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />

            <Input
              type="email"
              name="customerEmail"
              label="Correo"
              placeholder="tu@email.com"
              value={formData.customerEmail}
              onChange={handleInputChange}
            />

            <Input
              type="tel"
              name="customerPhoneNumber"
              label="Telefono"
              placeholder={selectedChannel.placeholder}
              value={formData.customerPhoneNumber}
              onChange={handleInputChange}
              required={formData.channel === "SMS"}
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
                Confirmar contrasena
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

            <RecaptchaCheckbox
              onTokenChange={recaptcha.setToken}
              resetSignal={recaptcha.resetKey}
            />

            <Button variant="primary" size="md" type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Crear cuenta"}
            </Button>

            <p className="text-center text-sm text-gray-400">O continua con</p>

            <div className="flex justify-center">
              <GoogleLoginConsent
                buttonLabel="Habilitar registro con Google"
                onSuccess={async (credentialResponse) => {
                  const result = await loginWithGoogleCredential(credentialResponse, navigate);
                  if (result?.requiresPasswordSetup) {
                    setShowGooglePasswordModal(true);
                  }
                }}
              />
            </div>
          </form>

          <LabelLinkTo
            label="Ya tienes cuenta?"
            linkPlaceholder="Inicia sesion aqui"
            pathname="/auth/login"
          />

          <VerifyCodeModal
            isOpen={verify.open}
            identifier={verify.identifier}
            channel={verify.channel}
            onClose={() => verify.setOpen(false)}
            onVerified={handleVerified}
            onSubmitCode={verify.submitCode}
            onResendCode={verify.resendCode}
            title={verify.channel === "SMS" ? "Verifica tu telefono" : "Verifica tu correo"}
            descriptionPrefix={
              verify.channel === "SMS"
                ? "Enviamos tu codigo de activacion al numero"
                : "Enviamos tu codigo de activacion a"
            }
            submitLabel="Completar registro"
            backLabel="Volver al registro"
            resendRequiresRecaptcha
          />

          <GooglePasswordSetupModal
            isOpen={showGooglePasswordModal}
            onClose={() => setShowGooglePasswordModal(false)}
            onSuccess={() => navigate("/")}
          />
        </>
      }
    />
  );
}
