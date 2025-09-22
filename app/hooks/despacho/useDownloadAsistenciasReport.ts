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
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `asistencias_${idDespacho}_${startDate}_${endDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      // 👇 rethrow so page.tsx can handle
      throw err;
    }
  };

  return { downloadReport };
};