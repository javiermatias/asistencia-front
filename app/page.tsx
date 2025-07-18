'use client'
import {  useSession } from "next-auth/react";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Spinner from "./ui/spiner";



export default function Page() {

  const { data: session } = useSession()
  const token = session?.user?.access_token
  console.log("session",session)

  const { setSession } = useAuthStore()
  useEffect(() => {
    if (token) {
      console.log("homepage session", session)
      setSession(session)
      switch (session?.user.role) {
        case "admin": { redirect('/admin') }
        case "supervisor": { redirect('/supervisor') }
        case "agente": { redirect('/agente') }
        
      }
    }

  }, [session, setSession, token])


  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <p className="mb-4 text-center">Ingresando, aguarde un momento</p>
      <Spinner></Spinner>
    </main>
  )






  /* const { pending } = useFormStatus(); // Get pending state if used within a form
  return (
    <>

 <form
      action={async () => {
        await signOut({ callbackUrl: '/login' }); // Redirects to /login after sign out
        // Or if you want to redirect to a specific page after sign out:
        // await signOut({ redirectTo: '/some-other-page' });
      }}
    >
      <button
        type="submit"
        disabled={pending} // Disable button while sign out is in progress
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        {pending ? 'Signing Out...' : 'Sign Out'}
      </button>
    </form>


    </>
  ); */
}



