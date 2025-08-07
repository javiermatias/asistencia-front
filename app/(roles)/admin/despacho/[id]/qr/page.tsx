"use client";

import { useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import { toast } from 'sonner';
import { useQRCode } from 'next-qrcode';
import { useReactToPrint } from 'react-to-print';

// --- NEW: Import your custom hooks ---
import { useGetDespachoById, useRenovateDespachoQr } from '@/app/hooks/despacho/useDespachos';

export default function QrManagementPage() {
  const { id: despachoId } = useParams() as { id: string };
  const { session } = useAuthStore();
  const token = session?.user.access_token;
  const { Canvas } = useQRCode();
  const qrRef = useRef<HTMLDivElement>(null);
  // Create a separate ref specifically for the component you want to print
  const qrToPrintRef = useRef(null); 


  // --- USE THE HOOKS ---
  const { data: despacho, isLoading, isError, error } = useGetDespachoById(despachoId, token);
  const renovateMutation = useRenovateDespachoQr();

  const handleRenovate = async () => {
    if (!despachoId || !token) return;

    toast.promise(
      renovateMutation.mutateAsync({ id: despachoId, token }),
      {
        loading: 'Renovando token QR...',
        success: '¡Código QR renovado con éxito!',
        error: 'Falló la renovación del QR.',
      }
    );
  };
  
  // The rest of your component (handlePrint, JSX, etc.) remains the same.
  // Notice how much cleaner the data fetching and mutation logic is.
 // Configure the print hook
 const handlePrint = useReactToPrint({
    contentRef: qrToPrintRef,
    documentTitle: `QR Code - ${despacho?.nombre || ''}`,
    onAfterPrint: () => toast.info('Preparando impresión...'), // Optional: nice UX
  });

  // This is the cleanest way to do it. Create a small wrapper function.


  if (isLoading) return <div className="text-center mt-8">Cargando...</div>;
  if (isError) return <div className="text-center mt-8 text-red-500">Error: {error.message}</div>;
  
  return (
    <main className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800">
        Gestión de QR para: <span className="text-blue-600">{despacho?.nombre}</span>
      </h1>
      <p className="text-gray-500 mb-6">ID del Despacho: {despachoId}</p>

      {/* This container div no longer needs a ref */}
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-gray-50">
        {despacho?.qrToken ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Código QR Actual</h2>

            {/* --- CHANGE 1: A new div with the ref wraps ONLY the canvas --- */}
            <div ref={qrToPrintRef}>
              <Canvas
                text={despacho.qrToken}
                options={{
                  errorCorrectionLevel: 'M',
                  margin: 3,
                  scale: 4,
                  width: 256,
                  color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                  },
                }}
              />
            </div>
            
            <p className="mt-4 text-xs text-gray-400 break-all">{despacho.qrToken}</p>
          </>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-lg font-semibold text-gray-700">No hay un código QR generado.</h2>
            <p className="text-gray-500">Haz clic en Crear QR para generar el primero.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        {/* --- CHANGE 2: Added proper styling and disabled state --- */}
        <button
          onClick={handleRenovate}
          disabled={renovateMutation.isPending}
          className="px-6 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {renovateMutation.isPending 
            ? 'Renovando...' 
            : despacho?.qrToken ? 'Renovar QR' : 'Crear QR'
          }
        </button>
        {despacho?.qrToken && (
           <button
            onClick={handlePrint} // This now calls the function from the useReactToPrint hook
            className="px-6 py-2 rounded text-white bg-green-600 hover:bg-green-700 transition"
          >
            Imprimir QR
          </button>
        )}
      </div>
    </main>
  );


  // ... your return JSX ...
  // Remember to add a disabled state to your button while the mutation is pending:

  /*
  <button
    onClick={handleRenovate}
    disabled={renovateMutation.isPending} // <-- Add this
    className="..."
  >
    {renovateMutation.isPending 
      ? 'Renovando...' 
      : despacho?.qrToken ? 'Renovar QR' : 'Crear QR'
    }
  </button>
  */
}