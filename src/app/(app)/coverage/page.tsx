import Link from "next/link";
import { getStore } from "@/lib/data/store";
import { computeCoverage, TARGET_COVERAGE_RATIO } from "@/lib/engine/coverage";
import { CURRENT_QUARTER, NEXT_QUARTER } from "@/lib/data/generator";
import { money, moneyCompact } from "@/lib/format";

export const dynamic = "force-dynamic";

function ratioStyles(ratio: number): string {
  if (ratio >= TARGET_COVERAGE_RATIO) return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  if (ratio >= 2) return "bg-amber-50 text-amber-700 ring-amber-600/20";
  return "bg-red-50 text-red-700 ring-red-600/20";
}

export default async function CoveragePage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; dimension?: string }>;
}) {
  const sp = await searchParams;
  const period = sp.period === NEXT_QUARTER ? NEXT_QUARTER : CURRENT_QUARTER;
  const dimension = sp.dimension === "product_line" ? "product_line" : "team";

  const store = getStore();
  const segments = computeCoverage(store.openDeals, store.quotaTargets, period, dimension);
  const below = segments.filter((s) => s.coverageRatio < TARGET_COVERAGE_RATIO);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline coverage</h1>
          <p className="mt-1 text-sm text-mist-600">
            Probability-weighted pipeline vs. quota. Target ratio: {TARGET_COVERAGE_RATIO.toFixed(1)}x.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          {[CURRENT_QUARTER, NEXT_QUARTER].map((p) => (
            <Link
              key={p}
              href={`/coverage?period=${p}&dimension=${dimension}`}
              className={`rounded-lg px-3.5 py-1.5 font-data ${period === p ? "bg-navy-800 text-white" : "bg-white ring-1 ring-mist-200 hover:bg-mist-100"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      </div>

      {below.length > 0 ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>{below.length} segment{below.length > 1 ? "s" : ""} below {TARGET_COVERAGE_RATIO.toFixed(1)}x coverage.</strong>{" "}
          Largest gap: {below[0].name} needs {moneyCompact(below[0].gap)} more weighted pipeline to reach target.
        </div>
      ) : null}

      <div className="mt-5 flex gap-2 text-sm">
        {(["team", "product_line"] as const).map((d) => (
          <Link
            key={d}
            href={`/coverage?period=${period}&dimension=${d}`}
            className={`rounded-full px-3 py-1 ${dimension === d ? "bg-gold-500 text-navy-950" : "bg-white ring-1 ring-mist-200 hover:bg-mist-100"}`}
          >
            {d === "team" ? "By team" : "By product line"}
          </Link>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {segments.map((s) => (
          <div key={s.name} className="rounded-xl border border-mist-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold">{s.name}</h2>
              <span className={`rounded-full px-2.5 py-1 font-data text-sm font-semibold ring-1 ring-inset ${ratioStyles(s.coverageRatio)}`}>
                {s.coverageRatio.toFixed(1)}x
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-mist-100" role="img" aria-label={`Coverage ${s.coverageRatio.toFixed(1)}x of ${TARGET_COVERAGE_RATIO}x target`}>
              <div
                className={`h-full ${s.coverageRatio >= TARGET_COVERAGE_RATIO ? "bg-emerald-500" : s.coverageRatio >= 2 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(100, (s.coverageRatio / (TARGET_COVERAGE_RATIO + 1)) * 100)}%` }}
              />
            </div>
            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-mist-600">Quota</dt><dd className="font-data">{money(s.quota)}</dd></div>
              <div className="flex justify-between"><dt className="text-mist-600">Weighted pipeline</dt><dd className="font-data">{money(s.weightedPipeline)}</dd></div>
              <div className="flex justify-between"><dt className="text-mist-600">Raw pipeline</dt><dd className="font-data">{money(s.rawPipeline)}</dd></div>
              <div className="flex justify-between"><dt className="text-mist-600">Open deals</dt><dd className="font-data">{s.dealCount}</dd></div>
              {s.gap > 0 ? (
                <div className="flex justify-between text-red-700"><dt>Gap to {TARGET_COVERAGE_RATIO.toFixed(1)}x</dt><dd className="font-data font-medium">{money(s.gap)}</dd></div>
              ) : null}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
