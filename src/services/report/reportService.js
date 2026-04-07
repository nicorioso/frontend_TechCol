import axios from "axios";
import { ANALYTICS_API_URL } from "../../config/config";
import { getToken } from "../../utils/authSession";

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

const downloadReport = async (format, fallbackFileName) => {
  const response = await axios.get(`${ANALYTICS_API_URL}/reports/exportar`, {
    params: { format },
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const fileName = extractFileName(response.headers, fallbackFileName);
  downloadBlob(response.data, fileName);
};

const reportService = {
  downloadSalesExcel: async () => {
    await downloadReport("excel", "reporte-techcol.xlsx");
  },

  downloadSalesCsv: async () => {
    await downloadReport("csv", "reporte-techcol.csv");
  },
};

export default reportService;
