import { errorHandler, getErrorMessage } from '../../errors/error_handler.jsx';

/**
 * Interceptor de respuesta
 * Se ejecuta después de recibir la respuesta del servidor
 */
const responseInterceptor = (api) => {
  api.interceptors.response.use(
    // Respuesta exitosa
    response => {
      console.log(`✅ ${response.status} ${response.config.url}`);
      return response;
    },

    // Respuesta con error
    error => {
      // Obtener el status del error
      const status = error.response?.status;
      const errorData = error.response?.data;

      console.error('❌ Response error:', status, errorData);

      // Llamar al manejador de errores
      errorHandler(status, errorData);

      // Retornar el error procesado
      return Promise.reject({
        status,
        message: getErrorMessage(status),
        data: errorData,
        originalError: error
      });
    }
  );
};

export default responseInterceptor;
