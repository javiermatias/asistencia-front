import { Despacho, Puesto } from "../despacho";

export interface EmpleadoDTO {
    horarios: any;
    id:string;
    numero_empleado: string;
    nombre: string;
    apellido: string;
    sexo: 'Masculino' | 'Femenino' | 'Otro';
    
    baja:boolean;
    puesto: Puesto;
    despacho: Despacho;
    es_supervisor?: boolean;
  }

  export interface EmpleadoBaja {
    id: number;
    nombre: string;
    apellido: string;
    baja_date: string; // This will be an ISO date string from the API
    puesto: {
      nombre: string;
    } | null; // Handle cases where puesto might be null
    despacho: {
      nombre: string;
    } | null; // Handle cases where despacho might be null
  }
