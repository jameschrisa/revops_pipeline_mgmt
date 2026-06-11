"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/deals", label: "Deals" },
  { href: "/forecast", label: "Forecast" },
  { href: "/alerts", label: "Alerts" },
  { href: "/trends", label: "Trends" },
  { href: "/coverage", label: "Coverage" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  children,
  alertCount,
  lastSync,
}: {
  children: React.ReactNode;
  alertCount: number;
  lastSync: string;
}) {
  const pathname = usePathname();
  return (
    <div className="mx-auto min-h-screen max-w-[1440px] px-4 pb-10 sm:px-6">
      <header className="sticky top-4 z-30 mt-4 rounded-2xl border border-mist-200/70 bg-white/95 px-4 py-2.5 shadow-sm shadow-navy-900/5 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5 pr-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-800 font-heading text-sm font-bold text-gold-400">
              F3
            </span>
            <span className="hidden font-heading text-[15px] font-semibold text-navy-900 lg:block">
              Pipeline Intelligence
            </span>
          </Link>

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto" aria-label="Main navigation">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                    active
                      ? "bg-navy-700 font-medium text-white shadow-sm"
                      : "text-navy-700 hover:bg-mist-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-mist-200 bg-mist-50 px-3 py-1.5 text-xs text-mist-600 xl:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              Synced {lastSync}
            </div>
            <Link
              href="/alerts"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-mist-200 bg-white text-navy-700 transition-colors hover:bg-mist-100"
              aria-label={`Alerts — ${alertCount} active`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
              {alertCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 font-data text-[9px] font-bold text-navy-950">
                  {alertCount > 99 ? "99+" : alertCount}
                </span>
              ) : null}
            </Link>
            <div className="flex items-center gap-2.5 rounded-full border border-mist-200 bg-white py-1 pl-1 pr-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-100 font-heading text-xs font-bold text-navy-800">
                JC
              </span>
              <span className="hidden text-left leading-tight md:block">
                <span className="block text-xs font-semibold text-navy-900">James</span>
                <span className="block text-[10px] text-mist-600">Meridian Labs (Demo)</span>
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="pt-7">{children}</main>
    </div>
  );
}
