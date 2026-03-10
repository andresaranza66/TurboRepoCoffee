import { MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import HowItWorks from "./_components/HowItWorks";
import Pricing from "./_components/Pricing";
import AuthAwareHeader from "./_components/AuthAwareHeader";
import Footer from "./_components/Footer";
import UserStatsPanel from "./_components/UserStatsPanel";

export default async function Home() {
  return (
    <>
      <AuthAwareHeader />
      <main className="relative min-h-screen">
        <section className="relative h-200 w-full flex flex-col justify-start items-start px-12 pt-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/coffeeImg1.png')] bg-cover bg-center blur-sm scale-105" />
          <div className="absolute inset-0 bg-gray-400/50" />
          <div className="relative z-10 w-full flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex flex-col gap-1 max-w-2xl">
              <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full mb-4 animate-fade-in w-fit">
                <MapPin className="text-brown-primary" />
                <span className="text-brown-primary font-medium">
                  100% Colombian Coffee
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-yellow-primary via-white to-brown-primary bg-clip-text text-transparent mt-6">
                Unlimited Coffee
              </h1>
              <h2 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-yellow-primary to-black bg-clip-text text-transparent mt-1 h-32">
                For Just One Payment
              </h2>
              <p className="text-base text-white mt-2 max-w-prose leading-relaxed">
                Join the CoffePass and enjoy a cup of the best colombian coffee
                every day. Subscribe, scan your code and taste the best coffee in
                the world.
              </p>

              <div className="flex flex-wrap gap-4 mt-9">
                <Link
                  href="/account"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brown-primary text-white hover:bg-gray-900 hover:scale-105 transition"
                >
                  <Sparkles className="mr-4" /> Start your subscription
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white border text-black font-semibold hover:bg-yellow-primary hover:text-white transition"
                >
                  Find a coffee shop near you
                </Link>
              </div>
            </div>

            <div className="lg:pt-3 lg:shrink-0">
              <UserStatsPanel />
            </div>
          </div>
        </section>

        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
