"use client";

import { useState } from "react"; // Added for the loading effect
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react"; // Nice spinner icon

const LogoutPage: React.FC = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Start the "waiting" state

    try {
      await authClient.signOut();

      // 1. Redirect to the Home Page ("/")
      router.push("/");

      // 2. Refresh ensures the Navbar updates to show "Login" instead of "User"
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-amber-50/30">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm border border-amber-100">
        <h1 className="text-2xl font-bold text-zinc-800 mb-2">¿Ya te vas?</h1>
        <p className="text-zinc-500 mb-8">
          Esperamos que hayas disfrutado tu café.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-6 py-3 text-white bg-red-500 font-bold rounded-xl hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Cerrando sesión...
              </>
            ) : (
              "Cerrar Sesión"
            )}
          </button>

          <button
            onClick={() => router.back()} // Takes them back to where they were
            disabled={isLoggingOut}
            className="w-full px-6 py-3 text-zinc-600 bg-zinc-100 font-bold rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
