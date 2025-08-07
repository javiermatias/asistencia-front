'use client'
import {  signOut, useSession } from "next-auth/react";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import {  useRouter } from "next/navigation";
import Spinner from "./ui/spiner";
import { useCheckStatus } from "./hooks/despacho/useLogin";



export default function Page() {
  // 1. Get session from next-auth
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.user?.access_token;

  // 2. Call your custom hook to validate the token against YOUR backend
  // This query will only run when `token` is available (`enabled: !!token`)
  const { 
    isSuccess: isTokenValid, 
    isError: isTokenInvalid,
    isLoading: isTokenCheckLoading,
  } = useCheckStatus(token);

  const { setSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // While next-auth is checking for a session OR our custom hook is checking the token,
    // we do nothing and let the spinner show.
    if (sessionStatus === 'loading' || isTokenCheckLoading) {
      return;
    }

    // --- FAILURE CONDITIONS ---
    // Condition 1: No session found by next-auth.
    // Condition 2: The token was checked and is invalid/expired (isTokenInvalid is true).
    if (sessionStatus === 'unauthenticated' || isTokenInvalid) {
      // Use signOut to clear the next-auth cookie and session state.
      // `redirect: false` prevents next-auth from auto-redirecting,
      // allowing us to control it with router.push().
      signOut({ redirect: false }).then(() => {
        router.push('/login');
      });
      return;
    }

    // --- SUCCESS CONDITION ---
    // If the next-auth session is authenticated AND our backend confirms the token is valid.
    if (sessionStatus === 'authenticated' && isTokenValid) {
      console.log('Token is valid, proceeding to dashboard...');
      setSession(session);

      switch (session.user.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'supervisor':
          router.push('/supervisor');
          break;
        case 'agente':
          router.push('/agente');
          break;
        default:
          // If role is unknown, send to login as a fallback
          router.push('/login');
      }
    }
  }, [
    session,
    sessionStatus,
    isTokenValid,
    isTokenInvalid,
    isTokenCheckLoading,
    setSession,
    router,
  ]);

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <p className="mb-4 text-center">Verificando sesión, aguarde un momento...</p>
      <Spinner />
    </main>
  );
}



