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
        : err?.response?.data?.message;

    if (status === 401 || status === 403) {
      return 'Correo o contrasena incorrectos.';
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  /**
   * Maneja cambios en inputs
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
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

    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      const response = await CustomerService.login(
        formData.customerEmail,
        formData.customerPassword
      );

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
    setError('');
    setSuccessMessage('');
  };

  return {
    formData,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleSubmit,
    resetForm,
    isAuthenticated: CustomerService.isAuthenticated(),
    verify: {
      open: verifyOpen,
      email: verifyEmail,
      password: verifyPassword,
      setOpen: setVerifyOpen,
      onVerified: handleVerified
    }
  };
};

export default useLoginForm;
