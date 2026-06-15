"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/deals", label: "Deals" },
  { href: "/forecast", label: "Forecast" },
  { href: "/alerts", label: "Alerts" },
  { href: "/trends", label: "Trends" },
  { href: "/coverage", label: "Coverage" },
];

const railIcons: { href: string; label: string; d: string }[] = [
  { href: "/dashboard", label: "Dashboard", d: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" },
  { href: "/deals", label: "Deals", d: "M3 6h18M3 12h18M3 18h12" },
  { href: "/forecast", label: "Forecast", d: "M3 17l6-6 4 4 8-8M21 7v6h-6" },
  { href: "/alerts", label: "Alerts", d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" },
  { href: "/trends", label: "Trends", d: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { href: "/coverage", label: "Coverage", d: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" },
];

function RailIcon({ href, label, d, active }: { href: string; label: string; d: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      aria-current={active ? "page" : undefined}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
        active ? "bg-navy-700 text-white shadow-sm" : "text-navy-600 hover:bg-mist-100"
      }`}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={d} />
      </svg>
      <span className="pointer-events-none absolute right-12 hidden whitespace-nowrap rounded-lg bg-navy-900 px-2.5 py-1 text-xs font-medium text-white shadow-md group-hover:block">
        {label}
      </span>
    </Link>
  );
}

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
    <div className="mx-auto min-h-screen max-w-[1440px] px-4 pb-10 sm:px-6 xl:pr-20">
      <header className="sticky top-4 z-30 mt-4 rounded-2xl border border-mist-200/70 bg-white/95 px-4 py-2.5 shadow-sm shadow-navy-900/5 backdrop-blur">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5 pr-2">
            <Image
              src="/f3i-mark-color.svg"
              alt="F3 Insights"
              width={44}
              height={32}
              priority
              className="h-8 w-auto"
            />
            <span className="hidden font-heading text-[15px] font-semibold text-navy-900 lg:block">
              Pipeline Intelligence
            </span>
          </Link>

          <nav className="flex items-center justify-center gap-1 overflow-x-auto" aria-label="Main navigation">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-[background-color,color,transform] duration-150 active:scale-[0.97] ${
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
              <span className="sync-dot h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
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
            <Link
              href="/profile"
              className="flex items-center gap-2.5 rounded-full border border-mist-200 bg-white py-1 pl-1 pr-3 transition-colors hover:bg-mist-100"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-100 font-heading text-xs font-bold text-navy-800">
                JC
              </span>
              <span className="hidden text-left leading-tight md:block">
                <span className="block text-xs font-semibold text-navy-900">James</span>
                <span className="block text-[10px] text-mist-600">Meridian Labs (Demo)</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Right-side icon shortcut rail */}
      <aside
        className="fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-1 rounded-full border border-mist-200/70 bg-white/95 p-1.5 shadow-md shadow-navy-900/10 backdrop-blur xl:flex"
        aria-label="Quick navigation"
      >
        {railIcons.map((item) => (
          <RailIcon key={item.href} {...item} active={pathname.startsWith(item.href)} />
        ))}
        <div className="my-1 h-px w-6 bg-mist-200" aria-hidden />
        <RailIcon
          href="/settings"
          label="Settings"
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          active={pathname.startsWith("/settings")}
        />
        <Link
          href="/profile"
          aria-label="Profile"
          title="Profile"
          className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            pathname.startsWith("/profile") ? "ring-2 ring-navy-600" : "hover:bg-mist-100"
          }`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-100 font-heading text-[10px] font-bold text-navy-800">
            JC
          </span>
          <span className="pointer-events-none absolute right-12 hidden whitespace-nowrap rounded-lg bg-navy-900 px-2.5 py-1 text-xs font-medium text-white shadow-md group-hover:block">
            Profile
          </span>
        </Link>
      </aside>

      <main className="pt-7">{children}</main>

      {/* Footer — styled after f3insights.com */}
      <footer className="mt-14 rounded-3xl bg-navy-900 px-8 py-10 text-white sm:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-12 items-center justify-center rounded-xl bg-white p-1.5">
                <Image src="/f3i-mark-color.svg" alt="" width={36} height={26} className="h-6 w-auto" />
              </span>
              <span className="font-heading text-lg font-semibold">F3 Insights</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
              Pipeline Intelligence is the forecasting layer of the F3 Insights platform —
              deal health scoring, multi-scenario forecasts, and slippage alerts for revenue
              leaders.
            </p>
            <p className="mt-4 text-sm text-navy-200">
              Built for <em className="text-gold-300">clarity</em>, measured by{" "}
              <em className="text-gold-300">results.</em>
            </p>
          </div>
          <div>
            <h3 className="font-data text-xs uppercase tracking-[0.2em] text-navy-300">Product</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["01", "Dashboard", "/dashboard"],
                ["02", "Forecast", "/forecast"],
                ["03", "Alerts", "/alerts"],
                ["04", "API access", "/settings"],
              ].map(([n, label, href]) => (
                <li key={label}>
                  <Link href={href} className="group inline-flex items-baseline gap-2.5 text-navy-100 transition-colors hover:text-white">
                    <span className="font-data text-[10px] text-gold-400">{n}</span>
                    <span className="group-hover:underline group-hover:underline-offset-4">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-data text-xs uppercase tracking-[0.2em] text-navy-300">Location</h3>
            <p className="mt-4 text-sm leading-relaxed text-navy-100">
              Headquartered in San Diego.
              <br />
              Serving teams nationally and internationally.
            </p>
            <a href="mailto:info@f3insights.com" className="mt-3 inline-block text-sm text-gold-300 hover:underline hover:underline-offset-4">
              info@f3insights.com
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-navy-800 pt-6">
          <span className="font-data text-[11px] uppercase tracking-[0.2em] text-navy-300">
            F3 Insights · San Diego · {new Date().getFullYear()}
          </span>
          <a
            href="https://www.f3insights.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-navy-200 transition-colors hover:text-white"
          >
            f3insights.com ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
