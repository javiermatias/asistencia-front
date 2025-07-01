import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import AuthWrapper from './auth_wrapper';
import TanstackProvider from './tanstack_provider';
import { ToastContainer } from 'react-toastify'
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
        <ToastContainer
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
        />
      </body>
    </html>
  );
}
