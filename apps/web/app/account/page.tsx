"use client";

import BackHeader from "../_components/BackHeader";
import { useApp } from "../providers";
import { useMemo } from "react";
import Image from "next/image";
import { Calendar, CoffeeIcon, QrCode } from "lucide-react";
import Link from "next/link";
import AccountFooter from "../_components/AccountFooter";
import { getTimeOfDay } from "@/lib/time";
import RequireAuth from "../_components/RequireAuth";
import ProductCard from "../_components/ui/ProductCard";

const Page = () => {
  const { drinksCount, subDate } = useApp();
  const date = useMemo(() => new Date(subDate ?? 0), [subDate]);
  const daysSubscribed = useMemo(() => {
    if (!subDate) return 0;

    const today = new Date();
    const diffInTime = today.getTime() - date.getTime();

    // Math: Milliseconds / (1000ms * 60s * 60m * 24h)
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    return diffInDays > 0 ? diffInDays : 0; // Ensure it doesn't show negative
  }, [date, subDate]);
  const subMonth = useMemo(() => {
    return date
      ? date.toLocaleString("en-US", { month: "long", year: "numeric" })
      : "";
  }, [date]);
  const greeting = useMemo(() => getTimeOfDay(), []);

  return (
    <RequireAuth>
      <main className=" bg-amber-50">
        <BackHeader />
       
        <section className="p-6 has-autofill: ">
          <h1 className="text-2xl font-semibold text-foreground">{greeting}</h1>
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 flex flex-col  gap-4 border-brand-brown-secondary  border">
            <h1 className="text-foreground">Cofee from today</h1>
            <h3 className="text-amber-600 ">
              ¡Aviable! Show your QR code to one of our dispensary and be ready to
              enjoy the best coffe in the world
            </h3>
            <Image
              src="/QRcode.png"
              alt="QR Code"
              width={200}
              height={200}
              className="pt-10"
            />
            <div className="h-0.5 bg-neutral-800/15" />
            <h3 className="text-amber-600 ">
              Show your QR in the dispensary to get your daily coffee{" "}
            </h3>
            <Link
              href="/account/dispensary"
              className="inline-flex items-center gap-2 bg-brown-primary w-fit px-4 py-2 rounded-lg text-white text-2xl hover:bg-amber-900 transition-colors scale-3d"
            >
              <QrCode /> Open Dispensary!
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-5">
            <div className="mt-5 bg-white flex gap-8 w-full rounded-2xl p-6">
              <div className="bg-brand-brown-tertiary p-1 rounded h-auto">
                <CoffeeIcon className=" text-brown-primary rounded h-auto w-13 p-1" />
              </div>
              <div>
                <h3>Total Coffee</h3>
                <h3>
                  <span className="font-bold text-2xl">{drinksCount}</span> Cups
                </h3>
              </div>
            </div>

            <div className="mt-5 bg-white flex gap-8 w-full rounded-2xl p-6">
              <div className="bg-brand-brown-tertiary p-1 rounded">
                <Calendar className="bg-brand-brown-tertiary text-brown-primary rounded  h-auto w-13 p-1" />
              </div>
              <div>
                <h3 className="text-sm">Days Subscribed</h3>
                <h3>
                  <span className="font-bold text-2xl">{daysSubscribed}</span>{" "}
                  Days
                </h3>
              </div>
            </div>

            <div className="mt-5 bg-white flex gap-8 w-full rounded-2xl p-6">
              <div className="bg-brand-brown-tertiary p-1 rounded">
                <QrCode className=" text-brown-primary rounded  h-auto w-13 p-1" />
              </div>
              <div>
                <h3>Being a member since</h3>
                <h3>
                  <span className="font-bold text-2xl">{subMonth}</span>
                </h3>
              </div>
            </div>
          </div>
          <AccountFooter />
        </section>
      </main>
    </RequireAuth>
  );
};

export default Page;
