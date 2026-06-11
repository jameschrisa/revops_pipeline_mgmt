"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "◳" },
  { href: "/deals", label: "Deals", icon: "≣" },
  { href: "/forecast", label: "Forecast", icon: "◇" },
  { href: "/alerts", label: "Alerts", icon: "◬" },
  { href: "/trends", label: "Trends", icon: "∿" },
  { href: "/coverage", label: "Coverage", icon: "▦" },
  { href: "/settings", label: "Settings", icon: "⚙" },
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
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-56 flex-col bg-navy-900 text-white">
        <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500 font-heading text-sm font-bold text-navy-950">
            F3
          </span>
          <span className="font-heading text-sm font-semibold leading-tight">
            Pipeline
            <br />
            Intelligence
          </span>
        </Link>
        <nav className="mt-2 flex-1 space-y-0.5 px-3" aria-label="Main navigation">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-navy-700 font-medium text-white"
                    : "text-navy-200 hover:bg-navy-800 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span aria-hidden className="w-4 text-center text-gold-400">
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                {item.href === "/alerts" && alertCount > 0 ? (
                  <span className="rounded-full bg-gold-500 px-1.5 py-0.5 font-data text-[10px] font-semibold text-navy-950">
                    {alertCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-navy-800 px-5 py-4 text-xs text-navy-300">
          <div className="font-medium text-navy-200">Meridian Labs (Demo)</div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            Salesforce synced {lastSync}
          </div>
        </div>
      </aside>
      <main className="ml-56 flex-1 px-8 py-7">{children}</main>
    </div>
  );
}
