import { axiosInstance } from "../api";

const auditService = {
  getRecentLogs: async () => {
    const response = await axiosInstance.get("/audit-logs");
    return Array.isArray(response.data) ? response.data : [];
  },
};

export default auditService;
