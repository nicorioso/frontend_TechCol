const parseJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const loginWithGoogleCredential = (credentialResponse, navigate) => {
  const credential = credentialResponse?.credential;
  if (!credential) {
    throw new Error("Google no devolvio credenciales.");
  }

  const payload = parseJwtPayload(credential);
  if (!payload) {
    throw new Error("No se pudo leer el token de Google.");
  }

  const role = String(payload?.role ?? "CLIENTE").toUpperCase();
  const isAdmin = role.includes("ADMIN");

  const user = {
    customerName: payload?.given_name ?? payload?.name ?? "",
    customerLastName: payload?.family_name ?? "",
    customerEmail: payload?.email ?? "",
    name: payload?.name ?? "",
    photoUrl: payload?.picture ?? "",
    role: isAdmin ? "ADMIN" : "CLIENTE",
  };

  localStorage.setItem("access_token", credential);
  localStorage.setItem("user", JSON.stringify(user));

  navigate(isAdmin ? "/admin/profile" : "/user/profile");
};

