// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type Bitacora = {
  //semana: string;
  id:number;
  asunto: string;
  nombre: string; //nombreColaborador
  fecha: string;
  lugar: string;
  convocado: string;//convocadoPor
  id_user: number; //id usuario
  id_despacho: string; //id despacho
  nombre_despacho: string; //nombre despacho
  nombre_atiende: string; //nombre atiende
  cargo_atiende: string; //cargo de quein atiende
  participantes: Participante[];
  volumen_cartera: string;
  saldo_cartera: string;
  cuota_semana: string;
  plantilla_ideal: string;
  plantilla_real: string;
  telefonicos: string;
  presenciales: string;
  descansos: string;
  bajas: string;
  altas: string;
  cartera_rmd: string;
  saldo_cartera_rmd: string;
  cuota_semana_rmd: string;
  total_plan_pago: string;
  vigentes: string;
  cancelados: string;
  normalidad: string;
  cuota_planes: string;
  avance_planes: string;
  elaborados: string;
  compromiso: string;
  pendientes: string;
  demandas: string;
  gestionadas: string;
  acuses: string;
  pendientes_ciceron: string;
  deudores: string;
  llamada: string;
  blaster: string;
  sms: string;
  whatsapp: string;
  carta: string;
  visita: string;
  otro: string;
  hallazgos: string[];
  acciones: Accion[];
  segmento5: string;
  cuota5: string;
  eficiencia5: string;
  segmento28: string;
  cuota28: string;
  eficiencia28: string;
  segmento6: string;
  cuota6: string;
  eficiencia6: string;
  segmento16: string;
  cuota16: string;
  eficiencia16: string;
  banco: string;
  prestador: string;
  representante_legal: string;
  entrevistado: string;
  firma:string;
  firma1:string;
  numero_empleado:string;
  nombre_empleado:string;
  posicion_empleado:string;
  fecha_fin:string;
}



export type Participante = {
  id: number;
  nombre: string;
  puesto: string;
}

export type Accion = {
  id: number;
  descripcion: string;
  responsable: string;
  fecha: string;
}

export type User = {
  id: string;
  nombre: string; //nombreColaborador
  email: string;
  password: string;
  role: string;
  numero: string;
  posicion: string; //posicionColaborador;
  proyecto: string; //proyectoPerteneces
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type FormState = {
  status: 'UNSET' | 'SUCCESS' | 'ERROR';
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
};

export const EMPTY_FORM_STATE: FormState = {
  status: 'UNSET' as const,
  message: '',
  fieldErrors: {},
  timestamp: Date.now(),
};