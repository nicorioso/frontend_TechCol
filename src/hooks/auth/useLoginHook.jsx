import { useState } from 'react';
import CustomerService from '../../services/customer/CustomerService';

/**
 * Hook para manejar logica de login
 * Separacion de responsabilidades (S - Single Responsibility)
 */
const useLoginForm = () => {
  const getLoginErrorMessage = (err) => {
    const status = err?.response?.status;
    const responseMessage =
      typeof err?.response?.data === 'string'
        ? err.response.data
        : err?.response?.data?.message || err?.response?.data?.error;

    if (status === 429) {
      return responseMessage || 'Demasiados intentos. Intenta de nuevo en un minuto.';
    }

    if (status === 403) {
      return responseMessage || "Captcha invalido o expirado. Marca de nuevo 'No soy un robot'.";
    }

    if (status === 401) {
      return responseMessage || 'Correo o contrasena incorrectos.';
    }

    if (responseMessage) {
      return responseMessage;
    }

    return 'Error al iniciar sesion';
  };

  const [formData, setFormData] = useState({
    customerEmail: '',
    customerPassword: ''
  });
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [recaptchaResetKey, setRecaptchaResetKey] = useState(0);

  const resetRecaptcha = () => {
    setRecaptchaToken('');
    setRecaptchaResetKey((prev) => prev + 1);
  };

  /**
   * Maneja cambios en inputs
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => (name === 'customerEmail'
      ? { ...prev, customerEmail: value, customerPassword: '' }
      : { ...prev, [name]: value }));

    if (name === 'customerEmail') {
      setStep(1);
    }

    setError('');
  };

  const validateEmailStep = () => {
    if (!formData.customerEmail) {
      setError('El correo electronico es requerido');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      setError('El correo electronico no es valido');
      return false;
    }

    return true;
  };

  /**
   * Valida los datos del formulario
   */
  const validateForm = () => {
    if (!formData.customerEmail) {
      setError('El correo electronico es requerido');
      return false;
    }

    if (!formData.customerPassword) {
      setError('La contrasena es requerida');
      return false;
    }

    if (!recaptchaToken) {
      setError('Completa el reCAPTCHA para continuar.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      setError('El correo electronico no es valido');
      return false;
    }

    return true;
  };

  /**
   * Envia el login
   */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    let shouldResetRecaptcha = false;

    try {
      if (step === 1) {
        if (!validateEmailStep()) {
          setLoading(false);
          return;
        }

        const accountCheck = await CustomerService.checkAccountExists(formData.customerEmail);
        if (!accountCheck?.exists) {
          setError('No existe una cuenta registrada con ese correo.');
          setLoading(false);
          return;
        }

        setStep(2);
        setSuccessMessage('Cuenta encontrada. Ahora ingresa tu contrasena.');
        setLoading(false);
        return { success: true, data: accountCheck };
      }

      if (!validateForm()) {
        setLoading(false);
        return;
      }

      console.debug("Login submit:", {
        email: formData.customerEmail,
        hasRecaptchaToken: Boolean(recaptchaToken),
      });

      const response = await CustomerService.login(
        formData.customerEmail,
        formData.customerPassword,
        recaptchaToken
      );
      shouldResetRecaptcha = true;

      setVerifyEmail(formData.customerEmail);
      setVerifyPassword(formData.customerPassword);
      setVerifyOpen(true);
      setSuccessMessage('Se ha enviado un codigo a tu correo.');

      return { success: true, data: response };
    } catch (err) {
      const errorMsg = getLoginErrorMessage(err);
      setError(errorMsg);
      console.error('Error en login:', err);
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
    setSuccessMessage('Inicio de sesion confirmado.');
    window.location.href = '/';
  };

  const resetForm = () => {
    setFormData({ customerEmail: '', customerPassword: '' });
    setStep(1);
    setError('');
    setSuccessMessage('');
    resetRecaptcha();
  };

  const goBackToEmailStep = () => {
    setStep(1);
    setFormData(prev => ({ ...prev, customerPassword: '' }));
    setError('');
    setSuccessMessage('');
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
    goBackToEmailStep,
    isAuthenticated: CustomerService.isAuthenticated(),
    verify: {
      open: verifyOpen,
      email: verifyEmail,
      password: verifyPassword,
      setOpen: setVerifyOpen,
      onVerified: handleVerified
    },
    recaptcha: {
      token: recaptchaToken,
      setToken: setRecaptchaToken,
      resetKey: recaptchaResetKey
    }
  };
};

export default useLoginForm;
