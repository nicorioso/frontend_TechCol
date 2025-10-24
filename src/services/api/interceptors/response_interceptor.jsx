/**
 * Interceptor de respuesta
 * se ejecuta despues de recibir la respuesta del servidor
 */

const responseInterceptor = (api) => {
    api.interceptors.response.use(
        response => {
            console.log(`${response.status} ${response.config.url}`);
            return response;
        },
        error => {
            
            console.error('Response error:', error.response?.status, error.response?.data);
            return Promise.eject(error);
        }
    )
}

export default responseInterceptor;