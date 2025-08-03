'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import styles from './HorarioEditor.module.css';
import { useHorario } from '@/app/hooks/despacho/useHorario';

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

  // Local state for the editable schedule form
  const [schedule, setSchedule] = useState<HorarioState[]>([]);

  // Use our custom hook to handle all API interactions
  const {
    existingSchedule,
    allTurnos,
    isLoading,
    isError,
    error,
    updateHorarioMutation
  } = useHorario(employeeId);

  // This effect syncs the fetched data from react-query into our local form state.
  // It runs whenever the fetched data changes.
  useEffect(() => {
    if (existingSchedule && allTurnos) {
      const defaultTurno = allTurnos.find(t => t.nombre.toLowerCase() === 'mañana');
      if (!defaultTurno) {
        console.error("Default 'Mañana' shift not found.");
        return;
      }
      
      const scheduleMap = new Map(
        existingSchedule.map(item => [item.dia_semana, item.turno.id])
      );

      const fullSchedule = daysOfWeek.map((_, index) => {
        const dayNumber = index + 1;
        return {
          dia_semana: dayNumber,
          id_turno: scheduleMap.get(dayNumber) || defaultTurno.id,
        };
      });

      setSchedule(fullSchedule);
    }
  }, [existingSchedule, allTurnos]); // Dependencies: the data from our hook

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
    // Call the mutate function from our hook
    updateHorarioMutation.mutate({ employeeId, horarios: schedule });
  };

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
          {daysOfWeek.map((dayName, index) => {
            const dayNumber = index + 1;
            const currentDaySchedule = schedule.find(s => s.dia_semana === dayNumber);
            
            if (!currentDaySchedule) return null;

            return (
              <div key={dayNumber} className={styles.dayCard}>
                <h3>{dayName}</h3>
                <select
                  className={styles.select}
                  value={currentDaySchedule.id_turno}
                  onChange={(e) => handleTurnoChange(dayNumber, e.target.value)}
                  disabled={updateHorarioMutation.isPending}
                >
                  {allTurnos.map(turno => (
                    <option key={turno.id} value={turno.id}>
                      {turno.nombre}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No se encontraron turnos disponibles.</p>
      )}

      <div className={styles.actions}>
        <button 
          onClick={handleSave} 
          disabled={updateHorarioMutation.isPending}
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