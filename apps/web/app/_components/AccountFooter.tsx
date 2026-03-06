import Link from "next/link";

const AccountFooter = () => {
  return (
    <footer className="bg-white shadow-inner flex flex-col md:flex-row items-start md:items-center justify-between  gap-4 font-display px-4 py-8 mb-8 mt-8 rounded-2xl">
      <div className="text-left md:text-left ">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} CoffeeName. Your subscription renew
          each month, automatically
        </p>
      </div>
      <div className="flex flex-row gap-6 text-2xl font-medium ">
        <Link
          href={"/"}
          className="relative inline-block px-4 py-2 rounded-lg font-medium overflow-hidden 
                bg-linear-to-r from-gray-100 from-50% to-amber-500 to-50% 
                bg-size-[200%_100%] bg-position-[0%_0%] 
                hover:bg-position-[100%_0%] transition-all duration-500 ease-out hover:text-white border border-brand-brown-tertiary"
        >
          <span className="">Manage Subscription</span>
        </Link>
        <Link
          href={"/"}
          className="bg-gray-300 px-4 py-2 rounded-lg border border-brown-secondary "
        >
          History
        </Link>
      </div>
    </footer>
  );
};

export default AccountFooter;
