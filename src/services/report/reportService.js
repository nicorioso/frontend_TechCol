import { axiosInstance } from "../api";

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
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
};

const reportService = {
  downloadSalesCsv: async () => {
    const response = await axiosInstance.get("/reports/sales/csv", {
      responseType: "blob",
    });
    const fileName = extractFileName(response.headers, "sales-report.csv");
    downloadBlob(response.data, fileName);
  },

  downloadSalesPdf: async () => {
    const response = await axiosInstance.get("/reports/sales/pdf", {
      responseType: "blob",
    });
    const fileName = extractFileName(response.headers, "sales-report.pdf");
    downloadBlob(response.data, fileName);
  },
};

export default reportService;
