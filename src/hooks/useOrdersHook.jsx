import { useState, useEffect } from 'react';
import { axiosInstance } from '../services/api';

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
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/orders/customer/${customerId}`);
        const ordersData = Array.isArray(response.data) ? response.data : [];

        setOrders(ordersData);

        // Calcular resumen
        const totalSpent = ordersData.reduce((sum, order) => {
          const price = parseFloat(order?.orderPrice ?? order?.order_price ?? 0);
          return sum + price;
        }, 0);

        const totalOrders = ordersData.length;
        const delivered = ordersData.filter(
          (o) => String(o?.status ?? '').toLowerCase() === 'delivered'
        ).length;
        const pending = ordersData.filter(
          (o) => String(o?.status ?? '').toLowerCase() === 'paid'
        ).length;

        setSummary({
          totalSpent,
          totalOrders,
          delivered,
          pending,
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Error cargando órdenes');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  return { orders, summary, loading, error };
}
