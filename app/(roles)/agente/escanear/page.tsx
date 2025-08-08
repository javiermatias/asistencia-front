'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useUserLocation } from '@/app/hooks/despacho/useUserLocation';
import { useRegistrarAsistencia } from '@/app/hooks/despacho/useRegistrarAsistencia';
import Spinner from '@/app/ui/spiner';
import { QrReader } from 'react-qr-reader';
// Define a type for our status messages

export default function ScanPage() {
    const { data: session } = useSession({ required: true });
    const { latitud, longitud, error: locationError, isLoading: isLocationLoading } = useUserLocation();
  
    // We will now use these flags directly to control the UI
    const { mutate, isPending,isSuccess, isError, error: apiError, data: apiData } = useRegistrarAsistencia();
  
    const [scanEnabled, setScanEnabled] = useState(true); // Control when the scanner is active
  
    const handleScanResult = (result: any, error: any) => {
      // Only process if scan is enabled and a result is found
      if (scanEnabled && !!result) {
        setScanEnabled(false); // Disable scanner to prevent multiple submissions
        const qrToken = result.getText();
        console.log('QR Code Scanned:', qrToken);
  
        if (!latitud || !longitud) {
          // This is a pre-check, not using the mutation state yet
          console.error('Location not available when QR was scanned.');
          return; // Early exit
        }
        
        if (session?.user.access_token) {
          mutate({
            dto: { qrToken, latitud, longitud },
            token: session.user.access_token,
          });
        }
      }
    };
  
    // --- UI RENDERING LOGIC ---
    
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
  
    // 4. API Call Succeeded State
    if (isSuccess) {
      const successMessage = apiData?.fecha_egreso
        ? "Se ha registrado su salida correctamente."
        : "Se ha registrado su entrada correctamente.";
  
      return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-50">
          <p className="text-green-700 text-2xl font-bold text-center">{successMessage}</p>
        </main>
      );
    }
    
    // 5. API Call Failed State
    if (isError) {
      // Extract a user-friendly error message from the AxiosError
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