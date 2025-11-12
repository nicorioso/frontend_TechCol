import axios from 'axios';
import { setupInterceptors } from '../interceptors';
import config from '../../../config/config';

const axiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});
setupInterceptors(axiosInstance);


export default axiosInstance;
