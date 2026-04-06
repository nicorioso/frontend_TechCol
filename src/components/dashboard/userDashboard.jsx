import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useSearchParams } from "react-router-dom";
import { useOrdersHook } from "../../hooks/useOrdersHook";
import { images } from "../../assets/img/img_url";
import UserService from "../../services/customer/UserService";
import { normalizePhoneToE164 } from "../../utils/phone";
import {
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Download,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

const DATE_FORMAT_OPTIONS = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

const STATUS_META = {
  delivered: {
    label: "Entregado",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  paid: {
    label: "En proceso",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    icon: Clock3,
  },
  pending: {
    label: "Pendiente",
    className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    icon: ShoppingBag,
  },
  default: {
    label: "Desconocido",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
    icon: ShoppingBag,
  },
};

const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "ordenes", label: "Mis ordenes" },
  { id: "cuenta", label: "Mi cuenta" },
];
const TAB_IDS = new Set(TABS.map((tab) => tab.id));
const getValidTab = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  return TAB_IDS.has(normalized) ? normalized : "resumen";
};

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const formatPrice = (price) => {
  const amount = Number.parseFloat(price ?? 0);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Number.isNaN(amount) ? 0 : amount);
};

const formatDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("es-ES", DATE_FORMAT_OPTIONS);
};

const getOrderStatusMeta = (status) =>
  STATUS_META[String(status ?? "").toLowerCase()] || STATUS_META.default;

const getSafeString = (value) => String(value ?? "").trim();
const getProductName = (detail) =>
  detail?.product?.productName ??
  detail?.product?.name ??
  detail?.product?.product_name ??
  "Producto";
const getProductImage = (detail) =>
  detail?.product?.productImage ??
  detail?.product?.imageUrl ??
  detail?.product?.image ??
  detail?.product?.product_image ??
  "";
const getDetailTotal = (detail) => {
  const quantity = Number(detail?.quantity ?? 0);
  const unitPrice = Number.parseFloat(detail?.unitPrice ?? 0);
  return quantity * (Number.isNaN(unitPrice) ? 0 : unitPrice);
};
const formatPdfCurrency = (price) => {
  const amount = Number.parseFloat(price ?? 0);
  const safeAmount = Number.isNaN(amount) ? 0 : amount;
  return `COP ${new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeAmount)}`;
};
const drawRoundedBlock = (doc, x, y, width, height, fillColor) => {
  doc.setFillColor(...fillColor);
  doc.roundedRect(x, y, width, height, 6, 6, "F");
};
const drawInvoiceHeaderBlock = (doc, width, height, fillColor) => {
  doc.setFillColor(...fillColor);
  doc.rect(0, 0, width, 10, "F");
  doc.roundedRect(0, 0, width, height, 6, 6, "F");
};
const loadImageDataUrl = (src) =>
  new Promise((resolve, reject) => {
    if (!src) {
      resolve(null);
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("No fue posible preparar el logo para la factura."));
          return;
        }

        context.drawImage(image, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: canvas.width,
          height: canvas.height,
        });
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => reject(new Error("No fue posible cargar el logo de TechCol."));
    image.src = src;
  });
