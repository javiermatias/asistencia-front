// app/supervisor/page.tsx
import DespachoPage from '@/app/components/despacho/Despacho';
import { auth } from '@/auth';



export default async function AdminPage() {
  const session = await auth();
  console.log(session);

  return (
    <section className="pt-16 p-2">
      <div className="container mx-auto px-2">
            <DespachoPage></DespachoPage>
       </div>
    </section>
  );
}