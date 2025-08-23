'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { useAddEmpleado, useUpdateEmpleado } from '@/app/hooks/despacho/useEmpleado';
import { CreateEmpleadoDTO } from '@/app/types/empleado/create-empleado';
// === MODIFIED: useGetDespachos is no longer needed here ===
import { useGetPuestos } from '@/app/hooks/despacho/useDespachos';
import { AxiosError } from 'axios';

interface EmpleadoFormProps {
  initialData?: CreateEmpleadoDTO | null;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (errorMessage: string) => void;
  // +++ ADDED: New prop to receive the supervisor's despacho ID +++
  supervisorDespachoId: number; 
}

const EmpleadoSupervisorForm = ({ initialData, onSuccess, onCancel, onError, supervisorDespachoId }: EmpleadoFormProps) => {
  const isEditMode = !!initialData;

  // Form state
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [sexo, setSexo] = useState<'Masculino' | 'Femenino' | 'Otro'>('Masculino');
  const [puestoId, setPuestoId] = useState('');
  const [despachoId, setDespachoId] = useState('');
  // --- REMOVED: State for supervisor checkbox is gone ---
  // const [esSupervisor, setEsSupervisor] = useState(false);

  const token = useAuthStore((state) => state.session?.user.access_token);

  // === MODIFIED: We only need to fetch puestos now ===
  const { data: puestos, isLoading: isLoadingPuestos } = useGetPuestos(token!);
  
  const addEmpleadoMutation = useAddEmpleado();
  const updateEmpleadoMutation = useUpdateEmpleado();

  // === MODIFIED: Effect now handles setting the fixed despachoId in add mode ===
  useEffect(() => {
    if (isEditMode && initialData) {
      // Edit Mode: Populate form with existing employee data
      setNumeroEmpleado(initialData.numero_empleado);
      setNombre(initialData.nombre);
      setApellido(initialData.apellido);
      setSexo(initialData.sexo);
      setPuestoId(initialData.puesto?.toString() ?? '');
      setDespachoId(initialData.despacho?.toString() ?? '');
    } else {
      // Add Mode: Set the despachoId from the prop and reset other fields
      setDespachoId(supervisorDespachoId.toString());
      setNumeroEmpleado('');
      setNombre('');
      setApellido('');
      setSexo('Masculino');
      setPuestoId('');
    }
  }, [initialData, isEditMode, supervisorDespachoId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const empleadoData = {
      id: numeroEmpleado, // Used for update, ignored for create
      numero_empleado: numeroEmpleado,
      nombre,
      apellido,
      sexo,
      puesto: parseInt(puestoId, 10),
      despacho: parseInt(despachoId, 10),
      // === MODIFIED: es_supervisor is now hardcoded to false ===
      es_supervisor: false,
    };

    const mutationOptions = {
      onSuccess,
      onError: (error: unknown) => {
        let errorMessage = 'Ocurrió un error inesperado.';
        if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.message || errorMessage;
        }
        onError(errorMessage);
      },
    };

    if (isEditMode) {
      updateEmpleadoMutation.mutate({ empleado: empleadoData, token }, mutationOptions);
    } else {
      addEmpleadoMutation.mutate({ empleado: empleadoData, token }, mutationOptions);
    }
  };

  const isLoading = addEmpleadoMutation.isPending || updateEmpleadoMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="p-5 border border-gray-300 rounded-lg mb-6 bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
        {isEditMode ? 'Editar Empleado' : 'Agregar Empleado'}
      </h2>
      
      {/* Fields for Numero Empleado, Nombre, Apellido, Sexo remain the same */}
      <div className="mb-4">
        <label htmlFor="numeroEmpleado" className="block mb-1 font-medium text-gray-700">Número de Empleado</label>
        <input id="numeroEmpleado" type="text" value={numeroEmpleado} onChange={(e) => setNumeroEmpleado(e.target.value)} required disabled={isEditMode} className={`w-full px-3 py-2 border border-gray-300 rounded ${isEditMode ? 'bg-gray-200 cursor-not-allowed' : ''}`} />
      </div>
      <div className="mb-4"><label htmlFor="nombre" className="block mb-1 font-medium text-gray-700">Nombre</label><input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded"/></div>
      <div className="mb-4"><label htmlFor="apellido" className="block mb-1 font-medium text-gray-700">Apellido</label><input id="apellido" type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded"/></div>
      <div className="mb-4"><label htmlFor="sexo" className="block mb-1 font-medium text-gray-700">Sexo</label><select id="sexo" value={sexo} onChange={(e) => setSexo(e.target.value as 'Masculino' | 'Femenino' | 'Otro')} required className="w-full px-3 py-2 border border-gray-300 rounded"><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option><option value="Otro">Otro</option></select></div>

      {/* Puesto Select */}
      <div className="mb-4">
        <label htmlFor="puesto" className="block mb-1 font-medium text-gray-700">Puesto</label>
        <select id="puesto" value={puestoId} onChange={(e) => setPuestoId(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded" disabled={isLoadingPuestos}>
          <option value="" disabled>{isLoadingPuestos ? 'Cargando...' : 'Seleccione un puesto'}</option>
          {puestos?.map((puesto) => (<option key={puesto.id} value={puesto.id}>{puesto.nombre}</option>))}
        </select>
      </div>

      {/* --- REMOVED: Despacho Select is gone --- */}
      
      {/* --- REMOVED: Supervisor Checkbox is gone --- */}
      
      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button type="submit" disabled={isLoading} className={`px-4 py-2 rounded text-white transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}>
          {isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar')}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded text-white bg-gray-500 hover:bg-gray-600 transition">Cancelar</button>
      </div>
    </form>
  );
};

export default EmpleadoSupervisorForm;