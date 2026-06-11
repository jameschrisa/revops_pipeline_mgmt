import Link from "next/link";
import { getStore } from "@/lib/data/store";
import { money, relativeDays } from "@/lib/format";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Sparkline } from "@/components/Sparkline";

export const dynamic = "force-dynamic";

const SORTS = {
  score: { label: "Score (riskiest first)" },
  amount: { label: "Amount (largest first)" },
  close: { label: "Close date (soonest first)" },
} as const;
type SortKey = keyof typeof SORTS;

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; stage?: string }>;
}) {
  const { sort: sortParam, stage: stageParam } = await searchParams;
  const sort: SortKey = (sortParam as SortKey) in SORTS ? (sortParam as SortKey) : "score";
  const store = getStore();
  let deals = [...store.openDeals];
  const stages = ["Lead", "Qualified", "Proposal", "Negotiation"];
  if (stageParam && stages.includes(stageParam)) {
    deals = deals.filter((d) => d.currentStage === stageParam);
  }
  deals.sort((a, b) =>
    sort === "amount"
      ? b.amount - a.amount
      : sort === "close"
        ? a.closeDate.localeCompare(b.closeDate)
        : a.score.score - b.score.score
  );

  const linkFor = (params: Record<string, string | undefined>) => {
    const merged = { sort: sortParam, stage: stageParam, ...params };
    const qs = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join("&");
    return `/deals${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Open deals</h1>
      <p className="mt-1 text-sm text-mist-600">
        {deals.length} deals · {money(deals.reduce((s, d) => s + d.amount, 0))}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-mist-600">Stage:</span>
        <Link href={linkFor({ stage: undefined })} className={`rounded-full px-3 py-1 ${!stageParam ? "bg-navy-800 text-white" : "bg-white ring-1 ring-mist-200 hover:bg-mist-100"}`}>
          All
        </Link>
        {stages.map((s) => (
          <Link key={s} href={linkFor({ stage: s })} className={`rounded-full px-3 py-1 ${stageParam === s ? "bg-navy-800 text-white" : "bg-white ring-1 ring-mist-200 hover:bg-mist-100"}`}>
            {s}
          </Link>
        ))}
        <span className="ml-4 text-mist-600">Sort:</span>
        {(Object.keys(SORTS) as SortKey[]).map((k) => (
          <Link key={k} href={linkFor({ sort: k })} className={`rounded-full px-3 py-1 ${sort === k ? "bg-gold-500 text-navy-950" : "bg-white ring-1 ring-mist-200 hover:bg-mist-100"}`}>
            {SORTS[k].label}
          </Link>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-mist-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-mist-100 text-left text-xs uppercase tracking-wide text-mist-600">
            <tr>
              <th className="px-4 py-2.5 font-medium">Deal</th>
              <th className="px-4 py-2.5 font-medium">Owner</th>
              <th className="px-4 py-2.5 font-medium">Product</th>
              <th className="px-4 py-2.5 font-medium">Amount</th>
              <th className="px-4 py-2.5 font-medium">Stage</th>
              <th className="px-4 py-2.5 font-medium">Close</th>
              <th className="px-4 py-2.5 font-medium">Last activity</th>
              <th className="px-4 py-2.5 font-medium">Score</th>
              <th className="px-4 py-2.5 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {deals.map((d) => (
              <tr key={d.id} className="hover:bg-mist-50">
                <td className="max-w-64 px-4 py-3">
                  <Link href={`/deals/${d.id}`} className="font-medium text-navy-800 hover:underline">
                    {d.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-mist-600">{d.ownerName}</td>
                <td className="px-4 py-3 text-mist-600">{d.productLine}</td>
                <td className="px-4 py-3 font-data">{money(d.amount)}</td>
                <td className="px-4 py-3">{d.currentStage}</td>
                <td className="px-4 py-3 font-data text-xs">{relativeDays(d.closeDate)}</td>
                <td className="px-4 py-3 font-data text-xs">{relativeDays(d.lastActivity)}</td>
                <td className="px-4 py-3"><ScoreBadge score={d.score.score} band={d.score.band} /></td>
                <td className="px-4 py-3"><Sparkline points={d.score.history.map((h) => h.score)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
