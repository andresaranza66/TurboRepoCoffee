"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

// Make sure it is "export default function"
export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-9999">
      <div className="relative flex flex-col items-center">
        {/* Animated Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-amber-900 p-5 rounded-full text-white shadow-xl"
        >
          <Coffee size={40} />
        </motion.div>

        {/* Text */}
        <h2 className="mt-6 text-xl font-bold text-zinc-800">
          Moliendo granos...
        </h2>

        {/* Small Progress Bar */}
        <div className="mt-4 w-32 h-1 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-amber-600"
          />
        </div>
      </div>
    </div>
  );
}
