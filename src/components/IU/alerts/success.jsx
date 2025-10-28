import React, { useEffect } from 'react';

/**
 * Componente de alerta tipo toast (flotante)
 */
const Alert = ({ type = 'info', message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${styles[type]} rounded-lg shadow-lg px-6 py-4 flex items-center space-x-3 max-w-md`}>
        <span className="text-2xl">{icons[type]}</span>
        <p className="font-medium flex-1">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            aria-label="Cerrar"
          >
            <span className="text-2xl">×</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
