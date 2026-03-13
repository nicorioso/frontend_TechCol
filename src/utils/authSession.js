import { storageGateway } from "./storageGateway";

export const getToken = () => storageGateway.get("access_token");

export const getStoredUser = () => storageGateway.getJson("user", null);

export const parseJwtPayload = (token) => {
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

const asArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const findAdminRoleDeep = (value, depth = 0) => {
  if (depth > 4 || value == null) return "";

  if (typeof value === "string") {
    const upper = value.toUpperCase();
    return upper.includes("ADMIN") ? upper : "";
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findAdminRoleDeep(item, depth + 1);
      if (found) return found;
    }
    return "";
  }

  if (typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      if (!/role|authorit|group|scope/i.test(key)) continue;
      const found = findAdminRoleDeep(nested, depth + 1);
      if (found) return found;
    }
  }

  return "";
};

export const resolveRoleFromPayload = (payload) => {
  if (!payload || typeof payload !== "object") return "";

  const candidates = [
    payload.role,
    payload.rol,
    payload.userRole,
    payload.authority,
    payload.authorities,
    payload.roles,
    payload.groups,
    payload.realm_access?.roles,
    payload.resource_access,
  ];

  for (const candidate of candidates.flatMap(asArray)) {
    const found = findAdminRoleDeep(candidate);
    if (found) return found;
  }

  return "";
};

export const getCurrentRole = () => {
  const token = getToken();
  const payload = token ? parseJwtPayload(token) : null;
  const tokenRole = resolveRoleFromPayload(payload);
  if (tokenRole) return tokenRole;

  const user = getStoredUser();
  return String(user?.role ?? user?.rol ?? "").toUpperCase();
};

export const getRolePathPrefix = () =>
  getCurrentRole().includes("ADMIN") ? "admin" : "user";
