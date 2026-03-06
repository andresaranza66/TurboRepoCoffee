"use client";

import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  return (
    <button
      onClick={() => authClient.signOut()}
      className="px-4 py-2 border rounded"
    >
      Logout
    </button>
  );
}
