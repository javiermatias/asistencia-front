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