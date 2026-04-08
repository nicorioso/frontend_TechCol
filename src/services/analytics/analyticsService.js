import orderService from "../order/orderService";
import productService from "../product/productService";
import { analyticsRequest } from "./analyticsClient";

const normalizeArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getDashboardErrorMessage = (error) =>
  typeof error?.response?.data === "string"
    ? error.response.data
    : error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "No se pudo cargar el dashboard administrativo.";

const getOrderDate = (order) => order?.orderDate ?? order?.createdAt ?? order?.updatedAt ?? null;

const formatChartLabel = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Sin fecha";

  return parsed.toLocaleDateString("es-CO", {
    month: "short",
    day: "numeric",
  });
};

const normalizeDashboardData = (rawData) => {
  const data = rawData && typeof rawData === "object" ? rawData : {};

  return {
    ...data,
    kpis: data?.kpis ?? {},
    top_products: normalizeArray(data?.top_products),
    sales_chart: normalizeArray(data?.sales_chart),
    summary: data?.summary ?? {},
  };
};

const buildSalesChart = (orders) => {
  const grouped = new Map();

  orders.forEach((order) => {
    const rawDate = getOrderDate(order);
    const parsed = rawDate ? new Date(rawDate) : null;
    const key =
      parsed && !Number.isNaN(parsed.getTime())
        ? parsed.toISOString().slice(0, 10)
        : `unknown-${grouped.size + 1}`;
    const current = grouped.get(key) ?? {
      sortKey:
        parsed && !Number.isNaN(parsed.getTime()) ? parsed.getTime() : Number.MAX_SAFE_INTEGER,
      date: parsed && !Number.isNaN(parsed.getTime()) ? formatChartLabel(parsed) : "Sin fecha",
      sales: 0,
    };

    current.sales += toNumber(order?.orderPrice ?? order?.order_price);
    grouped.set(key, current);
  });

  return [...grouped.values()]
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(-8)
    .map(({ date, sales }) => ({ date, sales }));
};

const buildTopProducts = (orders) => {
  const aggregated = new Map();

  orders.forEach((order) => {
    normalizeArray(order?.orderDetails).forEach((detail, index) => {
      const productId =
        detail?.product?.productId ??
        detail?.product?.product_id ??
        detail?.product?.id ??
        detail?.productId ??
        `${order?.orderId ?? "order"}-${index}`;
      const productName =
        detail?.product?.productName ??
        detail?.product?.product_name ??
        detail?.product?.name ??
        "Producto";
      const quantity = toNumber(detail?.quantity);
      const current = aggregated.get(productId) ?? {
        product_id: productId,
        product_name: productName,
        total_sold: 0,
      };

      current.total_sold += quantity;
      aggregated.set(productId, current);
    });
  });

  return [...aggregated.values()]
    .sort((a, b) => b.total_sold - a.total_sold)
    .slice(0, 6);
};

const buildFallbackDashboard = async () => {
  const [ordersResponse, productsResponse] = await Promise.all([
    orderService.getAllOrders(),
    productService.getAllProducts(),
  ]);

  const orders = normalizeArray(ordersResponse);
  const products = normalizeArray(productsResponse);
  const totalOrders = orders.length;
  const totalSales = orders.reduce(
    (sum, order) => sum + toNumber(order?.orderPrice ?? order?.order_price),
    0
  );
  const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;
  const pendingOrders = orders.filter((order) => {
    const status = String(order?.status ?? "").toLowerCase();
    return status === "pending" || status === "paid";
  }).length;
  const deliveredOrders = orders.filter(
    (order) => String(order?.status ?? "").toLowerCase() === "delivered"
  ).length;
  const activeProducts = products.filter((product) => toNumber(product?.stock) > 0).length;
  const outOfStockProducts = products.filter((product) => toNumber(product?.stock) <= 0).length;

  return {
    kpis: {
      total_orders: totalOrders,
      total_sales: totalSales,
      average_order_value: averageOrderValue,
    },
    top_products: buildTopProducts(orders),
    sales_chart: buildSalesChart(orders),
    summary: {
      total_products: products.length,
      active_products: activeProducts,
      out_of_stock_products: outOfStockProducts,
      pending_orders: pendingOrders,
      delivered_orders: deliveredOrders,
    },
  };
};

const analyticsService = {
  getDashboardData: async () => {
    try {
      const response = await analyticsRequest({
        url: "/reports/dashboard",
        method: "get",
      });

      return {
        data: normalizeDashboardData(response.data),
        source: "analytics",
        warning: "",
        capabilities: {
          exports: true,
          exportFormats: ["csv", "excel"],
        },
      };
    } catch (analyticsError) {
      const fallbackData = await buildFallbackDashboard();

      return {
        data: normalizeDashboardData(fallbackData),
        source: "fallback",
        warning: `${getDashboardErrorMessage(
          analyticsError
        )} Se muestran metricas calculadas desde pedidos y productos.`,
        capabilities: {
          exports: false,
          exportFormats: ["csv", "excel"],
        },
      };
    }
  },
};

export { getDashboardErrorMessage };
export default analyticsService;
