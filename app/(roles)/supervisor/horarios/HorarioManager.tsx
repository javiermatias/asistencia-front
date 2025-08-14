// src/components/horarios/HorarioManager.tsx (or your chosen path)
'use client'

import React, { useState, useEffect } from 'react';

import { EmpleadoConHorarios, UpdateHorarioPayload } from '@/app/types/horario';
import { useAuthStore } from '@/app/store/authStore';
import { toast } from 'sonner';

// --- UPDATED HOOK IMPORTS ---
import { useGetDespachoBySupervisor } from '@/app/hooks/despacho/useDespachos';
import { useGetHorariosPorDespacho, useGetTurnos, useUpdateHorariosPorDespacho } from '@/app/hooks/despacho/useHorario';
import { HorarioTable } from '../../admin/horariobulk/HorarioTable';

// Helper function remains the same, it's good logic.
const processInitialData = (
  apiData: EmpleadoConHorarios[],
  defaultTurnoId: number | undefined,
): EmpleadoConHorarios[] => {
  if (!apiData || !defaultTurnoId) return [];

  return apiData.map((empleado) => {
    const scheduleMap = new Map(empleado.horarios.map((h) => [h.dia_semana, h]));
    const fullSchedule: EmpleadoConHorarios['horarios'] = [];
    for (let i = 1; i <= 7; i++) {
      if (scheduleMap.has(i)) {
        fullSchedule.push(scheduleMap.get(i)!);
      } else {
        fullSchedule.push({
          id: -i,
          dia_semana: i,
          turno: { id: defaultTurnoId, nombre: 'Mañana' }, // Assumed name for UI
        });
      }
    }
    return { ...empleado, horarios: fullSchedule };
  });
};

export const HorarioManager: React.FC = () => {
  const { session } = useAuthStore();
  const token = session?.user.access_token;
  
  // State for the processed table data
  const [tableData, setTableData] = useState<EmpleadoConHorarios[]>([]);

  // --- STEP 1: Fetch the supervisor's despacho first ---
  const { 
    data: supervisorDespacho, 
    isLoading: isLoadingDespacho, 
    isError: isErrorDespacho 
  } = useGetDespachoBySupervisor(token);
  
  // --- STEP 2: Fetch horarios and turnos. Horarios are dependent on the supervisor's despacho. ---
  const { data: turnos, isLoading: isLoadingTurnos } = useGetTurnos(token);

  const { data: horariosData, isLoading: isLoadingHorarios } = useGetHorariosPorDespacho(
    token,
    supervisorDespacho?.id, // Pass the ID from the first hook
    
  );
  
  const updateMutation = useUpdateHorariosPorDespacho();

  // Effect to process the raw horario data into the table format
  useEffect(() => {
    if (horariosData && turnos) {
      const mañanaTurno = turnos.find((t) => t.nombre.toLowerCase() === 'mañana');
      const defaultTurnoId = mañanaTurno?.id || turnos[0]?.id; // Fallback to first turno
      
      const processedData = processInitialData(horariosData, defaultTurnoId);
      setTableData(processedData);
    }
  }, [horariosData, turnos]);

  // This handler for local state updates remains the same
  const handleHorarioChange = (employeeId: number, diaSemana: number, newTurnoId: number) => {
    setTableData((currentData) =>
      currentData.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              horarios: emp.horarios.map((horario) =>
                horario.dia_semana === diaSemana
                  ? { ...horario, turno: turnos?.find((t) => t.id === newTurnoId)! }
                  : horario
              ),
            }
          : emp
      )
    );
  };

  // The save handler now uses the supervisorDespacho's ID
  const handleSave = () => {
    if (!supervisorDespacho?.id || !token) {
        toast.error("No se pudo identificar el despacho para guardar.");
        return;
    }

    const payload: UpdateHorarioPayload[] = tableData.map((emp) => ({
      id: emp.id,
      horarios: emp.horarios.map((h) => ({
        dia_semana: h.dia_semana,
        turno: { id: h.turno.id },
      })),
    }));
    
    toast.promise(
      updateMutation.mutateAsync({
        token,
        despachoId: supervisorDespacho.id,
        payload,
      }),
      {
        loading: 'Guardando horarios...',
        success: '¡Horarios guardados con éxito!',
        error: (err: any) => err.response?.data?.message || 'Error al guardar los horarios.'
      }
    )
  };

  // Consolidated loading state
  const isLoading = isLoadingDespacho || isLoadingTurnos || isLoadingHorarios;
  
  if (isLoadingDespacho) {
    return <p className="text-center text-gray-500 mt-8">Cargando datos del supervisor...</p>;
  }

  if (isErrorDespacho || !supervisorDespacho) {
    return <p className="text-center text-red-500 mt-8">No se encontró un despacho asignado a este supervisor.</p>;
  }
  
  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Gestión de Horarios
        </h1>

        {/* --- STEP 3: Replace the <select> with a static display --- */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div>
            <span className="block text-sm font-medium text-gray-700">
              Despacho
            </span>
            <p className="text-lg font-semibold text-indigo-600">{supervisorDespacho.nombre}</p>
          </div>

          <button
            onClick={handleSave}
            disabled={tableData.length === 0 || updateMutation.isPending || isLoadingHorarios}
            className="mt-4 sm:mt-0 self-end px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
        
        {/* Conditional rendering for the table */}
        {isLoading && <p className="text-center text-gray-500 mt-8">Cargando horarios de empleados...</p>}
        {!isLoading && supervisorDespacho && (
          <HorarioTable
            empleados={tableData}
            turnos={turnos || []}
            onHorarioChange={handleHorarioChange}
          />
        )}
      </div>
    </div>
  );
};