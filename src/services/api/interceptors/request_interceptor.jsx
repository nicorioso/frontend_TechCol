/**
 * Interceptor del servidor
 * Se ejecuta cada vez antes de enviar una petición al servidor
 */

const requestInterceptor = (api) => {

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token agregado al header');
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default requestInterceptor;