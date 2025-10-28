/**
 * Configuración de la aplicación
 * Usa import.meta.env para Vite
 */
const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000
  },
  environment: import.meta.env.MODE || 'development',
  debug: import.meta.env.VITE_DEBUG === 'true'
};

console.log('✅ Configuración cargada:', {
  baseURL: config.api.baseURL,
  environment: config.environment,
  debug: config.debug
});

export default config;
