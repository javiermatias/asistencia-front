'use client';


import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { useAddEmpleado, useUpdateEmpleado } from '@/app/hooks/despacho/useEmpleado';
import { CreateEmpleadoDTO } from '@/app/types/empleado/create-empleado';
import { useGetDespachos, useGetPuestos } from '@/app/hooks/despacho/useDespachos';

interface EmpleadoFormProps {
  initialData?: CreateEmpleadoDTO | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EmpleadoForm = ({ initialData, onSuccess, onCancel }: EmpleadoFormProps) => {
  const isEditMode = !!initialData;

  // Form state
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [sexo, setSexo] = useState<'Masculino' | 'Femenino' | 'Otro'>('Masculino');
  const [puestoId, setPuestoId] = useState('');
  const [despachoId, setDespachoId] = useState('');
  //const [esSupervisor, setEsSupervisor] = useState(false);

  // Get token from the store
  const token = useAuthStore((state) => state.session?.user.access_token);

  // Use the new hooks by passing the token
  const { data: puestos, isLoading: isLoadingPuestos } = useGetPuestos(token!);
  const { data: despachos, isLoading: isLoadingDespachos } = useGetDespachos(token!);

  // The mutation hooks are now simpler to call
  const addEmpleadoMutation = useAddEmpleado();
  const updateEmpleadoMutation = useUpdateEmpleado();

  // Effect to populate form data on edit
  useEffect(() => {
    if (isEditMode && initialData) {
      setNumeroEmpleado(initialData.numero_empleado);
      setNombre(initialData.nombre);
      setApellido(initialData.apellido);
      setSexo(initialData.sexo);
      setPuestoId(initialData.puesto?.toString() ?? '');
      setDespachoId(initialData.despacho?.toString() ?? '');
      //setEsSupervisor(initialData.es_supervisor);
    }
  }, [initialData, isEditMode]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!token) return; // Guard clause

    const empleadoData = {
      id: numeroEmpleado,
      numero_empleado: numeroEmpleado,
      nombre,
      apellido,
      sexo,
      puesto: parseInt(puestoId, 10),
      despacho: parseInt(despachoId, 10),
      es_supervisor: false,
    };

    if (isEditMode) {
      updateEmpleadoMutation.mutate(
        // The mutate function expects the exact object our `updateEmpleado` function needs
        {  empleado: empleadoData, token },
        { onSuccess }
      );

      
    } else {
      addEmpleadoMutation.mutate(
        // The mutate function expects the exact object our `addEmpleado` function needs
        { empleado: { ...empleadoData, numero_empleado: numeroEmpleado }, token },
        { onSuccess }
      );
    }
  };

  const isLoading = addEmpleadoMutation.isPending || updateEmpleadoMutation.isPending;
  const mutationError = addEmpleadoMutation.error || updateEmpleadoMutation.error;

  return (
    // The JSX for the form remains exactly the same as in the previous answer.
    // No changes are needed in the return statement.
    <form onSubmit={handleSubmit} className="p-5 border border-gray-300 rounded-lg mb-6 bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
        {isEditMode ? 'Editar Empleado' : 'Agregar Empleado'}
      </h2>

      {mutationError && (
        <div className="mb-4 text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          {/* @ts-ignore */}
          Error: {mutationError.response?.data?.message || mutationError.message}
        </div>
      )}

      {/* Número Empleado */}
      <div className="mb-4">
        <label htmlFor="numeroEmpleado" className="block mb-1 font-medium text-gray-700">Número de Empleado</label>
        <input id="numeroEmpleado" type="text" value={numeroEmpleado} onChange={(e) => setNumeroEmpleado(e.target.value)} required disabled={isEditMode} className={`w-full px-3 py-2 border border-gray-300 rounded ${isEditMode ? 'bg-gray-200 cursor-not-allowed' : ''}`} />
      </div>

      {/* Nombre, Apellido, Sexo */}
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

      {/* Despacho Select */}
      <div className="mb-4">
        <label htmlFor="despacho" className="block mb-1 font-medium text-gray-700">Despacho</label>
        <select id="despacho" value={despachoId} onChange={(e) => setDespachoId(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded" disabled={isLoadingDespachos}>
          <option value="" disabled>{isLoadingDespachos ? 'Cargando...' : 'Seleccione un despacho'}</option>
          {despachos?.map((despacho) => (<option key={despacho.id} value={despacho.id}>{despacho.nombre}</option>))}
        </select>
      </div>


      {/* Supervisor Checkbox
      
      */}
      

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

export default EmpleadoForm;