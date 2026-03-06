"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ensureUser = useMutation(api.user.ensureUser);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/login",
        newUserCallbackURL: "/account",
        disableRedirect: true,
      });

      console.log("Google sign-in response:", res);

      let url: unknown = (res as any)?.url;

      if (!url) url = (res as any)?.data?.url;
      if (!url) url = (res as any)?.redirectUrl;
      if (!url) url = (res as any)?.data?.redirectUrl;

      // Some implementations may return a Fetch Response.
      if (!url && res && typeof (res as any)?.json === "function") {
        try {
          const body = await (res as any).json();
          console.log("Google sign-in response body:", body);
          url = body?.url ?? body?.data?.url ?? body?.redirectUrl ?? body?.data?.redirectUrl;
        } catch (e) {
          console.error("Failed to parse Google sign-in response JSON:", e);
        }
      }
      if (typeof url === "string" && url.length > 0) {
        window.location.href = url;
        return;
      }

      setError("Failed to start Google sign-in. Missing redirect URL.");
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      const message =
        err?.error?.message ??
        err?.message ??
        (typeof err === "string" ? err : null) ??
        "Failed to sign in with Google";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authClient.signIn.email({
        email,
        password,
      });

      await ensureUser(); // 👈 THIS CREATES THE DB USER
      window.location.href = "/";
    } catch (err: string | any) {
      setError(err.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-80 flex flex-col justify-center items-center"
      >
        <h1 className="text-2xl font-semibold ">Login</h1>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full border py-2 rounded hover:cursor-pointer hover:bg-gray-100 transition-color"
        >
          Continue with Google
        </button>

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:cursor-pointer hover:bg-gray-500 transition-color"
        >
          {loading ? "Login...." : "Login"}
        </button>
      </form>
    </div>
  );
}
