"use client";

import { useApp } from "../providers";
import Header from "../_components/Header";
import { CoffeeIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function Page() {
  const { isLoading, isAuthenticated, coffeeName, drinksCount, subDate } =
    useApp();
  const createSubscription = useMutation(api.user.createSubscription);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  // const drinkCoffee = useMutation(api.user.drinkCoffee);

  if (isLoading) return <p>Loading...</p>;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-amber-50">
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-black/5 shadow-xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-brown-primary">Get your coffee</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Manage your subscription and track your drinks.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/account")}
              className="shrink-0 text-sm font-semibold text-brown-primary hover:underline"
            >
              My account
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <div className="text-xs font-medium text-zinc-500">Coffee</div>
              <div className="mt-1 text-lg font-semibold text-zinc-900">
                {coffeeName ?? "—"}
              </div>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <div className="text-xs font-medium text-zinc-500">Drinks</div>
              <div className="mt-1 text-lg font-semibold text-zinc-900">
                {drinksCount}
              </div>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <div className="text-xs font-medium text-zinc-500">Joined</div>
              <div className="mt-1 text-lg font-semibold text-zinc-900">
                {subDate ? new Date(subDate).toLocaleDateString() : "—"}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {coffeeName ? (
              <div className="rounded-2xl bg-brown-primary/5 border border-brown-primary/15 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-brown-primary">
                      Subscription active
                    </div>
                    <div className="text-xs text-zinc-600 mt-1">
                      Show your QR code in the dispensary to get your daily coffee.
                    </div>
                  </div>
                  <Link
                  href="/account/dispensary"
                    type="button"
                    // onClick={() => drinkCoffee()}
                    className="inline-flex items-center gap-2 rounded-xl bg-brown-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brown-secondary transition-colors hover:cursor-pointer hover:bg-brown-secundary"
                  >
                    <CoffeeIcon className="h-4 w-4" />
                    Drink Coffee
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <div className="text-sm font-semibold text-zinc-900">No active subscription</div>
                <div className="text-xs text-zinc-600 mt-1">
                  Create your subscription to start collecting coffees.
                </div>

                <button
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-brown-primary text-white rounded-xl hover:bg-brown-secondary transition-colors hover:cursor-pointer disabled:opacity-60"
                  onClick={async () => {
                    try {
                      setIsCreating(true);
                      await createSubscription({
                        coffeeName: "Latte",
                      });
                      toast.success("Subscription created!");
                    } catch (err) {
                      toast.error("Could not create subscription");
                    } finally {
                      setIsCreating(false);
                    }
                  }}
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create subscription"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
