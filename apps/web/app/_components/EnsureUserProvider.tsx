"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function EnsureUserProvider() {
  const user = useQuery(api.user.currentUser);
  const ensureUser = useMutation(api.user.ensureUser);

  useEffect(() => {
    if (user === null) {
      ensureUser();
    }
  }, [user, ensureUser]);

  return null;
}
