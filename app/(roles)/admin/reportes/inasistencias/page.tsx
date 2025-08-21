'use client';

import { useState, useMemo } from 'react';
import { useAuthStore } from '@/app/store/authStore'; // Your auth store
 // Our new hook
import { Loader, AlertTriangle, UserX } from 'lucide-react';
import { useGetInasistencias } from '@/app/hooks/despacho/useGetInasistencia';

// Helper function to get today's date in 'YYYY-MM-DD' format
const getTodayISOString = () => {
  const today = new Date();
  // Adjust for timezone offset to get the correct local date
  const offset = today.getTimezoneOffset();
  const adjustedToday = new Date(today.getTime() - (offset*60*1000));
  return adjustedToday.toISOString().split('T')[0];
};

export default function InasistenciasReportPage() {
  const { session } = useAuthStore();
  const token = session?.user.access_token;

  // --- State for Filters ---
  const [startDate, setStartDate] = useState(getTodayISOString());
  const [endDate, setEndDate] = useState(getTodayISOString());
  const [despachoFilter, setDespachoFilter] = useState('');

  // --- Fetch data using our custom hook ---
  const { 
    data: inasistencias, 
    isLoading, 
    isError, 
    error 
  } = useGetInasistencias(token, startDate, endDate);

  // --- Filtering Logic with useMemo for performance ---
  const filteredInasistencias = useMemo(() => {
    if (!inasistencias) return [];

    return inasistencias.filter((item) => {
      // Despacho Filter (case-insensitive)
      // It safely handles cases where `despacho` is null
      if (
        despachoFilter &&
        !item.despacho?.nombre.toLowerCase().includes(despachoFilter.toLowerCase())
      ) {
        return false;
      }
      
      return true;
    });
  }, [inasistencias, despachoFilter]); // Dependency array

  const clearFilters = () => {
    // Reset filters to today's date
    setStartDate(getTodayISOString());
    setEndDate(getTodayISOString());
    setDespachoFilter('');
  };

  return (
    <section className="pt-16 p-2">
      <div className="container mx-auto px-2">
        <main className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-6">
            Reporte de Inasistencias
          </h1>
          
          {/* --- Filter Controls --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="despacho" className="block text-sm font-medium text-gray-700 mb-1">Despacho</label>
              <input
                id="despacho"
                type="text"
                placeholder="Filtrar por despacho..."
                value={despachoFilter}
                onChange={(e) => setDespachoFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 rounded text-white bg-gray-500 hover:bg-gray-600 transition"
              >
                Limpiar
              </button>
            </div>
          </div>
          
          {/* --- Table Section --- */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Empleado</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Turno</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Despacho</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Fecha de Inasistencia</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center p-6">
                      <div className="flex justify-center items-center gap-2 text-gray-500">
                        <Loader className="animate-spin" />
                        Cargando inasistencias...
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={4} className="text-center p-6 text-red-600">
                      <div className="flex justify-center items-center gap-2">
                        <AlertTriangle />
                        Error al cargar el reporte: {error.message}
                      </div>
                    </td>
                  </tr>
                ) : filteredInasistencias.length > 0 ? (
                  filteredInasistencias.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b text-sm">{`${item.empleado.nombre} ${item.empleado.apellido}`}</td>
                      <td className="p-3 border-b text-sm">{item.turno.nombre}</td>
                      <td className="p-3 border-b text-sm">{item.despacho?.nombre ?? 'N/A'}</td>
                      <td className="p-3 border-b text-sm">
                        {new Date(item.dia + 'T00:00:00').toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 p-6">
                       <div className="flex flex-col items-center gap-2">
                         <UserX size={32} />
                         <span>
                            {inasistencias && inasistencias.length > 0 ? 'No se encontraron resultados para los filtros aplicados.' : 'No hay inasistencias en el rango de fechas seleccionado.'}
                         </span>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </section>
  );
}