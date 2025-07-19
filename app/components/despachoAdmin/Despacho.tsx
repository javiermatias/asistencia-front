"use client";

import { useState } from 'react';

import { Despacho } from '@/app/types/despacho';
import { useDeleteDespacho, useGetDespachos } from '@/app/hooks/despacho/useDespachos';
import DespachoForm from './DespachoForm';
import { useAuthStore } from '@/app/store/authStore';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function DespachoPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingDespacho, setEditingDespacho] = useState<Despacho | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { session } = useAuthStore();
  const token = session?.user.access_token;
  
  const { data: despachos, isLoading, isError, error } = useGetDespachos(token);
  const deleteMutation = useDeleteDespacho(token);

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
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡elimínalo!',
      cancelButtonText: 'Cancelar', // Optional: Custom text for the cancel button
    // 👇 This is the magic part
     customClass: {
     confirmButton: 'my-swal-confirm-button', // Class for the confirm button
     cancelButton: 'my-swal-cancel-button'   // Class for the cancel button
  }
    }).then((result) => {
      // This code runs AFTER the user clicks a button
      if (result.isConfirmed) {
        // If the user clicked "Sí, ¡elimínalo!"
        deleteMutation.mutate({ id, token: session?.user.access_token }, {
          onError: (error) => {
            // Keep your original error handling logic
            const errorMessage = (error as any).response?.data as string || "Ocurrió un error desconocido.";
            setGlobalError(`Falló la eliminación del despacho. El servidor dice: ${errorMessage}`);
            toast.error('¡Hubo un error al eliminar el despacho!');
          },
          onSuccess: () => {
            // On success, show another alert or toast
            Swal.fire(
              '¡Eliminado!',
              'El despacho ha sido eliminado correctamente.',
              'success'
            );
            // toast.success('¡Se eliminó correctamente!'); // You can use this instead of the Swal.fire if you prefer
            setGlobalError(null);
          }
        });
      }
    });
  };

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    setEditingDespacho(null);
    toast.success(editingDespacho ? 'Despacho actualizado con éxito!' : 'Despacho agregado con éxito!'); // Dynamic success message
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingDespacho(null);
    setGlobalError(null); // Clear any errors if form is cancelled
  };

  if (isLoading) return <div className="text-center mt-8">Cargando despachos...</div>;
  
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
          Error Cargando Datos: {error.message}
        </div>
      )}
  
      {/* Conditionally render the "Add Despacho" button AND the form */}
      {!isFormVisible ? (
        <button
          onClick={handleAddClick}
          className="mt-6 mb-4 px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600 transition"
        >
          Agregar Despacho
        </button>
      ) : (
        <DespachoForm
          initialData={editingDespacho}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
  
      {/* Conditionally render the list only when the form is NOT visible */}
      {!isFormVisible && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Lista de Despachos</h2>
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left bg-gray-100 border-b">Nombre</th>
                <th className="p-3 text-left bg-gray-100 border-b">Latitud</th>
                <th className="p-3 text-left bg-gray-100 border-b">Longitud</th>
                <th className="p-3 text-left bg-gray-100 border-b">Acción</th>
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
                        Editar
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
                          ? 'Eliminando...' // Updated text
                          : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {despachos && despachos.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No hay despachos para mostrar.</p>
          )}
        </div>
      )}
    </main>
  );
}