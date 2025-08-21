"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { User, UpdateUserDto, ERole } from '@/app/types/user';
import { useUpdateUser } from '@/app/hooks/despacho/useUser';


interface UserFormProps {
  initialData: User | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserForm({ initialData, onSuccess, onCancel }: UserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<ERole>(ERole.Empleado);
  const [error, setError] = useState<string | null>(null);

  const { session } = useAuthStore();
  const token = session?.user.access_token;
  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username);
      setRol(initialData.rol);
      setPassword(''); // Always clear password field for security
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData || !token) return;

    setError(null);

    const userData: UpdateUserDto = {
        username,
        rol,
    };

    // Only include the password in the DTO if the user actually typed one
    if (password) {
        userData.password = password;
    }

    updateUserMutation.mutate({ id: initialData.id, userData, token }, {
        onSuccess: () => {
            onSuccess();
        },
        onError: (error) => {
            const errorMessage = (error as any).response?.data?.message || "An unknown error occurred.";
            setError(`Failed to update user. Server says: ${errorMessage}`);
        }
    });
  };

  return (
    <div className="my-8 p-6 bg-gray-50 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Editing User: {initialData?.username}
      </h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="mb-4 text-red-700 bg-red-100 p-3 rounded">{error}</div>}
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={3}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Leave blank to keep current password"
            minLength={3}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="rol" className="block text-gray-700 font-medium mb-2">Role</label>
          <select
            id="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value as ERole)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(ERole).map((roleValue) => (
              <option key={roleValue} value={roleValue}>
                {roleValue}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-4">
          <button 
            type="submit" 
            className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 transition disabled:bg-blue-300"
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}