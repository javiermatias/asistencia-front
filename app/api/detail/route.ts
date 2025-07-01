import executeQuery from '@/app/lib/db';
import { type NextRequest } from 'next/server'

 export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams; 


  const id = parseInt(searchParams.get('id') || '1', 10);

  let result:any="";
  let result1:any="";
  let result2:any ="";
  let result3:any ="";
  try {    
      result = await executeQuery({
      query: 'SELECT * FROM Bitacora where id=?',
      values: [id]
      });
      result1 = await executeQuery({
        query: 'SELECT * FROM Accion where bitacora_id=?',
        values: [id]
      });
      result2 = await executeQuery({
        query: 'SELECT * FROM Hallazgo where bitacora_id=?',
        values: [id]
      });
      result3 = await executeQuery({
        query: 'SELECT * FROM Participante where bitacora_id=?',
        values: [id]
      });

  } catch (error) {
    console.log(error);
  }
  const bitacora = result[0];
  const accion = result1;
  const hallazgo = result2;
  const participante =result3;
  console.log("tt1", result[0]);
  console.log("tt2", result1);
  console.log("tt3", result2);
  console.log("tt4", result3);
  //const re = result.result;
  return Response.json({ bitacora,accion,hallazgo,participante })
} 