import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, MailCheck, ShieldCheck, Smartphone } from "lucide-react";
import Button from "../../IU/forms/button";
import { Input } from "../../IU/forms/input";
import { LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import useLoginForm from "../../../hooks/auth/useLoginHook";
import VerifyCodeModal from "../../IU/modal/VerifyCodeModal";
import { loginWithGoogleCredential } from "../../../services/auth/googleAuth";
import GoogleLoginConsent from "../GoogleLoginConsent";
import GooglePasswordSetupModal from "../../IU/modal/GooglePasswordSetupModal";
import RecaptchaCheckbox from "../../IU/forms/RecaptchaCheckbox";

const CHANNELS = [
  {
    value: "EMAIL",
    label: "Correo electronico",
    shortLabel: "Correo",
    icon: MailCheck,
    placeholder: "tu@email.com",
    inputLabel: "Correo",
    inputType: "email",
  },
  {
    value: "SMS",
    label: "Numero de telefono",
    shortLabel: "SMS",
    icon: Smartphone,
    placeholder: "+57 300 123 4567",
    inputLabel: "Telefono",
    inputType: "tel",
  },
];

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showGooglePasswordModal, setShowGooglePasswordModal] = useState(false);
  const {
    formData,
    step,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleSubmit,
    goBackToIdentifierStep,
    verify,
    recaptcha,
  } = useLoginForm();

  const selectedChannel = CHANNELS.find((item) => item.value === formData.channel) || CHANNELS[0];

  return (
    <CardForm
      title="TechCol"
      subtitle="Inicia sesion en tu cuenta"
      content={
        <>
          <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              Acceso seguro con verificacion OTP
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Elige si quieres autenticarte con correo o telefono. Luego validaremos un codigo enviado al canal seleccionado.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-600 dark:border-cyan-900/40 dark:bg-cyan-950/20 dark:text-slate-300">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <selectedChannel.icon className="h-4 w-4" />
                Acceso por {selectedChannel.label.toLowerCase()}
              </div>
              <p>
                {step === 1
                  ? "Primero valida el canal y el identificador de tu cuenta."
                  : "Ahora ingresa tu contrasena y confirma el acceso con el codigo OTP."}
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Metodo de autenticacion
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CHANNELS.map((channel) => {
                  const active = formData.channel === channel.value;
                  return (
                    <button
                      key={channel.value}
                      type="button"
                      disabled={loading || step === 2}
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
            </div>

            <Input
              type={selectedChannel.inputType}
              name="identifier"
              label={selectedChannel.inputLabel}
              placeholder={selectedChannel.placeholder}
              value={formData.identifier}
              onChange={handleInputChange}
              disabled={loading || step === 2}
              required
            />

            {step === 2 && (
              <>
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

                <div className="text-right">
                  <button
                    type="button"
                    onClick={goBackToIdentifierStep}
                    className="text-sm font-medium text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                  >
                    Cambiar {formData.channel === "EMAIL" ? "correo" : "telefono"}
                  </button>
                </div>

                <RecaptchaCheckbox
                  onTokenChange={recaptcha.setToken}
                  resetSignal={recaptcha.resetKey}
                />
              </>
            )}

            <Button variant="primary" size="md" type="submit" className="w-full" disabled={loading}>
              {loading ? "Validando..." : step === 1 ? "Continuar" : "Iniciar sesion"}
            </Button>

            {step === 1 && (
              <>
                <p className="text-center text-sm text-gray-400">O continua con</p>

                <div className="flex justify-center">
                  <GoogleLoginConsent
                    buttonLabel="Habilitar login con Google"
                    onSuccess={async (credentialResponse) => {
                      const result = await loginWithGoogleCredential(credentialResponse, navigate);
                      if (result?.requiresPasswordSetup) {
                        setShowGooglePasswordModal(true);
                      }
                    }}
                  />
                </div>
              </>
            )}
          </form>

          {step === 2 && (
            <div className="mt-4">
              <LabelLinkTo
                label="Olvidaste tu contrasena?"
                linkPlaceholder="Recuperala aqui"
                pathname="/auth/password-recovery"
              />
            </div>
          )}

          <VerifyCodeModal
            isOpen={verify.open}
            identifier={verify.identifier}
            channel={verify.channel}
            originalPassword={verify.password}
            onClose={() => verify.setOpen(false)}
            onVerified={verify.onVerified}
            title={verify.channel === "SMS" ? "Verifica tu telefono" : "Verifica tu correo"}
            descriptionPrefix={
              verify.channel === "SMS"
                ? "Enviamos un codigo de seguridad al numero"
                : "Enviamos un codigo de seguridad a"
            }
            resendRequiresRecaptcha
          />

          <LabelLinkTo
            label="No tienes cuenta?"
            linkPlaceholder="Registrate aqui"
            pathname="/auth/register"
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
