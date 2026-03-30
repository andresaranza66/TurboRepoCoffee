"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useApp } from "../providers";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const { isLoading, isAuthenticated } = useApp();
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const authedId = session?.user?.id;
    if (authedId) {
      router.replace(`/getCoffee/${authedId}`);
    }
  }, [isAuthenticated, isLoading, router, session?.user?.id]);

  return <p>Loading...</p>;
}
