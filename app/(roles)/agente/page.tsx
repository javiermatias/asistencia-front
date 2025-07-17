import { auth } from "@/auth";

export default async function AgentePage() {
    const session = await auth();
  
    return (
      <main className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="w-full max-w-2xl p-8 space-y-4 text-center bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-800">
           Agente Dashboard
          </h1>
          <p className="text-lg text-gray-700">
            Welcome, <span className="font-semibold">{session?.user?.username}</span>!
          </p>
          <p className="text-gray-600">
            Your role is: <span className="font-mono text-blue-600">{session?.user?.role}</span>
          </p>
          <div className="p-4 mt-4 text-left bg-gray-100 rounded">
            <h3 className="font-semibold">Your Backend JWT:</h3>
            <p className="text-xs break-all text-gray-600">{session?.user?.access_token}</p>
          </div>
          {/* <SignOutButton /> */}
        </div>
      </main>
    );
  }