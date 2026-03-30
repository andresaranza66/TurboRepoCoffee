"use client";
import { Coffee } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="flex justify-between items-center py-2 sm:py-4 bg-brown-primary h-auto sm:h-16 relative shadow-md px-2 sm:px-8 w-full z-10"
    >
      <span className="flex items-center gap-2 text-xs sm:text-xl font-bold text-yellow-primary shrink-0">
        <Coffee size={16} className="sm:hidden" />
        <Coffee size={20} className="hidden sm:block" />
        Aroma Cafetero
      </span>

      <span className="text-[11px] sm:text-xl font-bold text-yellow-primary leading-snug text-right ml-2 truncate">
        ©{currentYear} Colombia CoffeePass. All rights reserved.
      </span>
    </footer>
  );
}

export default Footer;
