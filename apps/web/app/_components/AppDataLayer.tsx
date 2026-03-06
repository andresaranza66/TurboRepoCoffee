"use client";

import { useEffect } from "react";
import { useConvexAuth } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AppDataLayer() {
  const { isAuthenticated } = useConvexAuth();
  const ensureUser = useMutation(api.user.ensureUser);

  useEffect(() => {
    if (!isAuthenticated) return;
    ensureUser();
  }, [isAuthenticated, ensureUser]);

  return null;
}
