import axios from "axios";
import { setupInterceptors } from "../interceptors";
import config from "../../../config/config";

const DEFAULT_HEADERS = Object.freeze({
  "Content-Type": "application/json",
});

const axiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  withCredentials: true,
  headers: DEFAULT_HEADERS,
});

setupInterceptors(axiosInstance);

export default axiosInstance;
