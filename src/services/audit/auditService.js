import axios from "axios";
import { ANALYTICS_API_URL } from "../../config/config";
import { getToken } from "../../utils/authSession";

const auditService = {
  getRecentLogs: async () => {
    const response = await axios.get(`${ANALYTICS_API_URL}/reports/audit/recent`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  },
};

export default auditService;
