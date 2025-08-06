'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';
import { signIn } from 'next-auth/react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous errors
  
    try {
      // 1. Get the device fingerprint
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const deviceId = result.visitorId;
  
      const formData = new FormData(event.currentTarget);
  
      // 2. Pass the deviceId along with other credentials to the signIn function
      const res = await signIn('credentials', {
        redirect: false, // Important to handle the response manually
        username: formData.get('username'),
        password: formData.get('password'),
        deviceId: deviceId, // <-- THE NEW, CRUCIAL PART
      });
  
      if (res?.error) {
        // next-auth sets res.error if authorize returns null or an error is thrown
        setErrorMessage('Credenciales inválidas o inicio de sesión desde un dispositivo no autorizado.');
      } else {
        router.push('/'); // ✅ Success!
      }
    } catch (error) {
      console.error("An error occurred during the login process:", error);
      setErrorMessage("Ocurrió un error. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-3 p-6 md:w-1/2 bg-white rounded-lg shadow-lg"
      >
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl text-center`}>
            Ingreso.
          </h1>

          <div className="mb-4">
            <label htmlFor="username" className="block mb-1 font-medium text-gray-700">
              Usuario
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="w-full rounded border border-gray-300 p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full rounded border border-gray-300 p-2"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm mt-2 text-center">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Ingresar
          </button>
        </div>
      </form>
    </div>
  );
}