import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, KeyRound, MailCheck, ShieldCheck, Smartphone } from "lucide-react";
import UserService from "../../services/customer/UserService";

const CHANNELS = [
  {
    value: "EMAIL",
    label: "Enviar codigo por correo",
    icon: MailCheck,
    emptyMessage: "Tu cuenta no tiene un correo disponible para este metodo.",
  },
  {
    value: "SMS",
    label: "Enviar codigo por SMS",
    icon: Smartphone,
    emptyMessage: "Agrega un telefono a tu perfil para usar verificacion por SMS.",
  },
];

const getApiMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data;
  const responseMessage =
    typeof responseData === "string"
      ? responseData
      : responseData?.message ||
        responseData?.error ||
        responseData?.errors?.find?.((item) => item?.message)?.message ||
        "";

  return responseMessage || error?.message || fallbackMessage;
};

const maskEmail = (value = "") => {
  const normalized = String(value || "").trim();
  if (!normalized) return "sin correo";

  const [localPart, domain = ""] = normalized.split("@");
  if (!domain) return normalized;
  if (localPart.length <= 2) return `${localPart}****@${domain}`;
  return `${localPart.slice(0, 2)}****${localPart.slice(-1)}@${domain}`;
};

const maskPhone = (value = "") => {
  const normalized = String(value || "").trim();
  if (!normalized) return "sin telefono";

  const hasPlus = normalized.startsWith("+");
  const digits = normalized.replace(/\D/g, "");
  if (!digits) return normalized;
  if (digits.length <= 4) return `${hasPlus ? "+" : ""}${digits}`;
  return `${hasPlus ? "+" : ""}${digits.slice(0, 3)}****${digits.slice(-2)}`;
};

const getPasswordChecks = (newPassword, confirmPassword) => [
  {
    id: "length",
    label: "Minimo 8 caracteres",
    valid: newPassword.length >= 8,
  },
  {
    id: "match",
    label: "Las contrasenas coinciden",
    valid: Boolean(confirmPassword) && newPassword === confirmPassword,
  },
];

