/**
 * Interceptor del servidor
 * Se ejecuta cada vez antes de enviar una petición al servidor
 */

const requestInterceptor = (api) => {

  // Public endpoints que no requieren autenticación
  const publicEndpoints = ['/auth/register', '/auth/login'];

  api.interceptors.request.use(
    (config) => {
      // Verificar si el endpoint es público
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        config.url?.includes(endpoint)
      );

      // Solo agregar token si no es un endpoint público
      if (!isPublicEndpoint) {
        const token = localStorage.getItem('access_token');
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Token agregado al header');
        }
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default requestInterceptor;