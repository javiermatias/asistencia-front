'use client'
import { Bitacora, Participante } from '@/app/lib/definitions';
import Spinner from '@/app/ui/spiner'
import Step from '@/app/ui/steps';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import { type FieldValues, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useBitacoraStore } from '@/app/store/authStore';
import Badge from '@/app/ui/badge';

export default function DatosGenerales() {

    const { data: session } = useSession()
    let user: any = { ...session?.user }    
    const { bitacora, setBitacora } = useBitacoraStore()
    //console.log(bitacora)
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue
    } = useForm()

    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const numbStep = Number.parseInt(searchParams.get('id') || '0')
    const [participante, setParticipante] = useState(new Array<Participante>());
    //console.table(user);

    useEffect(() => {

        if (bitacora.asunto) setValue('asunto', bitacora.asunto);
        if (bitacora.nombre) setValue('nombre', bitacora.nombre);
        if (bitacora.lugar) setValue('lugar', bitacora.lugar);
        if (bitacora.convocado) setValue('convocado', bitacora.convocado);
        if (bitacora.id_despacho) setValue('despacho', bitacora.id_despacho);
        if (bitacora.nombre_despacho) setValue('nombredespacho', bitacora.nombre_despacho);
        if (bitacora.nombre_atiende) setValue('atiende', bitacora.nombre_atiende);
        if (bitacora.cargo_atiende) setValue('cargo', bitacora.cargo_atiende);
        if (bitacora.participantes) setParticipante(bitacora.participantes);
        

    }, [bitacora, setValue])

    const agregarParticipante = () => {
        const nombreParticipante = getValues('nombreparticipante');
        const puestoParticipante = getValues('puestoparticipante');
        const newParticipante: Participante = { id: participante.length + 1, nombre: nombreParticipante, puesto: puestoParticipante }
        setParticipante([...participante, newParticipante])

    }
    const onRemove = (id: number) => {
        // Filter out the badge with the specified id
        const updatedParticipante = participante.filter(badge => badge.id !== id)

        // Update the state with the filtered badges array
        setParticipante(updatedParticipante)

      
    }

    const onSubmit = async (data: FieldValues) => {
        const currentDate = DateTime.local();

        if (participante.length === 0) {
            toast.error('Tienes que cargar al menos un participante!')
            return
        }

        // Set the locale to Spanish
        //fecha formato: const spanishDate = currentDate.setLocale("es").toFormat("dd 'de' MMMM 'de' yyyy");
        //semana: "Dia" + DateTime.now().day + "-S" + DateTime.now().weekNumber,
        //hora: const spanishHour = currentDate.setLocale("es").toFormat("hh:mm a");
        setBitacora({
            ...bitacora,
            asunto: getValues('asunto'),
            nombre: user?.nombre,
            fecha: currentDate.toString(),
            lugar: getValues('lugar'),
            convocado: getValues('convocado'),
            id_user: Number.parseInt(user?.id || '0'),
            id_despacho: getValues('despacho'),
            nombre_despacho: getValues('nombredespacho'),
            nombre_atiende: getValues('atiende'),
            cargo_atiende: getValues('cargo'),
            participantes: participante,
            numero_empleado:user.numero,
            nombre_empleado:user.nombre,
            posicion_empleado:user.posicion
        })


        
        router.push('/agente/dashboard/gestion?id=1')
    }
    return (
        <>

            <div className="w-full container mx-auto py-8">
                <Step id={numbStep}></Step>
                <hr />
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-md shadow-md">

                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Datos Generales</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="asunto">
                                    Asunto
                                </label>

                                <input
                                    {...register('asunto', {
                                        required: 'El asunto es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="asunto"
                                    name="asunto"
                                    placeholder="Reunion de proyecto..."

                                />
                                {(errors.asunto != null) && (

                                    <p className="text-red-500">{`${errors.asunto.message}`}</p>
                                )}

                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lugar">
                                    Lugar
                                </label>
                                <input
                                    {...register('lugar', {
                                        required: 'El lugar es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="lugar"
                                    name="lugar"
                                    placeholder="Sala de..."
                                />
                                {(errors.lugar != null) && (

                                    <p className="text-red-500">{`${errors.lugar.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="convocado">
                                    Convocado por
                                </label>
                                <input
                                    {...register('convocado', {
                                        required: 'Convocado por es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="convocado"
                                    name="convocado"
                                    placeholder="Juan..."
                                />
                                {(errors.convocado != null) && (

                                    <p className="text-red-500">{`${errors.convocado.message}`}</p>
                                )}
                            </div>

                        </div>

                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Datos Despacho</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="despacho">
                                    ID despacho
                                </label>
                                <input
                                    {...register('despacho', {
                                        required: 'El el id de despacho es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md  text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="despacho"
                                    name="despacho"
                                    placeholder="101...."
                                />
                                {(errors.despacho != null) && (

                                    <p className="text-red-500">{`${errors.despacho.message}`}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombredespacho">
                                    Nombre Despacho
                                </label>
                                <input
                                    {...register('nombredespacho', {
                                        required: 'El nombe de despacho requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="nombredespacho"
                                    name="nombredespacho"
                                    placeholder="ON..."
                                />
                                {(errors.nombredespacho != null) && (

                                    <p className="text-red-500">{`${errors.nombredespacho.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="atiende">
                                    Nombre de quien atiende
                                </label>
                                <input
                                    {...register('atiende', {
                                        required: 'Nombre de quien atiende es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="atiende"
                                    name="atiende"
                                    placeholder="Yessica..."
                                />
                                {(errors.atiende != null) && (

                                    <p className="text-red-500">{`${errors.atiende.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cargo">
                                    Cargo de quien atiende
                                </label>
                                <input
                                    {...register('cargo', {
                                        required: 'Cargo de quien atiende es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cargo"
                                    name="cargo"
                                    placeholder="Yessica..."
                                />
                                {(errors.cargo != null) && (

                                    <p className="text-red-500">{`${errors.cargo.message}`}</p>
                                )}
                            </div>

                        </div>
                    </div>



                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Participantes Reunion</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreparticipante">
                                    Nombre Completo
                                </label>
                                <input
                                    {...register('nombreparticipante')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="nombreparticipante"
                                    name="nombreparticipante"
                                    placeholder="Juan..."
                                />

                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="puestoparticipante">
                                    Cargo/Puesto
                                </label>
                                <input
                                    {...register('puestoparticipante')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="puestoparticipante"
                                    name="puestoparticipante"
                                    placeholder="..."
                                />

                            </div>


                            <button
                                className="w-full bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-md hover:bg-green-600 transition duration-300"
                                onClick={() => agregarParticipante()}
                                type="button"

                            >
                                Agregar Participante
                            </button>



                        </div>

                        <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">

                            <div
                                className="w-full overflow-y-auto border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"

                            >
                                <div className={`px-5 py-2 pt`}>
                                    {participante.length === 0
                                        ? (
                                            <p className="px-5 py-2 pt">No hay participantes agregados</p>
                                        )
                                        : (
                                            <div className="px-5 py-2 pt">
                                                {participante.map((part) => (
                                                    <Badge key={part.id} title={part.nombre + "-" + part.puesto} onRemove={() => { onRemove(part.id) }} />
                                                ))}
                                            </div>
                                        )}
                                </div>

                            </div>
                        </div>
                    </div>



                    <button
                        className="w-full bg-blue-700 text-white text-sm font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                        type="submit"
                        disabled={loading}
                    >
                        Siguiente
                    </button>

                </form>
            </div>

        </>
    )
}