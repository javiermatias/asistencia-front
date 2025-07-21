export interface UpdateEmpleadoDTO {
    numero_empleado?: string;
    nombre?: string;
    apellido?: string;
    sexo?: 'M' | 'F' | 'Otro';
    puesto?: number;
    despacho?: number;
    es_supervisor?: boolean;
    password?: string;
    baja?: boolean;
    baja_date?: string;
    id_user?: number;
  }