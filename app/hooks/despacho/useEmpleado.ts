"use client";

import { CreateEmpleadoDTO } from "@/app/types/empleado/create-empleado";
import { UpdateEmpleadoDTO } from "@/app/types/empleado/update-empleado";
import { EmpleadoDTO } from "@/app/types/empleado/ver-empleado";
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
  empleado: UpdateEmpleadoDTO & { id: string };
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
    { empleado: UpdateEmpleadoDTO & { id: string }; token: string }
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

export const useDeleteEmpleado = (token: string) => {
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