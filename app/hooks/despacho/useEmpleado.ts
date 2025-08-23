"use client";

import { CreateEmpleadoDTO } from "@/app/types/empleado/create-empleado";
import { UpdateEmpleadoDTO } from "@/app/types/empleado/update-empleado";
import { EmpleadoBaja, EmpleadoDTO } from "@/app/types/empleado/ver-empleado";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export interface PaginatedEmpleadosResponse {
  data: EmpleadoDTO[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/empleado`;
const API_URL_BAJAS = `${process.env.NEXT_PUBLIC_API_URL}/empleado/bajas`;
// --- API Functions with token ---

const fetchEmpleados = async (
  token: string, 
  page: number, 
  limit: number
): Promise<PaginatedEmpleadosResponse> => {
  const { data } = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Pass pagination parameters to the API
    params: {
      page,
      limit,
    },
  });
  return data;
};
/**
 * Fetches all employees belonging to a specific despacho.
 * This endpoint does not support pagination.
 * @param token - The authentication token.
 * @param despachoName - The name of the despacho to filter by.
 * @returns A promise that resolves to an array of Empleado objects.
 */
const fetchEmpleadosByDespacho = async (
  token: string,
  despachoName: string
): Promise<EmpleadoDTO[]> => {
  // The API endpoint is /empleado/despacho and it uses a query parameter 'name'
  const { data } = await axios.get(`${API_URL}/despacho`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      name: despachoName,
    },
  });
  // Assuming the API returns the array of employees directly.
  // If it returns { data: Empleado[] }, you would use "return data.data;"
  return data;
};

const addEmpleado = async ({
  empleado,
  token,
}: {
  empleado: CreateEmpleadoDTO;
  token: string;
}): Promise<EmpleadoDTO> => {
  const { data } = await axios.post(API_URL, empleado, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const updateEmpleado = async ({
  empleado,
  token,
}: {
  empleado: CreateEmpleadoDTO & { id: string };
  token: string;
}): Promise<EmpleadoDTO> => {
  const { data } = await axios.patch(`${API_URL}/${empleado.id}`, empleado, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const deleteEmpleado = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Fetches the list of employees who have left the company.
 * @param token - The authentication JWT token.
 * @returns A promise that resolves to an array of EmpleadoBaja.
 */
const fetchBajas = async (token: string): Promise<EmpleadoBaja[]> => {
  const { data } = await axios.get(API_URL_BAJAS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// --- React Query Hooks ---

// --- Custom Hook to GET Empleados ---
export const useGetEmpleados = (token: string | undefined, page: number, limit: number) => {
  return useQuery<PaginatedEmpleadosResponse, Error>({
    // The query key is an array that uniquely identifies this data.
    // When page or limit changes, React Query will refetch automatically.
    queryKey: ['empleados', page, limit],
    queryFn: () => fetchEmpleados(token!, page, limit),
    // Only run the query if the token exists
    enabled: !!token,
    // Optional: Keep previous data visible while new data is loading
    //keepPreviousData: true, 
  });
};

export const useAddEmpleado = () => {
  const queryClient = useQueryClient();
  return useMutation<
    EmpleadoDTO,
    AxiosError,
    { empleado: CreateEmpleadoDTO; token: string }
  >({
    mutationFn: addEmpleado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
    },
    onError: (error) => {
      console.error("Error adding empleado:", error.response?.data || error.message);
    },
  });
};

export const useUpdateEmpleado = () => {
  const queryClient = useQueryClient();
  return useMutation<
    EmpleadoDTO,
    AxiosError,
    { empleado: CreateEmpleadoDTO & { id: string }; token: string }
  >({
    mutationFn: updateEmpleado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
    },
    onError: (error) => {
      console.error("Error updating empleado:", error.response?.data || error.message);
    },
  });
};

export const useDeleteEmpleado = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, { id: string; token: string }>({
    mutationFn: deleteEmpleado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
    },
    onError: (error) => {
      console.error("Error deleting empleado:", error.response?.data || error.message);
    },
  });
};

/**
 * Custom hook to get the list of employees who have left the company.
 * @param token - The authentication token.
 */
export const useGetBajas = (token: string) => {
  return useQuery<EmpleadoBaja[], Error>({
    queryKey: ['empleadosBajas'],
    queryFn: () => fetchBajas(token),
    enabled: !!token, // The query will only run if the token exists
    staleTime: 1000 * 60 * 5, // Optional: Cache data for 5 minutes
  });
};

/**
 * React Query hook to get all employees for a given despacho.
 * @param token - The user's authentication token.
 * @param despachoName - The name of the despacho.
 * @returns The result of the useQuery hook.
 */
export const useGetEmpleadosByDespacho = (token: string | undefined, despachoName: string | undefined) => {
  return useQuery<EmpleadoDTO[], Error>({
    // The query key uniquely identifies this data.
    // It will refetch if 'despachoName' changes.
    queryKey: ['empleadosByDespacho', despachoName],
    
    // The query function calls our new fetcher.
    queryFn: () => fetchEmpleadosByDespacho(token!, despachoName!),
    
    // The query will only run if both the token and despachoName are provided.
    enabled: !!token && !!despachoName,
  });
};

// +++ END: NEW HOOK FOR SUPERVISOR +++

