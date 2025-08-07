export interface Despacho {
    id:number;
    nombre:string;
    latitud:number;
    longitud:number;
    qrToken?: string | null; // <-- ADD THIS LINE. It can be a string, null, or undefined.
  }
  
 export interface Puesto{
    id:number,
    nombre:string
}