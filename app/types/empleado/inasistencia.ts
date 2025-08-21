export interface EmpleadoInasistencia {
    id: number;
    numero_empleado: string;
    nombre: string;
    apellido: string;
    sexo: string;
    baja: boolean;
    baja_date: string | null;
    es_supervisor: boolean;
  }
  
  export interface TurnoInasistencia {
    id: number;
    nombre: string;
    horaInicio: string;
    horaFin: string;
  }
  
  export interface DespachoInasistencia {
      id: number;
      nombre: string;
      // Add other properties if they exist
  }

export interface Inasistencia {
    id: number;
    dia: string;
    asistio: "NO"; // This will always be "NO" for this endpoint
    tarde: "NO";
    fecha_ingreso: string | null;
    fecha_egreso: string | null;
    fecha_ingreso_local: string | null;
    fecha_egreso_local: string | null;
    latitud: number | null;
    longitud: number | null;
    enRango: boolean | null;
    empleado: EmpleadoInasistencia;
    despacho: DespachoInasistencia | null; // Despacho can be null based on your JSON
    turno: TurnoInasistencia;
  }