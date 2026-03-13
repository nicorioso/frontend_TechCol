import { clearSession, isPublicEndpoint, refreshAccessToken } from './session_manager';

const responseInterceptor = (api) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const originalRequest = error?.config || {};

      if (
        (status === 401 || status === 403) &&
        !originalRequest._retry &&
        !originalRequest.skipAuth &&
        !isPublicEndpoint(originalRequest.url)
      ) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken(api);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          clearSession();
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }

      if (status === 401) {
        clearSession();
        window.location.href = '/auth/login';
      }

      if (status === 403) {
        console.error('Acceso denegado (403)');
      }

      return Promise.reject(error);
    }
  );
};

export default responseInterceptor;
