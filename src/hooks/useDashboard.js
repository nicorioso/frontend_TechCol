import { useEffect, useState } from "react";
import axios from "axios";
import { ANALYTICS_API_URL } from "../config/config";
import { getToken } from "../utils/authSession";

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${ANALYTICS_API_URL}/reports/dashboard`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (active) {
          setData(response.data || null);
        }
      } catch (err) {
        if (active) {
          const backendMessage =
            typeof err?.response?.data === "string"
              ? err.response.data
              : err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "No se pudo cargar el dashboard administrativo.";

          setError(backendMessage);
          setData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
};
