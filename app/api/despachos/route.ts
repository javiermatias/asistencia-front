import { Despacho } from '@/app/types/despacho';
import { NextResponse } from 'next/server';


// Simulamos una base de datos en memoria
let despachos: Despacho[] = [
  { id: '1', nombre_despacho: 'Oficina Central', latitud: 40.416775, longitud: -3.703790 },
  { id: '2', nombre_despacho: 'Almacén Norte', latitud: 40.463667, longitud: -3.749220 },
];

// GET /api/despachos - Obtener todos los despachos
export async function GET() {
  return NextResponse.json(despachos);
}

// POST /api/despachos - Crear un nuevo despacho
export async function POST(request: Request) {
  try {
    const body: Omit<Despacho, 'id'> = await request.json();
    const { nombre_despacho, latitud, longitud } = body;

    if (!nombre_despacho || latitud === undefined || longitud === undefined) {
      return new NextResponse('Faltan campos requeridos', { status: 400 });
    }

    const newDespacho: Despacho = {
      id: crypto.randomUUID(), // Genera un ID único
      nombre_despacho,
      latitud: Number(latitud),
      longitud: Number(longitud),
    };

    despachos.push(newDespacho);
    return NextResponse.json(newDespacho, { status: 201 });
  } catch (error) {
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}