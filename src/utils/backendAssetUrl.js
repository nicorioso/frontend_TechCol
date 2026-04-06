import config from "../config/config";

const getBackendBaseUrl = () => String(config.api.baseURL || "").replace(/\/+$/, "");

export const buildBackendAssetUrl = (assetPath) => {
  const value = String(assetPath || "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) return value;

  return value.startsWith("/") ? `${baseUrl}${value}` : `${baseUrl}/${value}`;
};
