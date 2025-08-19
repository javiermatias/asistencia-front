// app/supervisor/page.tsx
import DespachoPage from '@/app/components/despachoAdmin/Despacho';
export default async function AdminDespacho() {

  return (
    <section className="pt-16 p-2">
      <div className="container mx-auto px-2 ">
            <DespachoPage></DespachoPage>
       </div>
    </section>
  );
}