import { EmpleadoConHorarios, Turno, UpdateHorarioPayload } from '@/app/types/horario';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';


// --- Base URL and Type Definitions ---
const API_HORARIO = `${process.env.NEXT_PUBLIC_API_URL}/horario`;
const API_TURNO = `${process.env.NEXT_PUBLIC_API_URL}/turno`;



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


///////////////////////////////////////////HORARIO DESPACHO///////////////////////////////////////////
const fetchHorariosPorDespacho = async (
  token: string,
  despachoId: number,
): Promise<EmpleadoConHorarios[]> => {
  const { data } = await axios.get(`${API_HORARIO}/despacho/${despachoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};


/**
 * Updates the schedules for multiple employees in a specific despacho.
 * Corresponds to: PATCH /horario/despacho/:id
 */
const updateHorariosPorDespacho = async ({
  token,
  despachoId,
  payload,
}: {
  token: string;
  despachoId: number;
  payload: UpdateHorarioPayload[];
}) => {
  const { data } = await axios.patch(
    `${API_HORARIO}/despacho/${despachoId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

export const useGetTurnos = (token: string) => {
  return useQuery<Turno[], Error>({
    // The key for this query
    queryKey: ['turnos'],
    // The function that will be called to fetch the data
    queryFn: () => fetchAllTurnos(token),
    // Only run the query if the token exists
    enabled: !!token,
    // Turnos don't change often, so we can consider the data "fresh" for a long time
    // to avoid unnecessary refetching.
    //staleTime: 1000 * 60 * 60, // 1 hour    
    //cacheTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * React Query hook to fetch schedules for a specific despacho.
 * @param token The user's JWT token.
 * @param despachoId The ID of the despacho to fetch, or null if none is selected.
 */
export const useGetHorariosPorDespacho = (
  token: string,
  despachoId: number | null,
) => {
  return useQuery<EmpleadoConHorarios[], Error>({
    // The query key is an array. It uniquely identifies this query's data.
    // By including `despachoId`, TanStack Query knows to refetch if the ID changes.
    queryKey: ['horarios', despachoId],

    // The query function only runs if `enabled` is true.
    // We use a non-null assertion `!` because `enabled` guarantees `despachoId` is not null.
    queryFn: () => fetchHorariosPorDespacho(token, despachoId!),

    // This is crucial: only run the query if both the token and a despachoId are available.
    enabled: !!token && !!despachoId,
  });
};

/**
 * React Query mutation hook to update the schedules for a despacho.
 * Use the `mutate` function returned by this hook to trigger the update.
 */
export const useUpdateHorariosPorDespacho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHorariosPorDespacho,

    // This function runs after the mutation is successful.
    onSuccess: (data, variables,context) => {
      console.log('Schedules updated successfully:', data);
      toast.success('¡Horarios guardados con éxito!', {
        id: context as any, // Use the ID from onMutate to update the correct toast
      });
      // This is the most important part for a good UX.
      // We invalidate the query for the specific despacho we just updated.
      // This tells React Query that the data is stale and triggers a refetch,
      // automatically updating the UI with the newly saved data.
      queryClient.invalidateQueries({ queryKey: ['horarios', variables.despachoId] });

      // You can also show a success notification here.
      // e.g., toast.success('Horarios guardados con éxito!');
    },

    // This function runs if the mutation fails.
    onError: (error,context) => {
      const errorMessage =
      (error as any)?.response?.data?.message ||
      'Error al guardar los horarios. Por favor, intente de nuevo.';
    
      toast.error(errorMessage, {
        id: context as any, // Use the ID from onMutate
      });
      console.error('Error updating schedules:', error);
      // Show an error notification to the user.
      // e.g., toast.error('Error al guardar los horarios. Por favor, intente de nuevo.');
    },
  });
};