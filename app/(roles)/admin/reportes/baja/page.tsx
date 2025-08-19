'use client';

import { useState, useMemo } from 'react';

import { useAuthStore } from '@/app/store/authStore'; // Assuming you have this

import { Loader, AlertTriangle } from 'lucide-react';
import { useGetBajas } from '@/app/hooks/despacho/useEmpleado';

export default function BajasReportPage() {
  const { session } = useAuthStore();
  const token = session?.user.access_token;

  // --- State for Filters ---
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [puestoFilter, setPuestoFilter] = useState('');
  const [despachoFilter, setDespachoFilter] = useState('');

  const { data: bajas, isLoading, isError, error } = useGetBajas(token);

  // --- Filtering Logic with useMemo for performance ---
  const filteredBajas = useMemo(() => {
    if (!bajas) return [];

    return bajas.filter((empleado) => {
      // Date Range Filter
      const bajaDate = new Date(empleado.baja_date);
      if (startDate && new Date(startDate) > bajaDate) {
        return false;
      }
      if (endDate) {
        // Set end date to the very end of the day to include it
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (end < bajaDate) {
          return false;
        }
      }

      // Puesto Filter (case-insensitive)
      if (
        puestoFilter &&
        !empleado.puesto?.nombre.toLowerCase().includes(puestoFilter.toLowerCase())
      ) {
        return false;
      }

      // Despacho Filter (case-insensitive)
      if (
        despachoFilter &&
        !empleado.despacho?.nombre.toLowerCase().includes(despachoFilter.toLowerCase())
      ) {
        return false;
      }
      
      return true;
    });
  }, [bajas, startDate, endDate, puestoFilter, despachoFilter]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setPuestoFilter('');
    setDespachoFilter('');
  };

  return (
    
      <section className="pt-16 p-2">
        <div className="container mx-auto px-2 ">
             
        <main className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-6">
        Reporte de Bajas de Empleados
      </h1>
      
      {/* --- Filter Controls --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
          <input
            type="text"
            placeholder="Filtrar por puesto..."
            value={puestoFilter}
            onChange={(e) => setPuestoFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Despacho</label>
          <input
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
              <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Nombre</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Apellido</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Puesto</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Despacho</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Fecha de Baja</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center p-6">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader className="animate-spin" />
                    Cargando datos...
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-red-600">
                  <div className="flex justify-center items-center gap-2">
                    <AlertTriangle />
                    Error al cargar el reporte: {error.message}
                  </div>
                </td>
              </tr>
            ) : filteredBajas.length > 0 ? (
              filteredBajas.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b text-sm">{empleado.nombre}</td>
                  <td className="p-3 border-b text-sm">{empleado.apellido}</td>
                  <td className="p-3 border-b text-sm">{empleado.puesto?.nombre ?? 'N/A'}</td>
                  <td className="p-3 border-b text-sm">{empleado.despacho?.nombre ?? 'N/A'}</td>
                  <td className="p-3 border-b text-sm">
                    {new Date(empleado.baja_date).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 p-6">
                  {bajas && bajas.length > 0 ? 'No se encontraron resultados para los filtros aplicados.' : 'No hay registros de bajas.'}
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