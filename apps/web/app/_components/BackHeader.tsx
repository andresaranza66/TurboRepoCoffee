import { ArrowLeft, CoffeeIcon } from "lucide-react";
import Link from "next/link";

const BackHeader = () => {
  return (
    <header className="bg-brown-primary flex justify-between items-center p-4 ">
      <Link
        href="/"
        className="flex items-center gap-2 text-amber-100 hover:text-amber-300 transition"
      >
        <ArrowLeft className=" h-5 w-5" />
        Go back
      </Link>

      <h1 className="flex items-center text-amber-200 font-semibold">
        <CoffeeIcon className="mr-2 inline-block h-5 w-5" />
        AromaCafetero
      </h1>
    </header>
  );
};
export default BackHeader;
