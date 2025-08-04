import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

// --- Base URL and Type Definitions ---
const API_HORARIO = `${process.env.NEXT_PUBLIC_API_URL}/horario`;
const API_TURNO = `${process.env.NEXT_PUBLIC_API_URL}/turno`;

type Turno = {
  id: number;
  nombre: string;
};

type HorarioAPIResponse = {
  id: number;
  dia_semana: number;
  turno: Turno;
};

type HorarioPayload = {
  dia_semana: number;
  id_turno: number;
};

// --- API Fetching Functions with Authorization ---

// Fetches the schedule for a specific employee
const fetchHorarioByEmpleado = async ({
  employeeId,
  token,
}: {
  employeeId: string;
  token: string;
}): Promise<HorarioAPIResponse[]> => {
  const { data } = await axios.get(`${API_HORARIO}/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Fetches the list of all possible shifts
const fetchAllTurnos = async (token: string): Promise<Turno[]> => {
  const { data } = await axios.get(API_TURNO, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Updates the schedule for a specific employee
const updateHorario = async ({
  employeeId,
  horarios,
  token,
}: {
  employeeId: string;
  horarios: HorarioPayload[];
  token: string;
}) => {
  const payload = { horarios };
  const { data } = await axios.patch(`${API_HORARIO}/user/${employeeId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// --- React Query Hooks ---

/**
 * Custom hook to fetch an employee's schedule and all possible shifts.
 * @param employeeId - The ID of the employee.
 * @param token - The authentication token.
 */
export const useGetHorario = (employeeId: string, token: string) => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<[HorarioAPIResponse[], Turno[]], AxiosError>({
    // A unique key for this query. employeeId ensures it re-fetches if the ID changes.
    queryKey: ['horario', employeeId],
    // The query function fetches both sets of data concurrently.
    queryFn: () =>
      Promise.all([
        fetchHorarioByEmpleado({ employeeId, token }),
        fetchAllTurnos(token),
      ]),
    // This query should only run if both employeeId and token are valid, truthy values.
    enabled: !!employeeId && !!token,
  });

  return {
    // Data from useQuery. We can rename them for clarity.
    existingSchedule: data?.[0], // First element from Promise.all
    allTurnos: data?.[1],        // Second element
    isLoading,
    isError,
    error,
  };
};

/**
 * Custom hook to provide a mutation for updating an employee's schedule.
 */
export const useUpdateHorario = () => {
  const queryClient = useQueryClient();

  // Define the types for the mutation function
  type UpdateHorarioVariables = {
    employeeId: string;
    horarios: HorarioPayload[];
    token: string;
  };

  return useMutation<any, AxiosError, UpdateHorarioVariables>({
    mutationFn: updateHorario,
    // When the mutation is successful, we want to update our cached data.
    onSuccess: (data, variables) => {
      // Invalidate the query for the specific employee's schedule.
      // This tells react-query that the data is stale and should be re-fetched.
      // The UI will then automatically update with the fresh data.
      queryClient.invalidateQueries({ queryKey: ['horario', variables.employeeId] });
    },
    onError: (error) => {
      // Log errors to the console for debugging.
      console.error("Error updating horario:", error.response?.data || error.message);
    },
  });
};