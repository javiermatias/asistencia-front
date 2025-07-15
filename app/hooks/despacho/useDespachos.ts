"use client";

import { Despacho } from '@/app/types/despacho';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios'; // Import AxiosError for better typing

const API_URL = '/api/despachos';

// --- API Functions using Axios ---

const fetchDespachos = async (): Promise<Despacho[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};

const addDespacho = async (newDespacho: Omit<Despacho, 'id'>): Promise<Despacho> => {
  const { data } = await axios.post(API_URL, newDespacho);
  return data;
};

const updateDespacho = async (updatedDespacho: Despacho): Promise<Despacho> => {
  const { data } = await axios.put(`${API_URL}/${updatedDespacho.id}`, updatedDespacho);
  return data;
};

const deleteDespacho = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// --- React Query Hooks ---

// Hook to get all despachos
export const useGetDespachos = () => {
  return useQuery<Despacho[], Error>({
    queryKey: ['despachos'],
    queryFn: fetchDespachos,
  });
};

// Hook to add a despacho
export const useAddDespacho = () => {
  const queryClient = useQueryClient();
  return useMutation<Despacho, AxiosError, Omit<Despacho, 'id'>>({
    mutationFn: addDespacho,
    onSuccess: () => {
      // Invalidate and refetch the 'despachos' query to show the new data
      queryClient.invalidateQueries({ queryKey: ['despachos'] });
    },
    onError: (error) => {
      // Centralized error logging
      console.error("Error adding despacho:", error.response?.data || error.message);
    },
  });
};

// Hook to update a despacho
export const useUpdateDespacho = () => {
  const queryClient = useQueryClient();
  return useMutation<Despacho, AxiosError, Despacho>({
    mutationFn: updateDespacho,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despachos'] });
    },
    onError: (error) => {
      console.error("Error updating despacho:", error.response?.data || error.message);
    },
  });
};

// Hook to delete a despacho
export const useDeleteDespacho = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: deleteDespacho,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despachos'] });
    },
    onError: (error) => {
      console.error("Error deleting despacho:", error.response?.data || error.message);
    },
  });
};