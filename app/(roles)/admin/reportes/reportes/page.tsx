'use client';

import { useState, useMemo } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { Loader, AlertTriangle, UserX } from 'lucide-react';
import { ReportType, useGetReporte } from '@/app/hooks/despacho/useGetReporte';
import { Asistencia } from '@/app/types/empleado/inasistencia';


// --- Configuration for the select dropdown ---
const REPORT_OPTIONS: { value: ReportType; label: string }[] = [
  { value: 'inasistencias', label: 'Inasistencias' },
  { value: 'asistencias', label: 'Asistencias' },
  { value: 'descansos', label: 'Descansos' },
  { value: 'tardes', label: 'Llegadas Tarde' },
  { value: 'asistencias-matutinas', label: 'Asistencias (Matutino)' },
  { value: 'faltas-matutinas', label: 'Faltas (Matutino)' },
  { value: 'asistencias-vespertinas', label: 'Asistencias (Vespertino)' },
  { value: 'faltas-vespertinas', label: 'Faltas (Vespertino)' },
];

// Helper to get today's date in 'YYYY-MM-DD' format
const getTodayISOString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const adjustedToday = new Date(today.getTime() - offset * 60 * 1000);
  return adjustedToday.toISOString().split('T')[0];
};

export default function EstadisticasReportPage() {
  const { session } = useAuthStore();
  const token = session?.user.access_token;

  // --- State for Filters ---
  const [reportType, setReportType] = useState<ReportType>('inasistencias');
  const [startDate, setStartDate] = useState(getTodayISOString());
  const [endDate, setEndDate] = useState(getTodayISOString());
  const [empleadoFilter, setEmpleadoFilter] = useState('');
  const [despachoFilter, setDespachoFilter] = useState(''); // NEW: State for despacho filter

  // --- Fetch data using our generic hook ---
  const { 
    data: reporteData, 
    isLoading, 
    isError, 
    error 
  } = useGetReporte(token, reportType, startDate, endDate);

  // --- Dynamic titles and labels ---
  const reportTitle = REPORT_OPTIONS.find(opt => opt.value === reportType)?.label || 'Reporte';
  const dateColumnTitle = reportType.includes('inasistencia') || reportType.includes('faltas') 
    ? `Fecha de Falta` 
    : `Fecha de Registro`;

  // --- Filtering Logic with useMemo for performance ---
  const filteredData = useMemo(() => {
    if (!reporteData) return [];

    return reporteData.filter((item: Asistencia) => { // MODIFIED: Added type for item
      // Employee Filter (case-insensitive)
      const fullName = `${item.empleado.nombre} ${item.empleado.apellido}`.toLowerCase();
      if (empleadoFilter && !fullName.includes(empleadoFilter.toLowerCase())) {
        return false;
      }
      
      // NEW: Despacho Filter (case-insensitive and safe for null values)
      if (
        despachoFilter &&
        (!item.despacho || !item.despacho.nombre.toLowerCase().includes(despachoFilter.toLowerCase()))
      ) {
        return false;
      }
      
      return true;
    });
  }, [reporteData, empleadoFilter, despachoFilter]); // MODIFIED: Added despachoFilter to dependency array

  const clearFilters = () => {
    setStartDate(getTodayISOString());
    setEndDate(getTodayISOString());
    setEmpleadoFilter('');
    setDespachoFilter(''); // NEW: Clear despacho filter
  };

  return (
    <section className="pt-16 p-2">
      <div className="container mx-auto px-2">
        <main className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-6">
            Reporte de {reportTitle}
          </h1>
          
          {/* --- Filter Controls --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {REPORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
              <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
              <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label htmlFor="empleado" className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
              <input id="empleado" type="text" placeholder="Filtrar por empleado..." value={empleadoFilter} onChange={(e) => setEmpleadoFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            {/* NEW: Despacho filter input */}
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
            <div className="flex items-end col-span-1 md:col-span-2 lg:col-span-5 justify-end">
              <button onClick={clearFilters} className="w-full md:w-auto px-4 py-2 rounded text-white bg-gray-500 hover:bg-gray-600 transition">
                Limpiar Filtros
              </button>
            </div>
          </div>
          
          {/* --- Table Section --- */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Empleado</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Turno</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Despacho</th> {/* NEW: Table header */}
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">{dateColumnTitle}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center p-6"> {/* MODIFIED: colSpan is now 4 */}
                      <div className="flex justify-center items-center gap-2 text-gray-500"><Loader className="animate-spin" />Cargando reporte...</div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={4} className="text-center p-6 text-red-600"> {/* MODIFIED: colSpan is now 4 */}
                      <div className="flex justify-center items-center gap-2"><AlertTriangle />Error al cargar el reporte: {error.message}</div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b text-sm">{`${item?.empleado?.nombre} ${item?.empleado?.apellido}`}</td>
                      <td className="p-3 border-b text-sm">{item?.turno?.nombre}</td>
                      {/* NEW: Table cell for despacho. Uses optional chaining and nullish coalescing for safety. */}
                      <td className="p-3 border-b text-sm">{item?.despacho?.nombre ?? 'N/A'}</td>
                      <td className="p-3 border-b text-sm">
                        {new Date(item.dia + 'T00:00:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 p-6"> {/* MODIFIED: colSpan is now 4 */}
                       <div className="flex flex-col items-center gap-2">
                         <UserX size={32} />
                         <span>
                            {reporteData && reporteData.length > 0 ? 'No se encontraron resultados para los filtros aplicados.' : 'No hay datos en el rango de fechas seleccionado.'}
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