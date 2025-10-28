import { useState, useCallback } from 'react';

/**
 * Hook para manejar alertas
 */
const useAlert = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
  }, []);

  const showSuccess = useCallback((message) => {
    setAlert({ type: 'success', message });
  }, []);

  const showError = useCallback((message) => {
    setAlert({ type: 'error', message });
  }, []);

  const showWarning = useCallback((message) => {
    setAlert({ type: 'warning', message });
  }, []);

  const showInfo = useCallback((message) => {
    setAlert({ type: 'info', message });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return {
    alert,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert
  };
};

export default useAlert;
