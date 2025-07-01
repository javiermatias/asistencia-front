'use client'
import { Accion } from '@/app/lib/definitions';
import Spinner from '@/app/ui/spiner'
import Step from '@/app/ui/steps';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import { type FieldValues, useForm } from 'react-hook-form'
import { useBitacoraStore } from '@/app/store/authStore';
import { toast } from 'react-toastify';



export default function Despacho() {

    const { bitacora, setBitacora } = useBitacoraStore()
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue
    } = useForm()

    const [loading, setLoading] = useState(false)
    const [hallazgo, setHallazgo] = useState(new Array<string>())
    const searchParams = useSearchParams()
    const numbStep = Number.parseInt(searchParams.get('id') || '0')
    const [acciones, setAcciones] = useState(new Array<Accion>());
    const router = useRouter()

    useEffect(() => {
        if (bitacora.deudores) setValue('deudores', bitacora.deudores);
        if (bitacora.llamada) setValue('llamada', bitacora.llamada);
        if (bitacora.blaster) setValue('blaster', bitacora.blaster);
        if (bitacora.sms) setValue('sms', bitacora.sms);
        if (bitacora.whatsapp) setValue('whatsapp', bitacora.whatsapp);
        if (bitacora.carta) setValue('carta', bitacora.carta);
        if (bitacora.visita) setValue('visita', bitacora.visita);
        if (bitacora.otro) setValue('otro', bitacora.otro);
        if (bitacora.hallazgos) setValue('otro', bitacora.otro);
        if (bitacora.acciones) setAcciones(bitacora.acciones);
        if (bitacora.hallazgos) setHallazgo(bitacora.hallazgos);
        if (bitacora.segmento5) setValue('segmento5', bitacora.segmento5);
        if (bitacora.segmento5) setValue('segmento5', bitacora.segmento5);
        if (bitacora.cuota5) setValue('cuota5', bitacora.cuota5);
        if (bitacora.eficiencia5) setValue('eficiencia5', bitacora.eficiencia5);
        if (bitacora.segmento28) setValue('segmento28', bitacora.segmento28);
        if (bitacora.cuota28) setValue('cuota28', bitacora.cuota28);
        if (bitacora.eficiencia28) setValue('eficiencia28', bitacora.eficiencia28);
        if (bitacora.segmento6) setValue('segmento6', bitacora.segmento6);
        if (bitacora.cuota6) setValue('cuota6', bitacora.cuota6);
        if (bitacora.eficiencia6) setValue('eficiencia6', bitacora.eficiencia6);
        if (bitacora.segmento16) setValue('segmento16', bitacora.segmento16);
        if (bitacora.cuota16) setValue('cuota16', bitacora.cuota16);
        if (bitacora.eficiencia16) setValue('eficiencia16', bitacora.eficiencia16);

    }, [bitacora, setValue])


    const agregarAccion = () => {
        const descripcion = getValues('descripcion');
        const responsable = getValues('responsable');
        const fecha = getValues('fecha');
        const newAccion: Accion = { id: acciones.length + 1, descripcion: descripcion, responsable: responsable, fecha: fecha }
        setAcciones([...acciones, newAccion])

    }

    const agregarHallazago = () => {
        const newHallazgo = getValues('hallazgo');

        setHallazgo([...hallazgo, newHallazgo])

    }

    const removeHallazgo = (name: string) => {
        // Filter out the badge with the specified id
        const updatedHallazgo = hallazgo.filter(badge => badge !== name)

        // Update the state with the filtered badges array
        setHallazgo(updatedHallazgo)

        // console.log("Se borró el número con id " + id);
    }

    const onRemove = (id: number) => {
        // Filter out the badge with the specified id
        const updatedAcciones = acciones.filter(accion => accion.id !== id)

        // Update the state with the filtered badges array
        setAcciones(updatedAcciones)

        // console.log("Se borró el número con id " + id);
    }
    const onSubmit = async (data: FieldValues) => {

        if (acciones.length === 0) {
            toast.error('Tienes que cargar al menos una accion!')
            return
        }
        if (hallazgo.length === 0) {
            toast.error('Tienes que cargar al menos un hallazgo!')
            return
        }


        setBitacora({
            ...bitacora,
            deudores: getValues('deudores'),
            llamada: getValues('llamada'),
            blaster: getValues('blaster'),
            sms: getValues('sms'),
            whatsapp: getValues('whatsapp'),
            carta: getValues('carta'),
            visita: getValues('visita'),
            otro: getValues('otro'),
            hallazgos: hallazgo,
            acciones: acciones,
            segmento5: getValues('segmento5'),
            cuota5: getValues('cuota5'),
            eficiencia5: getValues('eficiencia5'),
            segmento28: getValues('segmento28'),
            cuota28: getValues('cuota28'),
            eficiencia28: getValues('eficiencia28'),
            segmento6: getValues('segmento6'),
            cuota6: getValues('cuota6'),
            eficiencia6: getValues('eficiencia6'),
            segmento16: getValues('segmento16'),
            cuota16: getValues('cuota16'),
            eficiencia16: getValues('eficiencia16')

        })

        router.push('/agente/dashboard/anexo?id=3')


    }
    return (
        <>

            <div className="container mx-auto py-8">
                <Step id={numbStep}></Step>
                <hr />
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-md shadow-md">

                <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Paramestros de asignación</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deudores">
                                    Deudores
                                </label>
                                <input
                                    {...register('deudores', {
                                        required: 'Deudores es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="deudores"
                                    name="deudores"
                                    placeholder="1000.."
                                />
                                {(errors.deudores != null) && (

                                    <p className="text-red-500">{`${errors.deudores.message}`}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="llamada">
                                    Llamada
                                </label>
                                <input
                                    {...register('llamada', {
                                        required: 'Llamada es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="llamada"
                                    name="llamada"
                                    placeholder="1000"
                                />
                                {(errors.llamada != null) && (

                                    <p className="text-red-500">{`${errors.llamada.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="blaster">
                                    Blaster
                                </label>
                                <input
                                    {...register('blaster', {
                                        required: 'Blaster es requerida',
                                    })}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="blaster"
                                    name="blaster"
                                    placeholder="2000"
                                />
                                {(errors.blaster != null) && (

                                    <p className="text-red-500">{`${errors.blaster.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sms">
                                    SMS
                                </label>
                                <input
                                    {...register('sms', {
                                        required: 'SMS es requerida',
                                    })}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="sms"
                                    name="sms"
                                    placeholder="2000"
                                />
                                {(errors.sms != null) && (

                                    <p className="text-red-500">{`${errors.sms.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whatsapp">
                                    Whatsapp
                                </label>
                                <input
                                    {...register('whatsapp', {
                                        required: 'Whatsapp es requerida',
                                    })}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="whatsapp"
                                    name="whatsapp"
                                    placeholder="100"
                                />
                                {(errors.whatsapp != null) && (

                                    <p className="text-red-500">{`${errors.whatsapp.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carta">
                                    Carta
                                </label>
                                <input
                                    {...register('carta', {
                                        required: 'Carta es requerida',
                                    })}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="carta"
                                    name="carta"
                                    placeholder="100"
                                />
                                {(errors.carta != null) && (

                                    <p className="text-red-500">{`${errors.carta.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="visita">
                                    Visita
                                </label>
                                <input
                                    {...register('visita', {
                                        required: 'Visita es requerida',
                                    })}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="visita"
                                    name="visita"
                                    placeholder="50"
                                />
                                {(errors.visita != null) && (

                                    <p className="text-red-500">{`${errors.visita.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otro">
                                    Otro
                                </label>
                                <input
                                    {...register('otro')}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="otro"
                                    name="otro"
                                    placeholder="50"
                                />

                            </div>

                        </div>
                    </div>



                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Hallazgos</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hallazgo">
                                    Descripción
                                </label>
                                <input
                                    {...register('hallazgo')}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="hallazgo"
                                    name="hallazgo"
                                    placeholder="..."
                                />

                            </div>

                            <div className="mb-4">
                                <label className="max-sm:hidden block text-gray-700 text-sm font-bold mb-2" htmlFor="hallazgo">
                                    Agregar
                                </label>
                                <button
                                    className="w-full bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-md hover:bg-green-600 transition duration-300"
                                    onClick={() => agregarHallazago()}
                                    type="button"

                                >
                                    Agregar Hallazgo
                                </button>
                            </div>


                        </div>

                        <div className="w-full max-w-sm mx-auto bg-white p-4 rounded-md shadow-md">

                            <div >
                                {hallazgo.length === 0
                                    ? (
                                        <p className="px-5 py-2 pt">No hay Hallazgos agregados</p>
                                    )
                                    : (
                                        <div >

                                            <table className="w-full border divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="px-6 py-2">Nombre</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {hallazgo.map((ph, index) => (
                                                        <tr key={index}>
                                                            <td className="px-4 py-2">{ph}</td>
                                                            <td>
                                                                <button onClick={() => removeHallazgo(ph)} type="button" className="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                                                    <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                                    </svg>
                                                                    <span className="sr-only">Eliminar</span>
                                                                </button>
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    )}
                            </div>

                        </div>


                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Compromisos y acciones a realizar</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
                                    Descripcion
                                </label>
                                <input
                                    {...register('descripcion')}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="descripcion"
                                    name="descripcion"
                                    placeholder="Juan..."
                                />

                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="responsable">
                                    Responsable
                                </label>
                                <input
                                    {...register('responsable')}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="responsable"
                                    name="responsable"
                                    placeholder="..."
                                />

                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha">
                                    Fecha planeada
                                </label>
                                <input
                                    {...register('fecha')}
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="fecha"
                                    name="fecha"
                                    placeholder="..."
                                />

                            </div>

                            <div className="mb-4">
                                <label className="max-sm:hidden block text-gray-700 text-sm font-bold mb-2" htmlFor="accion">
                                    Agregar
                                </label>

                                <button
                                    className="w-full px-3 py-2 bg-green-500 text-white text-xs font-bold  rounded-md hover:bg-green-600 transition duration-300"
                                    onClick={() => agregarAccion()}
                                    type="button"

                                >
                                    Agregar Accion
                                </button>
                            </div>


                        </div>

                        <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">

                            <div >
                                {acciones.length === 0
                                    ? (
                                        <p className="px-5 py-2 pt">No hay Acciones agregados</p>
                                    )
                                    : (
                                        <div >

                                            <table className="w-full border divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="px-4 py-2">Descripcion</th>
                                                        <th className="px-4 py-2">Responsable</th>
                                                        <th className="px-4 py-2">Fecha</th>
                                                        {/* Add more columns as needed */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {acciones.map((accion) => (
                                                        <tr key={accion.id}>
                                                            <td className="px-4 py-2">{accion.descripcion}</td>
                                                            <td className="px-4 py-2">{accion.responsable}</td>
                                                            <td className="px-4 py-2">{accion.fecha}</td>
                                                            <td>
                                                                <button onClick={() => onRemove(accion.id)} type="button" className="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                                                    <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                                    </svg>
                                                                    <span className="sr-only">Eliminar</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    )}
                            </div>

                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-md mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Herramientas de gestión</h5>
                        <p className="text-sm">
                            <strong>Mayor o igual 100%</strong>. Goteo del segmento donde se logró EPR. (cabe mencionar que en segmento temprano debe considerarse volumen de cartera mayor a 1000 deudores.)
                        </p>
                        <p className="text-sm">
                            <strong>90 - 100%</strong>. Se mantiene Cartera (no se realiza movimiento, a Favor o En contra) pérdida de cartera por pase Natural, solo a petición o estrategia de dirección.
                        </p>
                        <p className="text-sm">
                            <strong>80 - 89.99%</strong>. Retiro parcial de portafolio. (Importante que cada lunes de semana envíen archivos de abanderamiento para no afectar en el retiro de deudores con negociación.) entiéndase como abanderamiento planes de pago, recurrentes, promesas de pago especificando fecha.
                        </p>
                        <p className="text-sm">
                            <strong>Menor de 79.99%</strong>. Se puede considerar el retiro Total de portafolio, despacho en Evaluación de proyecto.
                        </p>
                    </div>

                    <table className="min-w-full bg-white border border-gray-200 mt-6 mb-6">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200">Segmento</th>
                                <th className="py-2 px-4 border-b border-gray-200">Indicador EPR</th>
                                <th className="py-2 px-4 border-b border-gray-200">Alcance de cuota</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('segmento5', {
                                        required: 'Segmento 5 es requerido',
                                    })} id="segmento5" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder="Segmento 5" />
                                    {(errors.segmento5 != null) && (
                                        <p className="text-red-500">{`${errors.segmento5.message}`}</p>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('cuota5', {
                                        required: 'Indicador es requerido',
                                    })} id="cuota5" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder="$210" />
                                    {(errors.cuota5 != null) && (
                                        <p className="text-red-500">{`${errors.cuota5.message}`}</p>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('eficiencia5', {
                                        required: 'Eficiencia es requerida',
                                    })} id="eficiencia5" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder=".90%" />
                                    {(errors.eficiencia5 != null) && (
                                        <p className="text-red-500">{`${errors.eficiencia5.message}`}</p>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('segmento28', {
                                        required: 'Segmento 28 es requerido',
                                    })} id="segmento28" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder="Segmento 28" />
                                    {(errors.segmento28 != null) && (
                                        <p className="text-red-500">{`${errors.segmento28.message}`}</p>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('cuota28', {
                                        required: 'Indicador es requerido',
                                    })} id="cuota28" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder="$50" />
                                    {(errors.cuota28 != null) && (
                                        <p className="text-red-500">{`${errors.cuota28.message}`}</p>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('eficiencia28', {
                                        required: 'Eficiencia es requerida',
                                    })} id="eficiencia28" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder=".21%" />
                                    {(errors.eficiencia28 != null) && (
                                        <p className="text-red-500">{`${errors.eficiencia28.message}`}</p>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('segmento6', {
                                        required: 'Segmento 6 es requerido',
                                    })} id="segmento6" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder="Segmento 6" />
                                    {(errors.segmento6 != null) && (
                                        <p className="text-red-500">{`${errors.segmento6.message}`}</p>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('cuota6', {
                                        required: 'Indicador es requerido',
                                    })} id="cuota6" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder="$34" />
                                    {(errors.cuota6 != null) && (
                                        <p className="text-red-500">{`${errors.cuota6.message}`}</p>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('eficiencia6', {
                                        required: 'Eficiencia es requerida',
                                    })} id="eficiencia6" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder=".15%" />
                                    {(errors.eficiencia6 != null) && (
                                        <p className="text-red-500">{`${errors.eficiencia6.message}`}</p>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('segmento16', {
                                        required: 'Segmento 16 es requerido',
                                    })} id="segmento16" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder="Segmento 16" />
                                    {(errors.segmento16 != null) && (
                                        <p className="text-red-500">{`${errors.segmento16.message}`}</p>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('cuota16', {
                                        required: 'Indicador es requerido',
                                    })} id="cuota16" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder="$7" />
                                    {(errors.cuota16 != null) && (
                                        <p className="text-red-500">{`${errors.cuota16.message}`}</p>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input {...register('eficiencia16', {
                                        required: 'Eficiencia es requerida',
                                    })} id="eficiencia16" type="text" className="w-full border rounded px-2 py-1 text-gray-900" placeholder=".004%" />
                                    {(errors.eficiencia16 != null) && (
                                        <p className="text-red-500">{`${errors.eficiencia16.message}`}</p>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>




                    <button
                        className="w-full bg-blue-700 text-white text-sm font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <Spinner /> : 'Siguiente'}
                    </button>

                </form>
            </div>

        </>
    )
}