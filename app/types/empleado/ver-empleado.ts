import { Despacho, Puesto } from "../despacho";

export interface EmpleadoDTO {
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

