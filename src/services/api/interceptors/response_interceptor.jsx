import { clearSession, isPublicEndpoint, refreshAccessToken } from './session_manager';
import { logError } from '../../../utils/logger';

const responseInterceptor = (api) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const originalRequest = error?.config || {};
      const isPublicRequest = isPublicEndpoint(originalRequest.url);
      const preserveSessionOnAuthError = Boolean(originalRequest.preserveSessionOnAuthError);

      if (
        (status === 401 || status === 403) &&
        !originalRequest._retry &&
        !originalRequest.skipAuth &&
        !isPublicRequest
      ) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken(api);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          if (!preserveSessionOnAuthError) {
            clearSession();
            window.location.href = '/auth/login';
          }
          return Promise.reject(refreshError);
        }
      }

      if (status === 401 && !originalRequest.skipAuth && !isPublicRequest && !preserveSessionOnAuthError) {
        clearSession();
        window.location.href = '/auth/login';
      }

      if (status === 403 && !originalRequest.skipAuth && !isPublicRequest) {
        logError('Acceso denegado (403)');
      }

      return Promise.reject(error);
    }
  );
};

export default responseInterceptor;
