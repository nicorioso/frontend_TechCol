/**
 * Interceptor del servidor
 * Se ejecuta cada vez antes de enviar una petición al servidor
 */

const requestInterceptor = (api) => {

    api.interceptors.request.use(
        config => {
            console.log(`${config.method?.toUpperCase()} ${config.url}`);
            
            // Si tienes autenticación con JWT
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('Token JWT agregado a la petición')
            }
            
            return config;
        },

        error => {
            console.error('Request Error:', error);
            return Promise.reject(error);
        }
    );
};

export default requestInterceptor;