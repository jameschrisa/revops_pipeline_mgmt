import Link from "next/link";
import { getStore } from "@/lib/data/store";
import {
  BEST_CASE_THRESHOLD,
  COMMIT_THRESHOLD,
  computeScenarios,
  computeSegments,
  forecastHistory,
} from "@/lib/engine/forecast";
import { CURRENT_QUARTER, NEXT_QUARTER } from "@/lib/data/generator";
import { money, moneyCompact } from "@/lib/format";
import { Delta, StatCard } from "@/components/StatCard";
import { ForecastHistoryChart, SegmentBarChart } from "@/components/charts";

export const dynamic = "force-dynamic";

const DIMENSIONS = {
  team: "Team",
  product_line: "Product line",
  region: "Region",
} as const;
type Dim = keyof typeof DIMENSIONS;

export default async function ForecastPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; dimension?: string }>;
}) {
  const sp = await searchParams;
  const period = sp.period === NEXT_QUARTER ? NEXT_QUARTER : CURRENT_QUARTER;
  const dimension: Dim = (sp.dimension as Dim) in DIMENSIONS ? (sp.dimension as Dim) : "team";

  const store = getStore();
  const scenarios = computeScenarios(store.deals, period);
  const segments = computeSegments(store.deals, period, dimension);
  const history = forecastHistory(store.deals, CURRENT_QUARTER);
  const lastWeek = history.length > 1 ? history[history.length - 2] : null;
  const wow = (now: number, prev?: number) =>
    prev ? Math.round(((now - prev) / prev) * 100) : 0;

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Forecast</h1>
          <p className="mt-1 text-sm text-mist-600">
            Three scenarios from probability-weighted pipeline. Commit = score ≥ {COMMIT_THRESHOLD}, best case = score ≥ {BEST_CASE_THRESHOLD}. Includes closed won to date.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          {[CURRENT_QUARTER, NEXT_QUARTER].map((p) => (
            <Link
              key={p}
              href={`/forecast?period=${p}&dimension=${dimension}`}
              className={`rounded-lg px-3.5 py-1.5 font-data ${period === p ? "bg-navy-800 text-white" : "bg-white ring-1 ring-mist-200 hover:bg-mist-100"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          label={`Commit · ${period}`}
          value={money(scenarios.commit)}
          sub={period === CURRENT_QUARTER && lastWeek ? <Delta value={wow(scenarios.commit, lastWeek.commit)} /> : "high-confidence deals only"}
        />
        <StatCard
          label={`Most likely · ${period}`}
          value={money(scenarios.mostLikely)}
          sub={
            <>
              {period === CURRENT_QUARTER && lastWeek ? <Delta value={wow(scenarios.mostLikely, lastWeek.mostLikely)} /> : null}{" "}
              confidence {moneyCompact(scenarios.confidenceLow)} – {moneyCompact(scenarios.confidenceHigh)}
            </>
          }
          accent
        />
        <StatCard
          label={`Best case · ${period}`}
          value={money(scenarios.bestCase)}
          sub={`${scenarios.dealCount} open deals closing in ${period} · ${moneyCompact(scenarios.closedWon)} already won`}
        />
      </div>

      {period === CURRENT_QUARTER ? (
        <section className="mt-8" aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-lg font-semibold">Forecast movement this quarter</h2>
          <p className="mt-1 text-sm text-mist-600">Weekly forecast snapshots — commit firms up as the quarter progresses.</p>
          <div className="mt-3 rounded-xl border border-mist-200 bg-white p-4">
            <ForecastHistoryChart data={history} />
          </div>
        </section>
      ) : null}

      <section className="mt-8" aria-labelledby="segment-heading">
        <div className="flex items-center justify-between">
          <h2 id="segment-heading" className="text-lg font-semibold">By {DIMENSIONS[dimension].toLowerCase()}</h2>
          <div className="flex gap-2 text-sm">
            {(Object.keys(DIMENSIONS) as Dim[]).map((d) => (
              <Link
                key={d}
                href={`/forecast?period=${period}&dimension=${d}`}
                className={`rounded-full px-3 py-1 ${dimension === d ? "bg-gold-500 text-navy-950" : "bg-white ring-1 ring-mist-200 hover:bg-mist-100"}`}
              >
                {DIMENSIONS[d]}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-mist-200 bg-white p-4">
          <SegmentBarChart data={segments} />
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-mist-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-mist-100 text-left text-xs uppercase tracking-wide text-mist-600">
              <tr>
                <th className="px-4 py-2.5 font-medium">{DIMENSIONS[dimension]}</th>
                <th className="px-4 py-2.5 font-medium">Commit</th>
                <th className="px-4 py-2.5 font-medium">Most likely</th>
                <th className="px-4 py-2.5 font-medium">Best case</th>
                <th className="px-4 py-2.5 font-medium">Confidence range</th>
                <th className="px-4 py-2.5 font-medium">Open deals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {segments.map((s) => (
                <tr key={s.name} className="hover:bg-mist-50">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 font-data">{money(s.commit)}</td>
                  <td className="px-4 py-3 font-data font-semibold text-navy-800">{money(s.mostLikely)}</td>
                  <td className="px-4 py-3 font-data">{money(s.bestCase)}</td>
                  <td className="px-4 py-3 font-data text-xs">{moneyCompact(s.confidenceLow)} – {moneyCompact(s.confidenceHigh)}</td>
                  <td className="px-4 py-3 font-data">{s.dealCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
