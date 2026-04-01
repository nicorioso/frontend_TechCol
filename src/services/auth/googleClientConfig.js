import { axiosInstance } from "../api";

let googleClientConfigPromise = null;

export const getGoogleClientId = async () => {
  if (!googleClientConfigPromise) {
    googleClientConfigPromise = axiosInstance
      .get("/auth/google/client-config", { skipAuth: true })
      .then((response) => String(response?.data?.clientId || "").trim())
      .catch((error) => {
        googleClientConfigPromise = null;
        throw error;
      });
  }

  return googleClientConfigPromise;
};
