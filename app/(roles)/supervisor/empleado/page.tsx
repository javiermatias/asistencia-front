import { useAuthStore } from "@/app/store/authStore";
import EmpleadoSupervisor from "./Empleado";
import { useGetDespachoBySupervisor } from "@/app/hooks/despacho/useDespachos";

export default async function SupervisorEmpleadoPage() {
    //const session = await auth();
    //console.log(session);
  
    const { session } = useAuthStore();
    const token = session?.user.access_token;
    
    const { data: despacho, isLoading, isError, error } = useGetDespachoBySupervisor(token);
  
    if (isLoading) {
      return (
          <div className="flex justify-center items-center h-screen">
              <p className="text-lg font-semibold">Cargando empleados del despacho...</p>
          </div>
      );
    }
  
    if (isError) {
      return (
          <div className="flex justify-center items-center h-screen">
              <div className="p-4 bg-red-100 text-red-800 border border-red-400 rounded">
                  <p className="font-bold">Error al cargar el despacho</p>
                  <p>{(error as any).response?.data?.message || error.message}</p>
              </div>
          </div>
      );
    }
  
    if (!despacho) {
      return (
          <div className="flex justify-center items-center h-screen">
              <p className="text-lg text-gray-600">No se encontró un despacho asignado.</p>
          </div>
      );
    }
  
    return (
      <main className="container mx-auto p-4">
        <EmpleadoSupervisor initialData={despacho} />
      </main>
    );
  
  }