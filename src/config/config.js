const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 100000
  },
  environment: import.meta.env.MODE || 'development',
  debug: import.meta.env.VITE_DEBUG === 'true'
};

console.log('✅ Config cargada:', config);

export default config;
