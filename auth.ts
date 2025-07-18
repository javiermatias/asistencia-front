import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { JWT } from "next-auth/jwt"

interface User {
  id: number;
  username: string;
  role: string;
  access_token: string;
}

// Extend the built-in session and user types to include our custom properties
declare module "next-auth" {
  
  interface Session {
    user:User
    
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number;
      username: string;
      role: string;  
    };
    accessToken: string;
  }
}



export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
      Credentials({
        // You can specify which fields should be submitted, but we'll define them in the login form instead
        credentials: {
          username: { label: "Username" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.username || !credentials.password) {
            return null;
          }

          //console.log("hola" + process.env.NEXT_PUBLIC_API_URL)
  
          // Call our mock API to authenticate the user(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/login`
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });
  
          if (!res.ok) {
            return null; // Authentication failed
          }
  
          const user = await res.json();
          
          // If no user is returned, authentication failed
          if (!user) {
            return null;
          }
  
          // The user object returned here will be passed to the `jwt` callback
          return user;
        },
      }),
    ],
    callbacks: {
        // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
        async jwt({ token, user }) {

           
            console.log("jwt token",token);
            console.log("jwt user",user);
           
            return { ...token, ...user }
        },
        // If you want to use the role in client components
        async session({ session, token }) {

            // Send properties to the client, like an access_token from a provider.
            console.log("session auth:", session)
            console.log("token auth:", token)
            session.user = token as any
        
            console.log("session user:", session.user)
            return session
        },
    },
    pages: {
      signIn: "/login", // Redirect users to our custom login page
    },
});

/*  */