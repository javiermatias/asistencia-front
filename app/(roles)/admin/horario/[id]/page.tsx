'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import styles from './HorarioEditor.module.css';
import { useAuthStore } from '@/app/store/authStore';
import { useGetHorario, useUpdateHorario } from '@/app/hooks/despacho/useHorario'; // Adjust path if needed

type HorarioState = {
  dia_semana: number;
  id_turno: number;
};

const daysOfWeek = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

export default function HorarioEditorPage() {
  const params = useParams();
  const employeeId = params.id as string;

  const { session } = useAuthStore();
  const token = session?.user.access_token;
  const [schedule, setSchedule] = useState<HorarioState[]>([]);

  // --- Data Fetching and Mutations ---
  const {
    existingSchedule,
    allTurnos,
    isLoading,
    isError,
    error,
  } = useGetHorario(employeeId, token || '');

  const updateHorarioMutation = useUpdateHorario();

  // REFACTORED: This effect now correctly builds the 7-day schedule
  // and defaults to 'Mañana' for any missing days.
  useEffect(() => {
    // Guard clause: Don't run logic until both API calls have returned data.
    if (!existingSchedule || !allTurnos) {
      return;
    }

    // 1. Find the 'Mañana' shift to use as a default.
    const defaultTurno = allTurnos.find(t => t.nombre.toLowerCase() === 'mañana');

    // 2. Critical Check: If 'Mañana' doesn't exist in the turnos list, we can't proceed.
    if (!defaultTurno) {
      console.error("Critical Error: Default 'Mañana' shift not found in the API response. Cannot build schedule.");
      return;
    }

    // 3. Create a Map for fast lookups of the employee's existing schedule.
    // The key is the day of the week (1-7), and the value is the shift ID.
    const scheduleMap = new Map(
      existingSchedule.map(item => [item.dia_semana, item.turno.id])
    );

    // 4. Build the full 7-day schedule.
    const fullWeekSchedule = daysOfWeek.map((_, index) => {
      const dayNumber = index + 1; // 1 for Monday, 2 for Tuesday, etc.

      // Check if a schedule exists for this day in the map.
      const existingTurnoId = scheduleMap.get(dayNumber);

      return {
        dia_semana: dayNumber,
        // If a shift exists for this day, use it. Otherwise, use the 'Mañana' default ID.
        id_turno: existingTurnoId !== undefined ? existingTurnoId : defaultTurno.id,
      };
    });

    // 5. Set the complete 7-day schedule into our local state for the form.
    setSchedule(fullWeekSchedule);

  }, [existingSchedule, allTurnos]); // Dependencies: re-run when fetched data changes.

  const handleTurnoChange = (dia_semana: number, newTurnoId: string) => {
    setSchedule(currentSchedule =>
      currentSchedule.map(day =>
        day.dia_semana === dia_semana
          ? { ...day, id_turno: parseInt(newTurnoId, 10) }
          : day
      )
    );
  };

  const handleSave = () => {
    if (!token) {
      console.error('Authentication token not found. Cannot save.');
      return;
    }
    updateHorarioMutation.mutate({
      employeeId,
      horarios: schedule,
      token,
    });
  };

  // --- JSX / Rendering (No major changes, but it will now work correctly) ---
  if (isLoading) {
    return <div className={styles.loadingMessage}>Cargando horario...</div>;
  }

  if (isError) {
    return <div className={styles.errorMessage}>Error: {error?.message || 'No se pudo cargar el horario.'}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editor de Horario para Empleado #{employeeId}</h1>

      {allTurnos && schedule.length > 0 ? (
        <div className={styles.scheduleGrid}>
          {schedule.map(daySchedule => (
            <div key={daySchedule.dia_semana} className={styles.dayCard}>
              <h3>{daysOfWeek[daySchedule.dia_semana - 1]}</h3>
              <select
                className={styles.select}
                value={daySchedule.id_turno}
                onChange={(e) => handleTurnoChange(daySchedule.dia_semana, e.target.value)}
                disabled={updateHorarioMutation.isPending}
              >
                {allTurnos.map(turno => (
                  <option key={turno.id} value={turno.id}>
                    {turno.nombre}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <p>No se encontraron turnos disponibles para configurar el horario.</p>
      )}

      <div className={styles.actions}>
        <button
          onClick={handleSave}
          disabled={!token || schedule.length === 0 || updateHorarioMutation.isPending}
          className={styles.saveButton}
        >
          {updateHorarioMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        {updateHorarioMutation.isSuccess && (
          <p className={styles.successMessage}>¡Horario guardado con éxito!</p>
        )}

        {updateHorarioMutation.isError && (
          <p className={styles.errorMessage}>
            Error al guardar: {updateHorarioMutation.error?.message || 'Ocurrió un error.'}
          </p>
        )}
      </div>
    </div>
  );
}