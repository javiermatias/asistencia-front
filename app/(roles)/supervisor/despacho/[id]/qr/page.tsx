// src/app/despacho/[id]/qr/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import { useGetDespachoById } from '@/app/hooks/despacho/useDespachos';
import QrManager from '@/app/components/despachoAdmin/QrManager';

// --- NEW: Import your clean, presentational component ---


export default function QrManagementPage() {
  const { id: despachoId } = useParams() as { id: string };
  const { session } = useAuthStore();
  const token = session?.user.access_token;

  // The page is responsible for fetching the data
  const { data: despacho, isLoading, isError, error } = useGetDespachoById(despachoId, token);

  // The page handles the main loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen font-semibold">Cargando datos del despacho...</div>;
  }

  // The page handles the main error state
  if (isError) {
    const errorMessage = (error as any).response?.data?.message || error.message;
    return <div className="flex justify-center items-center h-screen text-red-600 bg-red-50 p-4">Error: {errorMessage}</div>;
  }
  
  // The page handles the case where no data is found
  if (!despacho) {
    return <div className="flex justify-center items-center h-screen text-gray-600">No se encontró el despacho.</div>;
  }

  // Once data is ready, render the component and pass the data as props
  return (
    <main className="container mx-auto mt-8 p-4">
      <QrManager despacho={despacho} token={token} />
    </main>
  );
}