

import { Inasistencia } from '@/app/types/empleado/inasistencia';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/asistencia`;

/**
 * Fetches the absence report from the API for a given date range.
 * @param token - The authentication token.
 * @param startDate - The start date in 'YYYY-MM-DD' format.
 * @param endDate - The end date in 'YYYY-MM-DD' format.
 * @returns A promise that resolves to an array of Inasistencia objects.
 */
const fetchInasistenciasPorRango = async (
  token: string,
  startDate: string,
  endDate: string
): Promise<Inasistencia[]> => {
  const { data } = await axios.get(`${API_URL}/inasistencias-por-rango`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Use the 'params' option to correctly build the query string:
    // ?startDate=...&endDate=...
    params: {
      startDate,
      endDate,
    },
  });
  return data;
};

/**
 * Custom hook to get the absence report for a date range.
 * @param token - The authentication token.
 * @param startDate - The start date for the report ('YYYY-MM-DD').
 * @param endDate - The end date for the report ('YYYY-MM-DD').
 */
export const useGetInasistencias = (
  token: string | undefined,
  startDate: string,
  endDate: string
) => {
  return useQuery<Inasistencia[], Error>({
    // The query key is an array that uniquely identifies this query.
    // It will refetch automatically when startDate or endDate changes.
    queryKey: ['inasistencias', startDate, endDate],
    
    queryFn: () => {
        // Ensure token is not undefined before making the call
        if (!token) {
            return Promise.reject(new Error('Authentication token is missing.'));
        }
        return fetchInasistenciasPorRango(token, startDate, endDate);
    },

    // The query will only run if the token and dates are available.
    // This prevents API calls with invalid parameters on initial render.
    enabled: !!token && !!startDate && !!endDate,
  });
};