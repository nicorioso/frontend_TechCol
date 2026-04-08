import { useEffect, useState } from "react";
import orderService from "../services/order/orderService";

export function useOrdersHook(customerId) {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalSpent: 0,
    totalOrders: 0,
    delivered: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) {
      setOrders([]);
      setSummary({
        totalSpent: 0,
        totalOrders: 0,
        delivered: 0,
        pending: 0,
      });
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const raw = await orderService.getCustomerOrders(customerId);
        const ordersData = Array.isArray(raw) ? raw : raw ? [raw] : [];

        setOrders(ordersData);

        const totalSpent = ordersData.reduce((sum, order) => {
          const price = Number.parseFloat(order?.orderPrice ?? order?.order_price ?? 0);
          return sum + (Number.isNaN(price) ? 0 : price);
        }, 0);

        const totalOrders = ordersData.length;
        const delivered = ordersData.filter(
          (order) => String(order?.status ?? "").toLowerCase() === "delivered"
        ).length;
        const pending = ordersData.filter((order) => {
          const status = String(order?.status ?? "").toLowerCase();
          return status === "paid" || status === "pending";
        }).length;

        setSummary({
          totalSpent,
          totalOrders,
          delivered,
          pending,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err?.message || "Error cargando ordenes");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  return { orders, summary, loading, error };
}
