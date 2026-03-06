"use client";

import * as BetterAuth from "@convex-dev/better-auth/react";
const { useAuth } = BetterAuth as any;

export function AuthStatus() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) return <p>Not logged in</p>;

  return <p>Welcome {user.email}</p>;
}
