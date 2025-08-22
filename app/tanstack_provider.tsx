'use client'

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

const TanstackProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: any, query) => {
            if (error?.response?.status === 401) {
              console.error('401 from query → signing out')
              signOut({ callbackUrl: '/login' })
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: any, mutation) => {
            if (error?.response?.status === 401) {
              console.error('401 from mutation → signing out')
              signOut({ callbackUrl: '/login' })
            }
          },
        }),
        defaultOptions: {
          queries: {
            // set defaults like staleTime, retries, etc.
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default TanstackProvider