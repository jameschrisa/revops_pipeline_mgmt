import Link from "next/link";
import { getStore, getSyncStatus } from "@/lib/data/store";
import { money, moneyCompact } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const store = getStore();
  const sync = getSyncStatus();
  const open = store.openDeals;
  const myPipeline = open.reduce((s, d) => s + d.amount, 0);

  const fields: [string, string][] = [
    ["Full name", "James Christensen"],
    ["Email", "james@signetscience.com"],
    ["Role", "VP of Sales / CRO"],
    ["Workspace", "Meridian Labs (Demo)"],
    ["Region focus", "All regions"],
    ["Time zone", "America/Los_Angeles"],
  ];

  return (
    <div>
      <h1 className="anim-rise text-2xl font-bold" style={{ ["--i" as string]: 0 }}>
        Profile
      </h1>
      <p
        className="anim-rise mt-1 text-sm text-mist-600"
        style={{ ["--i" as string]: 1 }}
      >
        Your account and workspace details. Read-only in the demo workspace.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section
          className="anim-rise rounded-3xl border border-mist-200/70 bg-white p-6 shadow-sm shadow-navy-900/5"
          style={{ ["--i" as string]: 2 }}
          aria-labelledby="who-heading"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 font-heading text-xl font-bold text-navy-800">
              JC
            </span>
            <div>
              <h2 id="who-heading" className="text-lg font-bold">
                James Christensen
              </h2>
              <p className="text-sm text-mist-600">VP of Sales · Meridian Labs</p>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            {fields.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-mist-100 pb-3 last:border-0 last:pb-0">
                <dt className="text-mist-600">{label}</dt>
                <dd className="font-medium text-navy-900">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
          <section
            className="anim-rise rounded-3xl border border-mist-200/70 bg-white p-6 shadow-sm shadow-navy-900/5"
            style={{ ["--i" as string]: 3 }}
          >
            <h2 className="text-sm font-medium uppercase tracking-wide text-mist-600">
              Open pipeline owned
            </h2>
            <p className="mt-2 font-data text-3xl font-semibold text-navy-900">
              {moneyCompact(myPipeline)}
            </p>
            <p className="mt-1 text-xs text-mist-600">{open.length} open deals</p>
          </section>

          <section
            className="anim-rise rounded-3xl border border-mist-200/70 bg-white p-6 shadow-sm shadow-navy-900/5"
            style={{ ["--i" as string]: 4 }}
          >
            <h2 className="text-sm font-medium uppercase tracking-wide text-mist-600">
              CRM connection
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-navy-900">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              Salesforce · connected
            </p>
            <p className="mt-1 font-data text-xs text-mist-600">
              {sync.recordsSynced.toLocaleString()} records · synced every {sync.intervalMinutes}m
            </p>
          </section>

          <section
            className="anim-rise rounded-3xl border border-mist-200/70 bg-white p-6 shadow-sm shadow-navy-900/5 sm:col-span-2"
            style={{ ["--i" as string]: 5 }}
          >
            <h2 className="text-lg font-bold">Quick links</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ["Workspace settings", "/settings"],
                ["Alert preferences", "/settings"],
                ["API access", "/settings"],
                ["View my deals", "/deals"],
              ].map(([label, href], i) => (
                <Link
                  key={label + i}
                  href={href}
                  className="rounded-full border border-mist-200 bg-white px-4 py-2 text-sm text-navy-700 transition-colors hover:bg-mist-100"
                >
                  {label}
                </Link>
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-mist-50 p-4 text-xs leading-relaxed text-mist-600">
              This is a demo profile. In production, identity and workspace membership are managed
              through the F3 Insights SSO and the org&apos;s role-based access controls. Your open
              pipeline shown here totals {money(myPipeline)}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
