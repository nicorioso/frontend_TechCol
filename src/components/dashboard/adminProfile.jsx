import Sidebar from "./sidebar";
import SeoHead from "../../seo/SeoHead";
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock3,
  Download,
  FileDown,
  ShieldCheck,
} from "lucide-react";
import reportService from "../../services/report/reportService";
import auditService from "../../services/audit/auditService";

const formatAuditTimestamp = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

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

export default function AdminProfile() {
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
        if (active) {
          setAuditLogs(logs.slice(0, 8));
        }
      } catch (error) {
        if (active) {
          const backendMessage =
            typeof error?.response?.data === "string"
              ? error.response.data
              : error?.response?.data?.message;
          setAuditError(backendMessage || "No se pudo cargar la bitacora reciente.");
        }
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
      if (type === "csv") {
        await reportService.downloadSalesCsv();
      } else {
        await reportService.downloadSalesPdf();
      }

      setMessage({
        type: "success",
        text: `Reporte ${type.toUpperCase()} generado correctamente.`,
      });
    } catch (error) {
      const backendMessage =
        typeof error?.response?.data === "string"
          ? error.response.data
          : error?.response?.data?.message;
      setMessage({
        type: "error",
        text: backendMessage || `No se pudo exportar el reporte ${type.toUpperCase()}.`,
      });
    } finally {
      setExporting("");
    }
  };

  return (
    <>
      <SeoHead routeKey="private" override={{ path: "/admin/profile", title: "Panel Administrativo | TechCol" }} />
      <div className="flex">
        <Sidebar
          content={
            <div className="flex-1 space-y-6 p-10">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-300">
                  <ShieldCheck className="h-4 w-4" />
                  Centro administrativo
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
                  Reportes y evidencias de entrega
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                  Desde aqui puedes exportar ventas en CSV o PDF para soporte academico, seguimiento comercial y evidencias de auditoria.
                </p>
              </div>

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

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Reporte de ventas CSV
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Exporta pedidos, cliente, estado, items y total para hojas de calculo.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExport("csv")}
                    disabled={exporting === "csv"}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                  >
                    <Download className="h-4 w-4" />
                    {exporting === "csv" ? "Exportando..." : "Exportar CSV"}
                  </button>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <FileDown className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Reporte de ventas PDF
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Genera una evidencia formal lista para anexar a entregas o revisiones.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExport("pdf")}
                    disabled={exporting === "pdf"}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Download className="h-4 w-4" />
                    {exporting === "pdf" ? "Exportando..." : "Exportar PDF"}
                  </button>
                </div>
              </div>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    <Clock3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Bitacora reciente
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Eventos auditados de login, compras y cambios de contrasena.
                    </p>
                  </div>
                </div>

                {auditLoading ? (
                  <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                    Cargando eventos de auditoria...
                  </p>
                ) : auditError ? (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                    {auditError}
                  </div>
                ) : auditLogs.length ? (
                  <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border-b border-slate-200 px-4 py-4 last:border-b-0 dark:border-slate-700"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {formatAuditAction(log.action)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {log.user || "system"} · {log.entity || "ENTITY"} {log.entityId ? `#${log.entityId}` : ""}
                            </p>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatAuditTimestamp(log.timestamp)}
                          </span>
                        </div>
                        {log.details ? (
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {log.details}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                    No hay eventos auditados disponibles todavia.
                  </p>
                )}
              </section>
            </div>
          }
        />
      </div>
    </>
  );
}
