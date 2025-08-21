import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { User, UpdateUserDto } from '@/app/types/user';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

// --- API Functions (with token) ---

// GET /users
const fetchUsers = async (token: string): Promise<User[]> => {
  const { data } = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// PATCH /users/:id
const updateUser = async ({
  id,
  userData,
  token,
}: {
  id: number;
  userData: UpdateUserDto;
  token: string;
}): Promise<User> => {
  const { data } = await axios.patch(`${API_URL}/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// DELETE /users/:id
const deleteUser = async ({ id, token }: { id: number; token: string }): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// --- React Query Hooks ---

export const useGetUsers = (token: string) => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => fetchUsers(token),
    enabled: !!token, // Query will not run until the token is available
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, AxiosError, { id: number; userData: UpdateUserDto; token: string }>({
    mutationFn: updateUser,
    onSuccess: () => {
      // When an update is successful, invalidate the 'users' query to refetch the fresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error("Error updating user:", error.response?.data || error.message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, { id: number; token: string }>({
    mutationFn: deleteUser,
    onSuccess: () => {
      // When a delete is successful, invalidate the 'users' query to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error("Error deleting user:", error.response?.data || error.message);
    },
  });
};