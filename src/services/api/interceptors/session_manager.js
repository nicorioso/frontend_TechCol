const PUBLIC_ENDPOINTS = ['/auth/register', '/auth/login', '/auth/verify', '/auth/refresh'];
const REFRESH_THRESHOLD_SECONDS = 60;

let refreshPromise = null;

const parseJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const getTokenExpirationMs = (token) => {
  const payload = parseJwtPayload(token);
  const exp = payload?.exp;
  return typeof exp === 'number' ? exp * 1000 : null;
};

export const isPublicEndpoint = (url = '') =>
  PUBLIC_ENDPOINTS.some((endpoint) => String(url).includes(endpoint));

export const isTokenExpiringSoon = (token, thresholdSeconds = REFRESH_THRESHOLD_SECONDS) => {
  const expMs = getTokenExpirationMs(token);
  if (!expMs) return true;

  const nowMs = Date.now();
  return expMs - nowMs <= thresholdSeconds * 1000;
};

export const clearSession = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

export const refreshAccessToken = async (api) => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = api
    .post('/auth/refresh', {}, { skipAuth: true })
    .then((response) => {
      const token = response?.data?.accessToken;
      if (!token) {
        throw new Error('No access token returned by refresh endpoint');
      }

      localStorage.setItem('access_token', token);
      return token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};
