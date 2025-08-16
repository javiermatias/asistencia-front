'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation'; // NEW: Import useRouter
import Swal from 'sweetalert2'; // NEW: Import SweetAlert2

import styles from './HorarioEditor.module.css';
import { useAuthStore } from '@/app/store/authStore';
import { useGetHorario, useUpdateHorario } from '@/app/hooks/despacho/useHorario';

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
    // 2. Get URL query parameters
    const searchParams = useSearchParams();
    const nombre = searchParams.get('nombre');
    const apellido = searchParams.get('apellido');
    const nroEmpleado = searchParams.get('nroEmpleado');
  
  
  
  const router = useRouter(); // NEW: Initialize the router for navigation

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

  // This effect correctly builds the 7-day schedule (No changes here)
  useEffect(() => {
    if (!existingSchedule || !allTurnos) {
      return;
    }
    const defaultTurno = allTurnos.find(t => t.nombre.toLowerCase() === 'matutino');
    if (!defaultTurno) {
      console.error("Critical Error: Default 'Mañana' shift not found.");
      return;
    }
    const scheduleMap = new Map(
      existingSchedule.map(item => [item.dia_semana, item.turno.id])
    );
    const fullWeekSchedule = daysOfWeek.map((_, index) => {
      const dayNumber = index + 1;
      const existingTurnoId = scheduleMap.get(dayNumber);
      return {
        dia_semana: dayNumber,
        id_turno: existingTurnoId !== undefined ? existingTurnoId : defaultTurno.id,
      };
    });
    setSchedule(fullWeekSchedule);
  }, [existingSchedule, allTurnos]);

  const handleTurnoChange = (dia_semana: number, newTurnoId: string) => {
    setSchedule(currentSchedule =>
      currentSchedule.map(day =>
        day.dia_semana === dia_semana
          ? { ...day, id_turno: parseInt(newTurnoId, 10) }
          : day
      )
    );
  };

  // UPDATED: handleSave function now includes the onSuccess callback
  const handleSave = () => {
    if (!token) {
      console.error('Authentication token not found. Cannot save.');
      return;
    }
    
    // The `mutate` function accepts a second argument for options, including callbacks
    updateHorarioMutation.mutate({
      employeeId,
      horarios: schedule,
      token,
    }, {
      onSuccess: () => {
        // This code runs only after the mutation is successful
        Swal.fire({
          title: '¡Guardado!',
          text: 'El horario del empleado se ha actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 2000, // Optional: auto-close the alert after 2 seconds
          timerProgressBar: true,
        }).then(() => {
          // This runs after the user clicks "Aceptar" or the timer runs out
          router.push('/admin/empleado'); // Redirect to the employee list page
        });
      },
      // You can also add an onError callback for more specific error handling
      onError: (error) => {
         Swal.fire({
            title: 'Error',
            text: `No se pudo guardar el horario: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Cerrar'
         });
      }
    });
  };

  // --- JSX / Rendering ---
  if (isLoading) {
    return <div className={styles.loadingMessage}>Cargando horario...</div>;
  }

  if (isError) {
    return <div className={styles.errorMessage}>Error: {error?.message || 'No se pudo cargar el horario.'}</div>;
  }

  return (
    <div className={styles.container}>
       <h1 className={styles.title}>
        Editor de Horario para {nombre} {apellido} (Nº {nroEmpleado || 'N/A'})
      </h1>
      

      {allTurnos && schedule.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th>Día</th>
                <th>Turno Asignado</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(daySchedule => (
                <tr key={daySchedule.dia_semana}>
                  <td>{daysOfWeek[daySchedule.dia_semana - 1]}</td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

        {/* REMOVED: The old success/error messages are now handled by SweetAlert */}
        {/* We can keep the general error one, or rely on the Swal popup */}
        {updateHorarioMutation.isError && !updateHorarioMutation.isPending && (
          <p className={styles.errorMessage}>
            Error al guardar. Por favor, intente de nuevo.
          </p>
        )}
      </div>
    </div>
  );
}