// src/app/ui/layouts/ProtectedRoleLayout.tsx

'use client'; // This component uses hooks, so it must be a client component.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use from 'next/navigation' in App Router
import { useAuthStore } from '@/app/store/authStore';
import Spinner from '../spiner';
import SideNavAdmin from '../dashboard/SideNavAdmin';
import SideNavSupervisor from '../dashboard/SideNavSupervisor';
import SideNavAgente from '../dashboard/SideNavAgente';


// Define the props for our layout, including the required role
interface ProtectedRoleLayoutProps {
    children: React.ReactNode;
    requiredRole: string;
  }
  
  // 2. Create the mapping from role string to Component Type
  const navComponents: { [key: string]: React.ComponentType } = {
    admin: SideNavAdmin,
    supervisor: SideNavSupervisor,
    agente: SideNavAgente,
  };
  
  
  export default function ProtectedRoleLayout({ children, requiredRole }: ProtectedRoleLayoutProps) {
    const router = useRouter();
    const { session } = useAuthStore();
    
    const token = session?.user?.access_token;
    const userRole = session?.user?.role;
    
    const isAuthorized = token && userRole === requiredRole;
  
    // 3. Look up the correct component from the map.
    // Note: Component variables in JSX must be PascalCase.
    const SideNavComponent = userRole ? navComponents[userRole] : null;
  
    useEffect(() => {
      if (!token || userRole !== requiredRole) {
        router.replace('/login');
      }
    }, [token, userRole, requiredRole, router]);
    
    if (!isAuthorized) {
      return (
        <main className="flex flex-col items-center justify-center h-screen">
          <p className="mb-4 text-center">Verificando permisos...</p>
          <Spinner />
        </main>
      );
    }
  
    return (
      // note: min-h-0 here prevents children flex items from overflowing unexpectedly
      <div className="flex h-screen min-h-0 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          {SideNavComponent && <SideNavComponent />}
        </aside>
  
        {/* Main content: allow independent scrolling */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6 md:p-2">
          {children}
        </main>
      </div>
    );
  }