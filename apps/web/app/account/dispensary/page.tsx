"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import Image from "next/image";
import { Gift, CheckCircle } from "lucide-react";
import Header from "@/app/_components/Header";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client"; // Import auth
import Footer from "@/app/_components/Footer";

type CoffeeType = {
  _id: Id<"coffees">;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string; // This tells TS that image DEFINITELY exists
};

export default function DispensaryPage() {
  const [confirmCoffee, setConfirmCoffee] = useState<Id<"coffees"> | null>(
    null,
  );

  const { data: session } = authClient.useSession();
  const userId = session?.user?.id; // This is a string

  // 1. Queries & Mutations from both files
  const coffees = useQuery(api.coffee.getMenu) as CoffeeType[] | undefined;
  const drinkStatus = useQuery(api.drinks.canDrinkToday);

  const orderFree = useMutation(api.drinks.consumeFreeDailyDrink);
  const buyPaid = useMutation(api.drinks.buyDrink);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  //GEtting to now wich coffee was selected by the user=>
  const selectedCoffee = coffees?.find(
    (coffee) => coffee._id === confirmCoffee,
  );

  // 2. The Logic: Decide which mutation to run
  const handleOrder = async (coffeeId: Id<"coffees">) => {
    if (!userId || !drinkStatus) {
      toast.error("Debes iniciar sesión para pedir café.");
      return;
    }

    try {
      setLoadingId(coffeeId);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (drinkStatus.canDrink) {
        await orderFree({ coffeeId });

        // Beautiful Success Toast for Free Coffee
        toast.success("¡Disfruta tu café!", {
          description: "Has reclamado tu beneficio gratuito de hoy. ✨",
        });
      } else {
        await buyPaid({ coffeeId });

        // Find the coffee price to show in toast (optional)
        const coffee = coffees?.find((c) => c._id === coffeeId);

        toast.success("Pedido confirmado", {
          description: `Se ha procesado tu pago de $${coffee?.price}. ☕`,
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error("No se pudo procesar", {
        description: error.message || "Ocurrió un error inesperado.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (!coffees || drinkStatus === undefined) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
        <p className="mt-4 text-amber-900 font-medium">Loading menú...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-8">
        {/* Daily Status Banner */}
        <div className="mb-8 p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-amber-900">
              Your daily benefit status
            </h2>
            <p className="text-amber-800/70">
              {drinkStatus.canDrink
                ? "You have a free coffee available for today."
                : "You've already used your daily benefit. Come back tomorrow!"}
            </p>
          </div>
          {drinkStatus.canDrink ? (
            <Gift className="text-amber-600" />
          ) : (
            <CheckCircle className="text-green-600" />
          )}
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4
"
        >
          {coffees.map((coffee) => (
            <motion.div
              key={coffee._id}
              className="group bg-white border border-amber-100 rounded-3xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col hover:cursor-pointer"
            >
              {/* Image Container: Moves outside the padding so it hits the edges */}
              {/* Image Container */}
              <div className="relative w-full aspect-3/2 sm:aspect-4/3 md:aspect-square overflow-hidden">
                <Image
                  src={coffee.image}
                  alt={coffee.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute top-3 right-3 text-xs font-bold bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                  {coffee.stock} left
                </div>
              </div>

              {/* Content Container: The padding stays here */}
              <div className="p-6 flex flex-col ">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base sm:text-xl font-bold text-zinc-800">
                    {coffee.name}
                  </h3>
                  <span className="text-base sm:text-xl font-black text-amber-900">
                    ${coffee.price}
                  </span>
                </div>

                <p className="text-zinc-500 text-sm sm:text-base mb-6 line-clamp-2">
                  {coffee.description}
                </p>

                <div className="mt-auto">
                  <button
                    onClick={() => setConfirmCoffee(coffee._id)}
                    disabled={coffee.stock === 0 || loadingId === coffee._id}
                    className={`w-full flex items-center justify-center gap-2 sm:px-4 sm:py-3 py-2 px-2 rounded-xl font-bold text-sm sm:text-base transition-all hover:cursor-pointer ${
                      drinkStatus.canDrink
                        ? "bg-amber-600 text-white hover:bg-amber-500 active:scale-95"
                        : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loadingId === coffee._id ? (
                      <div className="h-2 w-2 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : drinkStatus.canDrink ? (
                      <>Claim Free Coffee</>
                    ) : (
                      <>Buy Now</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {confirmCoffee && selectedCoffee && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                {/* Image */}
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={selectedCoffee.image}
                    alt={selectedCoffee.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-zinc-800 mb-1">
                    {selectedCoffee.name}
                  </h2>

                  <p className="text-amber-900 font-black text-lg mb-4">
                    ${selectedCoffee.price}
                  </p>

                  <p className="text-zinc-500 text-sm sm:text-base mb-6">
                    Are you sure you want to order this coffee?
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmCoffee(null)}
                      className="flex-1 py-3 rounded-xl bg-zinc-200 text-zinc-800 font-semibold hover:bg-zinc-300 transition hover:cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        if (confirmCoffee) {
                          handleOrder(confirmCoffee);
                        }
                        setConfirmCoffee(null);
                      }}
                      className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-500 transition hover:cursor-pointer"
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
