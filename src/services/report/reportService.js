import { analyticsRequest } from "../analytics/analyticsClient";

const downloadBlob = (blob, fileName) => {
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);
};

const extractFileName = (headers, fallback) => {
  const disposition = headers?.["content-disposition"] || "";
  const match = disposition.match(/filename=\"?([^\"]+)\"?/i);
  return match?.[1] || fallback;
};

const EXPORT_ENDPOINTS = Object.freeze({
  excel: {
    primary: "/reports/sales/excel",
    fallback: "/reports/exportar",
    fileName: "reporte-techcol.xlsx",
  },
  csv: {
    primary: "/reports/sales/csv",
    fallback: "/reports/exportar",
    fileName: "reporte-techcol.csv",
  },
});

const requestExport = async (format) => {
  const endpoint = EXPORT_ENDPOINTS[format];
  if (!endpoint) {
    throw new Error(`Formato de reporte no soportado: ${format}`);
  }

  try {
    return await analyticsRequest({
      url: endpoint.primary,
      method: "get",
      responseType: "blob",
    });
  } catch (primaryError) {
    const status = primaryError?.response?.status;
    if (status && status !== 404 && status !== 405) {
      throw primaryError;
    }

    return analyticsRequest({
      url: endpoint.fallback,
      method: "get",
      params: { format },
      responseType: "blob",
    });
  }
};

const downloadReport = async (format) => {
  const endpoint = EXPORT_ENDPOINTS[format];
  const response = await requestExport(format);

  const fileName = extractFileName(response.headers, endpoint.fileName);
  downloadBlob(response.data, fileName);
};

const reportService = {
  downloadSalesExcel: async () => {
    await downloadReport("excel");
  },

  downloadSalesCsv: async () => {
    await downloadReport("csv");
  },
};

export default reportService;