const createInvoicePdf = async ({ order, customerFirstName, customerLastName, customerEmail }) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const statusMeta = getOrderStatusMeta(order?.status);
  const details = Array.isArray(order?.orderDetails) ? order.orderDetails : [];
  const logoAsset = await loadImageDataUrl(images?.TechCol_logo?.url);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const accent = [6, 182, 212];
  const accentSoft = [236, 254, 255];
  const accentDeep = [8, 145, 178];
  const slate900 = [15, 23, 42];
  const slate700 = [51, 65, 85];
  const slate500 = [100, 116, 139];
  const slate300 = [203, 213, 225];
  const slate200 = [226, 232, 240];
  const white = [255, 255, 255];
  const cardBg = [248, 250, 252];

  drawInvoiceHeaderBlock(doc, pageWidth, 60, slate900);
  doc.setFillColor(14, 116, 144);
  doc.circle(pageWidth - 16, 11, 17, "F");
  doc.setFillColor(...accent);
  doc.circle(pageWidth - 1, 22, 23, "F");
  const totalCardX = pageWidth - 77;
  const contentRightEdge = totalCardX - 10;
  const headerTextWidth = contentRightEdge - margin;

  if (logoAsset?.dataUrl) {
    const maxLogoWidth = 34;
    const maxLogoHeight = 12;
    const logoRatio = (logoAsset.width || 1) / (logoAsset.height || 1);
    let logoWidth = maxLogoWidth;
    let logoHeight = logoWidth / logoRatio;

    if (logoHeight > maxLogoHeight) {
      logoHeight = maxLogoHeight;
      logoWidth = logoHeight * logoRatio;
    }

    doc.addImage(logoAsset.dataUrl, "PNG", margin, 8, logoWidth, logoHeight);
  } else {
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("TechCol", margin, 16.5);
  }

  const titleText = `Factura del pedido #${order?.orderId ?? "-"}`;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...white);
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(titleText, headerTextWidth);
  doc.text(titleLines, margin, 30.5);
  const titleBottomY = 30.5 + (titleLines.length - 1) * 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(225, 232, 240);
  const subtitleLines = doc.splitTextToSize(
    "Documento generado para consulta, soporte y seguimiento de compra.",
    headerTextWidth
  );
  const subtitleStartY = titleBottomY + 8;
  doc.text(subtitleLines, margin, subtitleStartY);

  const subtitleBottomY = subtitleStartY + (subtitleLines.length - 1) * 4.8;
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.3);
  const dividerY = subtitleBottomY + 4.5;
  doc.line(margin, dividerY, contentRightEdge, dividerY);
  doc.setTextColor(...white);
  doc.setFontSize(8.5);
  doc.text("Factura digital emitida por TechCol", margin, dividerY + 5.5);

  drawRoundedBlock(doc, pageWidth - 77, 15, 61, 32, [255, 255, 255]);
  doc.setDrawColor(220, 227, 235);
  doc.roundedRect(pageWidth - 77, 15, 61, 32, 7, 7, "S");
  doc.setTextColor(...slate500);
  doc.setFontSize(7.8);
  doc.text("TOTAL FACTURADO", pageWidth - 72, 23.5);
  doc.setTextColor(...slate900);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(formatPdfCurrency(order?.orderPrice), pageWidth - 72, 33.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...slate700);
  doc.text("Metodo de pago: PayPal", pageWidth - 72, 40.5);
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.8);
  doc.line(pageWidth - 72, 27, pageWidth - 56, 27);

  const cardTop = 68;
  const cardWidth = (pageWidth - margin * 2 - 8) / 3;
  const cardHeight = 34;
  const cardXs = [margin, margin + cardWidth + 4, margin + (cardWidth + 4) * 2];
  const cardData = [
    {
      title: "Cliente",
      lines: [
        customerFirstName || "Usuario TechCol",
        customerLastName || customerEmail || "Sin apellidos",
      ],
    },
    {
      title: "Fecha y referencia",
      lines: [formatDate(order?.orderDate ?? order?.createdAt), order?.paypalOrderId ?? "No disponible"],
    },
    {
      title: "Estado",
      lines: [statusMeta.label, "Pedido registrado en TechCol"],
    },
  ];

  cardData.forEach((card, index) => {
    drawRoundedBlock(doc, cardXs[index], cardTop, cardWidth, cardHeight, cardBg);
    doc.setDrawColor(...slate200);
    doc.roundedRect(cardXs[index], cardTop, cardWidth, cardHeight, 5, 5, "S");
    doc.setFillColor(...(index === 2 ? accentSoft : [241, 245, 249]));
    doc.roundedRect(cardXs[index] + 4, cardTop + 4, 14, 5.5, 2.5, 2.5, "F");
    const textWidth = cardWidth - 8;
    const firstLineText = String(card.lines[0] ?? "");
    const secondLineText = String(card.lines[1] ?? "");
    const firstLines = doc.splitTextToSize(firstLineText, textWidth);
    const secondLines = doc.splitTextToSize(secondLineText, textWidth);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(...(index === 2 ? accentDeep : slate500));
    doc.text(card.title.toUpperCase(), cardXs[index] + 6, cardTop + 7.6);

    if (card.title === "Cliente") {
      const primaryNameLines = firstLines.slice(0, 2);
      const lastNameLines = secondLines.slice(0, 2);
      const firstBlockY = cardTop + 16;
      const firstBlockHeight = Math.max(primaryNameLines.length - 1, 0) * 4.2;
      const secondBlockY = firstBlockY + firstBlockHeight + 5.2;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.2);
      doc.setTextColor(...slate900);
      doc.text(primaryNameLines, cardXs[index] + 4, firstBlockY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.6);
      doc.setTextColor(...slate900);
      doc.text(lastNameLines, cardXs[index] + 4, secondBlockY);
      return;
    }

    doc.setFont("helvetica", index === 2 ? "bold" : "normal");
    doc.setFontSize(index === 2 ? 12 : 10.2);
    doc.setTextColor(...slate900);
    doc.text(firstLines.slice(0, 2), cardXs[index] + 4, cardTop + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(index === 2 ? 8.2 : 7.8);
    doc.setTextColor(...(index === 2 ? slate700 : slate500));
    doc.text(secondLines.slice(0, 2), cardXs[index] + 4, cardTop + 28);
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...slate900);
  doc.text("Productos del pedido", margin, 113);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(...slate500);
  doc.text(
    `${details.length} ${details.length === 1 ? "producto" : "productos"} en esta factura`,
    margin,
    119
  );

  autoTable(doc, {
    startY: 125,
    head: [["Producto", "Cantidad", "Unitario", "Subtotal"]],
    body: details.length
      ? details.map((detail) => [
          getProductName(detail),
          String(detail?.quantity ?? 0),
          formatPdfCurrency(detail?.unitPrice),
          formatPdfCurrency(getDetailTotal(detail)),
        ])
      : [["No hay productos detallados disponibles para este pedido.", "", "", ""]],
    theme: "grid",
    margin: { left: margin, right: margin },
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: { top: 5, right: 4.5, bottom: 5, left: 4.5 },
      lineColor: [229, 231, 235],
      lineWidth: 0.2,
      textColor: slate900,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [239, 250, 252],
      textColor: slate700,
      fontStyle: "bold",
      halign: "left",
      lineColor: [214, 240, 245],
    },
    bodyStyles: {
      fillColor: white,
    },
    alternateRowStyles: {
      fillColor: [250, 252, 255],
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 24, halign: "center" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 30, halign: "right" },
    },
  });

  const finalY = doc.lastAutoTable?.finalY ?? 150;
  const footerTop = Math.min(finalY + 12, pageHeight - 44);
  drawRoundedBlock(doc, margin, footerTop, pageWidth - margin * 2, 30, [246, 250, 255]);
  doc.setDrawColor(...slate200);
  doc.roundedRect(margin, footerTop, pageWidth - margin * 2, 30, 5, 5, "S");
  drawRoundedBlock(doc, pageWidth - 52, footerTop + 3, 32, 24, [255, 255, 255]);
  doc.setDrawColor(...slate300);
  doc.roundedRect(pageWidth - 52, footerTop + 3, 32, 24, 4, 4, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...slate700);
  doc.text(
    doc.splitTextToSize(
      "Conserva esta factura para solicitudes de soporte, garantia o seguimiento de tu compra.",
      pageWidth - margin * 2 - 76
    ),
    margin + 4,
    footerTop + 9
  );
  doc.setTextColor(...slate900);
  doc.text("Gracias por comprar en TechCol.", margin + 4, footerTop + 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(...accentDeep);
  doc.text("TOTAL", pageWidth - 46, footerTop + 10);
  doc.setFontSize(15);
  doc.setTextColor(...slate900);
  doc.text(formatPdfCurrency(order?.orderPrice), pageWidth - 46, footerTop + 19);

  doc.save(`factura-pedido-${order?.orderId ?? "techcol"}.pdf`);
};

