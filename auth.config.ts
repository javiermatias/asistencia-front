import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request }) {
           
            const { nextUrl } = request;
            const isLoggedIn = !!auth?.user;
            const userRole = auth?.user?.rol; // Ensure 'rol' is consistently used

            console.log("auth.config.ts - authorized callback running:");
            console.log("  isLoggedIn:", isLoggedIn);
            console.log("  userRole:", userRole);
            console.log("  pathname:", nextUrl.pathname);

            // Paths that are always public (e.g., login page)
            const isPublicPath = nextUrl.pathname === '/login'; // Add other public paths if any

            // Rule 1: If not logged in and trying to access a protected path:
            // DENY ACCESS. NextAuth will automatically redirect to `pages.signIn` (/login).
            if (!isLoggedIn && !isPublicPath) {
                console.log("  -> Not logged in, not public. Denying access (NextAuth will redirect to login).");
                return false;
            }

            // Rule 2: If logged in and trying to access a public path (like /login):
            // ALLOW ACCESS. The actual redirect to the role-specific dashboard will be handled by middleware.ts.
            if (isLoggedIn && isPublicPath) {
                console.log("  -> Logged in and on public path. Allowing access (middleware will handle dashboard redirect).");
                return true;
            }

            // Rule 3: If logged in, check role-based access for protected paths:
            if (isLoggedIn) {
                if (nextUrl.pathname.startsWith('/admin')) {
                    console.log("  -> On /admin path. Authorized:", userRole === 'admin');
                    return userRole === 'admin';
                }
                if (nextUrl.pathname.startsWith('/supervisor')) {
                    console.log("  -> On /supervisor path. Authorized:", userRole === 'supervisor');
                    return userRole === 'supervisor';
                }
                if (nextUrl.pathname.startsWith('/agente')) {
                    console.log("  -> On /agente path. Authorized:", userRole === 'agente');
                    return userRole === 'agente';
                }
                // For any other path not explicitly defined, if logged in, allow access.
                // Adjust this fallback as per your application's security requirements.
                console.log("  -> Logged in on another path. Allowing access.");
                return true;
            }

            // Default: If none of the above rules matched, deny access.
            console.log("  -> Default: Denying access.");
            return false;

        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;