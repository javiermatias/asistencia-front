import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';

import { JWT } from "next-auth/jwt"

// Extend the built-in session and user types to include our custom properties
declare module 'next-auth' {
  interface Session {
    user: {
      role: 'supervisor' | 'agent';
      backendToken: string;
    } & User; // an intersection type with the default User
  }

}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'supervisor' | 'agent';
    backendToken: string;
  }
}

async function getUser(email: string): Promise<User | undefined> {
 /*    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    } */
        return {
            id: "0",
    nombre: "javi",
    email: "javi@javi.com",
    password: "123456",
    role: "agente",
    numero: "23232323",
    posicion: "nada",
    proyecto: "string",
          };



}

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    return user;
                    //const passwordsMatch = password === user.password;
                    //if (passwordsMatch) return user;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
        async jwt({ token, user }) {

            /* if (user) {
                const backendUser = user as BackendUser;
                token.role = backendUser.role;
                token.backendToken = backendUser.backendToken;
              }
              return token; */
            //console.log(token);
            console.log(token, user);
            return { ...token, ...user }
        },
        // If you want to use the role in client components
        async session({ session, token }) {


            session.user = token as any
            return session
        },
    },
});

/*  */