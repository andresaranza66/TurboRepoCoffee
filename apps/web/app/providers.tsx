"use client";

import { api } from "@/convex/_generated/api";
import {
  ConvexReactClient,
  useQuery,
  useMutation,
  useConvexAuth,
} from "convex/react";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";

import { createContext, ReactNode, useContext, useEffect } from "react";

/* ------------------------------------------------------------------ */
/* CLIENT                                                             */
/* ------------------------------------------------------------------ */

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
}
const convex = new ConvexReactClient(convexUrl);

/* ------------------------------------------------------------------ */
/* CONTEXT TYPE                                                       */
/* ------------------------------------------------------------------ */

type AppContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  name: string | null;
  email: string | null;
  image: string | null;
  coffeeName: string | null;
  drinksCount: number;
  subDate: number | null;
};

/* ------------------------------------------------------------------ */

const AppContext = createContext<AppContextType | undefined>(undefined);

/* ------------------------------------------------------------------ */
/* DATA LAYER                                                         */
/* ------------------------------------------------------------------ */

function AppDataLayer({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useConvexAuth();

  const user = useQuery(api.user.currentUser);
  const ensureUser = useMutation(api.user.ensureUser);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user === undefined) return;
    if (user === null || !user?.name || !user?.image) {
      ensureUser();
    }
  }, [isAuthenticated, user, ensureUser]);

  return (
    <AppContext.Provider
      value={{
        isLoading: user === undefined,
        isAuthenticated,
        name: user?.name ?? null,
        email: user?.email ?? null,
        image: user?.image ?? null,
        //Adding the subscription
        coffeeName: user?.coffeeName ?? null,
        drinksCount: user?.drinksCount ?? 0,
        subDate: user?.subDate ?? null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* ROOT PROVIDERS                                                     */
/* ------------------------------------------------------------------ */

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <AppDataLayer>{children}</AppDataLayer>
    </ConvexBetterAuthProvider>
  );
}

/* ------------------------------------------------------------------ */

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProviders");
  return ctx;
}
