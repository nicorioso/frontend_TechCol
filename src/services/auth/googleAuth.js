import { parseJwtPayload, resolveRoleFromPayload } from "../../utils/authSession";
import { upsertIdentityProfile } from "../../utils/identityProfile";
import { storageGateway } from "../../utils/storageGateway";

export const loginWithGoogleCredential = (credentialResponse, navigate) => {
  const credential = credentialResponse?.credential;
  if (!credential) {
    throw new Error("Google no devolvio credenciales.");
  }

  const payload = parseJwtPayload(credential);
  if (!payload) {
    throw new Error("No se pudo leer el token de Google.");
  }

  const user = upsertIdentityProfile({
    customerName: payload?.given_name ?? payload?.name ?? "",
    customerLastName: payload?.family_name ?? "",
    customerEmail: payload?.email ?? "",
    name: payload?.name ?? "",
    photoUrl: payload?.picture ?? "",
    role: resolveRoleFromPayload(payload) || "CLIENTE",
  });

  storageGateway.set("access_token", credential);
  storageGateway.setJson("user", user);
  navigate("/");
};
