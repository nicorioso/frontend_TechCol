import { storageGateway } from "./storageGateway";

export const getToken = () => storageGateway.get("access_token");

export const getStoredUser = () => storageGateway.getJson("user", null);

const ADMIN_ROLE_NAMES = new Set([
  "ADMIN",
  "ROLE_ADMIN",
  "SUPER_ADMIN",
  "ROLE_SUPER_ADMIN",
]);

const USER_ROLE_NAMES = new Set([
  "USER",
  "ROLE_USER",
  "CLIENTE",
  "ROLE_CLIENTE",
  "CUSTOMER",
  "ROLE_CUSTOMER",
]);

const normalizeRoleToken = (value) => String(value ?? "").trim().toUpperCase();

const splitRoleTokens = (value) =>
  String(value ?? "")
    .split(/[,\s]+/)
    .map(normalizeRoleToken)
    .filter(Boolean);

const isKnownRoleToken = (token) =>
  ADMIN_ROLE_NAMES.has(token) || USER_ROLE_NAMES.has(token);

const extractRoleTokens = (value, depth = 0) => {
  if (depth > 4 || value == null) return [];

  if (typeof value === "string") {
    return splitRoleTokens(value).filter(isKnownRoleToken);
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractRoleTokens(item, depth + 1));
  }

  if (typeof value === "object") {
    const tokens = [
      value.roleName,
      value.role,
      value.rol,
      value.userRole,
      value.authority,
      value.authorities,
      value.roles,
      value.groups,
      value.realm_access?.roles,
    ].flatMap((item) => extractRoleTokens(item, depth + 1));

    if (value.resource_access && typeof value.resource_access === "object") {
      tokens.push(
        ...Object.values(value.resource_access).flatMap((resource) =>
          extractRoleTokens(resource?.roles ?? resource?.role, depth + 1)
        )
      );
    }

    return tokens;
  }

  return [];
};

const resolvePrimaryRole = (value) => {
  const tokens = [...new Set(extractRoleTokens(value))];
  return (
    tokens.find((token) => ADMIN_ROLE_NAMES.has(token)) ??
    tokens.find((token) => USER_ROLE_NAMES.has(token)) ??
    ""
  );
};

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
    const found = resolvePrimaryRole(candidate);
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
  return resolvePrimaryRole(user) || normalizeRoleToken(user?.role ?? user?.rol);
};

export const isAdminRole = (role = getCurrentRole()) =>
  ADMIN_ROLE_NAMES.has(resolvePrimaryRole(role) || normalizeRoleToken(role));

export const getRolePathPrefix = () => (isAdminRole() ? "admin" : "user");
