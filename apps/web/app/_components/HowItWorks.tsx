import React from "react";
import { MousePointerClick, Coffee, CreditCard } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      id: 1,
      title: "Pick your Plan",
      description:
        "Choose the monthly subscription that fits your caffeine needs.",
      icon: <CreditCard className="w-8 h-8 text-yellow-primary" />,
    },
    {
      id: 2,
      title: "Find a Café",
      description:
        "Use our map to locate any partner CaféPass shop in Colombia.",
      icon: <MousePointerClick className="w-8 h-8 text-yellow-primary" />,
    },
    {
      id: 3,
      title: "Enjoy Unlimited Coffee",
      description:
        "Show your digital pass and get your premium coffee instantly.",
      icon: <Coffee className="w-8 h-8 text-yellow-primary" />,
    },
  ];

  return (
    <section className="py-20 relative z-20 bg-white">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <h2 className="text-4xl font-bold text-black mb-1 ">How It Works</h2>
        <h3
          className="text-.5xl font-semibold
         text-gray-400 mb-12
         "
        >
          Getting coffee every day was never that easy{" "}
        </h3>
        {/* Grid layout for the steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-brown-primary">
                {step.id}. {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
