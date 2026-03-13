import { useEffect, useState } from "react";
import {
  ALERT_DEFAULT_DURATION,
  ALERT_ICON_BY_TYPE,
  ALERT_STYLE_BY_TYPE,
} from "../../../constants/ui";

const resolveType = (value) => (value in ALERT_STYLE_BY_TYPE ? value : "info");

const Alert = ({
  type = "info",
  message,
  onClose,
  duration = ALERT_DEFAULT_DURATION,
  closeable = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const alertType = resolveType(type);

  useEffect(() => {
    setIsVisible(Boolean(message));
  }, [message, type]);

  useEffect(() => {
    if (!duration) return undefined;

    const timerId = window.setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => window.clearTimeout(timerId);
  }, [duration, onClose]);

  if (!isVisible || !message) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className="fixed right-4 top-4 z-50 animate-slide-in-right">
      <div
        role={alertType === "error" ? "alert" : "status"}
        aria-live={alertType === "error" ? "assertive" : "polite"}
        className={`${ALERT_STYLE_BY_TYPE[alertType]} flex max-w-md items-center space-x-3 rounded-lg px-6 py-4 shadow-lg`}
      >
        <span className="text-lg font-bold" aria-hidden="true">
          {ALERT_ICON_BY_TYPE[alertType]}
        </span>
        <p className="flex-1 font-medium">{message}</p>
        {closeable && (
          <button
            type="button"
            onClick={handleClose}
            className="ml-4 text-white transition-colors hover:text-gray-200 focus:outline-none"
            aria-label="Cerrar alerta"
          >
            <span className="text-2xl" aria-hidden="true">
              x
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
