export interface EmpleadoDTO {
    id:string;
    numero_empleado: string;
    nombre: string;
    apellido: string;
    sexo: 'Masculino' | 'Femenino' | 'Otro';
    
    baja:boolean;
    puesto: string;
    despacho: string;
    es_supervisor?: boolean;
  }

/*   "id": 2,
  "numero_empleado": "EMP12345sd",
  "nombre": "Juan",
  "apellido": "Pérez",
  "sexo": "Masculino",
  "baja": false,
  "baja_date": null,
  "es_supervisor": false */