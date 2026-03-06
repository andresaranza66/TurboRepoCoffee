"use client";

import Link from "next/link";
import { Coffee } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function toTitleCase(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function AvatarCircle({
  userName,
  userImage,
}: {
  userName: string | null;
  userImage: string | null;
}) {
  const initial = (userName?.trim()?.[0] ?? "U").toUpperCase();
  return (
    <span className="h-10 w-10 sm:h-9 sm:w-9 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center shrink-0">
      {userImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={userImage}
          alt={userName ?? "User"}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="text-sm font-semibold text-brown-primary">{initial}</span>
      )}
    </span>
  );
}

function AccountTrigger({
  userName,
  userImage,
  onMouseEnter,
}: {
  userName: string | null;
  userImage: string | null;
  onMouseEnter: () => void;
}) {
  const displayName = userName ? toTitleCase(userName) : null;
  const isAuthed = !!(userImage || userName);

  return (
    <button
      onMouseEnter={onMouseEnter}
      className={
        isAuthed
          ? "bg-transparent sm:bg-amber-50 rounded-2xl px-3 py-1.5 flex items-center gap-2 max-w-[220px]"
          : "bg-transparent sm:bg-amber-50 rounded-2xl px-4 py-2 text-sm font-semibold text-brown-primary"
      }
    >
      {isAuthed ? (
        <>
          <AvatarCircle userName={displayName} userImage={userImage} />
          <span className="hidden sm:inline text-sm font-semibold text-brown-primary truncate">
            {displayName ?? "Account"}
          </span>
        </>
      ) : (
        <span>Account</span>
      )}
    </button>
  );
}

type NavLink = {
  label: string;
  href: string;
};

type HeaderProps = {
  className?: string;
  brandName?: string;
  brandHref?: string;
  navLinks?: NavLink[];
  authLinks?: NavLink[];
  showUserDropdown?: boolean; // ⭐ control rendering
  userName?: string | null;
  userImage?: string | null;
};
export default function Header({
  className = "",
  brandName = "AromaCafetero",
  brandHref = "/",
  navLinks = [],
  authLinks = [],
  showUserDropdown = false, // default off
  userName = null,
  userImage = null,
}: HeaderProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header
      className={`sticky top-0 z-50 shadow-[0_4px_6px_-4px_rgba(0,0,0,1)] bg-brown-primary ${className}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link
          href={brandHref}
          className="flex items-center gap-2 group text-2xl font-bold tracking-wide text-amber-400 transition-all duration-300 hover:text-amber-200"
        >
          <Coffee
            size={28}
            className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
          />
          <span className="relative transition-transform group-hover:translate-x-1">
            {brandName}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-yellow-secundary transition-all duration-300 group-hover:w-full" />
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-amber-100 hover:text-amber-400 hover:scale-110 transition-transform"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {showUserDropdown && (
          <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
            <AccountTrigger
              userName={userName}
              userImage={userImage}
              onMouseEnter={() => setDropdownOpen(true)}
            />

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 z-10 pt-2 w-48"
                >
                  <div
                    className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden"
                    onMouseEnter={() => setDropdownOpen(true)}
                  >
                    {authLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 hover:bg-amber-50"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
}
