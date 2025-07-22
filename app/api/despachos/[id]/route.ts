import { Despacho } from '@/app/types/despacho';
import { NextResponse } from 'next/server';


// Re-importamos nuestra "base de datos"
// En una app real, esto vendría de una base de datos real.
// Para este ejemplo, necesitamos una forma de compartir el estado.
// Vamos a mover la definición a un archivo separado para que sea "singleton".

// Crea un archivo `lib/db.ts`
// export let despachos: Despacho[] = [ ... ];
// Y aquí lo importas: import { despachos } from '@/lib/db';
// Por simplicidad en este ejemplo, lo redefinimos, pero no funcionará entre archivos.
// LA FORMA CORRECTA está comentada. Para que este ejemplo funcione sin más archivos, lo dejamos así:
let despachos: Despacho[] = [
  { id: 1, nombre: 'Oficina Central', latitud: 40.416775, longitud: -3.703790 },
  { id: 2, nombre: 'Almacén Norte', latitud: 40.463667, longitud: -3.749220 },
];
// NOTA: Debido a cómo Next.js hace hot-reloading, la data en memoria se reiniciará con cada cambio de código.

interface Params {
  params: { id: string };
}

// PUT /api/despachos/[id] - Actualizar un despacho
export async function PUT(request: Request, { params }: Params) {
  const { id } = params;
  const index = despachos.findIndex(d => d.id === Number(id));

  if (index === -1) {
    return new NextResponse('Despacho no encontrado', { status: 404 });
  }

  try {
    const body: Partial<Despacho> = await request.json();
    despachos[index] = { ...despachos[index], ...body };
    return NextResponse.json(despachos[index]);
  } catch (error) {
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

// DELETE /api/despachos/[id] - Borrar un despacho
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;
  const initialLength = despachos.length;
  despachos = despachos.filter(d => d.id !== Number(id));

  if (despachos.length === initialLength) {
    return new NextResponse('Despacho no encontrado', { status: 404 });
  }

  return new NextResponse(null, { status: 204 }); // 204 No Content
}