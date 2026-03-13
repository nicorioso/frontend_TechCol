import { storageGateway } from "./storageGateway";

const PROFILE_CACHE_KEY = "user_identity_profiles";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const readProfileCache = () => {
  return storageGateway.getJson(PROFILE_CACHE_KEY, {});
};

const writeProfileCache = (cache) => {
  storageGateway.setJson(PROFILE_CACHE_KEY, cache);
};

export const upsertIdentityProfile = (user, fallbackEmail = "") => {
  if (!user || typeof user !== "object") return user;

  const email = normalizeEmail(user?.customerEmail ?? user?.email ?? fallbackEmail);
  if (!email) return user;

  const cache = readProfileCache();
  const cached = cache[email];

  const resolvedUser = cached
    ? {
        ...user,
        customerName: cached.customerName || user.customerName || "",
        customerLastName: cached.customerLastName || user.customerLastName || "",
        name: cached.name || user.name || "",
        customerEmail: user.customerEmail || user.email || email,
        email: user.email || user.customerEmail || email,
      }
    : {
        ...user,
        customerEmail: user.customerEmail || user.email || email,
        email: user.email || user.customerEmail || email,
      };

  cache[email] = {
    customerName: resolvedUser.customerName || "",
    customerLastName: resolvedUser.customerLastName || "",
    name: resolvedUser.name || "",
  };
  writeProfileCache(cache);

  return resolvedUser;
};
