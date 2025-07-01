'use client'
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import SignaturePad from "react-signature-pad-wrapper";

export default function Page({
    searchParams,
  }: {
    searchParams?: {     
      id?: string;
    };
  }) {
    const currentPage = Number(searchParams?.id) || 1;
    const sigCanvas = useRef<SignaturePad | null>(null);
    const sigCanvas1 = useRef<SignaturePad | null>(null);
    const { isPending, error, data,isSuccess } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
          fetch(`/api/detail?id=${currentPage}`).then((res) =>
            res.json(),
          ),
      })
      const [inputs, setInputs] = useState({
        fecha:'',
        asunto: '',
        nombre: '',
        lugar:'',
        convocado:'',
        id_despacho:'',
        nombre_despacho:'',
        nombre_atiende:'',
        cargo_atiende:'',
        participantes:[],
        semana:'',
        hora:'',
        numero_empleado:'',        
        nombre_empleado:'',
        posicion_empleado:'',
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
                    acciones: [],
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
                    fecha_fin:'',
                    hora_fin:''
        // Add more fields as needed
      });
      useEffect(() => {
        if (isSuccess && data) {
          setInputs({
            fecha: new Date(data?.bitacora?.fecha).toLocaleDateString() || '',
            asunto: data?.bitacora?.asunto || '',
            nombre: data?.bitacora?.nombre || '',
            nombre_atiende:data?.bitacora?.nombre_atiende || '',
            lugar: data?.bitacora?.lugar || '',
            convocado: data?.bitacora?.convocado || '',
            id_despacho: data?.bitacora?.id_despacho || '',
            nombre_despacho: data?.bitacora?.id_despacho || '',
            cargo_atiende:data?.bitacora?.cargo_atiende || '',
            participantes:data?.participante || [],
            semana:  DateTime.fromISO(data?.bitacora?.fecha).weekNumber.toString() || '',
            hora:DateTime.fromISO(data?.bitacora?.fecha).toFormat('HH:mm').toString() || '',
            numero_empleado:data?.bitacora?.numero_empleado || '',
            nombre_empleado:data?.bitacora?.nombre_empleado || '',
            posicion_empleado:data?.bitacora?.posicion_empleado || '',
            volumen_cartera: data?.bitacora?.volumen_cartera || '',
            saldo_cartera: data?.bitacora?.saldo_cartera|| '',
            cuota_semana: data?.bitacora?.cuota_semana || '',
            plantilla_ideal: data?.bitacora?.plantilla_ideal || '',
            plantilla_real: data?.bitacora?.plantilla_real || '',
            telefonicos: data?.bitacora?.telefonicos || '',
            presenciales: data?.bitacora?.presenciales || '',
            descansos: data?.bitacora?.descansos || '',
            bajas: data?.bitacora?.bajas || '',
            altas: data?.bitacora?.altas || '',
            cartera_rmd: data?.bitacora?.cartera_rmd || '',
            saldo_cartera_rmd: data?.bitacora?.saldo_cartera_rmd || '',
            cuota_semana_rmd: data?.bitacora?.cuota_semana_rmd || '',
            total_plan_pago: data?.bitacora?.total_plan_pago || '',
            vigentes: data?.bitacora?.vigentes || '',
            cancelados: data?.bitacora?.cancelados || '',
            normalidad: data?.bitacora?.normalidad || '',
            cuota_planes: data?.bitacora?.cuota_planes || '',
            avance_planes: data?.bitacora?.avance_planes || '',
            elaborados: data?.bitacora?.elaborados || '',
            compromiso: data?.bitacora?.compromiso || '',
            pendientes: data?.bitacora?.pendientes || '',
            demandas: data?.bitacora?.demandas || '',
            gestionadas: data?.bitacora?.gestionadas || '',
            acuses: data?.bitacora?.acuses || '',
            pendientes_ciceron: data?.bitacora?.pendientes_ciceron || '',
            deudores: data?.bitacora?.deudores || '',
            llamada: data?.bitacora?.llamada || '',
            blaster: data?.bitacora?.blaster || '',
            sms: data?.bitacora?.sms || '',
            whatsapp: data?.bitacora?.whatsapp || '',
            carta: data?.bitacora?.carta || '',
            visita: data?.bitacora?.visita || '',
            otro: data?.bitacora?.otro || '',
            hallazgos: data?.hallazgo || [],
            acciones: data?.accion || [],
            segmento5: data?.bitacora?.segmento5 || '',
            cuota5: data?.bitacora?.cuota5 || '',
            eficiencia5: data?.bitacora?.eficiencia5 || '',
            segmento28: data?.bitacora?.segmento28 || '',
            cuota28: data?.bitacora?.cuota28 || '',
            eficiencia28: data?.bitacora?.eficiencia28 || '',
            segmento6: data?.bitacora?.segmento6 || '',
            cuota6: data?.bitacora?.cuota6 || '',
            eficiencia6: data?.bitacora?.eficiencia6 || '',
            segmento16: data?.bitacora?.segmento16 || '',
            cuota16: data?.bitacora?.cuota16 || '',
            eficiencia16: data?.bitacora?.eficiencia16 || '',             
            banco: data?.bitacora?.banco || '',
            prestador: data?.bitacora?.prestador || '',
            representante_legal: data?.bitacora?.representante_legal || '',
            entrevistado: data?.bitacora?.entrevistado || '',
            firma: data?.bitacora?.firma || '',
            firma1: data?.bitacora?.firma1 || '',                 
            fecha_fin: data?.bitacora?.fecha_fin || '',
            hora_fin:DateTime.fromISO(data?.bitacora?.fecha_fin).toFormat('HH:mm').toString() || '',

            // Map other fields as needed
          });
          sigCanvas.current?.fromDataURL(data?.bitacora?.firma.toString() || '');
          sigCanvas1.current?.fromDataURL(data?.bitacora?.firma1.toString() || '');
        }
      }, [isSuccess, data]);
    

    if(isPending) return <>Loading...</>

    if(isSuccess){

        //console.table(data);
        //console.log(data.firma)
        //console.log(data.firma1)
        //sigCanvas.current?.fromDataURL(data.firma);
        //sigCanvas1.current?.fromDataURL(data.firma1);
    }

    return (
      <div className="w-full container mx-auto">
  
      <form className="w-full max-w-6xl mx-auto bg-white p-4 md:p-2 rounded-md shadow-md">

          <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-2">
              <h5 className="text-xl font-bold mb-2 text-center">Datos Generales</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha">
                          Fecha 
                      </label>

                      <input
                         
                          className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                          type="text"
                          id="fecha"
                          name="fecha"
                          defaultValue={inputs.fecha}
                      

                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="asunto">
                          Asunto
                      </label>

                      <input
                         
                          className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                          type="text"
                          id="asunto"
                          name="asunto"
                          defaultValue={inputs.asunto}
                      

                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lugar">
                          Lugar
                      </label>
                      <input
                         
                          className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                          type="text"
                          id="lugar"
                          name="lugar"
                          defaultValue={inputs.lugar}
                         
                      />
                   
                  </div>

                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="convocado">
                          Convocado por
                      </label>
                      <input
                                                   
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                          type="text"
                          id="convocado"
                          name="convocado"
                          defaultValue={inputs.convocado}
                         
                      />
                   
                  </div>

                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Semana">
                          Semana
                      </label>
                      <input
                                                   
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                          type="text"
                          id="semana"
                          name="semana"
                          defaultValue={inputs.semana}
                         
                      />
                   
                  </div>

                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hora">
                          Hora
                      </label>
                      <input
                                                   
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                          type="text"
                          id="hora"
                          name="hora"
                          defaultValue={inputs.hora}
                         
                      />
                   
                  </div>

              </div>

          </div>

          <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
              <h5 className="text-xl font-bold mb-2 text-center">Datos Colaborador</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2 md:p-6">

                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero_empleado">
                          Numero empleado
                      </label>
                      <input
                          
                          className="w-full px-3 py-2 border border-gray-300 rounded-md  text-gray-900 focus:outline-none focus:border-blue-500"
                          type="text"
                          id="numero_empleado"
                          name="numero_empleado"
                          defaultValue={inputs.numero_empleado}
                         
                      />
                   
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre_empleado">
                          Nombre Colaborador
                      </label>
                      <input
                          
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                          type="text"
                          id="nombre_empleado"
                          name="nombre_empleado"
                          defaultValue={inputs.nombre_empleado}
                          
                      />
                
                  </div>

                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="posicion_empleado">
                         Posición Colaborador
                      </label>
                      <input
                          
                          className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                          type="text"
                          id="posicion_empleado"
                          name="posicion_empleado"
                          defaultValue={inputs.posicion_empleado}
                         
                      />
                   
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
                          
                          className="w-full px-3 py-2 border border-gray-300 rounded-md  text-gray-900 focus:outline-none focus:border-blue-500"
                          type="text"
                          id="despacho"
                          name="despacho"
                          defaultValue={inputs.id_despacho}
                         
                      />
                   
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombredespacho">
                          Nombre Despacho
                      </label>
                      <input
                          
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                          type="text"
                          id="nombredespacho"
                          name="nombredespacho"
                          defaultValue={inputs.nombre_despacho}
                          
                      />
                
                  </div>

                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="atiende">
                          Nombre de quien atiende
                      </label>
                      <input
                          
                          className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                          type="text"
                          id="atiende"
                          name="atiende"
                          defaultValue={inputs.nombre_atiende}
                         
                      />
                   
                  </div>

                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cargo">
                          Cargo de quien atiende
                      </label>
                      <input
                          
                          className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                          type="text"
                          id="cargo"
                          name="cargo"
                          defaultValue={inputs.cargo_atiende}
                      />
                   
                  </div>

              </div>
          </div>



          <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
              <h5 className="text-xl font-bold mb-2 text-center">Participantes Reunion</h5>
          

            <div className="w-full bg-white p-2 rounded-md shadow-md">

                  <div
                      className="w-full  border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"

                  >
                      <div className={`px-5 py-2 pt`}>
                          {inputs.participantes.length === 0
                              ? (
                                  <p className="px-5 py-2 pt">No hay participantes agregados</p>
                              )
                              : (
                                  <div className="px-5 py-2 pt">
                                    <ul className="text-center">
                                   {inputs.participantes.map((part:any) => (
                                    <li key={part.id}>
                                     {part.nombre} - {part.puesto}
                                     </li>))}
                                    </ul>
                                  </div>
                              )}
                      </div>

                  </div>
              </div> 
          </div>

          <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Indicadores de gestión</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2 md:p-6">


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="volumen_cartera">
                                    Volumen Cartera
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="volumen_cartera"
                                    name="volumen_cartera"
                                    defaultValue={inputs.volumen_cartera}
                                />
                                
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="saldo_cartera">
                                    Saldo cartera
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="saldo_cartera"
                                    name="saldo_cartera"
                                    defaultValue={inputs.saldo_cartera}
                                />
                              
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="atiende">
                                    Cuota Semana
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cuota_semana"
                                    name="cuota_semana"
                                    defaultValue={inputs.cuota_semana}
                                />
                             
                            </div>

                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Plantilla Actual</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plantilla_ideal">
                                    Plantilla ideal
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="plantilla_ideal"
                                    name="plantilla_ideal"
                                    defaultValue={inputs.plantilla_ideal}
                                />
                              
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plantilla_real">
                                    Plantilla real
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="plantilla_real"
                                    name="plantilla_real"
                                    defaultValue={inputs.plantilla_real}
                                />
                              
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefonicos">
                                    Telefonicos
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="telefonicos"
                                    name="telefonicos"
                                    defaultValue={inputs.telefonicos}
                                />
                              
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="presenciales">
                                    Presenciales
                                </label>
                                <input
                                 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="presenciales"
                                    name="presenciales"
                                    defaultValue={inputs.presenciales}
                                />
                               
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descansos">
                                    Descansos
                                </label>
                                <input
                                   
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md  text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="descansos"
                                    name="descansos"
                                    defaultValue={inputs.descansos}
                                />
                                
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bajas">
                                    Bajas
                                </label>
                                <input
                                 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="bajas"
                                    name="bajas"
                                    defaultValue={inputs.bajas}
                                />
                              
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="altas">
                                    Altas
                                </label>
                                <input
                                 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="altas"
                                    name="altas"
                                    defaultValue={inputs.altas}
                                />
                               
                            </div>

                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Apartado RMD</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cartera_rmd">
                                    Cartera RMD
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cartera_rmd"
                                    name="cartera_rmd"
                                    defaultValue={inputs.cartera_rmd}
                                />
                               
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="saldo_cartera_rmd">
                                    Saldo Cartera RMD
                                </label>
                                <input
                                 
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="saldo_cartera_rmd"
                                    name="saldo_cartera_rmd"
                                    defaultValue={inputs.saldo_cartera_rmd}
                                />
                              
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cuota_semana_rmd">
                                    Cuota semana RMD
                                </label>
                                <input
                                   
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cuota_semana_rmd"
                                    name="cuota_semana_rmd"
                                    defaultValue={inputs.cuota_semana_rmd}
                                />
                                
                            </div>


                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Planes de pago</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total_plan_pago">
                                    Total Planes de Pago
                                </label>
                                <input
                                 
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="total_plan_pago"
                                    name="total_plan_pago"
                                    defaultValue={inputs.total_plan_pago}
                                />
                              
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vigentes">
                                    Vigentes
                                </label>
                                <input
                                   
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="vigentes"
                                    name="vigentes"
                                    defaultValue={inputs.vigentes}
                                />
                             
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cancelados">
                                    Cancelados
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cancelados"
                                    name="cancelados"
                                    defaultValue={inputs.cancelados}
                                />
                              
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="normalidad">
                                    Normalidad
                                </label>
                                <input
                                 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="normalidad"
                                    name="normalidad"
                                    defaultValue={inputs.normalidad}
                                />
                               
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cuota_planes">
                                    Cuota Planes
                                </label>
                                <input
                                   
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="cuota_planes"
                                    name="cuota_planes"
                                    defaultValue={inputs.cuota_planes}
                                />
                               
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avance_planes">
                                    Avance Planes
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="avance_planes"
                                    name="avance_planes"
                                    defaultValue={inputs.avance_planes}
                                />
                              
                            </div>


                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Pagares</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="elaborados">
                                    Elaborados
                                </label>
                                <input
                                 
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="elaborados"
                                    name="elaborados"
                                    defaultValue={inputs.elaborados}
                                />
                             
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="compromiso">
                                    Compromiso
                                </label>
                                <input
                                 
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="compromiso"
                                    name="compromiso"
                                    defaultValue={inputs.compromiso}
                                />
                             
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pendientes">
                                    Pendientes
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="pendientes"
                                    name="pendientes"
                                    defaultValue={inputs.pendientes}
                                />
                           
                            </div>

                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Cicerón</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2 md:p-6">

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="demandas">
                                    Demandas
                                </label>
                                <input
                                   
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="demandas"
                                    name="demandas"
                                    defaultValue={inputs.demandas}
                                />
                              
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gestionadas">
                                    Gestionadas
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="gestionadas"
                                    name="gestionadas"
                                    defaultValue={inputs.gestionadas}
                                />
                              
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="acuses">
                                    Acuses(PDF)
                                </label>
                                <input
                                   
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="acuses"
                                    name="acuses"
                                    defaultValue={inputs.acuses}
                                />
                               
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pendientes_ciceron">
                                    Pendientes
                                </label>
                                <input
                                
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="pendientes_ciceron"
                                    name="pendientes_ciceron"
                                    defaultValue={inputs.pendientes_ciceron}
                                />
                              
                            </div>

                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Herramientas de gestión</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deudores">
                                    Deudores
                                </label>
                                <input
                                
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="deudores"
                                    name="deudores"
                                    defaultValue={inputs.deudores}
                                />
                            
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="llamada">
                                    Llamada
                                </label>
                                <input
                                
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="llamada"
                                    name="llamada"
                                    defaultValue={inputs.llamada}
                                />
                               
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="blaster">
                                    Blaster
                                </label>
                                <input
                                 
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="blaster"
                                    name="blaster"
                                    defaultValue={inputs.blaster}
                                />
                              
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sms">
                                    SMS
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="sms"
                                    name="sms"
                                    defaultValue={inputs.sms}
                                />
                              
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whatsapp">
                                    Whatsapp
                                </label>
                                <input
                                 
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="whatsapp"
                                    name="whatsapp"
                                    defaultValue={inputs.whatsapp}
                                />
                               
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carta">
                                    Carta
                                </label>
                                <input
                                
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="carta"
                                    name="carta"
                                    defaultValue={inputs.carta}
                                />
                            
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="visita">
                                    Visita
                                </label>
                                <input
                               
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="visita"
                                    name="visita"
                                    defaultValue={inputs.visita}
                                />
                            
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otro">
                                    Otro
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="otro"
                                    name="otro"
                                    defaultValue={inputs.otro}
                                />

                            </div>

                        </div>
                    </div>



                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                        <h5 className="text-xl font-bold mb-2 text-center">Hallazgos</h5>
                        

                        <div className="w-full  bg-white p-4 rounded-md shadow-md">

                            <div >
                                {inputs.hallazgos?.length === 0
                                    ? (
                                        <p className="px-5 py-2 pt">No hay Hallazgos agregados</p>
                                    )
                                    : (
                                        <div >

                                            <table className="w-full border divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center px-6 py-2">Descripcion</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inputs.hallazgos?.map((ph:any, index) => (
                                                        <tr key={index}>
                                                            <td className="text-center px-4 py-2">{ph.descripcion}</td>
                                                         
                                                           
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
                        

                        <div className="w-full  bg-white p-8 rounded-md shadow-md">

                            <div >
                                {inputs.acciones.length === 0
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
                                                    {inputs.acciones.map((accion:any) => (
                                                        <tr key={accion.id}>
                                                            <td className="px-4 py-2">{accion.descripcion}</td>
                                                            <td className="px-4 py-2">{accion.responsable}</td>
                                                            <td className="px-4 py-2">{accion.fecha}</td>
                                                          
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
                                    <input id="segmento5" type="text" className="w-full border rounded px-2 py-1 text-gray-900"
                                     defaultValue={inputs.segmento5} />
                                 
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input id="cuota5" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                    defaultValue={inputs.cuota5} />
                                
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input id="eficiencia5" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                     defaultValue={inputs.eficiencia5}  />
                                 
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input  id="segmento28" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                    defaultValue={inputs.segmento28} />
                                  
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input  id="cuota28" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                   defaultValue={inputs.cuota28} />
                                   
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input  id="eficiencia28" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                    defaultValue={inputs.eficiencia28} />
                                  
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input  id="segmento6" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                   defaultValue={inputs.segmento6} />
                                   
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input  id="cuota6" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                    defaultValue={inputs.cuota6} />
                                 
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input  id="eficiencia6" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                    defaultValue={inputs.eficiencia6} />
                                  
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input  id="segmento16" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                    defaultValue={inputs.segmento16} />
                                  
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input id="cuota16" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                    defaultValue={inputs.cuota16} />
                                   
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <input  id="eficiencia16" type="text" className="w-full border rounded px-2 py-1 text-gray-900" 
                                    defaultValue={inputs.eficiencia16} />
                                  
                                </td>
                            </tr>
                        </tbody>
                    </table>


                    <div className="bg-white rounded-lg shadow-md p-6 mb-4 mx-3">
                        <h5 className="text-xl font-bold mb-2 text-center">ANEXO.</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="banco">
                                    EL BANCO
                                </label>
                                <input
                                
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="banco"
                                    name="banco"
                                    defaultValue={inputs.banco}
                                />
                           
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prestador">
                                    EL PRESTADOR
                                </label>
                                <input
                                
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="prestador"
                                    name="prestador"
                                    defaultValue={inputs.prestador}
                                />
                              
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firma_entrevistador">
                                    Firma entrevistador
                                </label>
                                <div style={{border:"1px solid black"}}>
                                <SignaturePad ref={sigCanvas}/>
                   
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
           
            
          </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700  text-sm font-bold mb-2" htmlFor="representante">
                                    Representante Legal
                                </label>
                                <input
                                  
                                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="representante"
                                    name="representante"
                                    defaultValue={inputs.representante_legal}
                                />
                            
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="entrevistado">
                                    Entrevistado
                                </label>
                                <input
                               
                                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    type="text"
                                    id="entrevistado"
                                    name="entrevistado"
                                    defaultValue={inputs.entrevistado}
                                />
                           
                            </div>


                        </div>
                        <p className="text-sm font-bold mb-2 text-center text-red-400 ">ESTOY ENTERADO Y FIRMO DE CONFORMIDAD.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md mb-4 w-full p-2 md:p-6 text-center">
                      <h5 className="text-xl font-bold mb-2 text-center">Reglas Operativas</h5> 
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

                    <div className="bg-white rounded-lg shadow-md  mb-4 w-full p-2 md:p-6">
                    <h2 className="text-xl font-bold mb-2 text-center">HORARIOS.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 md:p-6">

                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hora_inicio">
                          Hora Inicio
                      </label>

                      <input
                         
                          className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
                          type="text"
                          id="hora_inicio"
                          name="hora_inicio"
                          defaultValue={inputs.hora}
                      

                      />
                  </div>
        
        

               

                  <div className="mb-4">
                 
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hora">
                          Hora Fin
                      </label>
                      <input
                                                   
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-blue-500"
                          type="text"
                          id="hora_fin"
                          name="hora_fin"
                          defaultValue={inputs.hora_fin}
                         
                      />
                   
                  </div>

              </div>

          </div>

      </form>
  </div>
      );
}