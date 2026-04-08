import { useState } from "react";
import CustomerService from "../../services/customer/CustomerService";
import { getErrorMessage } from "../../services/errors/error_handler";
import { normalizePhoneToE164 } from "../../utils/phone";

const useRegister = () => {
  const initialFormData = {
    customerName: "",
    customerLastName: "",
    customerEmail: "",
    customerPassword: "",
    customerPhoneNumber: "",
    confirmPassword: "",
    channel: "EMAIL",
    roleId: 1,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaResetKey, setRecaptchaResetKey] = useState(0);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyIdentifier, setVerifyIdentifier] = useState("");
  const [verifyChannel, setVerifyChannel] = useState("EMAIL");

  const resetRecaptcha = () => {
    setRecaptchaToken("");
    setRecaptchaResetKey((prev) => prev + 1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const registerCustomer = async (event, payloadOverride = null) => {
    event?.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const source = payloadOverride || formData;
      const dataToSend = { ...source };
      delete dataToSend.confirmPassword;
      delete dataToSend.roleId;

      const normalizedChannel = String(dataToSend.channel || "EMAIL").toUpperCase();

      if (!recaptchaToken) {
        setErrorMessage("Completa el reCAPTCHA para continuar.");
        return { success: false, error: new Error("Missing reCAPTCHA token") };
      }

      if (normalizedChannel === "SMS" && !String(dataToSend.customerPhoneNumber || "").trim()) {
        setErrorMessage("El telefono es obligatorio cuando eliges verificacion por SMS.");
        return { success: false, error: new Error("Missing phone for SMS verification") };
      }

      if (dataToSend.customerPhoneNumber) {
        const normalizedPhone = normalizePhoneToE164(dataToSend.customerPhoneNumber, {
          defaultCountryCode: "+57",
        });
        if (!normalizedPhone) {
          setErrorMessage("El telefono debe estar en formato internacional E.164, ejemplo +573001234567.");
          return { success: false, error: new Error("Invalid phone format") };
        }
        dataToSend.customerPhoneNumber = normalizedPhone;
      }

      await CustomerService.register(dataToSend, recaptchaToken);

      setVerifyIdentifier(
        normalizedChannel === "SMS" ? dataToSend.customerPhoneNumber : String(dataToSend.customerEmail || "").trim().toLowerCase()
      );
      setVerifyChannel(normalizedChannel);
      setVerifyOpen(true);
      setSuccessMessage(
        normalizedChannel === "SMS"
          ? "Te enviamos un codigo de verificacion a tu telefono."
          : "Te enviamos un codigo de verificacion a tu correo."
      );
      resetRecaptcha();

      return { success: true };
    } catch (error) {
      const backendMessage =
        typeof error?.response?.data === "string"
          ? error.response.data
          : error?.response?.data?.message;
      const displayMessage = backendMessage || getErrorMessage(error?.response?.status) || error.message;
      setErrorMessage(displayMessage);

      console.error("Error capturado en hook:", error);
      resetRecaptcha();

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const verifyRegisterCode = async (code) => {
    return CustomerService.verifyRegister(verifyIdentifier, verifyChannel, code);
  };

  const resendRegisterCode = async (token = "") => {
    return CustomerService.resendRegisterCode(verifyIdentifier, verifyChannel, token);
  };

  const completeVerification = () => {
    setVerifyOpen(false);
    setFormData(initialFormData);
    setSuccessMessage("Cuenta verificada correctamente.");
    setErrorMessage("");
  };

  return {
    formData,
    loading,
    successMessage,
    errorMessage,
    handleInputChange,
    registerCustomer,
    setFormData,
    verify: {
      open: verifyOpen,
      identifier: verifyIdentifier,
      channel: verifyChannel,
      setOpen: setVerifyOpen,
      submitCode: verifyRegisterCode,
      resendCode: resendRegisterCode,
      complete: completeVerification,
    },
    recaptcha: {
      token: recaptchaToken,
      setToken: setRecaptchaToken,
      resetKey: recaptchaResetKey,
    },
  };
};

export default useRegister;
