"use client";

import { useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import Swal from 'sweetalert2';
import { FaEdit, FaTable, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// === MODIFIED: Import the new hook and remove the old one ===
import { useDeleteEmpleado, useGetEmpleadosByDespacho } from '@/app/hooks/despacho/useEmpleado';
import { CreateEmpleadoDTO } from '@/app/types/empleado/create-empleado';
import { Despacho } from '@/app/types/despacho';
import EmpleadoSupervisorForm from './EmpleadoForm'; // Assuming this form component exists

interface EmpleadoSupervisorProps {
  initialData: Despacho; // The supervisor's despacho passed from the parent
}

export default function EmpleadoSupervisor({ initialData }: EmpleadoSupervisorProps) {
  // --- State Management ---
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<CreateEmpleadoDTO | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // --- REMOVED: Pagination State ---
  // const [page, setPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(100);

  // --- Auth and Data Fetching ---
  const { session } = useAuthStore();
  const token = session?.user.access_token;

  // === MODIFIED: Use the new hook to fetch employees for the supervisor's despacho ===
  const { data: empleados = [], isLoading, isError, error } = useGetEmpleadosByDespacho(token, initialData.nombre);
  
  const deleteMutation = useDeleteEmpleado();

  // --- REMOVED: Fetching all despachos for the filter is no longer needed ---
  // const { data: allDespachos, isLoading: isLoadingDespachos } = useGetDespachos(token);

  // --- REMOVED: Extracting pagination details is no longer needed ---
  // const totalPages = ...
  // const totalRows = ...

  // === MODIFIED: Simplified Filtering Logic ===
  // Now only filters by search term, as all employees are from the correct despacho.
  const filteredEmpleados = empleados.filter(empleado =>
    searchTerm === '' ||
    empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Handlers (Most remain the same, with one small improvement) ---

  // === MODIFIED: handleAddClick now pre-fills the despacho for the new employee ===
  const handleAddClick = () => {
    // Automatically set the despacho to the supervisor's despacho
    setEditingEmpleado({
      numero_empleado: '',
      nombre: '',
      apellido: '',
      sexo: 'Masculino', // or some default
      puesto: 0, // or some default
      despacho: initialData.id, // Pre-fill the supervisor's despacho ID
      es_supervisor: false,
    });
    setIsFormVisible(true);
    setGlobalError(null);
  };

  const handleEditClick = (empleado: CreateEmpleadoDTO) => {
    setEditingEmpleado(empleado);
    setIsFormVisible(true);
    setGlobalError(null);
  };

  const handleDeleteClick = (title: string, id: string) => {
    Swal.fire({
        title: `${title} `,
        text: 'Estas seguro de eliminar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        background: '#f0f0f0',
        confirmButtonText: 'Sí, ¡elimínalo!',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteMutation.mutate({ id, token }, {
                onSuccess: () => {
                    Swal.fire('¡Eliminado!', 'El empleado ha sido eliminado.', 'success');
                    setGlobalError(null);
                },
                onError: (err: any) => {
                    const errorMessage = err.response?.data?.message || "Ocurrió un error.";
                    setGlobalError(`Falló la eliminación: ${errorMessage}`);
                    toast.error('Error al eliminar el empleado.');
                },
            });
        }
    });
  };

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    setEditingEmpleado(null);
    Swal.fire({
      title: "Empleado guardado",
      text: "El empleado se guardó correctamente",
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleFormError = (errorMessage: string) => {
    Swal.fire({
      icon: 'error',
      title: 'Error al Guardar',
      text: errorMessage,
      timer: 2000,
    });
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingEmpleado(null);
    setGlobalError(null);
  };

  // --- REMOVED: Pagination handlers ---
  // const handleRowsPerPageChange = ...
  // const handleNextPage = ...
  // const handlePreviousPage = ...

  return (
    <main className="max-w-7xl mx-auto mt-8 p-5 bg-white rounded-lg shadow">
      {/* === MODIFIED: Title now reflects the specific despacho === */}
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
        Empleados del Despacho: <span className="text-blue-600">{initialData.nombre}</span>
      </h1>

      {globalError && (
        <div className="mt-4 text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          {globalError}
        </div>
      )}

      {isError && (
        <div className="mt-4 text-red-700 bg-red-100 border border-red-400 p-3 rounded">
          Error Cargando Empleados: {error.message}
        </div>
      )}

      {!isFormVisible ? (
        // === MODIFIED: Simplified Controls Section ===
        <div className="mt-6 mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              onClick={handleAddClick}
              className="px-4 py-2 w-full md:w-auto rounded text-white bg-green-500 hover:bg-green-600 transition"
            >
              Agregar Empleado
            </button>
            <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-4">
                {/* --- REMOVED: Despacho Filter Select --- */}
                <input 
                  type="text"
                  placeholder="Buscar por nombre o apellido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
        </div>
      ) : (
        <EmpleadoSupervisorForm
          initialData={editingEmpleado}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          onError={handleFormError}
          supervisorDespachoId={initialData.id}
        /> 
      )}

      {!isFormVisible && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              {/* Table Headers remain the same */}
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Nº Empleado</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Nombre</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Apellido</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Puesto</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Despacho</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Sexo</th>
                <th className="p-3 text-center text-sm font-semibold text-gray-600 border-b">Horario</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                 <tr>
                    <td colSpan={8} className="text-center p-4">Cargando...</td>
                 </tr>
              ) : filteredEmpleados.length > 0 ? (
                filteredEmpleados.map((empleado) => (
                  <tr key={empleado.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b text-sm">{empleado.numero_empleado}</td>
                    <td className="p-3 border-b text-sm">{empleado.nombre}</td>
                    <td className="p-3 border-b text-sm">{empleado.apellido}</td>
                    <td className="p-3 border-b text-sm">{empleado.puesto?.nombre ?? 'N/A'}</td>
                    <td className="p-3 border-b text-sm">{empleado.despacho?.nombre ?? 'N/A'}</td>
                    <td className="p-3 border-b text-sm">{empleado.sexo}</td>
                    <td className="p-3 border-b text-sm text-center">
                    <span
                     className={`px-2 py-1 text-xs rounded-full ${
                     empleado.horarios.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                     }`}>
                     {empleado.horarios.length > 0 ? 'Sí' : 'No'}
                    </span>
                    </td>
                    <td className="p-3 border-b">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditClick({
                            numero_empleado: empleado.numero_empleado,
                            nombre: empleado.nombre,
                            apellido: empleado.apellido,
                            sexo: empleado.sexo,
                            puesto: empleado.puesto?.id ?? 0,
                            despacho: empleado.despacho?.id ?? 0,
                            es_supervisor: empleado.es_supervisor
                          })}
                          className="px-3 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 transition text-sm"
                        >
                          <FaEdit/>
                        </button>
                        <button
                           onClick={() => router.push(`/admin/horario/${empleado.id}?nombre=${empleado.nombre}&apellido=${empleado.apellido}&nroEmpleado=${empleado.numero_empleado}`)}
                           title="Editar Horario"
                           className="px-3 py-1 rounded text-white transition text-sm bg-cyan-500 hover:bg-cyan-600"
                        >
                          <FaTable/>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(empleado.numero_empleado + " " + empleado.apellido + " " + empleado.nombre,empleado.id.toString())}
                          className={`px-3 py-1 rounded text-white transition text-sm ${
                            deleteMutation.isPending
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600'
                          }`}
                          disabled={deleteMutation.isPending}
                        >
                          <FaTrash/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 p-4">
                    {empleados.length > 0 ? 'No se encontraron resultados para su búsqueda.' : 'No se encontraron empleados.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* --- REMOVED: Pagination Controls section --- */}
        </div>
      )}
    </main>
  );
}