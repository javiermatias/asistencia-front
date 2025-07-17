"use client";

import { useState } from 'react';

import { Despacho } from '@/app/types/despacho';
import { useDeleteDespacho, useGetDespachos } from '@/app/hooks/despacho/useDespachos';
import DespachoForm from './DespachoForm';
import { useAuthStore } from '@/app/store/authStore';

export default function DespachoPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingDespacho, setEditingDespacho] = useState<Despacho | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { session } = useAuthStore()

  console.log(session);
  const { data: despachos, isLoading, isError, error } = useGetDespachos(session?.user.access_token);
  const deleteMutation = useDeleteDespacho(session?.user.access_token);

  const handleAddClick = () => {
    setEditingDespacho(null);
    setIsFormVisible(true);
    setGlobalError(null); // Clear previous errors
  };

  const handleEditClick = (despacho: Despacho) => {
    setEditingDespacho(despacho);
    setIsFormVisible(true);
    setGlobalError(null); // Clear previous errors
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this despacho?')) {
      deleteMutation.mutate( { id, token:session?.user.access_token }, {
        onError: (error) => {
          // Handle specific UI error for this action
          const errorMessage = error.response?.data as string || "An unknown error occurred.";
          setGlobalError(`Failed to delete despacho. Server says: ${errorMessage}`);
        },
        onSuccess: () => {
          setGlobalError(null); // Clear error on success
        }
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    setEditingDespacho(null);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingDespacho(null);
  };

  if (isLoading) return <div>Cargando despachos...</div>;
  
  return (
    <main className="max-w-3xl mx-auto mt-8 p-5 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">Administrar Despachos</h1>
  
      {globalError && (
        <div className="mt-4 text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          {globalError}
        </div>
      )}
  
      {isError && (
        <div className="mt-4 text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          Error Cargando Data: {error.message}
        </div>
      )}
  
      {!isFormVisible && (
        <button
          onClick={handleAddClick}
          className="mt-6 mb-4 px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600 transition"
        >
          Agregar Despacho
        </button>
      )}
  
      {isFormVisible && (
        <DespachoForm
          initialData={editingDespacho}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
  
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Lista Despachos</h2>
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left bg-gray-100 border-b">Nombre</th>
              <th className="p-3 text-left bg-gray-100 border-b">Latitud</th>
              <th className="p-3 text-left bg-gray-100 border-b">Longitud</th>
              <th className="p-3 text-left bg-gray-100 border-b">Accion</th>
            </tr>
          </thead>
          <tbody>
            {despachos?.map((despacho) => (
              <tr key={despacho.id}>
                <td className="p-3 border-b">{despacho.nombre}</td>
                <td className="p-3 border-b">{despacho.latitud}</td>
                <td className="p-3 border-b">{despacho.longitud}</td>
                <td className="p-3 border-b">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(despacho)}
                      className="px-3 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(despacho.id)}
                      className={`px-3 py-1 rounded text-white transition ${
                        deleteMutation.isPending 
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}