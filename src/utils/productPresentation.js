import config from "../config/config";

const CATEGORY_RULES = [
  { category: "Procesadores", keywords: ["intel", "ryzen", "cpu", "procesador"] },
  { category: "Tarjetas Graficas", keywords: ["rtx", "gtx", "radeon", "gpu", "grafica"] },
  { category: "Memoria", keywords: ["ram", "ddr"] },
  { category: "Almacenamiento", keywords: ["ssd", "hdd", "nvme", "disco"] },
  { category: "Placas Madre", keywords: ["motherboard", "placa", "b650", "z790", "x670"] },
  { category: "Fuentes", keywords: ["fuente", "psu", "watt", "gold", "bronze"] },
  { category: "Refrigeracion", keywords: ["cooler", "fan", "liquid", "water", "refriger"] },
  { category: "Cases", keywords: ["case", "gabinete", "chasis"] },
  { category: "Monitores", keywords: ["monitor", "hz", "panel"] },
];

export const inferCategory = (product) => {
  const source = `${product?.product_name ?? product?.productName ?? ""} ${product?.description ?? ""}`.toLowerCase();
  const rule = CATEGORY_RULES.find((entry) =>
    entry.keywords.some((keyword) => source.includes(keyword))
  );
  return rule?.category ?? "Componentes";
};

export const buildProductImageUrl = (imageName) => {
  if (!imageName) return "";
  if (String(imageName).startsWith("http")) return imageName;

  const host = config.api.baseURL.replace(/\/+$/, "");
  const uploadsPath = config.uploadsPath.replace(/\/+$/, "");
  return `${host}${uploadsPath}/${imageName}`;
};

export const normalizeProduct = (item = {}) => ({
  ...item,
  productId: item?.product_id ?? item?.id,
  displayName: item?.product_name ?? item?.productName ?? "Producto",
  category: inferCategory(item),
  image: buildProductImageUrl(item?.imageUrl ?? item?.image),
  stockAmount: Number(item?.stock ?? 0),
  priceAmount: Number(item?.price ?? 0),
  description:
    item?.description?.trim() ||
    "Componente de alto rendimiento seleccionado para configuraciones gamer, profesionales y upgrades confiables.",
});

export const buildProductHighlights = (product) => {
  const description = String(product?.description || "");
  const pieces = description
    .split(/[.!?]+/)
    .map((piece) => piece.trim())
    .filter(Boolean)
    .slice(0, 4);

  if (pieces.length > 0) {
    return pieces;
  }

  return [
    "Rendimiento estable para configuraciones modernas.",
    "Compatibilidad pensada para upgrades y ensambles actuales.",
    "Ideal para equipos gamer, oficina avanzada y estaciones de trabajo.",
  ];
};
