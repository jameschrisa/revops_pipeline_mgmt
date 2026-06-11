import Link from "next/link";
import { getAlerts, getStore } from "@/lib/data/store";
import { computeScenarios, forecastHistory } from "@/lib/engine/forecast";
import { CURRENT_QUARTER } from "@/lib/data/generator";
import { money, moneyCompact, relativeDays, shortDate } from "@/lib/format";
import { ScoreBadge } from "@/components/ScoreBadge";
import { PipelineAreaChart } from "@/components/charts";

export const dynamic = "force-dynamic";

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default function DashboardPage() {
  const store = getStore();
  const open = store.openDeals;
  const alerts = getAlerts().filter((a) => a.status === "active");
  const scenarios = computeScenarios(store.deals, CURRENT_QUARTER);
  const history = forecastHistory(store.deals, CURRENT_QUARTER);
  const lastWeek = history.length > 1 ? history[history.length - 2] : null;
  const commitWow = lastWeek
    ? Math.round(((scenarios.commit - lastWeek.commit) / lastWeek.commit) * 100)
    : 0;

  const atRisk = [...open].sort((a, b) => a.score.score - b.score.score).slice(0, 4);
  const atRiskValue = open
    .filter((d) => d.score.band === "risk")
    .reduce((s, d) => s + d.amount, 0);
  const healthyCount = open.filter((d) => d.score.band === "good").length;
  const healthyPct = Math.round((healthyCount / open.length) * 100);

  const biggest = [...open].sort((a, b) => b.amount - a.amount)[0];
  const concentration = Math.round((biggest.amount / scenarios.bestCase) * 100);

  // Forecast trend mini-bars: last 5 weekly "most likely" snapshots.
  const trendPoints = history.slice(-5);
  const maxTrend = Math.max(...trendPoints.map((p) => p.mostLikely));

  // Recent activity feed across open deals.
  const dealById = new Map(open.map((d) => [d.id, d]));
  const recentActivity = [...store.activities]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 4);

  // Owner leaderboard by open pipeline value.
  const owners = Array.from(
    open.reduce((m, d) => {
      const o = m.get(d.ownerName) ?? { name: d.ownerName, team: d.team, value: 0, count: 0 };
      o.value += d.amount;
      o.count += 1;
      return m.set(d.ownerName, o);
    }, new Map<string, { name: string; team: string; value: number; count: number }>())
    .values()
  )
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div>
      {/* Greeting header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{greeting()}, James</h1>
          <p className="mt-2 text-sm text-mist-600">
            Here&apos;s where your pipeline stands for {CURRENT_QUARTER} — {open.length} open deals,{" "}
            {alerts.length} alerts need a look.
          </p>
        </div>
        <Link
          href="/forecast"
          className="rounded-full bg-navy-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-navy-600"
        >
          View forecast →
        </Link>
      </div>

      {/* Toolbar */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-mist-200 bg-white px-3.5 py-1.5 font-data text-xs text-navy-700">
          {CURRENT_QUARTER}
        </span>
        <Link href="/deals" className="rounded-full border border-mist-200 bg-white px-3.5 py-1.5 text-xs text-navy-700 transition-colors hover:bg-mist-100">
          All deals
        </Link>
        <Link href="/deals?stage=Negotiation" className="rounded-full border border-mist-200 bg-white px-3.5 py-1.5 text-xs text-navy-700 transition-colors hover:bg-mist-100">
          Late stage
        </Link>
        <span className="ml-auto hidden text-xs text-mist-500 sm:block">
          Scores refresh with every CRM sync · model {open[0]?.score.modelVersion}
        </span>
      </div>

      {/* Bento row 1 */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Pipeline health */}
        <section className="rounded-3xl border border-mist-200/70 bg-white p-6 shadow-sm shadow-navy-900/5" aria-labelledby="health-heading">
          <h2 id="health-heading" className="text-xl font-bold">Pipeline health</h2>
          <p className="mt-2 text-sm leading-relaxed text-mist-600">
            {alerts.length} alerts across {moneyCompact(atRiskValue)} of at-risk pipeline.
          </p>
          <Link href="/alerts" className="mt-3 inline-block text-sm font-medium text-navy-600 hover:underline">
            Review alerts →
          </Link>
          <div className="mt-6">
            <div className="flex h-3.5 overflow-hidden rounded-full bg-mist-100" role="img" aria-label={`${healthyPct}% of deals healthy`}>
              <div className="rounded-full bg-navy-600" style={{ width: `${healthyPct}%` }} />
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-navy-700">
                <span className="h-2 w-2 rounded-full bg-navy-600" aria-hidden /> Healthy: {healthyCount}
              </span>
              <span className="flex items-center gap-1.5 text-mist-600">
                <span className="h-2 w-2 rounded-full bg-mist-300" aria-hidden /> Needs attention: {open.length - healthyCount}
              </span>
            </div>
          </div>
        </section>

        {/* Forecast trend mini-bars */}
        <section className="rounded-3xl border border-mist-200/70 bg-white p-6 shadow-sm shadow-navy-900/5" aria-labelledby="trend-heading">
          <h2 id="trend-heading" className="text-xl font-bold">Forecast trend</h2>
          <p className="mt-1 text-xs text-mist-600">Most likely, last 5 weeks</p>
          <div className="mt-5 flex h-36 items-end justify-between gap-2.5">
            {trendPoints.map((p, i) => {
              const isPeak = p.mostLikely === maxTrend;
              const h = Math.max(18, Math.round((p.mostLikely / maxTrend) * 100));
              return (
                <div key={p.date} className="flex flex-1 flex-col items-center gap-1.5">
                  {isPeak ? (
                    <span className="rounded-full bg-navy-800 px-2 py-0.5 font-data text-[10px] font-semibold text-white">
                      {moneyCompact(p.mostLikely)}
                    </span>
                  ) : null}
                  <div className="flex w-full flex-1 items-end rounded-2xl bg-mist-100">
                    <div
                      className={`w-full rounded-2xl ${isPeak ? "bg-gold-400" : i === trendPoints.length - 1 ? "bg-navy-600" : "bg-navy-300"}`}
                      style={{ height: `${h}%` }}
                      role="img"
                      aria-label={`${shortDate(p.date)}: ${moneyCompact(p.mostLikely)}`}
                    />
                  </div>
                  <span className="font-data text-[10px] text-mist-600">
                    {shortDate(p.date).split(",")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Insight card (solid) */}
        <section className="rounded-3xl bg-navy-700 p-6 text-white shadow-md shadow-navy-900/20" aria-labelledby="insight-heading">
          <h2 id="insight-heading" className="text-xl font-bold">Forecast insight</h2>
          <p className="mt-3 text-sm leading-relaxed text-navy-100">
            Most likely lands at <strong className="text-white">{moneyCompact(scenarios.mostLikely)}</strong> for{" "}
            {CURRENT_QUARTER}, with commit {commitWow >= 0 ? "up" : "down"}{" "}
            <strong className="text-white">{Math.abs(commitWow)}%</strong> week over week.{" "}
            {biggest.name.split(" — ")[0]} alone is {concentration}% of best case — concentration
            worth watching.
          </p>
          <Link
            href={`/deals/${biggest.id}`}
            className="mt-5 inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
          >
            Inspect largest deal →
          </Link>
        </section>

        {/* Recent activity */}
        <section className="rounded-3xl border border-mist-200/70 bg-white p-6 shadow-sm shadow-navy-900/5" aria-labelledby="activity-heading">
          <h2 id="activity-heading" className="text-xl font-bold">Recent activity</h2>
          <p className="mt-1 text-xs text-mist-600">Latest touches synced from CRM</p>
          <ol className="mt-4 space-y-0">
            {recentActivity.map((a, i) => {
              const deal = dealById.get(a.dealId);
              return (
                <li key={i} className="relative pb-4 pl-5 last:pb-0">
                  {i < recentActivity.length - 1 ? (
                    <span className="absolute left-[5px] top-3 h-full w-px bg-mist-200" aria-hidden />
                  ) : null}
                  <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-navy-500 bg-white" aria-hidden />
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-navy-900">{a.summary}</div>
                      <div className="truncate text-xs text-mist-600">
                        {deal?.accountName} · {relativeDays(a.occurredAt)}
                      </div>
                    </div>
                    <Link href={`/deals/${a.dealId}`} className="shrink-0 text-xs font-medium text-navy-600 hover:underline">
                      View
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      {/* Bento row 2 */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Deals needing attention */}
        <section className="rounded-3xl border border-mist-200/70 bg-white p-6 shadow-sm shadow-navy-900/5" aria-labelledby="atrisk-heading">
          <div className="flex items-baseline justify-between">
            <h2 id="atrisk-heading" className="text-xl font-bold">Needs attention</h2>
            <Link href="/deals" className="text-xs font-medium text-navy-600 hover:underline">All →</Link>
          </div>
          <ul className="mt-4 space-y-4">
            {atRisk.map((d) => (
              <li key={d.id} className="border-b border-mist-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/deals/${d.id}`} className="truncate text-sm font-semibold text-navy-900 hover:underline">
                    {d.accountName}
                  </Link>
                  <ScoreBadge score={d.score.score} band={d.score.band} />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-mist-600">
                  <span>{money(d.amount)} · {d.currentStage}</span>
                  <span className="font-data">closes {relativeDays(d.closeDate)}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist-100">
                  <div
                    className={`h-full rounded-full ${d.score.band === "risk" ? "bg-red-400" : d.score.band === "warn" ? "bg-amber-400" : "bg-emerald-400"}`}
                    style={{ width: `${d.score.score}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Pipeline value chart (wide) */}
        <section className="rounded-3xl border border-mist-200/70 bg-white p-6 shadow-sm shadow-navy-900/5 md:col-span-2" aria-labelledby="value-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 id="value-heading" className="text-xl font-bold">Pipeline value</h2>
              <p className="mt-1 text-xs text-mist-600">Total vs. probability-weighted, trailing 12 months</p>
            </div>
            <div className="flex gap-4 font-data text-xs">
              <span className="text-navy-700">Total {moneyCompact(open.reduce((s, d) => s + d.amount, 0))}</span>
              <span className="text-gold-600">Weighted {moneyCompact(open.reduce((s, d) => s + d.amount * (d.score.score / 100), 0))}</span>
            </div>
          </div>
          <div className="mt-4">
            <PipelineAreaChart data={store.snapshots.filter((_, i) => i % 3 === 0).map((s) => ({ date: s.date, total: s.totalPipeline, weighted: s.weightedPipeline }))} />
          </div>
        </section>

        {/* Owner leaderboard */}
        <section className="rounded-3xl border border-mist-200/70 bg-white p-6 shadow-sm shadow-navy-900/5" aria-labelledby="owners-heading">
          <h2 id="owners-heading" className="text-xl font-bold">Top pipeline owners</h2>
          <p className="mt-1 text-xs text-mist-600">By open pipeline value</p>
          <ul className="mt-4 space-y-3.5">
            {owners.map((o) => (
              <li key={o.name} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 font-heading text-xs font-bold text-navy-700">
                  {o.name.split(" ").map((w) => w[0]).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-navy-900">{o.name}</div>
                  <div className="text-xs text-mist-600">{o.team} · {o.count} deals</div>
                </div>
                <span className="font-data text-sm font-medium text-navy-800">{moneyCompact(o.value)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
