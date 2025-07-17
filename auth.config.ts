import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request }) {
            return true;

        /*     const isLoggedIn = !!auth?.user;
            console.log("middleware",auth )
            const urlAgente = request.nextUrl.pathname.startsWith('/agente');
            const urlSupervisor = request.nextUrl.pathname.startsWith('/supervisor');
            const urlAdmin = request.nextUrl.pathname.startsWith('/admin');
            const login = request.nextUrl.pathname.startsWith('/login');
            if (!isLoggedIn) return false;
            if (login && isLoggedIn) return true;
            if (urlAgente && auth?.user?.role === 'agente') return true;
            if (urlSupervisor && auth?.user?.role === 'supervisor') return true;
            if (urlAdmin && auth?.user?.role === 'admin') return true;

            return false; */

        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;