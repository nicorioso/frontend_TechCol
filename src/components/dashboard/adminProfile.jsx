import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  BadgeDollarSign,
  Boxes,
  Clock3,
  Download,
  FileSpreadsheet,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Sidebar from "./sidebar";
import SeoHead from "../../seo/SeoHead";
import { useDashboard } from "../../hooks/useDashboard";
import reportService from "../../services/report/reportService";
import auditService from "../../services/audit/auditService";

const CHART_COLORS = ["#0f766e", "#14b8a6", "#0f172a", "#f59e0b", "#22c55e"];

const cardClass =
  "rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-900/90";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

const formatAuditTimestamp = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAuditAction = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getAuditTone = (value) => {
  const action = String(value || "").toUpperCase();

  if (action.includes("LOGIN")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300";
  }

  if (action.includes("EXPORT")) {
    return "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-300";
  }

  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300";
};

const Placeholder = ({ text }) => (
  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
    {text}
  </div>
);

export default function AdminProfile() {
  const { data, loading, error, warning, source, capabilities } = useDashboard();
  const [exporting, setExporting] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState("");

  useEffect(() => {
    let active = true;

    const loadAuditLogs = async () => {
      setAuditLoading(true);
      setAuditError("");

      try {
        const logs = await auditService.getRecentLogs();
        if (!active) return;
        setAuditLogs(logs.slice(0, 6));
      } catch (err) {
        if (!active) return;

        const backendMessage =
          typeof err?.response?.data === "string"
            ? err.response.data
            : err?.response?.data?.detail ||
              err?.response?.data?.message ||
              "No se pudo cargar la bitacora reciente.";

        setAuditError(backendMessage);
      } finally {
        if (active) {
          setAuditLoading(false);
        }
      }
    };

    loadAuditLogs();

    return () => {
      active = false;
    };
  }, []);

  const handleExport = async (type) => {
    setExporting(type);
    setMessage({ type: "", text: "" });

    try {
      if (type === "excel") {
        await reportService.downloadSalesExcel();
      } else {
        await reportService.downloadSalesCsv();
      }

      setMessage({
        type: "success",
        text: `Archivo ${type.toUpperCase()} descargado correctamente.`,
      });
    } catch (err) {
      const backendMessage =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.detail ||
            err?.response?.data?.message ||
            `No se pudo descargar el archivo ${type.toUpperCase()}.`;

      setMessage({ type: "error", text: backendMessage });
    } finally {
      setExporting("");
    }
  };

  const topProducts = data?.top_products || [];
  const topProduct = topProducts[0] || null;
  const salesChart = data?.sales_chart || [];
  const summaryMetrics = data?.summary || {};
  const showExports = Boolean(capabilities?.exports);
  const showAuditPanel = !auditError && (auditLoading || auditLogs.length > 0);

  const totalTopUnits = useMemo(
    () =>
      topProducts.reduce(
        (accumulator, product) => accumulator + Number(product.total_sold || 0),
        0
      ),
    [topProducts]
  );

  const salesTrend = useMemo(() => {
    if (salesChart.length < 2) return null;

    const first = Number(salesChart[0]?.sales || 0);
    const last = Number(salesChart[salesChart.length - 1]?.sales || 0);
    if (first === 0) return null;

    const diff = ((last - first) / first) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  }, [salesChart]);

  const stats = [
    {
      title: "Ordenes totales",
      value: data?.kpis?.total_orders ?? 0,
      note: "Pedidos procesados",
      icon: ShoppingBag,
      accent: "bg-slate-950 text-white dark:bg-slate-800",
    },
    {
      title: "Ventas acumuladas",
      value: formatCurrency(data?.kpis?.total_sales),
      note: "Ingreso consolidado",
      icon: BadgeDollarSign,
      accent: "bg-emerald-500 text-slate-950",
    },
    {
      title: "Promedio por orden",
      value: formatCurrency(data?.kpis?.average_order_value),
      note: "Valor medio por compra",
      icon: TrendingUp,
      accent: "bg-teal-500 text-slate-950",
    },
    {
      title: "Producto lider",
      value: topProduct?.product_name || "Sin datos",
      note: topProduct ? `${topProduct.total_sold} unidades vendidas` : "Aun sin registros",
      icon: PackageSearch,
      accent: "bg-amber-300 text-slate-950",
    },
  ];

  const quickCards = [
    {
      title: "Tendencia de ventas",
      value: salesTrend || "Sin variacion clara",
      icon: ArrowUpRight,
      accent: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300",
    },
    {
      title: "Unidades en top productos",
      value: totalTopUnits,
      icon: Boxes,
      accent: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    },
    source === "analytics"
      ? {
          title: "Eventos en bitacora",
          value: auditLogs.length,
          icon: Activity,
          accent: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        }
      : {
          title: "Productos activos",
          value: summaryMetrics.active_products ?? 0,
          icon: Boxes,
          accent: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
        },
  ];

  const insights = [
    {
      title: "Mejor producto actual",
      value: topProduct?.product_name || "Sin registros",
    },
    {
      title: "Ticket promedio",
      value: formatCurrency(data?.kpis?.average_order_value),
    },
    source === "analytics"
      ? {
          title: "Participacion de top productos",
          value: `${totalTopUnits} unidades registradas`,
        }
      : {
          title: "Productos agotados",
          value: `${summaryMetrics.out_of_stock_products ?? 0} sin stock`,
        },
  ];

  return (
    <>
      <SeoHead
        routeKey="private"
        override={{ path: "/admin/profile", title: "Panel Administrativo | TechCol" }}
      />
      <div className="flex bg-slate-100 dark:bg-slate-950">
        <Sidebar
          content={
            <div className="min-h-screen flex-1 bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef6f5_40%,_#f8fafc_100%)] p-6 dark:bg-[linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#020617_100%)] md:p-8 xl:p-10">
              <div className="mx-auto max-w-7xl space-y-6">
                <section className={`${cardClass} overflow-hidden`}>
                  <div className="grid lg:grid-cols-[1.45fr_0.95fr]">
                    <div className="border-b border-slate-200 p-7 dark:border-slate-800 lg:border-b-0 lg:border-r lg:p-9">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-300">
                          <ShieldCheck className="h-4 w-4" />
                          Centro administrativo
                        </p>
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {source === "analytics" ? "Analytics" : "Fuente de respaldo"}
                        </span>
                      </div>
                      <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                        Gestiona reportes, rendimiento comercial y actividad operativa desde un solo lugar.
                      </h1>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                        Priorizamos una lectura clara: metricas arriba, comparativos al centro y seguimiento operativo abajo.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        {showExports ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleExport("excel")}
                              disabled={exporting === "excel"}
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
                            >
                              <FileSpreadsheet className="h-4 w-4" />
                              {exporting === "excel" ? "Descargando Excel..." : "Descargar Excel"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleExport("csv")}
                              disabled={exporting === "csv"}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              <Download className="h-4 w-4" />
                              {exporting === "csv" ? "Descargando CSV..." : "Descargar CSV"}
                            </button>
                          </>
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Las exportaciones se ocultan mientras el panel usa metricas calculadas desde el backend principal.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-7 lg:p-9">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Resumen rapido
                      </p>
                      <div className="mt-5 grid gap-3">
                        {quickCards.map((card) => {
                          const Icon = card.icon;
                          return (
                            <div
                              key={card.title}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">{card.title}</p>
                                  <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                                    {card.value}
                                  </p>
                                </div>
                                <div className={`rounded-2xl p-3 ${card.accent}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                {message.text ? (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      message.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300"
                        : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
                    }`}
                  >
                    {message.text}
                  </div>
                ) : null}

                {warning ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                    {warning}
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                    {error}
                  </div>
                ) : null}

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <article key={stat.title} className={`${cardClass} p-5`}>
                        <div className={`inline-flex rounded-2xl p-3 ${stat.accent}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          {stat.title}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {stat.note}
                        </p>
                      </article>
                    );
                  })}
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.4fr_0.95fr]">
                  <article className={`${cardClass} p-6`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          Rendimiento comercial
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                          Ventas en el tiempo
                        </h2>
                      </div>
                      <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-300">
                        {salesChart.length} registros
                      </span>
                    </div>

                    <div className="mt-6 h-[340px] w-full">
                      {loading ? (
                        <Placeholder text="Cargando grafica..." />
                      ) : salesChart.length ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={salesChart}>
                            <CartesianGrid strokeDasharray="4 4" stroke="#dbe4ea" />
                            <XAxis dataKey="date" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="sales"
                              stroke="#0f766e"
                              strokeWidth={3}
                              dot={{ r: 3, fill: "#0f766e" }}
                              activeDot={{ r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <Placeholder text="No hay ventas para visualizar." />
                      )}
                    </div>
                  </article>

                  <article className={`${cardClass} p-6`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          Catalogo destacado
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                          Productos mas vendidos
                        </h2>
                      </div>
                      <PackageSearch className="h-5 w-5 text-amber-500" />
                    </div>

                    <div className="mt-6 h-[340px] w-full">
                      {loading ? (
                        <Placeholder text="Cargando productos..." />
                      ) : topProducts.length ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={topProducts}
                            layout="vertical"
                            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                          >
                            <CartesianGrid strokeDasharray="4 4" stroke="#dbe4ea" />
                            <XAxis type="number" stroke="#64748b" />
                            <YAxis type="category" dataKey="product_name" width={110} stroke="#64748b" />
                            <Tooltip />
                            <Bar dataKey="total_sold" radius={[0, 12, 12, 0]}>
                              {topProducts.map((product, index) => (
                                <Cell
                                  key={`${product.product_name}-${index}`}
                                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Placeholder text="No hay productos con ventas aun." />
                      )}
                    </div>
                  </article>
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                  <article className={`${cardClass} p-6`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          Resumen de productos
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                          Tabla de rendimiento
                        </h2>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {topProducts.length} elementos
                      </span>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                          <tr>
                            <th className="px-4 py-3">Producto</th>
                            <th className="px-4 py-3">Unidades</th>
                            <th className="px-4 py-3">Posicion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topProducts.length ? (
                            topProducts.map((product, index) => (
                              <tr
                                key={`${product.product_name}-${index}`}
                                className="border-t border-slate-200 dark:border-slate-800"
                              >
                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                  {product.product_name}
                                </td>
                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                  {product.total_sold}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-300">
                                    #{index + 1}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="3"
                                className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                              >
                                No hay registros de productos destacados.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </article>

                  <div className="grid gap-4">
                    {showAuditPanel ? (
                      <article className={`${cardClass} p-6`}>
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                            <Clock3 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                              Bitacora
                            </p>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                              Actividad reciente
                            </h2>
                          </div>
                        </div>

                        {auditLoading ? (
                          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                            Cargando bitacora...
                          </p>
                        ) : auditLogs.length ? (
                          <div className="mt-6 space-y-3">
                            {auditLogs.map((log) => (
                              <article
                                key={log.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <span
                                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getAuditTone(
                                      log.action
                                    )}`}
                                  >
                                    {formatAuditAction(log.action)}
                                  </span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {formatAuditTimestamp(log.timestamp)}
                                  </span>
                                </div>
                                <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                                  {log.user || "system"} - {log.entity || "ENTITY"}{" "}
                                  {log.entityId ? `#${log.entityId}` : ""}
                                </p>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                  {log.details || "Sin detalle adicional."}
                                </p>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                            No hay eventos recientes disponibles.
                          </p>
                        )}
                      </article>
                    ) : null}

                    <article className={`${cardClass} p-6`}>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Insights operativos
                      </p>
                      <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                        Lectura rapida del negocio
                      </h2>

                      <div className="mt-6 space-y-3">
                        {insights.map((item) => (
                          <div
                            key={item.title}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                          >
                            <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </article>
                  </div>
                </section>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}