function LoadingState() {
  return (
    <div className="flex justify-center py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-cyan-600"></div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
      {message}
    </div>
  );
}

function EmptyOrdersState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800/40">
      <ShoppingBag className="mx-auto mb-3 h-4 w-4 text-slate-400" />
      <p className="text-slate-600 dark:text-slate-300">Aun no tienes ordenes registradas.</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sublabel }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-3 flex items-center gap-2 text-slate-500 dark:text-slate-300">
        <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      {sublabel ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sublabel}</p> : null}
    </div>
  );
}

function OrderCard({ order, index, onOpen }) {
  const statusMeta = getOrderStatusMeta(order?.status);
  const StatusIcon = statusMeta.icon;

  return (
    <button
      type="button"
      onClick={() => onOpen?.(order)}
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <StatusIcon className="h-4 w-4 text-slate-400" />
            <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">
              Orden #{order?.orderId ?? index + 1}
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {formatDate(order?.orderDate ?? order?.createdAt)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Rastreo: {order?.paypalOrderId ?? `TR${String(index + 1).padStart(10, "0")}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatPrice(order?.orderPrice)}</p>
          <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
            {statusMeta.label}
          </span>
        </div>
      </div>
    </button>
  );
}

function OrderDetailsModal({ order, onClose, customerFirstName, customerLastName, customerEmail }) {
  if (!order) return null;

  const statusMeta = getOrderStatusMeta(order?.status);
  const StatusIcon = statusMeta.icon;
  const details = Array.isArray(order?.orderDetails) ? order.orderDetails : [];
  const handleDownloadInvoice = async () => {
    await createInvoicePdf({ order, customerFirstName, customerLastName, customerEmail });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
              Detalle del pedido
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Orden #{order?.orderId ?? "-"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Realizada el {formatDate(order?.orderDate ?? order?.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              <Download className="h-4 w-4" />
              Descargar factura
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Cerrar detalle del pedido"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Estado</p>
              <div className="mt-3 flex items-center gap-2">
                <StatusIcon className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
                  {statusMeta.label}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total</p>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatPrice(order?.orderPrice)}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Rastreo</p>
              <p className="mt-3 break-all text-sm font-medium text-slate-900 dark:text-slate-100">
                {order?.paypalOrderId ?? "No disponible"}
              </p>
            </div>
          </div>

          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Productos del pedido</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {details.length} {details.length === 1 ? "producto" : "productos"}
              </p>
            </div>

            {details.length ? (
              <div className="space-y-3">
                {details.map((detail, index) => {
                  const productImage = getProductImage(detail);
                  return (
                    <div
                      key={detail?.orderDetailId ?? `${order?.orderId ?? "order"}-${index}`}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/40"
                    >
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={getProductName(detail)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="h-4 w-4 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                          {getProductName(detail)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Cantidad: {detail?.quantity ?? 0}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Unitario: {formatPrice(detail?.unitPrice)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Subtotal</p>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {formatPrice(getDetailTotal(detail))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-300">
                Esta orden no tiene productos detallados disponibles en este momento.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = getUserFromStorage();
  const customerId = user?.customerId ?? user?.customer_id ?? null;
  const customerFirstName = getSafeString(user?.customerName) || getSafeString(user?.name) || "Usuario";
  const customerLastName = getSafeString(user?.customerLastName);
  const customerName = [user?.customerName, user?.customerLastName].filter(Boolean).join(" ").trim() || user?.name || "Usuario";
  const customerEmail = user?.customerEmail ?? user?.email ?? "";
  const joinDate = user?.createdAt ? formatDate(user.createdAt) : "Reciente";
  const requestedTab = getValidTab(searchParams.get("tab"));

  const { orders, summary, loading, error } = useOrdersHook(customerId);
  const [activeTab, setActiveTab] = useState(requestedTab);
  const [profileForm, setProfileForm] = useState({
    customerName: getSafeString(user?.customerName),
    customerLastName: getSafeString(user?.customerLastName),
    customerEmail: getSafeString(customerEmail),
    customerPhoneNumber: getSafeString(user?.customerPhoneNumber),
  });
  const [profileInitial, setProfileInitial] = useState(profileForm);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setActiveTab(requestedTab);
  }, [requestedTab]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!customerId) return;
      setProfileLoading(true);
      try {
        const profile = await UserService.getProfile(customerId);
        const source = profile?.customer || profile || {};
        const mapped = {
          customerName: getSafeString(source?.customerName ?? source?.name),
          customerLastName: getSafeString(source?.customerLastName),
          customerEmail: getSafeString(source?.customerEmail ?? source?.email),
          customerPhoneNumber: getSafeString(source?.customerPhoneNumber ?? source?.phone),
        };
        setProfileForm(mapped);
        setProfileInitial(mapped);
      } catch {
        setProfileMessage({ type: "error", text: "No se pudo cargar tu informacion de perfil." });
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [customerId]);

  const recentOrders = useMemo(() => {
    if (!orders.length) return [];
    return [...orders]
      .sort((a, b) => new Date(b.orderDate ?? b.createdAt) - new Date(a.orderDate ?? a.createdAt))
      .slice(0, 3);
  }, [orders]);

  const tabs = useMemo(
    () => TABS.map((tab) => (tab.id === "ordenes" ? { ...tab, badge: summary.totalOrders } : tab)),
    [summary.totalOrders]
  );

  const hasProfileChanges = useMemo(
    () =>
      Object.keys(profileInitial).some((key) => getSafeString(profileForm[key]) !== getSafeString(profileInitial[key])),
    [profileForm, profileInitial]
  );

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileMessage({ type: "", text: "" });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const nextParams = new URLSearchParams(searchParams);

    if (tabId === "resumen") {
      nextParams.delete("tab");
    } else {
      nextParams.set("tab", tabId);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!customerId) {
      setProfileMessage({ type: "error", text: "No se pudo identificar al usuario actual." });
      return;
    }
    if (!hasProfileChanges) {
      setProfileMessage({ type: "info", text: "No hay cambios para guardar." });
      return;
    }

    setProfileSaving(true);
    try {
      const normalizedPhone = profileForm.customerPhoneNumber
        ? normalizePhoneToE164(profileForm.customerPhoneNumber, { defaultCountryCode: "+57" })
        : "";
      if (profileForm.customerPhoneNumber && !normalizedPhone) {
        setProfileMessage({
          type: "error",
          text: "El telefono debe estar en formato internacional E.164, por ejemplo +573001234567.",
        });
        setProfileSaving(false);
        return;
      }

      const payload = {
        customerName: getSafeString(profileForm.customerName),
        customerLastName: getSafeString(profileForm.customerLastName),
        customerEmail: getSafeString(profileForm.customerEmail),
        customerPhoneNumber: normalizedPhone,
      };

      const response = await UserService.patchProfile(customerId, payload);
      const source = response?.customer || response?.user || response || payload;
      const next = {
        customerName: getSafeString(source?.customerName ?? payload.customerName),
        customerLastName: getSafeString(source?.customerLastName ?? payload.customerLastName),
        customerEmail: getSafeString(source?.customerEmail ?? source?.email ?? payload.customerEmail),
        customerPhoneNumber: getSafeString(source?.customerPhoneNumber ?? source?.phone ?? payload.customerPhoneNumber),
      };

      setProfileForm(next);
      setProfileInitial(next);
      setProfileMessage({ type: "success", text: "Tu informacion se actualizo correctamente." });

      const currentRaw = localStorage.getItem("user");
      const currentParsed = currentRaw ? JSON.parse(currentRaw) : {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentParsed,
          customerName: next.customerName,
          customerLastName: next.customerLastName,
          customerEmail: next.customerEmail,
          email: next.customerEmail,
          customerPhoneNumber: next.customerPhoneNumber,
        })
      );
    } catch {
      setProfileMessage({ type: "error", text: "No se pudo guardar la informacion. Intenta nuevamente." });
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-100 via-slate-50 to-white px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 sm:px-8 lg:px-12">
      <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/60 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300">
              <Sparkles className="h-4 w-4" />
              Panel cliente
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Hola, {customerName}</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Gestiona tus pedidos y datos de cuenta desde un solo lugar.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <p className="font-semibold">{customerEmail || "Sin correo"}</p>
            <p className="text-xs opacity-80">Miembro desde {joinDate}</p>
          </div>
        </div>
      </section>

      <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800/60">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
            {tab.badge > 0 ? <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      {activeTab === "resumen" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total gastado" value={formatPrice(summary.totalSpent)} sublabel="Historial completo" icon={Sparkles} />
            <StatCard label="Ordenes" value={summary.totalOrders} sublabel="Pedidos realizados" icon={ShoppingBag} />
            <StatCard label="Entregadas" value={summary.delivered} sublabel="Completadas" icon={CheckCircle2} />
            <StatCard label="Pendientes" value={summary.pending} sublabel="Aun en curso" icon={Clock3} />
          </div>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Ordenes recientes</h2>
              {summary.totalOrders > 3 ? (
                <button
                  type="button"
                  onClick={() => handleTabChange("ordenes")}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  Ver todas
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} />
            ) : recentOrders.length ? (
              <div className="grid gap-3">
                {recentOrders.map((order, index) => (
                  <OrderCard
                    key={order.orderId ?? index}
                    order={order}
                    index={index}
                    onOpen={setSelectedOrder}
                  />
                ))}
              </div>
            ) : (
              <EmptyOrdersState />
            )}
          </section>
        </div>
      ) : null}

      {activeTab === "ordenes" ? (
        <section className="space-y-4">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : orders.length ? (
            orders.map((order, index) => (
              <OrderCard
                key={order.orderId ?? index}
                order={order}
                index={index}
                onOpen={setSelectedOrder}
              />
            ))
          ) : (
            <EmptyOrdersState />
          )}
        </section>
      ) : null}

      {activeTab === "cuenta" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-100 p-2 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
              <CircleUserRound className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Informacion personal</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Actualiza tus datos de perfil.</p>
            </div>
          </div>

          {profileMessage.text ? (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                profileMessage.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : profileMessage.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                    : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
              }`}
            >
              {profileMessage.text}
            </div>
          ) : null}

          {profileLoading ? (
            <LoadingState />
          ) : (
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Nombre</label>
                <input
                  type="text"
                  name="customerName"
                  value={profileForm.customerName}
                  onChange={handleProfileChange}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Apellido</label>
                <input
                  type="text"
                  name="customerLastName"
                  value={profileForm.customerLastName}
                  onChange={handleProfileChange}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Correo</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={profileForm.customerEmail}
                  onChange={handleProfileChange}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
                  required
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Telefono</label>
                <input
                  type="tel"
                  name="customerPhoneNumber"
                  value={profileForm.customerPhoneNumber}
                  onChange={handleProfileChange}
                  placeholder="+57 300 123 4567"
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {profileSaving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </section>
      ) : null}

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        customerFirstName={profileForm.customerName || customerFirstName}
        customerLastName={profileForm.customerLastName || customerLastName}
        customerEmail={customerEmail}
      />
    </div>
  );
}
