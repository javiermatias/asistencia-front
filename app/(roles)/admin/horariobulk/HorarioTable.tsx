// src/components/HorarioTable.tsx

import { EmpleadoConHorarios, Turno } from '@/app/types/horario';
import React from 'react';


interface HorarioTableProps {
  empleados: EmpleadoConHorarios[];
  turnos: Turno[];
  onHorarioChange: (
    employeeId: number,
    diaSemana: number,
    newTurnoId: number,
  ) => void;
}

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const HorarioTable: React.FC<HorarioTableProps> = ({
  empleados,
  turnos,
  onHorarioChange,
}) => {
  if (!empleados.length) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No hay empleados en este despacho.
      </p>
    );
  }

  // A map for quick lookup of a turno for a specific day
  const getTurnoForDay = (empleado: EmpleadoConHorarios, dia: number): Turno | undefined => {
    return empleado.horarios.find((h) => h.dia_semana === dia)?.turno;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
              Empleado
            </th>
            {DIAS.map((dia) => (
              <th
                key={dia}
                className="py-2 px-4 border-b text-center font-semibold text-gray-700"
              >
                {dia}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                {empleado.nombre} {empleado.apellido}
              </td>
              {DIAS.map((_, index) => {
                const diaSemana = index + 1;
                const turnoActual = getTurnoForDay(empleado, diaSemana);
                
                return (
                  <td key={diaSemana} className="py-2 px-4 border-b text-center">
                    <select
                      value={turnoActual?.id || ''}
                      onChange={(e) =>
                        onHorarioChange(empleado.id, diaSemana, Number(e.target.value))
                      }
                      className="p-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
                    >
                      {turnos.map((turno) => (
                        <option key={turno.id} value={turno.id}>
                          {turno.nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};