"use client";

import { useApp } from "@/app/providers";

function formatElapsed(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function UserStatsPanel() {
  const { isLoading, isAuthenticated, name, email, image, drinksCount, subDate } =
    useApp();

  if (!isAuthenticated) return null;

  const subscribedText =
    subDate != null
      ? formatElapsed(Date.now() - subDate) + " subscribed"
      : "Not subscribed";

  return (
    <aside className="w-full m:w-[320px] rounded-2xl border border-white/30 bg-white/15 backdrop-blur-md shadow-lg p-4 flex flex-col">
      <div className="flex items-center gap-3">
        <span className="h-20 w-20 rounded-full overflow-hidden bg-white/40 shrink-0">
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
        </span>

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
