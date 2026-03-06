import { Sparkles } from "lucide-react";

const Pricing: React.FC = () => {
  return (
    <section className="py-20 relative z-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <h2 className="text-4xl font-bold text-black mb-1">Pricing</h2>
        <h3 className="text-2xl font-semibold text-gray-400 mb-12">
          Choose the plan that fits your needs
        </h3>
      </div>

      <div className="w-full max-w-6xl mx-auto px-6">
        <div
          className=" flex flex-col gap-4 mt-12 max-w-6xl mx-auto px-8
          relative rounded-2xl border-2 border-brown-primary
         shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] overflow-hidden"
        >
          <span className="bg-yellow-primary w-auto p-1 absolute top-0 right-0 px-4 py-1 rounded-bl-xl">
            Mas Popular
          </span>
          <h1 className="text-3xl font-bold text-black flex flex-col ">
            CoffeePass
            <span className="text-gray-600 font-mono text-sm">
              Un Cafe al dia, todos los dias
            </span>
          </h1>
          <h3 className="text-xl font-semibold text-gray-600 ">
            <span className="font-bold text-black text-6xl">$49.900</span>{" "}
            COP/mes
          </h3>
          <h3>Un cafe colombiano premium diario</h3>
          <ul className="space-y-4 mb-8">
            {[
              "Un café colombiano premium diario",
              "Cualquier tamaño, cualquier tipo",
              "Acceso a todos los dispensadores",
              "Sin filas con tu código QR",
              "Cancela cuando quieras",
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-caramel/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-caramel" />
                </div>
                <span className="text-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
