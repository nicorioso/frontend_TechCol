import { useEffect, useRef, useState } from "react";
import { loadGoogleScript } from "../../utils/loadGoogleScript";

const CONSENT_KEY = "third_party_auth_consent_v1";

const getInitialConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
};

export default function GoogleLoginConsent({
  onSuccess,
  onError,
  buttonLabel = "Habilitar Google",
  className = "",
}) {
  const [consentGranted, setConsentGranted] = useState(getInitialConsent);
  const [authError, setAuthError] = useState("");
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const buttonContainerRef = useRef(null);
  const successHandlerRef = useRef(onSuccess);
  const errorHandlerRef = useRef(onError);
  const isInitializedRef = useRef(false);
  const renderedClientIdRef = useRef(null);

  useEffect(() => {
    successHandlerRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    errorHandlerRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!consentGranted) {
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setAuthError("Google login no esta configurado en este entorno.");
      return;
    }

    if (!buttonContainerRef.current) {
      return;
    }

    let isCancelled = false;

    const initializeGoogleButton = async () => {
      setIsLoadingScript(true);
      setAuthError("");

      try {
        await loadGoogleScript();

        if (isCancelled) {
          return;
        }

        const googleId = window.google?.accounts?.id;
        if (!googleId) {
          throw new Error("Google Identity no esta disponible.");
        }

        if (!isInitializedRef.current) {
          googleId.initialize({
            client_id: clientId,
            callback: (response) => successHandlerRef.current?.(response),
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          isInitializedRef.current = true;
        }

        if (renderedClientIdRef.current !== clientId) {
          buttonContainerRef.current.innerHTML = "";
          googleId.renderButton(buttonContainerRef.current, {
            theme: "outline",
            size: "large",
            width: 320,
            text: "continue_with",
            shape: "rectangular",
          });
          renderedClientIdRef.current = clientId;
        }
      } catch {
        if (!isCancelled) {
          setAuthError("No se pudo completar la autenticacion con Google.");
          errorHandlerRef.current?.();
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingScript(false);
        }
      }
    };

    initializeGoogleButton();

    return () => {
      isCancelled = true;
    };
  }, [consentGranted]);

  const enableGoogleAuth = async () => {
    try {
      localStorage.setItem(CONSENT_KEY, "granted");
    } catch {
      // localStorage may be unavailable; keep runtime state only.
    }
    setConsentGranted(true);
  };

  return (
    <div className={className}>
      {!consentGranted ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <p>
            Google puede establecer cookies de terceros para autenticacion. El script se cargara
            solo cuando lo habilites.
          </p>
          <button
            type="button"
            className="mt-2 rounded-md bg-cyan-600 px-3 py-2 font-semibold text-white transition hover:bg-cyan-700"
            onClick={enableGoogleAuth}
          >
            {buttonLabel}
          </button>
        </div>
      ) : (
        <div className="w-full">
          <div ref={buttonContainerRef} />
          {isLoadingScript && <p className="mt-2 text-sm text-slate-500">Cargando Google...</p>}
        </div>
      )}
      {authError && (
        <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {authError}
        </p>
      )}
    </div>
  );
}
