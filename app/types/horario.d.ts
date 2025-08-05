export interface Turno {
    id: number;
    nombre: string;
  }
export interface HorarioItem {
    id: number;
    dia_semana: number;
    turno: Turno;
  }
  
  // This is the shape of the data coming from GET /horario/despacho/:id
  export interface EmpleadoConHorarios {
    id: number;
    numero_empleado: string;
    nombre: string;
    apellido: string;
    horarios: HorarioItem[];
  }
  
  // This is the shape of the data we send in the PATCH request
  export interface UpdateHorarioPayload {
    id: number; // employee id
    horarios: {
      dia_semana: number;
      turno: {
        id: number;
      };
    }[];
  }