"use client";

import { useApp } from "@/app/providers";
import { useRouter } from "next/navigation";

function formatSubscribedText(subDate: number) {
  const diffMs = Date.now() - subDate;
  const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  if (totalDays <= 0) return "Just subscribed";
  if (totalDays < 30) return `${totalDays}d subscribed`;

  const months = Math.max(1, Math.floor(totalDays / 30));
  return `${months}mo subscribed`;
}

export default function UserStatsPanel() {
  const { isLoading, isAuthenticated, name, email, image, drinksCount, subDate } =
    useApp();
  const router = useRouter();

  if (!isAuthenticated) return null;

  const subscribedText =
    subDate != null
      ? formatSubscribedText(subDate)
      : "Not subscribed";

  return (
    <aside className="w-full m:w-[320px] rounded-2xl border border-white/30 bg-white/15 backdrop-blur-md shadow-lg p-4 flex flex-col">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/getCoffee")}
          className="h-20 w-20 rounded-full overflow-hidden bg-white/40 shrink-0 cursor-pointer"
          aria-label="Go to Get Coffee"
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name ?? "User"}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="h-full w-full flex items-center justify-center text-sm font-semibold text-brown-primary">
              {(name?.trim()?.[0] ?? "U").toUpperCase()}
            </span>
          )}
        </button>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">
            {isLoading ? "Loading..." : name ?? "Account"}
          </div>
          <div className="text-xs text-white/80 truncate">{email ?? ""}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 items-center">
        <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 flex flex-col">
          <div className="text-[11px] text-white/70">Subscription</div>
          <div className="text-sm font-semibold text-white">
            {isLoading ? "..." : subscribedText}
          </div>
        </div>
        <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 flex flex-col">
          <div className="text-[11px] text-white/70">Drinks</div>
          <div className="text-sm font-semibold text-white">
            {isLoading ? "..." : drinksCount}
          </div>
        </div>
      </div>
    </aside>
  );
}
