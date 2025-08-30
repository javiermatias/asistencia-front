'use client';

import { useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';


import {
  Loader,
  Users,
  UserX,
  Clock,
  Coffee,
  Sunrise,
  Sunset,
  UserMinus,
  AlertTriangle,
} from 'lucide-react';
import { useGetDespachoBySupervisor } from '@/app/hooks/despacho/useDespachos';
import { useGetDailyReportByDespacho } from '@/app/hooks/despacho/useGetDailyReport';
import { StatGroup } from '../../admin/dashboard/StatGroup';
import { StatCard } from '../../admin/dashboard/StatCard';


export default function SupervisorDashboard() {
  const { session } = useAuthStore();
  const token = session?.user.access_token;

  // Supervisor’s despacho
  const {
    data: despacho,
    isLoading: isDespachoLoading,
    isError: isDespachoError,
  } = useGetDespachoBySupervisor(token);

  // Stable reportDate (today)
  const [reportDate] = useState(() =>
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, -1),
  );

  // Fetch daily report by despacho
  const {
    data,
    isLoading,
    isError,
  } = useGetDailyReportByDespacho(token, reportDate, despacho?.id);

  // --- LOADING AND ERROR STATES ---
  if (isDespachoLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isDespachoError || isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-red-600 dark:bg-gray-900">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12" />
          <h2 className="mt-4 text-xl font-semibold">
            Error al cargar el reporte del despacho
          </h2>
          <p className="text-gray-500">Por favor, intente de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  // --- DASHBOARD LAYOUT CONFIGURATION ---
  const dashboardLayout = [
    {
      title: `Resumen del Despacho ${despacho?.nombre ?? ''}`,
      stats: [
        {
          title: 'Asistencia Total',
          value: data.AsistenciaTotal,
          icon: Users,
          color: {
            background: 'bg-green-100 dark:bg-green-900/50',
            text: 'text-green-600 dark:text-green-400',
          },
        },
        {
          title: 'Faltas Totales',
          value: data.FaltasTotal,
          icon: UserX,
          color: {
            background: 'bg-red-100 dark:bg-red-900/50',
            text: 'text-red-600 dark:text-red-400',
          },
        },
        {
          title: 'Llegadas Tarde',
          value: data.Tarde,
          icon: Clock,
          color: {
            background: 'bg-yellow-100 dark:bg-yellow-900/50',
            text: 'text-yellow-600 dark:text-yellow-400',
          },
        },
        {
          title: 'Descansos',
          value: data.Descanso,
          icon: Coffee,
          color: {
            background: 'bg-blue-100 dark:bg-blue-900/50',
            text: 'text-blue-600 dark:text-blue-400',
          },
        },
        {
          title: 'Bajas de la semana',
          value: data.Bajas,
          icon: UserMinus,
          color: {
            background: 'bg-gray-200 dark:bg-gray-700',
            text: 'text-gray-600 dark:text-gray-300',
          },
        },
      ],
    },
    {
      title: 'Turno Matutino',
      stats: [
        {
          title: 'Asistencias Matutinas',
          value: data.AsistenciaMatutina,
          icon: Sunrise,
          color: {
            background: 'bg-orange-100 dark:bg-orange-900/50',
            text: 'text-orange-600 dark:text-orange-400',
          },
        },
        {
          title: 'Faltas Matutinas',
          value: data.FaltasMatutina,
          icon: UserX,
          color: {
            background: 'bg-red-100 dark:bg-red-900/50',
            text: 'text-red-600 dark:text-red-400',
          },
        },
      ],
    },
    {
      title: 'Turno Vespertino',
      stats: [
        {
          title: 'Asistencias Vespertinas',
          value: data.AsistenciaVespertina,
          icon: Sunset,
          color: {
            background: 'bg-indigo-100 dark:bg-indigo-900/50',
            text: 'text-indigo-600 dark:text-indigo-400',
          },
        },
        {
          title: 'Faltas Vespertinas',
          value: data.FaltasVespertina,
          icon: UserX,
          color: {
            background: 'bg-red-100 dark:bg-red-900/50',
            text: 'text-red-600 dark:text-red-400',
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reporte Diario de Asistencias del Despacho
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {new Date(reportDate).toLocaleDateString('es-MX', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        <main className="flex flex-col gap-8">
          {dashboardLayout.map((group) => (
            <StatGroup key={group.title} title={group.title}>
              {group.stats.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  colorClasses={stat.color}
                />
              ))}
            </StatGroup>
          ))}
        </main>
      </div>
    </div>
  );
}
