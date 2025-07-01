'use client'
import Spinner from '@/app/ui/spiner'
import Step from '@/app/ui/steps';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import { type FieldValues, useForm } from 'react-hook-form'
import { useBitacoraStore } from '@/app/store/authStore';

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
    const searchParams = useSearchParams()
    const numbStep = Number.parseInt(searchParams.get('id') || '0')
    const router = useRouter()

    useEffect(() => {

        if (bitacora.volumen_cartera) setValue('volumen_cartera', bitacora.volumen_cartera);
        if (bitacora.saldo_cartera) setValue('saldo_cartera', bitacora.saldo_cartera);
        if (bitacora.cuota_semana) setValue('cuota_semana', bitacora.cuota_semana);
        if (bitacora.plantilla_ideal) setValue('plantilla_ideal', bitacora.plantilla_ideal);
        if (bitacora.plantilla_real) setValue('plantilla_real', bitacora.plantilla_real);
        if (bitacora.telefonicos) setValue('telefonicos', bitacora.telefonicos);
        if (bitacora.presenciales) setValue('presenciales', bitacora.presenciales);
        if (bitacora.descansos) setValue('descansos', bitacora.descansos);
        if (bitacora.bajas) setValue('bajas', bitacora.bajas);
        if (bitacora.altas) setValue('altas', bitacora.altas);
        if (bitacora.cartera_rmd) setValue('cartera_rmd', bitacora.cartera_rmd);
        if (bitacora.saldo_cartera_rmd) setValue('saldo_cartera_rmd', bitacora.saldo_cartera_rmd);
        if (bitacora.cuota_semana_rmd) setValue('cuota_semana_rmd', bitacora.cuota_semana_rmd);
        if (bitacora.total_plan_pago) setValue('total_plan_pago', bitacora.total_plan_pago);
        if (bitacora.vigentes) setValue('vigentes', bitacora.vigentes);
        if (bitacora.cancelados) setValue('cancelados', bitacora.cancelados);
        if (bitacora.normalidad) setValue('normalidad', bitacora.normalidad);
        if (bitacora.cuota_planes) setValue('cuota_planes', bitacora.cuota_planes);
        if (bitacora.avance_planes) setValue('avance_planes', bitacora.avance_planes);
        if (bitacora.elaborados) setValue('elaborados', bitacora.elaborados);
        if (bitacora.compromiso) setValue('compromiso', bitacora.compromiso);
        if (bitacora.pendientes) setValue('pendientes', bitacora.pendientes);
        if (bitacora.demandas) setValue('demandas', bitacora.demandas);
        if (bitacora.gestionadas) setValue('gestionadas', bitacora.gestionadas);
        if (bitacora.acuses) setValue('acuses', bitacora.acuses);
        if (bitacora.pendientes_ciceron) setValue('pendientes_ciceron', bitacora.pendientes_ciceron);

    }, [bitacora, setValue])

    const onSubmit = async (data: FieldValues) => {

        setBitacora({
            ...bitacora,
            volumen_cartera: getValues('volumen_cartera'),
            saldo_cartera: getValues('saldo_cartera'),
            cuota_semana: getValues('cuota_semana'),
            plantilla_ideal: getValues('plantilla_ideal'),
            plantilla_real: getValues('plantilla_real'),
            telefonicos: getValues('telefonicos'),
            presenciales: getValues('presenciales'),
            descansos: getValues('descansos'),
            bajas: getValues('bajas'),
            altas: getValues('altas'),
            cartera_rmd: getValues('cartera_rmd'),
            saldo_cartera_rmd: getValues('saldo_cartera_rmd'),
            cuota_semana_rmd: getValues('cuota_semana_rmd'),
            total_plan_pago: getValues('total_plan_pago'),
            vigentes: getValues('vigentes'),
            cancelados: getValues('cancelados'),
            normalidad: getValues('normalidad'),
            cuota_planes: getValues('cuota_planes'),
            avance_planes: getValues('avance_planes'),
            elaborados: getValues('elaborados'),
            compromiso: getValues('compromiso'),
            pendientes: getValues('pendientes'),
            demandas: getValues('demandas'),
            gestionadas: getValues('gestionadas'),
            acuses: getValues('acuses'),
            pendientes_ciceron: getValues('pendientes_ciceron')
        })

        router.push('/agente/dashboard/herramientas?id=2')

    }
    return (
        <>

            <div className="container mx-auto py-8">
                <Step id={numbStep}></Step>
                <hr />
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-md shadow-md">

                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Indicadores de gestión</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="volumen_cartera">
                                    Volumen Cartera
                                </label>
                                <input
                                    {...register('volumen_cartera', {
                                        required: 'El volumen de cartera es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="volumen_cartera"
                                    name="volumen_cartera"
                                    placeholder="3.."
                                />
                                {(errors.volumen_cartera != null) && (

                                    <p className="text-red-500">{`${errors.volumen_cartera.message}`}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="saldo_cartera">
                                    Saldo cartera
                                </label>
                                <input
                                    {...register('saldo_cartera', {
                                        required: 'El saldo de cartera es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="saldo_cartera"
                                    name="saldo_cartera"
                                    placeholder="3.."
                                />
                                {(errors.saldo_cartera != null) && (

                                    <p className="text-red-500">{`${errors.saldo_cartera.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="atiende">
                                    Cuota Semana
                                </label>
                                <input
                                    {...register('cuota_semana', {
                                        required: 'La cuota de la semana es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cuota_semana"
                                    name="cuota_semana"
                                    placeholder="3.."
                                />
                                {(errors.cuota_semana != null) && (

                                    <p className="text-red-500">{`${errors.cuota_semana.message}`}</p>
                                )}
                            </div>

                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Plantilla Actual</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plantilla_ideal">
                                    Plantilla ideal
                                </label>
                                <input
                                    {...register('plantilla_ideal', {
                                        required: 'La plantilla ideal es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="plantilla_ideal"
                                    name="plantilla_ideal"
                                    placeholder="1..."
                                />
                                {(errors.plantilla_ideal != null) && (

                                    <p className="text-red-500">{`${errors.plantilla_ideal.message}`}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plantilla_real">
                                    Plantilla real
                                </label>
                                <input
                                    {...register('plantilla_real', {
                                        required: 'La plantilla real es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="plantilla_real"
                                    name="plantilla_real"
                                    placeholder="1..."
                                />
                                {(errors.plantilla_real != null) && (

                                    <p className="text-red-500">{`${errors.plantilla_real.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefonicos">
                                    Telefonicos
                                </label>
                                <input
                                    {...register('telefonicos', {
                                        required: 'Telefonicos es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="telefonicos"
                                    name="telefonicos"
                                    placeholder="1..."
                                />
                                {(errors.telefonicos != null) && (

                                    <p className="text-red-500">{`${errors.telefonicos.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="presenciales">
                                    Presenciales
                                </label>
                                <input
                                    {...register('presenciales', {
                                        required: 'Presenciales es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="presenciales"
                                    name="presenciales"
                                    placeholder="1..."
                                />
                                {(errors.presenciales != null) && (

                                    <p className="text-red-500">{`${errors.presenciales.message}`}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descansos">
                                    Descansos
                                </label>
                                <input
                                    {...register('descansos', {
                                        required: 'Descansos es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md  text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="descansos"
                                    name="descansos"
                                    placeholder="1..."
                                />
                                {(errors.descansos != null) && (

                                    <p className="text-red-500">{`${errors.descansos.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bajas">
                                    Bajas
                                </label>
                                <input
                                    {...register('bajas', {
                                        required: 'Bajas es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="bajas"
                                    name="bajas"
                                    placeholder="1..."
                                />
                                {(errors.bajas != null) && (

                                    <p className="text-red-500">{`${errors.bajas.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="altas">
                                    Altas
                                </label>
                                <input
                                    {...register('altas', {
                                        required: 'Altas es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="altas"
                                    name="altas"
                                    placeholder="1..."
                                />
                                {(errors.altas != null) && (

                                    <p className="text-red-500">{`${errors.altas.message}`}</p>
                                )}
                            </div>

                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Apartado RMD</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cartera_rmd">
                                    Cartera RMD
                                </label>
                                <input
                                    {...register('cartera_rmd', {
                                        required: 'La cartera RMD es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cartera_rmd"
                                    name="cartera_rmd"
                                    placeholder="2500"
                                />
                                {(errors.cartera_rmd != null) && (

                                    <p className="text-red-500">{`${errors.cartera_rmd.message}`}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="saldo_cartera_rmd">
                                    Saldo Cartera RMD
                                </label>
                                <input
                                    {...register('saldo_cartera_rmd', {
                                        required: 'El saldo de la cartera es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="saldo_cartera_rmd"
                                    name="saldo_cartera_rmd"
                                    placeholder="21230"
                                />
                                {(errors.saldo_cartera_rmd != null) && (

                                    <p className="text-red-500">{`${errors.saldo_cartera_rmd.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cuota_semana_rmd">
                                    Cuota semana RMD
                                </label>
                                <input
                                    {...register('cuota_semana_rmd', {
                                        required: 'La cuota de la semana es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cuota_semana_rmd"
                                    name="cuota_semana_rmd"
                                    placeholder="7 RMD SEMANA"
                                />
                                {(errors.cuota_semana_rmd != null) && (

                                    <p className="text-red-500">{`${errors.cuota_semana_rmd.message}`}</p>
                                )}
                            </div>


                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Planes de pago</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total_plan_pago">
                                    Total Planes de Pago
                                </label>
                                <input
                                    {...register('total_plan_pago', {
                                        required: 'Total Planes de pago es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="total_plan_pago"
                                    name="total_plan_pago"
                                    placeholder="2500"
                                />
                                {(errors.total_plan_pago != null) && (

                                    <p className="text-red-500">{`${errors.total_plan_pago.message}`}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vigentes">
                                    Vigentes
                                </label>
                                <input
                                    {...register('vigentes', {
                                        required: 'Vigentes es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="vigentes"
                                    name="vigentes"
                                    placeholder="2000"
                                />
                                {(errors.vigentes != null) && (

                                    <p className="text-red-500">{`${errors.vigentes.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cancelados">
                                    Cancelados
                                </label>
                                <input
                                    {...register('cancelados', {
                                        required: 'Cancelados es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cancelados"
                                    name="cancelados"
                                    placeholder="8000"
                                />
                                {(errors.cancelados != null) && (

                                    <p className="text-red-500">{`${errors.cancelados.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="normalidad">
                                    Normalidad
                                </label>
                                <input
                                    {...register('normalidad', {
                                        required: 'Normalidad es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="normalidad"
                                    name="normalidad"
                                    placeholder="20%"
                                />
                                {(errors.normalidad != null) && (

                                    <p className="text-red-500">{`${errors.normalidad.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cuota_planes">
                                    Cuota Planes
                                </label>
                                <input
                                    {...register('cuota_planes', {
                                        required: 'Cuota planes es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cuota_planes"
                                    name="cuota_planes"
                                    placeholder="50"
                                />
                                {(errors.cuota_planes != null) && (

                                    <p className="text-red-500">{`${errors.cuota_planes.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avance_planes">
                                    Avance Planes
                                </label>
                                <input
                                    {...register('avance_planes', {
                                        required: 'Avance Plan es requerido',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="avance_planes"
                                    name="avance_planes"
                                    placeholder="10"
                                />
                                {(errors.avance_planes != null) && (

                                    <p className="text-red-500">{`${errors.avance_planes.message}`}</p>
                                )}
                            </div>


                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Pagares</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="elaborados">
                                    Elaborados
                                </label>
                                <input
                                    {...register('elaborados', {
                                        required: 'Elaborados es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="elaborados"
                                    name="elaborados"
                                    placeholder="20"
                                />
                                {(errors.elaborados != null) && (

                                    <p className="text-red-500">{`${errors.elaborados.message}`}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="compromiso">
                                    Compromiso
                                </label>
                                <input
                                    {...register('compromiso', {
                                        required: 'Compromiso es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="compromiso"
                                    name="compromiso"
                                    placeholder="30"
                                />
                                {(errors.compromiso != null) && (

                                    <p className="text-red-500">{`${errors.compromiso.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pendientes">
                                    Pendientes
                                </label>
                                <input
                                    {...register('pendientes', {
                                        required: 'Pendientes es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="pendientes"
                                    name="pendientes"
                                    placeholder="30"
                                />
                                {(errors.pendientes != null) && (

                                    <p className="text-red-500">{`${errors.pendientes.message}`}</p>
                                )}
                            </div>

                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Cicerón</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="demandas">
                                    Demandas
                                </label>
                                <input
                                    {...register('demandas', {
                                        required: 'Demandas es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="demandas"
                                    name="demandas"
                                    placeholder="100"
                                />
                                {(errors.demandas != null) && (

                                    <p className="text-red-500">{`${errors.demandas.message}`}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gestionadas">
                                    Gestionadas
                                </label>
                                <input
                                    {...register('gestionadas', {
                                        required: 'Gestionadas es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="gestionadas"
                                    name="gestionadas"
                                    placeholder="100"
                                />
                                {(errors.gestionadas != null) && (

                                    <p className="text-red-500">{`${errors.gestionadas.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="acuses">
                                    Acuses(PDF)
                                </label>
                                <input
                                    {...register('acuses', {
                                        required: 'Acuses es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="acuses"
                                    name="acuses"
                                    placeholder="30"
                                />
                                {(errors.acuses != null) && (

                                    <p className="text-red-500">{`${errors.acuses.message}`}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pendientes_ciceron">
                                    Pendientes
                                </label>
                                <input
                                    {...register('pendientes_ciceron', {
                                        required: 'Pendientes es requerida',
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="pendientes_ciceron"
                                    name="pendientes_ciceron"
                                    placeholder="30"
                                />
                                {(errors.pendientes_ciceron != null) && (

                                    <p className="text-red-500">{`${errors.pendientes_ciceron.message}`}</p>
                                )}
                            </div>

                        </div>
                    </div>







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