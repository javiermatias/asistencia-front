import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import AuthWrapper from './auth_wrapper';
import TanstackProvider from './tanstack_provider';
import { Toaster } from 'sonner';
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
            {children}
          </TanstackProvider>
        </AuthWrapper>
         <Toaster richColors position="top-right" />



   {/*      <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[99999]" // A very high z-index using Tailwind's arbitrary values
        /> */}
      </body>
    </html>
  );
}
