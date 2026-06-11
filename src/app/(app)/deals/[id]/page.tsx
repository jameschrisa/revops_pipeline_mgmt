import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlerts, getStore } from "@/lib/data/store";
import { money, relativeDays, shortDate } from "@/lib/format";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Sparkline } from "@/components/Sparkline";

export const dynamic = "force-dynamic";

const activityIcons: Record<string, string> = {
  email: "✉",
  call: "☎",
  meeting: "▣",
  note: "✎",
  stage_change: "→",
};

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = getStore();
  const deal = store.deals.find((d) => d.id === id);
  if (!deal) notFound();

  const transitions = store.transitions
    .filter((t) => t.dealId === id)
    .sort((a, b) => a.transitionedAt.localeCompare(b.transitionedAt));
  const activities = store.activities
    .filter((a) => a.dealId === id)
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const dealAlerts = getAlerts().filter((a) => a.dealId === id && a.status === "active");

  return (
    <div>
      <Link href="/deals" className="text-sm text-navy-600 hover:underline">← All deals</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{deal.name}</h1>
          <p className="mt-1 text-sm text-mist-600">
            {deal.ownerName} ({deal.ownerEmail}) · {deal.team} · {deal.productLine} · {deal.region}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {deal.isOpen ? (
            <ScoreBadge score={deal.score.score} band={deal.score.band} size="lg" />
          ) : (
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${deal.outcome === "won" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              Closed {deal.outcome}
            </span>
          )}
          <a
            href={`https://demo.salesforce.invalid/lightning/r/Opportunity/${deal.crmDealId}/view`}
            className="rounded-full border border-mist-300 px-3.5 py-1.5 text-sm text-navy-700 hover:border-navy-400"
            target="_blank"
            rel="noreferrer"
          >
            View in CRM ↗
          </a>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          ["Amount", money(deal.amount)],
          ["Stage", deal.currentStage],
          ["Close date", `${shortDate(deal.closeDate)} (${relativeDays(deal.closeDate)})`],
          ["Created", shortDate(deal.createdDate)],
          ["Last activity", relativeDays(deal.lastActivity)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-mist-200 bg-white p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-mist-600">{label}</div>
            <div className="mt-1 font-data text-sm font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {dealAlerts.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <h2 className="font-heading text-sm font-semibold text-red-800">Active alerts</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-red-700">
            {dealAlerts.map((a) => (
              <li key={a.id}>• {a.detail}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {deal.isOpen ? (
          <section aria-labelledby="factors-heading">
            <div className="flex items-center justify-between">
              <h2 id="factors-heading" className="text-lg font-semibold">Score factors</h2>
              <div className="flex items-center gap-2 text-xs text-mist-600">
                8-week trend <Sparkline points={deal.score.history.map((h) => h.score)} width={120} height={32} />
              </div>
            </div>
            <div className="mt-3 space-y-2.5">
              {deal.score.factors.map((f) => (
                <div key={f.name} className="rounded-2xl border border-mist-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{f.name}</span>
                    <span className={`font-data text-sm font-semibold ${f.impact > 0 ? "text-emerald-600" : f.impact < 0 ? "text-red-600" : "text-mist-500"}`}>
                      {f.impact > 0 ? "+" : ""}{f.impact}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-navy-700">{f.description}</p>
                  <p className="mt-1 font-data text-xs text-mist-600">
                    {f.value} · benchmark: {f.benchmark}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-lg font-semibold">Outcome</h2>
            <div className="mt-3 rounded-2xl border border-mist-200 bg-white p-4 text-sm text-navy-700">
              This deal closed as <strong>{deal.outcome}</strong> on {shortDate(deal.closeDate)}. Closed deals
              feed the historical benchmarks used to score open pipeline.
            </div>
          </section>
        )}

        <section aria-labelledby="timeline-heading">
          <h2 id="timeline-heading" className="text-lg font-semibold">Timeline</h2>
          <div className="mt-3 rounded-2xl border border-mist-200 bg-white p-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-mist-600">Stage history</h3>
            <ol className="mt-2 space-y-1.5 text-sm">
              {transitions.map((t, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>
                    {t.fromStage ? `${t.fromStage} → ` : "Created in "}
                    <strong>{t.toStage}</strong>
                  </span>
                  <span className="font-data text-xs text-mist-600">{shortDate(t.transitionedAt)}</span>
                </li>
              ))}
            </ol>
            {activities.length > 0 ? (
              <>
                <h3 className="mt-5 text-xs font-medium uppercase tracking-wide text-mist-600">Recent activity</h3>
                <ol className="mt-2 space-y-1.5 text-sm">
                  {activities.slice(0, 10).map((a, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span aria-hidden className="text-mist-500">{activityIcons[a.activityType]}</span>
                        {a.summary}
                        <span className="text-xs text-mist-500">({a.activityType})</span>
                      </span>
                      <span className="font-data text-xs text-mist-600">{shortDate(a.occurredAt)}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