export default function PasswordChangeFlow({
  email = "",
  phone = "",
  className = "",
  compact = false,
}) {
  const normalizedEmail = String(email || "").trim();
  const normalizedPhone = String(phone || "").trim();
  const [step, setStep] = useState("select");
  const [selectedChannel, setSelectedChannel] = useState("EMAIL");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const availableChannels = useMemo(
    () =>
      CHANNELS.map((channel) => ({
        ...channel,
        available: channel.value === "EMAIL" ? Boolean(normalizedEmail) : Boolean(normalizedPhone),
      })),
    [normalizedEmail, normalizedPhone]
  );

  const activeChannel =
    availableChannels.find((channel) => channel.value === selectedChannel) || availableChannels[0];
  const destinationLabel = selectedChannel === "SMS" ? maskPhone(normalizedPhone) : maskEmail(normalizedEmail);
  const passwordChecks = getPasswordChecks(newPassword, confirmPassword);

  useEffect(() => {
    if (activeChannel?.available) {
      return;
    }

    const fallbackChannel = availableChannels.find((channel) => channel.available);
    if (fallbackChannel) {
      setSelectedChannel(fallbackChannel.value);
    }
  }, [activeChannel?.available, availableChannels]);

  const resetFlow = () => {
    setStep("select");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setSelectedChannel("EMAIL");
    setSubmitting(false);
    setResending(false);
    setMessage({ type: "", text: "" });
  };

  const handleSelectChannel = (channelValue) => {
    setSelectedChannel(channelValue);
    setMessage({ type: "", text: "" });
  };

  const handleRequestCode = async (channelValue = selectedChannel) => {
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await UserService.requestAuthenticatedPasswordChange(channelValue);
      setSelectedChannel(channelValue);
      setStep("verify");
      setVerificationCode("");
      setMessage({
        type: "success",
        text:
          channelValue === "SMS"
            ? "Enviamos un codigo de verificacion a tu telefono."
            : "Enviamos un codigo de verificacion a tu correo.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiMessage(error, "No fue posible enviar el codigo de verificacion."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(verificationCode)) {
      setMessage({ type: "error", text: "Ingresa un codigo valido de 6 digitos." });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      await UserService.verifyAuthenticatedPasswordChange(selectedChannel, verificationCode);
      setStep("reset");
      setMessage({ type: "success", text: "Codigo verificado correctamente. Ya puedes definir tu nueva contrasena." });
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiMessage(error, "No fue posible validar el codigo."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setMessage({ type: "", text: "" });
    try {
      await UserService.requestAuthenticatedPasswordChange(selectedChannel);
      setVerificationCode("");
      setMessage({
        type: "success",
        text:
          selectedChannel === "SMS"
            ? "Te reenviamos el codigo por SMS."
            : "Te reenviamos el codigo por correo.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiMessage(error, "No fue posible reenviar el codigo."),
      });
    } finally {
      setResending(false);
    }
  };

  const handleConfirmPassword = async (event) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "La nueva contrasena debe tener al menos 8 caracteres." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "La confirmacion no coincide con la nueva contrasena." });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      await UserService.confirmAuthenticatedPasswordChange(newPassword);
      setStep("success");
      setVerificationCode("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage({ type: "success", text: "Tu contrasena fue actualizada correctamente." });
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiMessage(error, "No fue posible actualizar la contrasena."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const messageClassName =
    message.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
      : message.type === "error"
        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300";

  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 ${className}`}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-cyan-100 p-2 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
          <KeyRound className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Cambiar contrasena</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Verifica tu identidad por correo o SMS y actualiza tu contrasena sin salir del perfil.
          </p>
        </div>
      </div>

      <div className={`mb-5 grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"}`}>
        {[
          { id: "select", label: "1. Metodo" },
          { id: "verify", label: "2. Codigo" },
          { id: "reset", label: "3. Nueva contrasena" },
        ].map((item) => {
          const active = item.id === step || (step === "success" && item.id === "reset");
          const complete =
            (item.id === "select" && ["verify", "reset", "success"].includes(step)) ||
            (item.id === "verify" && ["reset", "success"].includes(step)) ||
            (item.id === "reset" && step === "success");

          return (
            <div
              key={item.id}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                complete
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : active
                    ? "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-300"
                    : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400"
              }`}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      {message.text ? (
        <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${messageClassName}`}>{message.text}</div>
      ) : null}

      {step === "select" ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            Elige el metodo de verificacion. Usaremos la informacion guardada en tu perfil, sin pedirla de nuevo.
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {availableChannels.map((channel) => {
              const Icon = channel.icon;
              const active = selectedChannel === channel.value;
              return (
                <button
                  key={channel.value}
                  type="button"
                  disabled={!channel.available || submitting}
                  onClick={() => handleSelectChannel(channel.value)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    active
                      ? "border-cyan-300 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950/20"
                      : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/30"
                  } ${!channel.available ? "cursor-not-allowed opacity-60" : "hover:border-cyan-300 hover:bg-slate-50 dark:hover:bg-slate-900/50"}`}
                >
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <Icon className="h-4 w-4" />
                    {channel.label}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {channel.available
                      ? channel.value === "SMS"
                        ? `Destino: ${maskPhone(normalizedPhone)}`
                        : `Destino: ${maskEmail(normalizedEmail)}`
                      : channel.emptyMessage}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleRequestCode(selectedChannel)}
            disabled={!activeChannel?.available || submitting}
            className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Enviando codigo..." : activeChannel?.label || "Enviar codigo"}
          </button>
        </div>
      ) : null}

      {step === "verify" ? (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/20 dark:text-cyan-200">
            Enviamos un codigo de 6 digitos a <strong>{destinationLabel}</strong>.
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Codigo de verificacion</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm tracking-[0.35em] text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
              placeholder="123456"
              required
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Validando..." : "Validar codigo"}
            </button>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {resending ? "Reenviando..." : "Reenviar codigo"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("select");
                setVerificationCode("");
                setMessage({ type: "", text: "" });
              }}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cambiar metodo
            </button>
          </div>
        </form>
      ) : null}

      {step === "reset" ? (
        <form onSubmit={handleConfirmPassword} className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200">
            Codigo validado. Ingresa tu nueva contrasena para completar el cambio.
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Nueva contrasena</label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              autoComplete="new-password"
              className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
              placeholder="Minimo 8 caracteres"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Confirmar contrasena</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              autoComplete="new-password"
              className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
              placeholder="Repite la nueva contrasena"
              required
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Validaciones</p>
            <div className="space-y-2">
              {passwordChecks.map((check) => (
                <div
                  key={check.id}
                  className={`flex items-center gap-2 text-sm ${
                    check.valid ? "text-emerald-700 dark:text-emerald-300" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {check.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Actualizando..." : "Actualizar contrasena"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("verify");
                setNewPassword("");
                setConfirmPassword("");
                setMessage({ type: "", text: "" });
              }}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Volver al codigo
            </button>
          </div>
        </form>
      ) : null}

      {step === "success" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200">
            <ShieldCheck className="h-5 w-5" />
            <div>
              <p className="font-semibold">Contrasena actualizada</p>
              <p className="text-sm">Tu cuenta ya tiene la nueva contrasena registrada.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetFlow}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Realizar otro cambio
          </button>
        </div>
      ) : null}
    </section>
  );
}
