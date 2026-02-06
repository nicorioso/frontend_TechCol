import { errorHandler, getErrorMessage } from '../../errors/error_handler.jsx';

/**
 * Interceptor de respuesta
 * Se ejecuta después de recibir la respuesta del servidor
 */
const responseInterceptor = (api) => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado o inválido
        console.warn('⚠️ Token expirado, limpiando sesión');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        // Redirigir a login
        window.location.href = '/auth/login';
      }
      
      if (error.response?.status === 403) {
        console.error('❌ Acceso denegado (403)');
      }
      
      return Promise.reject(error);
    }
  );
};

export default responseInterceptor;
