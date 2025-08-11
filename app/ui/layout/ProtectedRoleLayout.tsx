// src/app/ui/layouts/ProtectedRoleLayout.tsx

'use client'; // This component uses hooks, so it must be a client component.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use from 'next/navigation' in App Router
import { useAuthStore } from '@/app/store/authStore';
import Spinner from '../spiner';
import SideNav from '../dashboard/sidenav';

// Define the props for our layout, including the required role
interface ProtectedRoleLayoutProps {
  children: React.ReactNode;
  requiredRole: string; // e.g., 'admin', 'supervisor'
}

export default function ProtectedRoleLayout({ children, requiredRole }: ProtectedRoleLayoutProps) {
  const router = useRouter();
  const { session } = useAuthStore();
  
  const token = session?.user?.access_token;
  const userRole = session?.user?.role;
  
  // A boolean to quickly check if the user is authorized.
  // This is great for preventing content "flashing" before redirection.
  const isAuthorized = token && userRole === requiredRole;

  useEffect(() => {
    // We check for two failure conditions:
    // 1. No token (user is not authenticated).
    // 2. Role doesn't match (user is not authorized for this section).
    if (!token || userRole !== requiredRole) {
      console.log(`Authorization failed. Token exists: ${!!token}, Role matches: ${userRole === requiredRole}. Redirecting to /login.`);
      // Using replace so the user can't click "back" to the protected page.
      router.replace('/login');
    }
  }, [token, userRole, requiredRole, router]);

  // While checks are running or if authorization fails,
  // show a loading screen. This prevents any of the protected
  // content (like the SideNav) from rendering for an unauthorized user.
  if (!isAuthorized) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-center">Verificando permisos...</p>
        <Spinner />
      </main>
    );
  }

  // If we reach this point, the user is authorized. Render the full layout.
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        {/* You can even pass the role to SideNav if it needs to render different links */}
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-2">{children}</div>
    </div>
  );
}