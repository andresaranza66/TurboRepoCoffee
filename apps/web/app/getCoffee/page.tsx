"use client";

import { useApp } from "../providers";
import Header from "../_components/Header";
import { CoffeeIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    <main>
      <Header />
      <section className="p-4">
        <h2 className="text-xl font-bold">Subscription</h2>

        {coffeeName ? (
          <>
            <p>Coffee: {coffeeName}</p>
            <p>Drinks: {drinksCount}</p>
            <p>
              Joined: {subDate ? new Date(subDate).toLocaleDateString() : "N/A"}
            </p>

            <button
              // onClick={() => drinkCoffee()}
              className="mt-4 flex gap-2 items-center"
            >
              <CoffeeIcon /> Drink Coffee
            </button>
          </>
        ) : (
          <>
            <p>No active subscription</p>

            <button
              className="mt-4 px-4 py-2 bg-brown-primary text-white rounded-xl hover:bg-brown-secondary hover:scale-105 transition-transform hover:cursor-pointer "
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
          </>
        )}
      </section>
    </main>
  );
}
