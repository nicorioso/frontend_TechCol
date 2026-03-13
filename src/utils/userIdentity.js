import { parseJwtPayload } from "./authSession";
import { storageGateway } from "./storageGateway";

export const getTokenEmail = () => {
  const token = storageGateway.get("access_token");
  if (!token) return "";
  const payload = parseJwtPayload(token);
  return String(payload?.sub ?? payload?.email ?? "").trim();
};

export const getUserDisplayName = (user) => {
  const fullName = [user?.customerName, user?.customerLastName]
    .map((v) => String(v || "").trim())
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) return fullName;

  const fromUser =
    user?.name || user?.username || user?.customerEmail || user?.email || "";
  if (fromUser) {
    const value = String(fromUser).trim();
    return value.includes("@") ? value.split("@")[0] : value;
  }

  const tokenEmail = getTokenEmail();
  if (tokenEmail) return tokenEmail.split("@")[0];

  return "Usuario";
};

export const getUserShortName = (user) => {
  const displayName = getUserDisplayName(user);
  if (!displayName) return "U";

  const parts = displayName.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
};
