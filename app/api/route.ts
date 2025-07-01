import { type NextRequest } from 'next/server'
import executeQuery from '../lib/db';


 export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams; 
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('size') || '10', 10);
  
  const offset = (page - 1) * pageSize;
  
  let result: any="";
  try {    
      result = await executeQuery({
      query: 'SELECT * FROM Bitacora ORDER BY fecha DESC LIMIT ? OFFSET ?',
      values: [pageSize, offset]
    });
    //console.log(result)
    
  } catch (error) {
    console.log(error);
  }
  console.log("ttt", result);
  //const re = result.result;
  return Response.json({ result })
} 

export async function POST(request: NextRequest) {
  const { asunto, nombre, fecha, lugar, convocado, id_user, id_despacho,
    nombre_despacho, nombre_atiende, cargo_atiende, participantes, volumen_cartera,
    saldo_cartera,cuota_semana,plantilla_ideal,plantilla_real, telefonicos,
    presenciales,descansos,bajas,altas,cartera_rmd,saldo_cartera_rmd,
    cuota_semana_rmd,total_plan_pago,vigentes,cancelados,normalidad,
    cuota_planes,avance_planes,elaborados,compromiso,pendientes,demandas,
    gestionadas,acuses,pendientes_ciceron,deudores,llamada,blaster,sms,whatsapp,
    carta,visita,otro,hallazgos,acciones,segmento5,cuota5,eficiencia5,
    segmento28,eficiencia28,cuota28,segmento6,cuota6,eficiencia6,
    segmento16,cuota16,eficiencia16,
    banco,prestador,representante_legal,entrevistado,firma,firma1,
    numero_empleado, nombre_empleado,posicion_empleado,fecha_fin

  } = await request.json();

  console.log("entrevistado"+entrevistado)

  
  try {
    // Insert into Bitacora
    const result:any = await executeQuery({
      query: `
        INSERT INTO Bitacora (fecha, asunto, nombre, lugar, convocado, id_user,
          id_despacho,nombre_despacho, nombre_atiende, cargo_atiende, volumen_cartera,
          saldo_cartera,cuota_semana,plantilla_ideal,plantilla_real, telefonicos,
          presenciales,descansos,bajas,altas,cartera_rmd,saldo_cartera_rmd,
          cuota_semana_rmd,total_plan_pago,vigentes,cancelados,normalidad,
          cuota_planes,avance_planes,elaborados,compromiso,pendientes,demandas,
          gestionadas,acuses,pendientes_ciceron,deudores,llamada,blaster,sms,whatsapp,
          carta,visita,otro,segmento5,cuota5,eficiencia5, segmento28,eficiencia28,cuota28,
          segmento6,cuota6,eficiencia6,segmento16,cuota16,eficiencia16,banco,prestador,
          representante_legal,entrevistado,firma,firma1,numero_empleado, nombre_empleado,
          posicion_empleado,fecha_fin
        ) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
          ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
          ?,?,?,?,?,?,?,?,?,?,?)`,
      values: [
        fecha, asunto, nombre, lugar, convocado, id_user,
        id_despacho,nombre_despacho, nombre_atiende, cargo_atiende, volumen_cartera,
        saldo_cartera,cuota_semana,plantilla_ideal,plantilla_real, telefonicos,
        presenciales,descansos,bajas,altas,cartera_rmd,saldo_cartera_rmd,
        cuota_semana_rmd,total_plan_pago,vigentes,cancelados,normalidad,
        cuota_planes,avance_planes,elaborados,compromiso,pendientes,demandas,
        gestionadas,acuses,pendientes_ciceron,deudores,llamada,blaster,sms,whatsapp,
        carta,visita,otro,segmento5,cuota5,eficiencia5,
        segmento28,eficiencia28,cuota28,segmento6,cuota6,eficiencia6,
        segmento16,cuota16,eficiencia16,
        banco,prestador,representante_legal,entrevistado,firma,firma1,
        numero_empleado, nombre_empleado,posicion_empleado,fecha_fin
      ]
    });
    const bitacoraId = result.insertId;
    for (const participante of participantes) {
      await executeQuery({
        query: 'INSERT INTO Participante (bitacora_id, nombre, puesto) VALUES (?, ?, ?)',
        values: [bitacoraId, participante.nombre, participante.puesto]
      });
    }
    for (const hallazgo of hallazgos) {
      await executeQuery({
        query: 'INSERT INTO Hallazgo (bitacora_id, descripcion) VALUES (?, ?)',
        values: [bitacoraId, hallazgo]
      });
    }

    for (const accion of acciones) {
      await executeQuery({
        query: 'INSERT INTO Accion (bitacora_id, descripcion, responsable, fecha) VALUES (?, ?, ?, ?)',
        values: [bitacoraId, accion.descripcion, accion.responsable, accion.fecha]
      });
    } 

    

    return new Response(`Bitacora was save success!`, {
      status: 200
    })

  } catch (error) {
    console.error('Error inserting Bitacora:', error);
    return new Response(`${error}`, {
      status: 400
    })
  }

}