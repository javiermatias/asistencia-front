
import { Despacho } from '@/app/types/despacho';
import { useAddDespacho, useUpdateDespacho } from '@/app/hooks/despacho/useDespachos';
import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';

interface DespachoFormProps {
  initialData?: Despacho | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const DespachoForm = ({ initialData, onSuccess, onCancel }: DespachoFormProps) => {
  const [nombre, setNombre] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [geoError, setGeoError] = useState<string | null>(null);
  const { session } = useAuthStore()
  const token = session?.user.access_token;

  const addDespachoMutation = useAddDespacho(token);
  const updateDespachoMutation = useUpdateDespacho();
  

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setLatitud(String(initialData.latitud));
      setLongitud(String(initialData.longitud));
    }
  }, [initialData]);

  const handleGetCoordinates = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitud(position.coords.latitude.toFixed(6));
        setLongitud(position.coords.longitude.toFixed(6));
        setGeoError(null);
      },
      (error) => {
        setGeoError('Unable to retrieve your location.');
        console.error(error);
        
      }
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  
    const despachoData: any = {
      nombre: nombre,
    };
  
    if (latitud) {
      despachoData.latitud = parseFloat(latitud);
    }
  
    if (longitud) {
      despachoData.longitud = parseFloat(longitud);
    }
  
    if (initialData) {
      updateDespachoMutation.mutate(
        {
          despacho: { id: initialData.id, ...despachoData },
          token,
        },
        { onSuccess }
      );
    } else {
      addDespachoMutation.mutate(
        {
          despacho: despachoData,
          token,
        },
        { onSuccess }
      );
    }
  };

  const mutation = initialData ? updateDespachoMutation : addDespachoMutation;
  const isLoading = mutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="p-5 border border-gray-300 rounded-lg mb-6 bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
        {initialData ? 'Editar Despacho' : 'Agregar despacho'}
      </h2>
  
      {mutation.isError && (
        <div className="mb-4 text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          Error: {mutation.error.response?.data as string || mutation.error.message}
        </div>
      )}
  
      {geoError && (
        <div className="mb-4 text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          ⚠️ {geoError}
        </div>
      )}
  
      <div className="mb-4">
        <label htmlFor="nombre_despacho" className="block mb-1 font-medium text-gray-700">
          Nombre Despacho
        </label>
        <input
          id="nombre_despacho"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="latitud" className="block mb-1 font-medium text-gray-700">
          Latitud
        </label>
        <input
          id="latitud"
          type="number"
          step="any"
          value={latitud}
          onChange={(e) => setLatitud(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="longitud" className="block mb-1 font-medium text-gray-700">
          Longitud
        </label>
        <input
          id="longitud"
          type="number"
          step="any"
          value={longitud}
          onChange={(e) => setLongitud(e.target.value)}          
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded text-white transition ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
  
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded text-white bg-gray-500 hover:bg-gray-600 transition"
        >
          Cancelar
        </button>
  
        <button
          type="button"
          onClick={handleGetCoordinates}
          className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600 transition"
        >
          Obtener Coordenadas
        </button>
      </div>
    </form>
  );
};

export default DespachoForm;