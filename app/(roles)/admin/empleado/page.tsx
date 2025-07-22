import EmpleadoPage from "@/app/components/EmpleadoAdmin/Empleado";
import { auth } from "@/auth";

export default async function AdminEmpleado() {
    const session = await auth();
    console.log(session);
  
    return (
      <section className="pt-16 p-2">
        <div className="container mx-auto px-2">
              <EmpleadoPage></EmpleadoPage>
         </div>
      </section>
    );
  }