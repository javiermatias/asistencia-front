// hooks/useDownloadAsistenciasReport.ts
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/estadisticas/asistencias`;

export const useDownloadAsistenciasReport = () => {
  const downloadReport = async (
    token: string,
    idDespacho: number,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await axios.get(`${API_URL}/${idDespacho}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { startDate, endDate },
        responseType: "blob", // required for binary files
      });

      // --- Try to extract filename from Content-Disposition ---
      const disposition = response.headers["content-disposition"];
      let filename = `asistencias_${idDespacho}_${startDate}_${endDate}.xlsx`; // fallback

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      // --- Create blob download link ---
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Cleanup blob URL
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      // Rethrow so the caller (page.tsx) can show a toast or handle it
      throw err;
    }
  };

  return { downloadReport };
};