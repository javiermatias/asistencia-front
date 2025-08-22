"use client";

import { useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';

import Swal from 'sweetalert2';
import { FaChevronLeft, FaChevronRight, FaEdit, FaTable, FaTrash } from 'react-icons/fa';
import { useDeleteEmpleado, useGetEmpleados } from '@/app/hooks/despacho/useEmpleado';
// NEW: Import the hook to get all despachos

import EmpleadoForm from './EmpleadoForm';
import { CreateEmpleadoDTO } from '@/app/types/empleado/create-empleado';
import { useRouter } from 'next/navigation'; 
import { useGetDespachos } from '@/app/hooks/despacho/useDespachos';
import { toast } from 'sonner';

export default function EmpleadoPage() {
  // --- State Management ---
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<CreateEmpleadoDTO | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDespacho, setSelectedDespacho] = useState<string>(''); // NEW: State for the despacho filter
  const router = useRouter();

  // Pagination State
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  // --- Auth and Data Fetching ---
  const { session } = useAuthStore();
  const token = session?.user.access_token;

  const { data: paginatedData, isLoading, isError, error } = useGetEmpleados(token, page, rowsPerPage);
  const deleteMutation = useDeleteEmpleado();
  
  // NEW: Fetch all despachos for the filter dropdown
  const { data: allDespachos, isLoading: isLoadingDespachos } = useGetDespachos(token);

  // Extract data and pagination details
  const empleados = paginatedData?.data ?? [];
  const totalPages = paginatedData?.pageCount ?? 1;
  const totalRows = paginatedData?.total ?? 0;

  // --- UPDATED: Filtered Data ---
  // Now filters by both search term and selected despacho
  const filteredEmpleados = empleados.filter(empleado => {
    const matchesSearchTerm =
      searchTerm === '' ||
      empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDespacho =
      selectedDespacho === '' ||
      empleado.despacho?.id.toString() === selectedDespacho;

    return matchesSearchTerm && matchesDespacho;
  });

  // --- Handlers (no changes to the functions below, only the JSX) ---
  const handleAddClick = () => {
    setEditingEmpleado(null);
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
      customClass: {
        confirmButton: 'my-swal-confirm-button',
        cancelButton: 'my-swal-cancel-button'
      }
    
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate({id, token}, {
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
      customClass: {
        confirmButton: 'my-swal-confirm-button',
        
      }
    })
  };
  const handleFormError = (errorMessage: string) => {
    // When an error occurs, the form stays open so the user can fix it.
    // We use Swal to show the error message.
    setIsFormVisible(false);
    setEditingEmpleado(null);
    Swal.fire({
      icon: 'error',
      title: 'Error al Guardar',
      text: errorMessage, // Display the specific message from the backend
      timer: 2000,
      customClass: {
        confirmButton: 'my-swal-confirm-button',
        
      }
    });
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingEmpleado(null);
    setGlobalError(null);
  };
  
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };


  return (
    <main className="max-w-7xl mx-auto mt-8 p-5 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
        Administrar Empleados
      </h1>

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

      {!isFormVisible ? (
        // --- UPDATED Controls Section ---
        <div className="mt-6 mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              onClick={handleAddClick}
              className="px-4 py-2 w-full md:w-auto rounded text-white bg-green-500 hover:bg-green-600 transition"
            >
              Agregar Empleado
            </button>
            <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-4">
                {/* NEW: Despacho Filter Select */}
                <select 
                  value={selectedDespacho}
                  onChange={(e) => setSelectedDespacho(e.target.value)}
                  disabled={isLoadingDespachos}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Todos los Despachos</option>
                  {allDespachos?.map(despacho => (
                    <option key={despacho.id} value={despacho.id}>
                      {despacho.nombre}
                    </option>
                  ))}
                </select>
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
        <EmpleadoForm
          initialData={editingEmpleado}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          onError={handleFormError}
        /> 
      )}

      {/* The rest of the component (table, pagination) remains the same */}
      {!isFormVisible && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse">
          <thead>
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
                    <td colSpan={9} className="text-center p-4">Cargando...</td>
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
                            //id: Number(empleado.id), // Add the ID to the DTO
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
                          onClick={() => handleDeleteClick(empleado.numero_empleado + " " + empleado.apellido + " " + empleado.nombre,empleado.id.toString(),)}
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
          
          <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                 <span className="text-sm text-gray-700">Filas por página:</span>
                 <select 
                   value={rowsPerPage}
                   onChange={handleRowsPerPageChange}
                   className="p-1 border rounded-md text-sm"
                 >
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                 </select>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-sm text-gray-700">
                    Página {page} de {totalPages} (Total: {totalRows} filas)
                 </span>
                 <div className="flex gap-2">
                    <button onClick={handlePreviousPage} disabled={page === 1} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
                        <FaChevronLeft />
                    </button>
                    <button onClick={handleNextPage} disabled={page >= totalPages} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
                        <FaChevronRight />
                    </button>
                 </div>
              </div>
          </div>
        </div>
      )}
    </main>
  );
}