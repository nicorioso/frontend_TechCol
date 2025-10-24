// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "API_URL",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;