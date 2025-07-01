import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request }) {
            console.log("autorizando")
            const isLoggedIn = !!auth?.user;
            const isAgente = request.nextUrl.pathname.startsWith('/agente');
            const isSupervisor = request.nextUrl.pathname.startsWith('/supervisor');
            const register = request.nextUrl.pathname.startsWith('/register');
            const login = request.nextUrl.pathname.startsWith('/login');
            if (register) return true;
            if (login && !isLoggedIn) return true;
            if (!isLoggedIn) return false;
            if (isSupervisor) {
                if (isLoggedIn && auth?.user?.role === 'supervisor') return true;
                return false; // Redirect unauthenticated users to login page
            }/*  else if (isLoggedIn && auth?.user?.email === 'moi@moi.com') {
                return Response.redirect(new URL('/supervisor/dashboard', request.nextUrl));
            } */

            if (isAgente) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/agente/dashboard', request.nextUrl));
            }

            return false;



        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;