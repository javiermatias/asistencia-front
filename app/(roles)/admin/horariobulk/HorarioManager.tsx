'use client'
import React, { useState, useEffect } from 'react';

import { HorarioTable } from './HorarioTable';
import { EmpleadoConHorarios, UpdateHorarioPayload } from '@/app/types/horario';
import { useGetDespachos } from '@/app/hooks/despacho/useDespachos';
import { useGetHorariosPorDespacho, useGetTurnos, useUpdateHorariosPorDespacho } from '@/app/hooks/despacho/useHorario';
import { useAuthStore } from '@/app/store/authStore';


// --- This is where the magic happens: Processing the data ---
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
        // ** THE DEFAULT RULE **
        // If the day is missing, add the default 'Mañana' shift
        fullSchedule.push({
          id: -i, // Use a temporary negative ID for react key purposes
          dia_semana: i,
          turno: { id: defaultTurnoId, nombre: 'Mañana' }, // Assume the name for UI
        });
      }
    }
    return { ...empleado, horarios: fullSchedule };
  });
};

export const HorarioManager: React.FC = () => {
  // Assume you get the token from a context or auth service
 
  const { session } = useAuthStore();
  const token = session?.user.access_token;

  const [selectedDespachoId, setSelectedDespachoId] = useState<number | null>(null);
  const [tableData, setTableData] = useState<EmpleadoConHorarios[]>([]);

  const { data: despachos, isLoading: isLoadingDespachos } = useGetDespachos(token);
  const { data: turnos, isLoading: isLoadingTurnos } = useGetTurnos(token);
  const { data: horariosData, isLoading: isLoadingHorarios } = useGetHorariosPorDespacho(token, selectedDespachoId);

  const updateMutation = useUpdateHorariosPorDespacho();

  // Effect to process API data and set it to local state
  useEffect(() => {
    if (horariosData && turnos) {
      const mañanaTurno = turnos.find((t) => t.nombre.toLowerCase() === 'mañana');
      const defaultTurnoId = mañanaTurno?.id || turnos[0]?.id; // Fallback to first turno if 'Mañana' not found
      
      const processedData = processInitialData(horariosData, defaultTurnoId);
      setTableData(processedData);
    }
  }, [horariosData, turnos]);

  const handleHorarioChange = (
    employeeId: number,
    diaSemana: number,
    newTurnoId: number,
  ) => {
    setTableData((currentData) =>
      currentData.map((emp) => {
        if (emp.id === employeeId) {
          const newHorarios = emp.horarios.map((horario) => {
            if (horario.dia_semana === diaSemana) {
              const newTurno = turnos?.find((t) => t.id === newTurnoId);
              return { ...horario, turno: newTurno! };
            }
            return horario;
          });
          return { ...emp, horarios: newHorarios };
        }
        return emp;
      }),
    );
  };

  const handleSave = () => {
    if (!selectedDespachoId) return;

    // Transform the table data into the format the API expects
    const payload: UpdateHorarioPayload[] = tableData.map((emp) => ({
      id: emp.id,
      horarios: emp.horarios.map((h) => ({
        dia_semana: h.dia_semana,
        turno: { id: h.turno.id },
      })),
    }));

    updateMutation.mutate({
      token,
      despachoId: selectedDespachoId,
      payload,
    });
    //toast.success("Horarios guardados con exito")
  };

  const isLoading = isLoadingDespachos || isLoadingTurnos || isLoadingHorarios;

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Gestión de Horarios
        </h1>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <label
              htmlFor="despacho-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Seleccionar Despacho
            </label>
            <select
              id="despacho-select"
              disabled={isLoadingDespachos}
              value={selectedDespachoId || ''}
              onChange={(e) => setSelectedDespachoId(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>
                -- Elija un despacho --
              </option>
              {despachos?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={!selectedDespachoId || tableData.length === 0 || updateMutation.isPending}
            className="mt-4 sm:mt-0 self-end px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

        {isLoading && <p className="text-center text-gray-500 mt-8">Cargando datos...</p>}
        {!isLoading && selectedDespachoId && (
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

