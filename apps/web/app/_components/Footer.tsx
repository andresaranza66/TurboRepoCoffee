"use client";
import { Coffee } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="flex justify-between items-center py-4
      bg-brown-primary height-16 relative shadow-md px-1 sm:px-8 w-full z-10"
    >
      <span className="flex items-center m-1 sm:m-2 text-sm sm:text-1xl font-bold text-yellow-primary ">
        <Coffee className="m-l-1 " />
        Aroma Cafetero
      </span>

      <span className="text-sm sm:text-1xl font-bold text-yellow-primary ">
        ©{currentYear} Colombia CoffeePass. All rights reserved.
      </span>
    </footer>
  );
}

export default Footer;
