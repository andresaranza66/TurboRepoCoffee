"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../providers";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
