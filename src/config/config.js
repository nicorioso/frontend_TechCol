const parsedTimeout = Number(import.meta.env.VITE_API_TIMEOUT);
const apiTimeout = Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 0;

const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    // 0 means no timeout in Axios.
    timeout: apiTimeout
  },
  // path where uploaded files are served from, relative to baseURL host
  uploadsPath: import.meta.env.VITE_UPLOADS_PATH || '/uploads/products',
  environment: import.meta.env.MODE || 'development',
  debug: import.meta.env.VITE_DEBUG === 'true'
};

console.log('✅ Config cargada:', config);

export default config;
