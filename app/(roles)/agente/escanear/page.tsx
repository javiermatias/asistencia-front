'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // <-- IMPORTED
import { useUserLocation } from '@/app/hooks/despacho/useUserLocation';
import { useRegistrarAsistencia } from '@/app/hooks/despacho/useRegistrarAsistencia';
import Spinner from '@/app/ui/spiner';
import { QrReader } from 'react-qr-reader';
import { CheckCircleIcon } from '@heroicons/react/24/outline'; // <-- IMPORTED

export default function ScanPage() {
    const router = useRouter(); // <-- ADDED
    const { data: session } = useSession({ required: true });
    const { latitud, longitud, error: locationError, isLoading: isLocationLoading } = useUserLocation();
  
    const { mutate, isPending,isSuccess, isError, error: apiError, data: apiData } = useRegistrarAsistencia();
  
    const [scanEnabled, setScanEnabled] = useState(true);
  
    const handleScanResult = (result: any, error: any) => {
      if (scanEnabled && !!result) {
        setScanEnabled(false);
        const qrToken = result.getText();
        console.log('QR Code Scanned:', qrToken);
  
        if (!latitud || !longitud) {
          console.error('Location not available when QR was scanned.');
          return;
        }
         //const timestampUtc = new Date().toISOString();
        const  timestampUtc = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1);
        
        if (session?.user.access_token) {
          mutate({
            dto: { qrToken, latitud, longitud, timestampUtc },
            token: session.user.access_token,
          });
        }
      }
    };
  
    // 1. Initial State: Waiting for location
    if (isLocationLoading) {
      return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
          <Spinner />
          <p className="mt-4 text-gray-600">Obteniendo su ubicación...</p>
        </main>
      );
    }
  
    // 2. Location Error State
    if (locationError) {
      return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
          <p className="text-red-500 text-center font-bold">Error de ubicación: {locationError}. Por favor, active los servicios de localización.</p>
        </main>
      );
    }
  
    // 3. API Call is in Progress State
    if (isPending) {
      return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
          <Spinner />
          <p className="mt-4 text-gray-600">Registrando asistencia...</p>
        </main>
      );
    }
  
    // 4. API Call Succeeded State (MODIFIED BLOCK)
    if (isSuccess) {
      const successMessage = apiData?.fecha_egreso
        ? "Se ha registrado su salida correctamente."
        : "Se ha registrado su entrada correctamente.";

      return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-50">
          <CheckCircleIcon className="w-24 h-24 text-green-500 mb-6" />
          <p className="text-green-800 text-2xl font-bold text-center mb-8">{successMessage}</p>
          <button
            onClick={() => router.push('/agente')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Aceptar
          </button>
        </main>
      );
    }
    
    // 5. API Call Failed State
    if (isError) {
      const errorMessage = (apiError as any)?.response?.data?.message || 'Ocurrió un error inesperado.';
  
      return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50">
          <p className="text-red-600 text-2xl font-bold text-center">{errorMessage}</p>
        </main>
      );
    }
  
    // 6. Default State: Ready to Scan
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Registrar Asistencia</h1>
        <div className="w-full max-w-sm border-4 border-gray-300 rounded-lg overflow-hidden">
          <QrReader
            onResult={handleScanResult}
            constraints={{ facingMode: 'environment' }}
            containerStyle={{ width: '100%' }}
          />
        </div>
        <p className="mt-4 text-gray-600">Apunte la cámara al código QR</p>
      </main>
    );
}