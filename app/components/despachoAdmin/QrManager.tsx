// src/components/despacho/QrManager.tsx
'use client';

import { useRef } from 'react';
import { useQRCode } from 'next-qrcode';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';

// Import the necessary types and hooks
import { useRenovateDespachoQr} from '@/app/hooks/despacho/useDespachos';
import { Despacho } from '@/app/types/despacho';

// Define the props this component expects
interface QrManagerProps {
  despacho: Despacho;
  token: string | undefined;
}

export default function QrManager({ despacho, token }: QrManagerProps) {
  const { Canvas } = useQRCode();
  const qrToPrintRef = useRef<HTMLDivElement>(null);
  
  // This mutation hook is specific to the component's functionality
  const renovateMutation = useRenovateDespachoQr();

  const handleRenovate = async () => {
    if (!despacho.id || !token) {
        toast.error("Falta información para renovar el QR.");
        return;
    }

    toast.promise(
      renovateMutation.mutateAsync({ id: String(despacho.id), token }),
      {
        loading: 'Renovando token QR...',
        success: '¡Código QR renovado con éxito!',
        error: (err: any) => err.response?.data?.message || 'Falló la renovación del QR.',
      }
    );
  };

  const handlePrint = useReactToPrint({
    contentRef: qrToPrintRef, // Use a callback function for better reliability
    documentTitle: `QR_Despacho_${despacho.nombre}`,
    onAfterPrint: () => toast.info('Impresión finalizada.'),
  });

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800">
        Gestión de QR para: <span className="text-blue-600">{despacho.nombre}</span>
      </h1>
      <p className="text-gray-500 mb-6">ID del Despacho: {despacho.id}</p>

      <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-gray-50">
        {despacho.qrToken ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Código QR Actual</h2>
            {/* The ref is attached to the div we want to print */}
            <div ref={qrToPrintRef}>
              <Canvas
                text={despacho.qrToken}
                options={{
                  errorCorrectionLevel: 'M',
                  margin: 3,
                  scale: 4,
                  width: 256,
                  color: { dark: '#000000', light: '#FFFFFF' },
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
        <button
          onClick={handleRenovate}
          disabled={renovateMutation.isPending}
          className="px-6 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {renovateMutation.isPending 
            ? 'Renovando...' 
            : despacho.qrToken ? 'Renovar QR' : 'Crear QR'
          }
        </button>
        {despacho.qrToken && (
           <button
            onClick={handlePrint}
            className="px-6 py-2 rounded text-white bg-green-600 hover:bg-green-700 transition"
          >
            Imprimir QR
          </button>
        )}
      </div>
    </div>
  );
}