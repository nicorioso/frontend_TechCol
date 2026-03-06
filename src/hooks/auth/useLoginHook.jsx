import { useState } from 'react';
import CustomerService from '../../services/customer/CustomerService';

/**
 * Hook para manejar lógica de login
 * Separación de responsabilidades (S - Single Responsibility)
 */
const useLoginForm = () => {
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
    setError(''); // Limpiar error al escribir
  };

  /**
   * Valida los datos del formulario
   */
  const validateForm = () => {
    if (!formData.customerEmail) {
      setError('El correo electrónico es requerido');
      return false;
    }

    if (!formData.customerPassword) {
      setError('La contraseña es requerida');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      setError('El correo electrónico no es válido');
      return false;
    }

    return true;
  };

  /**
   * Envía el login
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

      // Llamar al servicio
      const response = await CustomerService.login(
        formData.customerEmail,
        formData.customerPassword
      );

      // El backend envía un código al correo. Abrimos modal de verificación.
      setVerifyEmail(formData.customerEmail);
      setVerifyPassword(formData.customerPassword);
      setVerifyOpen(true);
      setSuccessMessage('Se ha enviado un código a tu correo.');
      // no limpiar la contraseña todavía, la usamos para reenvío
      // setFormData({ customerEmail: '', customerPassword: '' });

      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err?.message || 'Error al iniciar sesión';
      setError(errorMsg);
      console.error('Error en login:', err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = (res) => {
    setVerifyOpen(false);
    setSuccessMessage('¡Inicio de sesión confirmado!');
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
    // verification modal control
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

