"use client";

import { useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { User } from '@/app/types/user';


import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useDeleteUser, useGetUsers } from '@/app/hooks/despacho/useUser';
import UserForm from './useForm';

export default function UsersPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { session } = useAuthStore();
  const token = session?.user.access_token;

  const { data: users, isLoading, isError, error } = useGetUsers(token!);
  const deleteMutation = useDeleteUser();

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsFormVisible(true);
  };

  const handleDeleteClick = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate({ id, token: token! }, {
          onSuccess: () => {
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "An unknown error occurred.";
            toast.error(`Failed to delete user: ${errorMessage}`);
          }
        });
      }
    });
  };

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    setEditingUser(null);
    toast.success('User updated successfully!');
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingUser(null);
  };

  if (isLoading) return <div className="text-center mt-8">Loading users...</div>;
  if (isError) return <div className="mt-4 text-red-700 p-3">Error loading data: {error.message}</div>;

  return (
    <main className="max-w-4xl mx-auto mt-8 p-5 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">Manage Users</h1>
      
      {isFormVisible ? (
        <UserForm
          initialData={editingUser}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        <div className="mt-8">
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left bg-gray-100 border-b">Username</th>
                <th className="p-3 text-left bg-gray-100 border-b">Password</th>
                <th className="p-3 text-left bg-gray-100 border-b">Role</th>
                <th className="p-3 text-left bg-gray-100 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id}>
                  <td className="p-3 border-b">{user.username}</td>
                  <td className="p-3 border-b">{user.password}</td>
                  <td className="p-3 border-b">{user.rol}</td>
                  <td className="p-3 border-b">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="px-3 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                 {/*      <button
                        onClick={() => handleDeleteClick(user.id)}
                        className={`px-3 py-1 rounded text-white transition ${
                          deleteMutation.isPending 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users && users.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No users found.</p>
          )}
        </div>
      )}
    </main>
  );
}