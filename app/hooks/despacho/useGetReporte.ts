import { Asistencia } from '@/app/types/empleado/inasistencia';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


// Define the possible report types for type safety
export type ReportType =
  | 'asistencias'
  | 'inasistencias'
  | 'descansos'
  | 'tardes'
  | 'asistencias-matutinas'
  | 'faltas-matutinas'
  | 'asistencias-vespertinas'
  | 'faltas-vespertinas';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/estadisticas`;

/**
 * Fetches a specific report from the API for a given date range.
 * @param token - The authentication token.
 * @param reportType - The specific endpoint to hit (e.g., 'inasistencia', 'asistencias').
 * @param startDate - The start date in 'YYYY-MM-DD' format.
 * @param endDate - The end date in 'YYYY-MM-DD' format.
 * @returns A promise that resolves to an array of Asistencia objects.
 */
const fetchReporte = async (
  token: string,
  reportType: ReportType,
  startDate: string,
  endDate: string,
): Promise<Asistencia[]> => {
  // The URL is now dynamic based on the reportType
  const { data } = await axios.get(`${API_URL}/${reportType}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      startDate,
      endDate,
    },
  });
  return data;
};

/**
 * Custom hook to get a statistics report for a date range.
 * @param token - The authentication token.
 * @param reportType - The type of report to fetch.
 * @param startDate - The start date for the report ('YYYY-MM-DD').
 * @param endDate - The end date for the report ('YYYY-MM-DD').
 */
export const useGetReporte = (
  token: string | undefined,
  reportType: ReportType,
  startDate: string,
  endDate: string,
) => {
  return useQuery<Asistencia[], Error>({
    // The query key MUST include the reportType.
    // This ensures react-query fetches new data when the report type changes.
    queryKey: ['reporte', reportType, startDate, endDate],

    queryFn: () => {
      if (!token) {
        return Promise.reject(new Error('Authentication token is missing.'));
      }
      return fetchReporte(token, reportType, startDate, endDate);
    },

    // The query will only run if all parameters are available.
    enabled: !!token && !!reportType && !!startDate && !!endDate,
  });
};