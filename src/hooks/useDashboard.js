import { useEffect, useState } from "react";
import analyticsService, {
  getDashboardErrorMessage,
} from "../services/analytics/analyticsService";

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [source, setSource] = useState("analytics");
  const [capabilities, setCapabilities] = useState({ exports: false });

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      setWarning("");

      try {
        const result = await analyticsService.getDashboardData();

        if (!active) return;

        setData(result?.data ?? null);
        setSource(result?.source ?? "analytics");
        setWarning(result?.warning ?? "");
        setCapabilities(result?.capabilities ?? { exports: false });
      } catch (err) {
        if (!active) return;

        setError(getDashboardErrorMessage(err));
        setData(null);
        setSource("analytics");
        setCapabilities({ exports: false });
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

  return { data, loading, error, warning, source, capabilities };
};
