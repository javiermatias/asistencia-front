export interface CreateEmpleadoDTO {
    
    numero_empleado: string;
    nombre: string;
    apellido: string;
    sexo: 'Masculino' | 'Femenino' | 'Otro';
    puesto: number;
    despacho: number;
    es_supervisor?: boolean;
  }