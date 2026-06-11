import Link from "next/link";
import { getAlerts, getStore } from "@/lib/data/store";
import { computeScenarios } from "@/lib/engine/forecast";
import { CURRENT_QUARTER } from "@/lib/data/generator";
import { money, moneyCompact, relativeDays } from "@/lib/format";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Sparkline } from "@/components/Sparkline";
import { StatCard } from "@/components/StatCard";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const store = getStore();
  const open = store.openDeals;
  const atRisk = [...open].sort((a, b) => a.score.score - b.score.score).slice(0, 8);
  const alerts = getAlerts().filter((a) => a.status === "active");
  const scenarios = computeScenarios(store.deals, CURRENT_QUARTER);
  const totalPipeline = open.reduce((s, d) => s + d.amount, 0);
  const bands = {
    good: open.filter((d) => d.score.band === "good").length,
    warn: open.filter((d) => d.score.band === "warn").length,
    risk: open.filter((d) => d.score.band === "risk").length,
  };

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline health</h1>
          <p className="mt-1 text-sm text-mist-600">
            {open.length} open deals · {money(totalPipeline)} total pipeline · scored by model {open[0]?.score.modelVersion}
          </p>
        </div>
        <Link href="/forecast" className="rounded-lg bg-navy-800 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700">
          View forecast →
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={`Most likely · ${CURRENT_QUARTER}`} value={moneyCompact(scenarios.mostLikely)} sub={`Range ${moneyCompact(scenarios.confidenceLow)} – ${moneyCompact(scenarios.confidenceHigh)}`} accent />
        <StatCard label="Commit" value={moneyCompact(scenarios.commit)} sub={`incl. ${moneyCompact(scenarios.closedWon)} closed won`} />
        <StatCard label="Best case" value={moneyCompact(scenarios.bestCase)} sub={`${scenarios.dealCount} open deals in quarter`} />
        <StatCard
          label="Active alerts"
          value={String(alerts.length)}
          sub={<Link href="/alerts" className="text-navy-600 underline-offset-2 hover:underline">Review alert feed →</Link>}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2" aria-labelledby="at-risk-heading">
          <div className="flex items-baseline justify-between">
            <h2 id="at-risk-heading" className="text-lg font-semibold">Deals needing attention</h2>
            <Link href="/deals" className="text-sm text-navy-600 hover:underline">All deals →</Link>
          </div>
          <div className="mt-3 overflow-hidden rounded-xl border border-mist-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-mist-100 text-left text-xs uppercase tracking-wide text-mist-600">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Deal</th>
                  <th className="px-4 py-2.5 font-medium">Amount</th>
                  <th className="px-4 py-2.5 font-medium">Stage</th>
                  <th className="px-4 py-2.5 font-medium">Close</th>
                  <th className="px-4 py-2.5 font-medium">Score</th>
                  <th className="px-4 py-2.5 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {atRisk.map((d) => (
                  <tr key={d.id} className="hover:bg-mist-50">
                    <td className="px-4 py-3">
                      <Link href={`/deals/${d.id}`} className="font-medium text-navy-800 hover:underline">
                        {d.name}
                      </Link>
                      <div className="text-xs text-mist-600">{d.ownerName} · {d.team}</div>
                    </td>
                    <td className="px-4 py-3 font-data">{money(d.amount)}</td>
                    <td className="px-4 py-3">{d.currentStage}</td>
                    <td className="px-4 py-3 font-data text-xs">{relativeDays(d.closeDate)}</td>
                    <td className="px-4 py-3"><ScoreBadge score={d.score.score} band={d.score.band} /></td>
                    <td className="px-4 py-3"><Sparkline points={d.score.history.map((h) => h.score)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-lg font-semibold">Health distribution</h2>
          <div className="mt-3 rounded-xl border border-mist-200 bg-white p-5">
            <div className="flex h-3 overflow-hidden rounded-full" role="img" aria-label={`${bands.good} healthy, ${bands.warn} drifting, ${bands.risk} at risk`}>
              <div className="bg-emerald-500" style={{ width: `${(bands.good / open.length) * 100}%` }} />
              <div className="bg-amber-500" style={{ width: `${(bands.warn / open.length) * 100}%` }} />
              <div className="bg-red-500" style={{ width: `${(bands.risk / open.length) * 100}%` }} />
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              {[
                ["Healthy (70–100)", bands.good, "bg-emerald-500"],
                ["Drifting (40–69)", bands.warn, "bg-amber-500"],
                ["At risk (0–39)", bands.risk, "bg-red-500"],
              ].map(([label, count, dot]) => (
                <div key={label as string} className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-mist-600">
                    <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden /> {label}
                  </dt>
                  <dd className="font-data font-medium">{count}</dd>
                </div>
              ))}
            </dl>
          </div>

          <h2 className="mt-6 text-lg font-semibold">Latest alerts</h2>
          <div className="mt-3 space-y-2">
            {alerts.slice(0, 4).map((a) => (
              <Link
                key={a.id}
                href={`/deals/${a.dealId}`}
                className="block rounded-xl border border-mist-200 bg-white p-3.5 hover:border-navy-300"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 font-data text-[10px] font-semibold uppercase ${
                      a.severity === "high"
                        ? "bg-red-100 text-red-700"
                        : a.severity === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-mist-100 text-mist-600"
                    }`}
                  >
                    {a.severity}
                  </span>
                  <span className="truncate text-sm font-medium text-navy-800">{a.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
