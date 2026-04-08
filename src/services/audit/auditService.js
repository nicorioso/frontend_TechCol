import { axiosInstance } from "../api";
import { analyticsRequest } from "../analytics/analyticsClient";

const normalizeAuditLogs = (value) => (Array.isArray(value) ? value : []);

const auditService = {
  getRecentLogs: async () => {
    try {
      const response = await analyticsRequest({
        url: "/reports/audit/recent",
        method: "get",
      });
      return normalizeAuditLogs(response.data);
    } catch (analyticsError) {
      try {
        const response = await axiosInstance.get("/audit-logs");
        return normalizeAuditLogs(response.data);
      } catch (backendError) {
        throw analyticsError?.response ? analyticsError : backendError;
      }
    }
  },
};

export default auditService;
