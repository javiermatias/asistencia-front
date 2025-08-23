'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';
import { signIn } from 'next-auth/react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Eye, EyeOff } from 'lucide-react';
export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous errors
    setIsLoading(true);
    try {
      // 1. Get the device fingerprint
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const deviceId = result.visitorId;
  
      // THE FIX IS HERE:
      // We are telling TypeScript that event.currentTarget is indeed a form element.
      //const form = event.currentTarget as HTMLFormElement;
      //const formData = new FormData(form);
  
      // 2. Pass the deviceId along with other credentials to the signIn function
      const res = await signIn('credentials', {
        redirect: false, // Important to handle the response manually
        username: username,
        password: password,
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
    }finally {
      setIsLoading(false);
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
  <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
    Contraseña
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      id="password"
      className="w-full rounded border border-gray-300 p-2 pr-10" // 👈 add padding-right for icon
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

          {errorMessage && (
            <div className="text-red-600 text-sm mt-2 text-center">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>
    </div>
  );
}