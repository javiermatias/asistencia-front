// src/components/DespachoManagement.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Despacho } from '@/app/types/despacho';
import { useAuthStore } from '@/app/store/authStore';
import { useUpdateDespacho } from '@/app/hooks/despacho/useDespachos';


interface DespachoManagementProps {
  initialData: Despacho;
}

const DespachoManagement = ({ initialData }: DespachoManagementProps) => {
  const router = useRouter();
  const { session } = useAuthStore();
  const token = session?.user.access_token;
  
  // State for form inputs

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latitud, setLatitud] = useState<string>('');
  const [longitud, setLongitud] = useState<string>('');
  const [geoError, setGeoError] = useState<string | null>(null);

  const updateDespachoMutation = useUpdateDespacho();

  // Populate form with initial data when the component mounts
  useEffect(() => {
    if (initialData) {
      setLatitud(String(initialData.latitud ?? ''));
      setLongitud(String(initialData.longitud ?? ''));
    }
  }, [initialData]);

  const handleGetCoordinates = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('La geolocalización no es soportada por su navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitud(position.coords.latitude.toFixed(6));
        setLongitud(position.coords.longitude.toFixed(6));
      },
      (error) => {
        setGeoError('No se pudo obtener su ubicación.');
        console.error('Geolocation Error:', error);
      }
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Clear previous messages on new submission
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!token) {
      setErrorMessage("Error de autenticación. Por favor, inicie sesión de nuevo.");
      return;
    }
    const despachoData = {
      id: initialData.id,
      nombre: initialData.nombre,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
    };

    // UPDATED: Use onSuccess and onError here to set state
    updateDespachoMutation.mutate(
      { despacho: despachoData, token },
      {
        onSuccess: () => {
          setSuccessMessage('¡Ubicación guardada correctamente!');
          // Optional: hide message after a few seconds
          setTimeout(() => setSuccessMessage(null), 5000);
        },
        onError: (error: any) => {
          const apiError = error.response?.data?.message || 'Hubo un error al guardar los datos.';
          setErrorMessage(apiError);
        },
      }
    );
  };

  const handleQrClick = (despachoId: number) => {
    router.push(`/supervisor/despacho/${despachoId}/qr`);
  };

  const isLoading = updateDespachoMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Despacho</h1>
      <p className="text-xl text-gray-600 border-b pb-4 mb-4">{initialData.nombre}</p>

       {/* NEW: Feedback Messages */}
      {successMessage && (
        <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-400 p-3 rounded">
          ✅ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          ❌ {errorMessage}
        </div>
      )}
      {geoError && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          ⚠️ {geoError}
        </div>
      )}
    

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="latitud" className="block mb-1 font-medium text-gray-700">
            Latitud
          </label>
          <input
            id="latitud"
            type="number"
            step="any"
            value={latitud}
            onChange={(e) => setLatitud(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 21.1619"
          />
        </div>

        <div>
          <label htmlFor="longitud" className="block mb-1 font-medium text-gray-700">
            Longitud
          </label>
          <input
            id="longitud"
            type="number"
            step="any"
            value={longitud}
            onChange={(e) => setLongitud(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: -86.8515"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={handleGetCoordinates}
            className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 transition"
          >
            Obtener Coordenadas
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded text-white transition ${
              isLoading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Guardando...' : 'Guardar Coordenadas'}
          </button>
          <button
            type="button"
            onClick={() => handleQrClick(initialData.id)}
            className="px-4 py-2 rounded text-white bg-gray-700 hover:bg-gray-800 transition"
          >
            {initialData.qrToken ? 'Renovar QR' : 'Crear QR'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DespachoManagement;