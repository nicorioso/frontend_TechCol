import { clearSession, isPublicEndpoint, isTokenExpiringSoon, refreshAccessToken } from './session_manager';

const requestInterceptor = (api) => {
  api.interceptors.request.use(
    async (config) => {
      if (config.skipAuth || isPublicEndpoint(config.url)) {
        return config;
      }

      let token = localStorage.getItem('access_token');

      if (token && isTokenExpiringSoon(token)) {
        try {
          token = await refreshAccessToken(api);
        } catch (error) {
          clearSession();
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }
      }

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default requestInterceptor;
