// hooks/useGetDailyReport.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
// Define your DailyReport type if you haven't already
interface DailyReport {
  AsistenciaTotal: number;
  FaltasTotal: number;
  Descanso: number;
  Tarde: number;
  AsistenciaMatutina: number;
  FaltasMatutina: number;
  AsistenciaVespertina: number;
  FaltasVespertina: number;
  Bajas: number;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/estadisticas`;
const API_URL_BY_DESPACHO = `${process.env.NEXT_PUBLIC_API_URL}/estadisticas/despacho`;
const fetchDailyReport = async (token: string, reportDateString: string): Promise<DailyReport> => {
    const { data } = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Use the 'params' option to correctly build the query string:
      // ?reportDate=...
      params: {
        reportDate: reportDateString,
      },
    });
    return data;
  };
  
  /**
   * Custom hook to get the daily report.
   * @param token - The authentication token.
   * @param reportDate - The pre-formatted, stable date string for the report.
   */
  export const useGetDailyReport = (token: string, reportDate: string) => {
    return useQuery<DailyReport, Error>({
      // The query key is now stable because 'reportDate' comes from state
      queryKey: ['dailyReport', reportDate],
      queryFn: () => fetchDailyReport(token, reportDate),
      enabled: !!token && !!reportDate,
    });
  };


  const fetchDailyReportByDespacho = async (
    token: string,
    reportDateString: string,
    idDespacho: number,
  ): Promise<DailyReport> => {
    const { data } = await axios.get(`${API_URL_BY_DESPACHO}/${idDespacho}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        reportDate: reportDateString,
      },
    });
    return data;
  };
  
  /**
   * Custom hook to get the daily report scoped to a despacho.
   */
  export const useGetDailyReportByDespacho = (
    token: string,
    reportDate: string,
    idDespacho?: number,
  ) => {
    return useQuery<DailyReport, Error>({
      queryKey: ['dailyReportByDespacho', reportDate, idDespacho],
      queryFn: () =>
        fetchDailyReportByDespacho(token, reportDate, idDespacho as number),
      enabled: !!token && !!reportDate && !!idDespacho, // only run when all are present
    });
  };