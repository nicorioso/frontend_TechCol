let googleScriptPromise;

export function loadGoogleScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google script can only load in the browser."));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  const existing = document.getElementById("google-client-script");
  if (existing) {
    if (!googleScriptPromise) {
      googleScriptPromise = new Promise((resolve, reject) => {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Failed to load Google Identity script.")), {
          once: true,
        });
      });
    }
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-client-script";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity script."));
    document.body.appendChild(script);
  });

  return googleScriptPromise;
}
