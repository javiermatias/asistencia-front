'use client'
import { signOut } from "next-auth/react";
import { useFormStatus } from "react-dom";


export default function Page() {
  const { pending } = useFormStatus(); // Get pending state if used within a form
  return (
    <>

 <form
      action={async () => {
        await signOut({ callbackUrl: '/login' }); // Redirects to /login after sign out
        // Or if you want to redirect to a specific page after sign out:
        // await signOut({ redirectTo: '/some-other-page' });
      }}
    >
      <button
        type="submit"
        disabled={pending} // Disable button while sign out is in progress
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        {pending ? 'Signing Out...' : 'Sign Out'}
      </button>
    </form>


    </>
  );
}



