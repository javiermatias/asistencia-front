"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { Loader, AlertTriangle } from "lucide-react";
import { useGetDespachos } from "@/app/hooks/despacho/useDespachos";
import { useDownloadAsistenciasReport } from "@/app/hooks/despacho/useDownloadAsistenciasReport";
import { toast } from "sonner";

// Helper para hoy en YYYY-MM-DD
const getTodayISOString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const adjustedToday = new Date(today.getTime() - offset * 60 * 1000);
  return adjustedToday.toISOString().split("T")[0];
};

export default function AsistenciasReportPage() {
  const { session } = useAuthStore();
  const token = session?.user.access_token;

  const { data: despachos, isLoading, isError, error } = useGetDespachos(token || "");
  const { downloadReport } = useDownloadAsistenciasReport();

  const [idDespacho, setIdDespacho] = useState<number | undefined>();
  const [startDate, setStartDate] = useState(getTodayISOString());
  const [endDate, setEndDate] = useState(getTodayISOString());

  const handleDownload = async () => {
    if (token && idDespacho && startDate && endDate) {
      try {
        await downloadReport(token, idDespacho, startDate, endDate);
        toast.success("Reporte descargado correctamente ✅");
      } catch (err: any) {
        console.error(err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Error al descargar el reporte";
        toast.error(message); // 👈 show error toast
      }
    } else {
      toast.warning("Por favor selecciona un despacho y ambas fechas");
    }
  };

  return (
    <section className="pt-16 p-4">
      <div className="container mx-auto max-w-3xl">
        <main className="p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-6">
            Reporte de Asistencias
          </h1>

          {/* --- Filtros --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
            {/* Select de despacho */}
            <div>
              <label
                htmlFor="despacho"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Despacho
              </label>
              <select
                id="despacho"
                value={idDespacho ?? ""}
                onChange={(e) => setIdDespacho(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Seleccione un despacho</option>
                {isLoading ? (
                  <option disabled>Cargando...</option>
                ) : isError ? (
                  <option disabled>Error al cargar despachos</option>
                ) : (
                  despachos?.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre}
                    </option>
                  ))
                )}
              </select>
              {isError && (
                <p className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertTriangle size={14} /> {error?.message}
                </p>
              )}
            </div>

            {/* Fecha inicio */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Desde
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Fecha fin */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hasta
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Botón */}
            <div className="flex items-end">
              <button
                onClick={handleDownload}
                disabled={!token || !despachos}
                className="w-full px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Descargar Excel
              </button>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}