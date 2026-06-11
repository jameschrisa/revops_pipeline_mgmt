import { getStore } from "@/lib/data/store";
import { computeTrends } from "@/lib/engine/trends";
import { moneyCompact } from "@/lib/format";
import { Delta } from "@/components/StatCard";
import { MonthlyBarChart, PipelineAreaChart, StageFunnelChart } from "@/components/charts";

export const dynamic = "force-dynamic";

export default function TrendsPage() {
  const store = getStore();
  const trends = computeTrends(store.deals, store.transitions, store.snapshots);

  return (
    <div>
      <h1 className="text-2xl font-bold">Pipeline trends</h1>
      <p className="mt-1 text-sm text-mist-600">
        Daily snapshots over the trailing 12 months. Quarter comparison is measured at the same point in each quarter.
      </p>

      <section className="mt-6" aria-labelledby="qoq-heading">
        <h2 id="qoq-heading" className="text-lg font-semibold">This quarter vs. last quarter (same day)</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {trends.quarterComparison.map((c) => (
            <div key={c.label} className="rounded-xl border border-mist-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-mist-600">{c.label}</div>
              <div className="mt-1 font-data text-xl font-semibold">
                {c.label.includes("count") ? c.thisQuarter : moneyCompact(c.thisQuarter)}
              </div>
              <div className="mt-1 text-xs text-mist-600">
                <Delta value={c.delta} /> vs. {c.label.includes("count") ? c.lastQuarter : moneyCompact(c.lastQuarter)} last quarter
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="value-heading">
        <h2 id="value-heading" className="text-lg font-semibold">Pipeline value over time</h2>
        <div className="mt-3 rounded-xl border border-mist-200 bg-white p-4">
          <PipelineAreaChart data={trends.pipelineValue} />
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section aria-labelledby="conv-heading">
          <h2 id="conv-heading" className="text-lg font-semibold">Stage conversion rates</h2>
          <p className="mt-1 text-sm text-mist-600">Share of deals entering each stage that advance.</p>
          <div className="mt-3 rounded-xl border border-mist-200 bg-white p-4">
            <StageFunnelChart data={trends.stageConversion} />
          </div>
        </section>
        <section aria-labelledby="created-heading">
          <h2 id="created-heading" className="text-lg font-semibold">Deals created per month</h2>
          <p className="mt-1 text-sm text-mist-600">Pipeline generation rate.</p>
          <div className="mt-3 rounded-xl border border-mist-200 bg-white p-4">
            <MonthlyBarChart data={trends.dealsCreatedPerMonth} name="Deals created" />
          </div>
        </section>
        <section aria-labelledby="winrate-heading">
          <h2 id="winrate-heading" className="text-lg font-semibold">Win rate by month</h2>
          <p className="mt-1 text-sm text-mist-600">Won / all closed, by close month.</p>
          <div className="mt-3 rounded-xl border border-mist-200 bg-white p-4">
            <MonthlyBarChart data={trends.winRatePerMonth} name="Win rate" suffix="%" color="#1e8e5a" />
          </div>
        </section>
        <section aria-labelledby="velocity-heading">
          <h2 id="velocity-heading" className="text-lg font-semibold">Deal velocity</h2>
          <p className="mt-1 text-sm text-mist-600">Average days from created to won.</p>
          <div className="mt-3 rounded-xl border border-mist-200 bg-white p-4">
            <MonthlyBarChart data={trends.velocityPerMonth} name="Days to close" color="#c9a227" suffix="d" />
          </div>
        </section>
      </div>
    </div>
  );
}
