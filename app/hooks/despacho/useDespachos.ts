"use client";

import { Despacho, Puesto } from '@/app/types/despacho';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/despacho`;
const API_PUESTO = `${process.env.NEXT_PUBLIC_API_URL}/puesto`;

// --- API Functions with token ---

const fetchDespachos = async (token: string): Promise<Despacho[]> => {
  const { data } = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const getDespachoById = async ({ id, token }: { id: string; token?: string }): Promise<Despacho> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const renovateDespachoQr = async ({ id, token }: { id: string; token?: string }): Promise<Despacho> => {
  // The backend endpoint returns the updated despacho object
  const response = await axios.post(`${API_URL}/${id}/renovate-qr`, {}, { // POST request with empty body
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const addDespacho = async ({
  despacho,
  token,
}: {
  despacho: Omit<Despacho, 'id'>;
  token: string;
}): Promise<Despacho> => {
  const { data } = await axios.post(API_URL, despacho, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const updateDespacho = async ({
  despacho,
  token,
}: {
  despacho: Despacho;
  token: string;
}): Promise<Despacho> => {
  const { data } = await axios.patch(`${API_URL}/${despacho.id}`, despacho, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const deleteDespacho = async ({
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

export const useGetDespachos = (token: string) => {
  return useQuery<Despacho[], Error>({
    queryKey: ['despachos'],
    queryFn: () => fetchDespachos(token),
    enabled: !!token, // only run if token is available
  });
};

export const useAddDespacho = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation<Despacho, AxiosError, { despacho: Omit<Despacho, 'id'>; token: string }>({
    mutationFn: addDespacho,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despachos'] });
    },
    onError: (error) => {
      console.error("Error adding despacho:", error.response?.data || error.message);
    },
  });
};

export const useUpdateDespacho = () => {
  const queryClient = useQueryClient();
  return useMutation<Despacho, AxiosError, { despacho: Despacho; token: string }>({
    mutationFn: updateDespacho,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despachos'] });
    },
    onError: (error) => {
      console.error("Error updating despacho:", error.response?.data || error.message);
    },
  });
};

export const useDeleteDespacho = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, { id: string; token: string }>({
    mutationFn: deleteDespacho,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despachos'] });
    },
    onError: (error) => {
      console.error("Error deleting despacho:", error.response?.data || error.message);
    },
  });
};


const fetchPuestos = async (token: string): Promise<Puesto[]> => {
  const { data } = await axios.get(API_PUESTO, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const useGetPuestos = (token: string) => {
  return useQuery<Puesto[], Error>({
    queryKey: ['puestos'],
    queryFn: () => fetchPuestos(token),
    enabled: !!token, // only run if token is available
  });
};


//====================================================================
// HOOK 1: useGetDespachoById
// ====================================================================
/**
 * Custom hook to fetch a single despacho by its ID.
 * @param id The ID of the despacho to fetch.
 * @param token The authentication token.
 */
export const useGetDespachoById = (id: string, token?: string) => {
  return useQuery<Despacho, AxiosError>({
    // The query key is an array that uniquely identifies this data.
    // When the id changes, React Query will automatically refetch.
    queryKey: ['despacho', id], 
    
    // The function that will be called to fetch the data.
    queryFn: () => getDespachoById({ id, token }),

    // This query will only run if both `id` and `token` are truthy.
    // This prevents unnecessary API calls.
    enabled: !!id && !!token,
  });
};


// ====================================================================
// HOOK 2: useRenovateDespachoQr
// ====================================================================
/**
 * Custom hook to create or renovate the QR token for a despacho.
 * It follows the mutation template you provided.
 */
export const useRenovateDespachoQr = () => {
  const queryClient = useQueryClient();

  return useMutation<Despacho, AxiosError, { id: string; token?: string }>({
    mutationFn: renovateDespachoQr,

    onSuccess: (updatedDespacho, variables) => {
      // After a successful mutation, we need to update our cached data.
      
      // 1. Invalidate the query for the main list of despachos.
      // This will cause the DespachoPage to refetch and show the "SI"/"NO" status correctly.
      queryClient.invalidateQueries({ queryKey: ['despachos'] });

      // 2. Invalidate the query for this specific despacho.
      // This will cause the QrManagementPage to refetch and show the new QR code.
      queryClient.invalidateQueries({ queryKey: ['despacho', variables.id] });

      // Optional: You can also manually set the query data for an instant update without a refetch.
      // queryClient.setQueryData(['despacho', variables.id], updatedDespacho);
    },
    
    onError: (error) => {
      // Centralized error logging. You can also trigger a toast notification here.
      console.error("Error renovating QR token:", error.response?.data || error.message);
    },
  });
};