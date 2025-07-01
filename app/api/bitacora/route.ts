import executeQuery from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    let result: any="";
    try {    
        result = await executeQuery({
        query: `SELECT 
        id,
        asunto,
        nombre,
        fecha,
        lugar,
        convocado,
        id_user,
        id_despacho,
        nombre_despacho,
        nombre_atiende,
        cargo_atiende,
        volumen_cartera,
        saldo_cartera,
        cuota_semana,
        plantilla_ideal,
        plantilla_real,
        telefonicos,
        presenciales,
        descansos,
        bajas,
        altas,
        cartera_rmd,
        saldo_cartera_rmd,
        cuota_semana_rmd,
        total_plan_pago,
        vigentes,
        cancelados,
        normalidad,
        cuota_planes,
        avance_planes,
        elaborados,
        compromiso,
        pendientes,
        demandas,
        gestionadas,
        acuses,
        pendientes_ciceron,
        deudores,
        llamada,
        blaster,
        sms,
        whatsapp,
        carta,
        visita,
        otro,
        segmento5,
        cuota5,
        eficiencia5,
        segmento28,
        cuota28,
        eficiencia28,
        segmento6,
        cuota6,
        eficiencia6,
        segmento16,
        cuota16,
        eficiencia16,
        banco,
        prestador,
        representante_legal,
        entrevistado,
        numero_empleado,
        nombre_empleado,
        posicion_empleado,
        fecha_fin
    FROM Bitacora`,
        values: []
      });
      //console.log(result)
      
    } catch (error) {
      console.log(error);
    }
    console.log("ttt", result);
    //const re = result.result;
    return Response.json({ result })
  } 
