'use client'
import Spinner from '@/app/ui/spiner'
import Step from '@/app/ui/steps';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'
import { type FieldValues, useForm } from 'react-hook-form'
import { useBitacoraStore } from '@/app/store/authStore';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { createBitacora } from '@/app/services/bitacora.service';
import SignaturePad from 'react-signature-pad-wrapper'
import { toast } from 'react-toastify';
import { Participante, Accion } from '@/app/lib/definitions';
import { DateTime } from 'luxon';

export default function Anexo() {

    const queryClient = new QueryClient()
    const { bitacora, setBitacora } = useBitacoraStore()
    const router = useRouter()
    const sigCanvas = useRef<SignaturePad | null>(null);
    const sigCanvas1 = useRef<SignaturePad | null>(null);

    
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue
    } = useForm()

    
    const searchParams = useSearchParams()
    const numbStep = Number.parseInt(searchParams.get('id') || '0')
    const mutation = useMutation({
        mutationFn: createBitacora,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['bitacora'] })
        },
    })
    const clearSignature = () => {
        if (sigCanvas.current) {
            sigCanvas.current.clear();
        }
    };
    const clearSignature1 = () => {
        if (sigCanvas1.current) {
            sigCanvas1.current.clear();
        }
    };

    useEffect(() => {
        setValue('banco', "BANCO AZTECA S.A.");

     if (bitacora.prestador) setValue('prestador', bitacora.prestador);
     if (bitacora.representante_legal) setValue('representante', bitacora.representante_legal); 
     if (bitacora.entrevistado) setValue('entrevistado', bitacora.entrevistado); 
     if (bitacora.firma) sigCanvas.current?.fromDataURL(bitacora.firma);
     if (bitacora.firma1) sigCanvas1.current?.fromDataURL(bitacora.firma1);
    }, [bitacora, setValue])

    const onSubmit = async(data: FieldValues) => {
        let signatureData = '';
        let signatureData1 = '';

        
        if (sigCanvas.current){ 
        const isEmpty = sigCanvas.current.isEmpty();
        if(isEmpty){
            toast.error('Tienes que firmar!')
            
            return;
        }else{
            signatureData = sigCanvas.current.toDataURL();
              
        }
  
        }
        if (sigCanvas1.current){ 
            const isEmpty = sigCanvas1.current.isEmpty();
            if(isEmpty){
                toast.error('Tu entrevistado tiene que firmar!')
                console.log("errorfirma1")
                return;
            }else{
                signatureData1 = sigCanvas1.current.toDataURL();
                console.log(signatureData1);  
            }  
        }

        const updatedBitacora = {
            ...bitacora,
            banco: getValues('banco'),
            prestador: getValues('prestador'),
            representante_legal: getValues('representante'),
            entrevistado: getValues('entrevistado'),
            firma: signatureData,
            firma1: signatureData1,
            fecha_fin:DateTime.local().toString(),
        };
     
        
        setBitacora(updatedBitacora);
        mutation.mutate(updatedBitacora);
        
        //router.push('/agente/dashboard/herramientas?id=2')

    }

    if(mutation.isSuccess){                        
      
        setBitacora({
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
        })
        router.push('/agente/dashboard');

    }
    
    return (
        <>

            <div className="container mx-auto py-8">
                <Step id={numbStep}></Step>
                <hr />
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto bg-white p-8 rounded-md shadow-md">

                    <div className="bg-white rounded-lg shadow-md p-6 mb-4 mx-3">
                        <h5 className="text-xl font-bold mb-2 text-center">ANEXO.</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="banco">
                                    EL BANCO
                                </label>
                                <input
                                    {...register('banco', {
                                        required: '',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="banco"
                                    name="banco"
                                    disabled
                                />
                                {(errors.banco != null) && (

                                    <p className="text-red-500">{`${errors.banco}`}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prestador">
                                    EL PRESTADOR
                                </label>
                                <input
                                    {...register('prestador', {
                                        required: 'El prestador es requerido',
                                    })}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="prestador"
                                    name="prestador"
                                    placeholder="NOMBRE O RAZÓN SOCIAL DEL DESPACHO"
                                />
                                {(errors.prestador != null) && (

                                    <p className="text-red-500">{`${errors.prestador.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firma_entrevistador">
                                    Firma entrevistador
                                </label>
                                <div style={{border:"1px solid black"}}>
                                <SignaturePad ref={sigCanvas}/>
                   
                                </div>
                                <div>
                                <button onClick={clearSignature} className='bg-blue-500 hover:bg-red-700  font-bold text-white py-3 px-4 rounded-md w-fit'>Limpiar</button>
                                </div>
                      
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firma_entrevistado">
                                    Firma entrevistado
                                </label>
                                <div style={{border:"1px solid black"}}>
                                <SignaturePad ref={sigCanvas1}/>
                                </div>
                                <div>
            <button onClick={clearSignature1} className='bg-blue-500 hover:bg-red-700  font-bold text-white py-3 px-4 rounded-md w-fit'>Limpiar</button>
            
          </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700  text-sm font-bold mb-2" htmlFor="representante">
                                    Representante Legal
                                </label>
                                <input
                                    {...register('representante', {
                                        required: 'La cuota de la semana es requerida',
                                    })}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="representante"
                                    name="representante"
                                    placeholder="Nombre de quien hace la minuta"
                                />
                                {(errors.representante != null) && (

                                    <p className="text-red-500">{`${errors.representante}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="entrevistado">
                                    Entrevistado
                                </label>
                                <input
                                    {...register('entrevistado', {
                                        required: 'La cuota de la semana es requerida',
                                    })}
                                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="entrevistado"
                                    name="entrevistado"
                                    placeholder="Persona que se entrevista"
                                />
                                {(errors.entrevistado != null) && (

                                    <p className="text-red-500">{`${errors.entrevistado}`}</p>
                                )}
                            </div>


                        </div>
                        <p className="text-sm font-bold mb-2 text-center text-red-400 ">ESTOY ENTERADO Y FIRMO DE CONFORMIDAD.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md mb-4 w-full p-2 md:p-6">
                       <h5 className="text-xl font-bold mb-2 text-center">Reglas Operativas </h5> 
                        <p className="text-sm">
                            Cumplir con Indicadores (Eficiencia, EPR, Cobranza, RMD, Planes de Pago, Abonos, otros.)
                        </p>
                        <p className="text-sm">
                            Horario de 8:00 a 21:00 hrs los 7 días de la semana.
                        </p>
                        <p className="text-sm">
                            Proporcionar información de gestion.
                        </p>
                        <p className="text-sm">
                            Plantilla especializada en segmento, planes de pago, productos (Consumo, TOR, Italika, otros),
                        </p>
                        <p className="text-sm">
                            Gestores finales registrados en SCL y contar con conexión (6 dias a la semana)
                        </p>
                        <p className="text-sm">
                            Utilizar las herramientas de CL (Paga Fácil, Pagaré Electrónico, Aztecargo, Demanda Digital, Movilizate)
                        </p>
                        <p className="text-sm">
                            Envió semanal de carteo.
                        </p>

                        <p className="text-sm font-bold mb-2 text-center text-red-400 ">El incumplimiento de las reglas operativas, estan estipuladas en contrato y podran ser motivo de sanción.</p>

                    </div>





                    <button
                        className="w-full bg-blue-700 text-white text-sm font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                        type="submit"
                        disabled={mutation.isPending }
                    >
                        {mutation.isPending ? <Spinner /> : 'Cargar Bitacora'}
                    </button>

                </form>
            </div>

        </>
    )
}