'use client'
import {  useSession } from "next-auth/react";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import {  useRouter } from "next/navigation";
import Spinner from "./ui/spiner";



export default function Page() {
  const { data: session, status } = useSession()
  const token = session?.user?.access_token
  const { setSession } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // wait for session check to complete

    if (!session) {
      // no session -> redirect to login
      router.push('/login')
      return
    }

    if (token) {
      console.log('homepage session', session)
      setSession(session)

      switch (session.user.role) {
        case 'admin':
          router.push('/admin')
          break
        case 'supervisor':
          router.push('/supervisor')
          break
        case 'agente':
          router.push('/agente')
          break
        default:
          router.push('/login')
      }
    }
  }, [session, status, setSession, token, router])

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <p className="mb-4 text-center">Ingresando, aguarde un momento</p>
      <Spinner />
    </main>
  )
}



