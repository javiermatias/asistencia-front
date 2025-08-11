import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import AuthWrapper from './auth_wrapper';
import TanstackProvider from './tanstack_provider';
import { Toaster } from 'sonner';
import HydrationHandler from './ui/layout/HydrationHandler';
//import 'sweetalert2/src/sweetalert2.scss';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">

      <body className={`${inter.className} antialiased`}>
        <AuthWrapper> {/* Wrapping the entire app with AuthWrapper */}
          <TanstackProvider>
           <HydrationHandler>
            {children}
            </HydrationHandler>
          </TanstackProvider>
        </AuthWrapper>
         <Toaster richColors position="top-right" />

      </body>
    </html>
  );
}
