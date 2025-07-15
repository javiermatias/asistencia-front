// app/supervisor/page.tsx
import DespachoPage from '@/app/components/despacho/Despacho';
import { auth } from '@/auth';



export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="flex items-center justify-center min-h-screen bg-blue-50">
            <DespachoPage></DespachoPage>
    </main>
  );
}