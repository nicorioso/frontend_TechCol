import { upsertIdentityProfile } from "../../utils/identityProfile";
import { axiosInstance } from "../api";
import { storageGateway } from "../../utils/storageGateway";

export const loginWithGoogleCredential = async (credentialResponse, navigate) => {
  const credential = credentialResponse?.credential;
  if (!credential) {
    throw new Error("Google no devolvio credenciales.");
  }

  const response = await axiosInstance.post("/auth/google", { credential }, { skipAuth: true });
  const accessToken = response?.data?.accessToken;
  const backendUser = response?.data?.user;

  if (!accessToken || !backendUser) {
    throw new Error("No se pudo completar la autenticacion con el backend.");
  }

  const user = upsertIdentityProfile(backendUser, backendUser?.customerEmail ?? backendUser?.email ?? "");

  storageGateway.set("access_token", accessToken);
  storageGateway.setJson("user", user);
  navigate("/");
};
