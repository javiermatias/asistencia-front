import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// --- Base URL and Type Definitions ---
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/horario`;

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

// --- API Fetching Functions ---

// Fetches the schedule for a specific employee
const fetchHorarioByEmpleado = async (employeeId: string): Promise<HorarioAPIResponse[]> => {
  const { data } = await axios.get(`${API_BASE_URL}/${employeeId}`);
  return data;
};

// Fetches the list of all possible shifts
const fetchAllTurnos = async (): Promise<Turno[]> => {
  const { data } = await axios.get(`${API_BASE_URL}/turnos`); // Assumed endpoint
  return data;
};

// Updates the schedule for a specific employee
const updateHorario = async ({ employeeId, horarios }: { employeeId: string, horarios: HorarioPayload[] }) => {
  const payload = { horarios };
  const { data } = await axios.patch(`${API_BASE_URL}/horario/user/${employeeId}`, payload);
  return data;
};


// --- The Custom Hook ---
export const useHorario = (employeeId: string) => {
  const queryClient = useQueryClient();

  // useQuery to fetch both schedule and all shifts concurrently
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    // A unique key for this query. employeeId ensures it re-fetches if the ID changes.
    queryKey: ['horario', employeeId],
    // The query function fetches both sets of data.
    queryFn: () => Promise.all([
        fetchHorarioByEmpleado(employeeId),
        fetchAllTurnos()
    ]),
    // This query should only run if employeeId is a valid, truthy value.
    enabled: !!employeeId,
  });

  // useMutation for handling the PATCH request to save changes
  const updateHorarioMutation = useMutation({
    mutationFn: updateHorario,
    // When the mutation is successful, we want to update our cached data.
    onSuccess: () => {
      // Invalidate the query for this employee's schedule.
      // This tells react-query that the data is stale and should be re-fetched.
      // The UI will then automatically update with the fresh data.
      queryClient.invalidateQueries({ queryKey: ['horario', employeeId] });
    },
  });

  return {
    // Data from useQuery. We can rename them for clarity.
    existingSchedule: data?.[0], // First element from Promise.all
    allTurnos: data?.[1],        // Second element
    isLoading,
    isError,
    error,
    // The mutation object, which includes status and the mutate function
    updateHorarioMutation,
  };
};