import axios from "axios";
import config from "../../config/config";
import { getToken } from "../../utils/authSession";

const DEFAULT_HEADERS = Object.freeze({
  "Content-Type": "application/json",
});

const analyticsClient = axios.create({
  baseURL: config.analytics.baseURL,
  timeout: config.analytics.timeout,
  headers: DEFAULT_HEADERS,
});

const getAnalyticsHeaders = (headers = {}) => {
  const token = getToken();

  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const analyticsRequest = (requestConfig = {}) =>
  analyticsClient({
    ...requestConfig,
    headers: getAnalyticsHeaders(requestConfig.headers),
  });

export { analyticsClient, analyticsRequest, getAnalyticsHeaders };

