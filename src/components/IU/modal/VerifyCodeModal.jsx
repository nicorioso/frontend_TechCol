import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import CustomerService from "../../../services/customer/CustomerService";
import RecaptchaCheckbox from "../forms/RecaptchaCheckbox";

const getVerifyErrorMessage = (err) => {
  const status = err?.response?.status;

  if (status === 403) {
    return "No autorizado para verificar. Reingresa y solicita un nuevo codigo.";
  }

  if (status === 401) {
    return "Sesion no valida. Inicia sesion de nuevo.";
  }

  if (status === 400) {
    return "Codigo invalido o expirado. Solicita uno nuevo.";
  }

  if (status === 429) {
    return "Demasiados intentos. Espera un minuto para volver a intentarlo.";
  }

  const dataMessage = typeof err?.response?.data === "string" ? err.response.data : "";
  return dataMessage || err?.message || "Codigo invalido";
};

export default function VerifyCodeModal({
  isOpen,
  email,
  channel,
  onClose,
  onVerified,
  originalPassword,
  onSubmitCode,
  onResendCode,
  title = "Verificacion",
  descriptionPrefix = "Hemos enviado un codigo de seguridad a",
  submitLabel = "Verificar Codigo",
  backLabel = "Volver al inicio de sesion",
  resendCooldownSeconds = 41,
  resendRequiresRecaptcha = false,
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(resendCooldownSeconds);
  const [error, setError] = useState("");
  const [resendRecaptchaToken, setResendRecaptchaToken] = useState("");
  const [resendRecaptchaResetKey, setResendRecaptchaResetKey] = useState(0);
  const inputRefs = useRef([]);

  const resetResendRecaptcha = () => {
    setResendRecaptchaToken("");
    setResendRecaptchaResetKey((prev) => prev + 1);
  };

  const contactValue = useMemo(() => String(email || "").trim(), [email]);
  const inferredChannel = useMemo(() => {
    if (channel) return channel;
    return contactValue.includes("@") ? "EMAIL" : "SMS";
  }, [channel, contactValue]);

  const maskedContact = useMemo(() => {
    if (!contactValue) return "****";

    if (inferredChannel === "EMAIL") {
      const atIndex = contactValue.indexOf("@");
      if (atIndex === -1) {
        if (contactValue.length <= 4) return `${contactValue}${"*".repeat(4)}`;
        return `${contactValue.slice(0, 4)}${"*".repeat(contactValue.length - 4)}`;
      }

      const localPart = contactValue.slice(0, atIndex);
      const domainPart = contactValue.slice(atIndex);
      if (localPart.length <= 4) {
        return `${localPart}${"*".repeat(4)}${domainPart}`;
      }

      return `${localPart.slice(0, 4)}****${localPart.slice(-1)}${domainPart}`;
    }

    const hasPlusPrefix = contactValue.startsWith("+");
    const digits = contactValue.replace(/\D/g, "");
    if (!digits) return "****";
    if (digits.length <= 4) return `${hasPlusPrefix ? "+" : ""}${digits}${"*".repeat(4)}`;

    const prefix = digits.slice(0, Math.min(3, Math.max(digits.length - 2, 1)));
    const suffix = digits.slice(-2);
    return `${hasPlusPrefix ? "+" : ""}${prefix}****${suffix}`;
  }, [contactValue, inferredChannel]);

  useEffect(() => {
    if (!isOpen) return;
    setCode("");
    setError("");
    setSecondsLeft(resendCooldownSeconds);
    setLoading(false);
    setResending(false);
    resetResendRecaptcha();
  }, [isOpen, resendCooldownSeconds]);

  useEffect(() => {
    if (!isOpen || secondsLeft <= 0) return;
    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [isOpen, secondsLeft]);

  if (!isOpen) return null;

  const updateCodeAt = (value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    if (code.length >= 6) return;

    const next = `${code}${digit}`;
    setCode(next);
    inputRefs.current[Math.min(next.length, 5)]?.focus();
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = code.slice(0, -1);
      setCode(next);
      inputRefs.current[Math.max(next.length, 0)]?.focus();
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedDigits) return;
    event.preventDefault();
    setCode(pastedDigits);
    const focusIndex = Math.min(pastedDigits.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (code.length !== 6) {
        setError("Ingresa los 6 digitos del codigo.");
        setLoading(false);
        return;
      }

      const res = onSubmitCode
        ? await onSubmitCode(code)
        : await CustomerService.verify(email, code);
      onVerified && onVerified(res);
      onClose && onClose();
    } catch (err) {
      console.error("Error verificando codigo:", err);
      setError(getVerifyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;

    try {
      if (!onResendCode && !originalPassword) {
        setError("No se puede reenviar sin la contrasena original");
        return;
      }

      if (resendRequiresRecaptcha && !resendRecaptchaToken) {
        setError("Completa el reCAPTCHA para reenviar el codigo.");
        return;
      }

      setResending(true);
      setError("");
      if (onResendCode) {
        await onResendCode(resendRecaptchaToken);
      } else {
        await CustomerService.login(email, originalPassword, resendRecaptchaToken);
      }
      setSecondsLeft(resendCooldownSeconds);
    } catch (err) {
      console.error("Error reenviando codigo:", err);
      setError(getVerifyErrorMessage(err));
    } finally {
      if (resendRequiresRecaptcha) {
        resetResendRecaptcha();
      }
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-slate-900 dark:bg-cyan-950/50 dark:text-cyan-200">
            <Shield className="h-4 w-4" />
          </div>
        </div>

        <h3 className="text-center text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-center text-lg text-slate-600 dark:text-slate-300">
          {descriptionPrefix}
          <span className="block font-semibold text-slate-900 dark:text-slate-100">{maskedContact}</span>
        </p>

        {error && (
          <div className="mt-4 rounded border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex items-center justify-center gap-3" onPaste={handlePaste}>
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={code[index] || ""}
                onChange={(e) => updateCodeAt(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                autoFocus={index === 0}
                className="h-12 w-10 rounded-lg border border-slate-300 bg-white text-center text-lg font-semibold text-slate-900 outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-700"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 px-6 py-3 text-xl font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Verificando..." : submitLabel}
          </button>

          <div className="flex items-center justify-center gap-3 text-base text-slate-500 dark:text-slate-400">
            <span>No recibiste el codigo?</span>
            {secondsLeft > 0 ? (
              <span className="font-semibold text-slate-700 dark:text-slate-200">Reenviar en {secondsLeft} s</span>
            ) : (
              <div className="space-y-3 text-center">
                {resendRequiresRecaptcha && (
                  <RecaptchaCheckbox
                    onTokenChange={setResendRecaptchaToken}
                    resetSignal={resendRecaptchaResetKey}
                    className="flex flex-col items-center"
                  />
                )}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="font-semibold text-cyan-600 transition hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-70 dark:text-cyan-400 dark:hover:text-cyan-300"
                >
                  {resending ? "Reenviando..." : "Reenviar codigo"}
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="mx-auto flex items-center gap-2 text-base text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </button>
          </div>

          <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-center text-xs text-cyan-900 dark:border-cyan-900/50 dark:bg-cyan-950/40 dark:text-cyan-100">
            El codigo se valida con informacion real enviada a tu {inferredChannel === "EMAIL" ? "correo" : "telefono"}.
          </div>

          {secondsLeft <= 0 && error && (
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Si el problema persiste, verifica tu correo y vuelve a solicitar el codigo.
            </div>
          )}

          <div className="hidden">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
