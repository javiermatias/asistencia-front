'use client';


import { FormEvent, useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { useAddEmpleado } from '@/app/hooks/despacho/useEmpleado';

interface EmpleadoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const EmpleadoForm = ({ onSuccess, onCancel }: EmpleadoFormProps) => {
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [sexo, setSexo] = useState<'Masculino' | 'Femenino' | 'Otro'>('Masculino');
  const [puesto, setPuesto] = useState('');
  const [despacho, setDespacho] = useState('');
  const [esSupervisor, setEsSupervisor] = useState(false);

  const { session } = useAuthStore();
  const token = session?.user.access_token;

  const addEmpleadoMutation = useAddEmpleado();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const empleadoData = {
      numero_empleado: numeroEmpleado,
      nombre,
      apellido,
      sexo,
      puesto: parseInt(puesto),
      despacho: parseInt(despacho),
      es_supervisor: esSupervisor,
    };

    addEmpleadoMutation.mutate(
      {
        empleado: empleadoData,
        token,
      },
      { onSuccess }
    );
  };

  const isLoading = addEmpleadoMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="p-5 border border-gray-300 rounded-lg mb-6 bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
        Agregar Empleado
      </h2>

      {addEmpleadoMutation.isError && (
        <div className="mb-4 text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          Error: {addEmpleadoMutation.error.response?.data as string || addEmpleadoMutation.error.message}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="numeroEmpleado" className="block mb-1 font-medium text-gray-700">
          Número de Empleado
        </label>
        <input
          id="numeroEmpleado"
          type="text"
          value={numeroEmpleado}
          onChange={(e) => setNumeroEmpleado(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="nombre" className="block mb-1 font-medium text-gray-700">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="apellido" className="block mb-1 font-medium text-gray-700">
          Apellido
        </label>
        <input
          id="apellido"
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="sexo" className="block mb-1 font-medium text-gray-700">
          Sexo
        </label>
        <select
          id="sexo"
          value={sexo}
          onChange={(e) => setSexo(e.target.value as 'Masculino' | 'Femenino' | 'Otro')}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="puesto" className="block mb-1 font-medium text-gray-700">
          Puesto (ID)
        </label>
        <input
          id="puesto"
          type="number"
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="despacho" className="block mb-1 font-medium text-gray-700">
          Despacho (ID)
        </label>
        <input
          id="despacho"
          type="number"
          value={despacho}
          onChange={(e) => setDespacho(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4 flex items-center">
        <input
          id="esSupervisor"
          type="checkbox"
          checked={esSupervisor}
          onChange={(e) => setEsSupervisor(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="esSupervisor" className="text-gray-700">
          Es supervisor
        </label>
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
      </div>
    </form>
  );
};

export default EmpleadoForm;