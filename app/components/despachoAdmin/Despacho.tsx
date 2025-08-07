"use client";

import { useState } from 'react';
// NEW: Import useRouter for navigation
import { useRouter } from 'next/navigation';

import { Despacho } from '@/app/types/despacho';
import { useDeleteDespacho, useGetDespachos } from '@/app/hooks/despacho/useDespachos';
import DespachoForm from './DespachoForm';
import { useAuthStore } from '@/app/store/authStore';

import Swal from 'sweetalert2';
import { toast } from 'sonner';

export default function DespachoPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingDespacho, setEditingDespacho] = useState<Despacho | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { session } = useAuthStore();
  const token = session?.user.access_token;
  
  // NEW: Initialize the router
  const router = useRouter();

  const { data: despachos, isLoading, isError, error } = useGetDespachos(token);
  const deleteMutation = useDeleteDespacho();

  const handleAddClick = () => {
    setEditingDespacho(null);
    setIsFormVisible(true);
    setGlobalError(null);
  };

  const handleEditClick = (despacho: Despacho) => {
    setEditingDespacho(despacho);
    setIsFormVisible(true);
    setGlobalError(null);
  };

  // NEW: Handler for the QR button click
  const handleQrClick = (despachoId: number) => {
    // Navigate to the dedicated QR management page for that despacho
    router.push(`despacho/${despachoId}/qr`);
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
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'my-swal-confirm-button',
        cancelButton: 'my-swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate({ id, token: session?.user.access_token }, {
          onError: (error) => {
            const errorMessage = (error as any).response?.data as string || "Ocurrió un error desconocido.";
            setGlobalError(`Falló la eliminación del despacho. El servidor dice: ${errorMessage}`);
            toast.error('¡Hubo un error al eliminar el despacho!');
          },
          onSuccess: () => {
            Swal.fire('¡Eliminado!', 'El despacho ha sido eliminado correctamente.', 'success');
            setGlobalError(null);
          }
        });
      }
    });
  };

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    setEditingDespacho(null);
    toast.success(editingDespacho ? 'Despacho actualizado con éxito!' : 'Despacho agregado con éxito!');
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingDespacho(null);
    setGlobalError(null);
  };

  if (isLoading) return <div className="text-center mt-8">Cargando despachos...</div>;

  return (
    <main className="max-w-5xl mx-auto mt-8 p-5 bg-white rounded-lg shadow"> {/* Increased max-w for new columns */}
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">Administrar Despachos</h1>
  
      {globalError && (
        <div className="mt-4 text-red-700 bg-red-100 border border-red-400 p-3 rounded">{globalError}</div>
      )}
  
      {isError && (
        <div className="mt-4 text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          Error Cargando Datos: {error.message}
        </div>
      )}
  
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
  
      {!isFormVisible && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Lista de Despachos</h2>
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left bg-gray-100 border-b">Nombre</th>
                <th className="p-3 text-left bg-gray-100 border-b">Latitud</th>
                <th className="p-3 text-left bg-gray-100 border-b">Longitud</th>
                {/* NEW COLUMNS */}
                <th className="p-3 text-center bg-gray-100 border-b">QR</th>
                <th className="p-3 text-left bg-gray-100 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {despachos?.map((despacho) => (
                <tr key={despacho.id}>
                  <td className="p-3 border-b">{despacho.nombre}</td>
                  <td className="p-3 border-b">{despacho.latitud}</td>
                  <td className="p-3 border-b">{despacho.longitud}</td>
                  {/* NEW QR STATUS CELL */}
                  <td className="p-3 border-b text-center font-bold">
                    {despacho.qrToken ? (
                      <span className="text-green-600">SI</span>
                    ) : (
                      <span className="text-red-600">NO</span>
                    )}
                  </td>
                  <td className="p-3 border-b">
                    <div className="flex flex-wrap gap-2"> {/* Use flex-wrap for responsiveness */}
                      <button
                        onClick={() => handleEditClick(despacho)}
                        className="px-3 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(despacho.id.toString())}
                        className={`px-3 py-1 rounded text-white transition ${
                          deleteMutation.isPending 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                      </button>
                      {/* NEW QR ACTION BUTTON */}
                      <button
                        onClick={() => handleQrClick(despacho.id)}
                        className="px-3 py-1 rounded text-white bg-gray-700 hover:bg-gray-800 transition"
                      >
                        {despacho.qrToken ? 'Renovar QR' : 'Crear QR'}
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