import { useState } from "react";
import CustomerService from "../../services/customer/CustomerService";
import { normalizePhoneToE164 } from "../../utils/phone";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeIdentifier = (identifier, channel) => {
  if (String(channel || "").toUpperCase() === "SMS") {
    return normalizePhoneToE164(identifier, { defaultCountryCode: "+57" }) || "";
  }

  return String(identifier || "").trim().toLowerCase();
};

const useLoginForm = () => {
  const getLoginErrorMessage = (err) => {
    const status = err?.response?.status;
    const responseMessage =
      typeof err?.response?.data === "string"
        ? err.response.data
        : err?.response?.data?.message || err?.response?.data?.error;

    if (status === 429) {
      return responseMessage || "Demasiados intentos. Intenta de nuevo en un minuto.";
    }

    if (status === 403) {
      return responseMessage || "Captcha invalido o expirado. Marca de nuevo 'No soy un robot'.";
    }

    if (status === 401) {
      return responseMessage || "Correo, telefono o contrasena incorrectos.";
    }

    if (responseMessage) {
      return responseMessage;
    }

    return "Error al iniciar sesion";
  };

  const [formData, setFormData] = useState({
    channel: "EMAIL",
    identifier: "",
    customerPassword: "",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyIdentifier, setVerifyIdentifier] = useState("");
  const [verifyChannel, setVerifyChannel] = useState("EMAIL");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaResetKey, setRecaptchaResetKey] = useState(0);

  const resetRecaptcha = () => {
    setRecaptchaToken("");
    setRecaptchaResetKey((prev) => prev + 1);
  };

  const resetVerifyState = () => {
    setVerifyOpen(false);
    setVerifyIdentifier("");
    setVerifyChannel("EMAIL");
    setVerifyPassword("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      if (name === "channel") {
        return {
          channel: value,
          identifier: "",
          customerPassword: "",
        };
      }

      if (name === "identifier") {
        return {
          ...prev,
          identifier: value,
          customerPassword: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });

    if (name === "channel" || name === "identifier") {
      setStep(1);
      resetRecaptcha();
      resetVerifyState();
    }

    setError("");
    setSuccessMessage("");
  };

  const validateIdentifierStep = () => {
    if (!formData.identifier.trim()) {
      setError(
        formData.channel === "EMAIL"
          ? "El correo electronico es requerido."
          : "El numero de telefono es requerido."
      );
      return false;
    }

    if (formData.channel === "EMAIL" && !EMAIL_REGEX.test(formData.identifier.trim())) {
      setError("El correo electronico no es valido.");
      return false;
    }

    if (formData.channel === "SMS" && !normalizeIdentifier(formData.identifier, formData.channel)) {
      setError("Ingresa un telefono valido en formato internacional, ejemplo +573001234567.");
      return false;
    }

    return true;
  };

  const validateForm = () => {
    if (!validateIdentifierStep()) {
      return false;
    }

    if (!formData.customerPassword) {
      setError("La contrasena es requerida.");
      return false;
    }

    if (!recaptchaToken) {
      setError("Completa el reCAPTCHA para continuar.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    let shouldResetRecaptcha = false;

    try {
      if (step === 1) {
        if (!validateIdentifierStep()) {
          setLoading(false);
          return;
        }

        const accountCheck = await CustomerService.checkAccountExists(formData.identifier, formData.channel);
        if (!accountCheck?.exists) {
          setError(
            formData.channel === "EMAIL"
              ? "No existe una cuenta registrada con ese correo."
              : "No existe una cuenta registrada con ese telefono."
          );
          setLoading(false);
          return;
        }

        setStep(2);
        setSuccessMessage(
          formData.channel === "EMAIL"
            ? "Cuenta encontrada. Ahora ingresa tu contrasena."
            : "Telefono encontrado. Ahora ingresa tu contrasena."
        );
        setLoading(false);
        return { success: true, data: accountCheck };
      }

      if (!validateForm()) {
        setLoading(false);
        return;
      }

      await CustomerService.login(
        formData.identifier,
        formData.customerPassword,
        recaptchaToken,
        formData.channel
      );
      shouldResetRecaptcha = true;

      const normalized = normalizeIdentifier(formData.identifier, formData.channel) || formData.identifier.trim();
      setVerifyIdentifier(normalized);
      setVerifyChannel(formData.channel);
      setVerifyPassword(formData.customerPassword);
      setVerifyOpen(true);
      setSuccessMessage(
        formData.channel === "EMAIL"
          ? "Se ha enviado un codigo a tu correo."
          : "Se ha enviado un codigo a tu telefono."
      );

      return { success: true };
    } catch (err) {
      setError(getLoginErrorMessage(err));
      console.error("Error en login:", err);
      return { success: false, error: err };
    } finally {
      if (shouldResetRecaptcha) {
        resetRecaptcha();
      }
      setLoading(false);
    }
  };

  const handleVerified = () => {
    setVerifyOpen(false);
    setSuccessMessage("Inicio de sesion confirmado.");
    window.location.href = "/";
  };

  const resetForm = () => {
    setFormData({
      channel: "EMAIL",
      identifier: "",
      customerPassword: "",
    });
    setStep(1);
    setError("");
    setSuccessMessage("");
    resetVerifyState();
    resetRecaptcha();
  };

  const goBackToIdentifierStep = () => {
    setStep(1);
    setFormData((prev) => ({ ...prev, customerPassword: "" }));
    setError("");
    setSuccessMessage("");
    resetVerifyState();
    resetRecaptcha();
  };

  return {
    formData,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleSubmit,
    resetForm,
    step,
    goBackToIdentifierStep,
    isAuthenticated: CustomerService.isAuthenticated(),
    verify: {
      open: verifyOpen,
      identifier: verifyIdentifier,
      channel: verifyChannel,
      password: verifyPassword,
      setOpen: setVerifyOpen,
      onVerified: handleVerified,
    },
    recaptcha: {
      token: recaptchaToken,
      setToken: setRecaptchaToken,
      resetKey: recaptchaResetKey,
    },
  };
};

export default useLoginForm;
