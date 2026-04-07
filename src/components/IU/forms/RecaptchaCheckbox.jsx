import { useEffect, useRef, useState } from "react";
import {
  RECAPTCHA_SCRIPT_ID,
  RECAPTCHA_SCRIPT_SRC,
  RECAPTCHA_SITE_KEY,
} from "../../../config/recaptcha";

const getRecaptchaTheme = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const loadRecaptchaScript = () => {
  if (!RECAPTCHA_SITE_KEY) {
    return Promise.reject(
      new Error(
        "reCAPTCHA no esta configurado. Define VITE_RECAPTCHA_SITE_KEY o RECAPTCHA_SITE_KEY en el frontend."
      )
    );
  }

  if (window.grecaptcha?.render) {
    return Promise.resolve(window.grecaptcha);
  }

  if (window.__techcolRecaptchaPromise) {
    return window.__techcolRecaptchaPromise;
  }

  window.__techcolRecaptchaPromise = new Promise((resolve, reject) => {
    let script = document.getElementById(RECAPTCHA_SCRIPT_ID);

    const handleLoad = () => {
      if (window.grecaptcha?.render) {
        resolve(window.grecaptcha);
        return;
      }

      reject(new Error("reCAPTCHA no se cargo correctamente."));
    };

    const handleError = () => reject(new Error("No fue posible cargar reCAPTCHA."));

    if (!script) {
      script = document.createElement("script");
      script.id = RECAPTCHA_SCRIPT_ID;
      script.src = RECAPTCHA_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
  });

  return window.__techcolRecaptchaPromise;
};

export default function RecaptchaCheckbox({
  onTokenChange,
  resetSignal = 0,
  className = "",
}) {
  const containerRef = useRef(null);
  const mountNodeRef = useRef(null);
  const widgetIdRef = useRef(null);
  const previousResetSignalRef = useRef(resetSignal);
  const [loadError, setLoadError] = useState("");
  const [themeMode, setThemeMode] = useState(getRecaptchaTheme);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const nextTheme = getRecaptchaTheme();
      setThemeMode((currentTheme) => (currentTheme === nextTheme ? currentTheme : nextTheme));
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadRecaptchaScript()
      .then(() => {
        if (cancelled || !containerRef.current) {
          return;
        }

        const mountNode = document.createElement("div");
        mountNode.className = "flex justify-center";
        containerRef.current.replaceChildren(mountNode);
        mountNodeRef.current = mountNode;

        if (widgetIdRef.current !== null) {
          onTokenChange?.("");
        }

        setLoadError("");
        widgetIdRef.current = window.grecaptcha.render(mountNode, {
          sitekey: RECAPTCHA_SITE_KEY,
          theme: themeMode,
          callback: (token) => {
            setLoadError("");
            onTokenChange?.(token);
          },
          "expired-callback": () => {
            onTokenChange?.("");
          },
          "error-callback": () => {
            setLoadError("No fue posible validar reCAPTCHA. Intenta de nuevo.");
            onTokenChange?.("");
          },
        });
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error.message || "No fue posible cargar reCAPTCHA.");
        }
      });

    return () => {
      cancelled = true;
      widgetIdRef.current = null;
      mountNodeRef.current = null;
      if (containerRef.current) {
        containerRef.current.replaceChildren();
      }
    };
  }, [onTokenChange, themeMode]);

  useEffect(() => {
    if (previousResetSignalRef.current === resetSignal) {
      return;
    }

    previousResetSignalRef.current = resetSignal;

    if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
      window.grecaptcha.reset(widgetIdRef.current);
    }

    onTokenChange?.("");
  }, [onTokenChange, resetSignal]);

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="flex justify-center overflow-x-auto">
          <div ref={containerRef} className="min-h-[78px]" />
        </div>
      </div>
      {loadError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {loadError}
        </p>
      )}
    </div>
  );
}
