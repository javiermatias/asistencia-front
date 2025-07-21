export interface EmpleadoDTO {
    numero_empleado: string;
    nombre: string;
    apellido: string;
    sexo: 'Masculino' | 'Femenino' | 'Otro';
    puesto: string;
    despacho: string;
    es_supervisor?: boolean;
  }