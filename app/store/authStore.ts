import { Session } from "next-auth"
import { devtools, persist } from 'zustand/middleware'
import create from 'zustand'
import { Accion, Bitacora, Participante } from "../lib/definitions"

interface AuthState {
    session: Session
    setSession: (session: Session) => void
}
interface BitacoraState {
    bitacora: Bitacora
    setBitacora: (incidencia: Bitacora) => void
}
export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                session: {
                    user: {
                        id:0,
                        username:"",                        
                        role:"",
                        access_token:""    
                    },
                    expires:""
                
                },
                setSession: (session) => { set({ session }) }, // Update the state with the new incidencia object

            }),
            {
                name: 'session-store',
            }
        )
    )
)


export const useBitacoraStore = create<BitacoraState>()(
    devtools(
        persist(
            (set) => ({
                bitacora: {
                    id:0,
                    asunto: '',
                    nombre: '', //nombreColaborador
                    fecha: '',
                    lugar: '',
                    convocado: '',//convocadoPor
                    id_user: 0,
                    id_despacho: '',
                    nombre_despacho: '',
                    nombre_atiende: '',
                    cargo_atiende: '',
                    participantes: new Array<Participante>(),
                    volumen_cartera: '',
                    saldo_cartera: '',
                    cuota_semana: '',
                    plantilla_ideal: '',
                    plantilla_real: '',
                    telefonicos: '',
                    presenciales: '',
                    descansos: '',
                    bajas: '',
                    altas: '',
                    cartera_rmd: '',
                    saldo_cartera_rmd: '',
                    cuota_semana_rmd: '',
                    total_plan_pago: '',
                    vigentes: '',
                    cancelados: '',
                    normalidad: '',
                    cuota_planes: '',
                    avance_planes: '',
                    elaborados: '',
                    compromiso: '',
                    pendientes: '',
                    demandas: '',
                    gestionadas: '',
                    acuses: '',
                    pendientes_ciceron: '',
                    deudores: '',
                    llamada: '',
                    blaster: '',
                    sms: '',
                    whatsapp: '',
                    carta: '',
                    visita: '',
                    otro: '',
                    hallazgos: [],
                    acciones: new Array<Accion>(),
                    segmento5: '',
                    cuota5: '',
                    eficiencia5: '',
                    segmento28: '',
                    cuota28: '',
                    eficiencia28: '',
                    segmento6: '',
                    cuota6: '',
                    eficiencia6: '',
                    segmento16: '',
                    cuota16: '',
                    eficiencia16: '',             
                    banco: '',
                    prestador: '',
                    representante_legal: '',
                    entrevistado: '',
                    firma:'',
                    firma1:'',
                    numero_empleado:'',
                    nombre_empleado:'',
                    posicion_empleado:'',
                    fecha_fin:''
                    
                },
                setBitacora: (bitacora) => { set({ bitacora }) }, // Update the state with the new incidencia object

            }),

            {
                name: 'bitacora-store',
            }
        )
    )
)