import React, { useEffect, useState } from 'react';

const Alert = ({ type = 'info', message, onClose, duration = 10000, closeable = true }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

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

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${styles[type]} rounded-lg shadow-lg px-6 py-4 flex items-center space-x-3 max-w-md`}>
        <span className="text-2xl">{icons[type]}</span>
        <p className="font-medium flex-1">{message}</p>
        {closeable && (
          <button
            onClick={handleClose}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none transition-colors"
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