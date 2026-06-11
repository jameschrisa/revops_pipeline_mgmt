import { getStore, getSyncStatus } from "@/lib/data/store";
import { INACTIVITY_DAYS, MIN_DEAL_AMOUNT } from "@/lib/engine/alerts";
import { BEST_CASE_THRESHOLD, COMMIT_THRESHOLD } from "@/lib/engine/forecast";
import { TARGET_COVERAGE_RATIO } from "@/lib/engine/coverage";
import { STAGE_BENCHMARK_DAYS } from "@/lib/data/generator";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const sync = getSyncStatus();
  const store = getStore();

  const stageMapping = [
    ["Prospecting", "Lead"],
    ["Discovery / Qualification", "Qualified"],
    ["Proposal / Price Quote", "Proposal"],
    ["Negotiation / Review", "Negotiation"],
    ["Closed Won", "Closed Won"],
    ["Closed Lost", "Closed Lost"],
  ];

  const config: [string, string, string][] = [
    ["alert.inactivity_days", String(INACTIVITY_DAYS), "Days of no activity before an alert fires"],
    ["alert.min_deal_amount", `$${MIN_DEAL_AMOUNT.toLocaleString()}`, "Minimum deal value to trigger alerts"],
    ["alert.channels", "in_app", "Slack and email available after workspace upgrade"],
    ["forecast.commit_threshold", String(COMMIT_THRESHOLD), "Minimum health score for the commit scenario"],
    ["forecast.best_case_threshold", String(BEST_CASE_THRESHOLD), "Minimum health score for the best-case scenario"],
    ["forecast.dimensions", "team, product_line, region", "Available forecast segmentation dimensions"],
    ["coverage.target_ratio", `${TARGET_COVERAGE_RATIO.toFixed(1)}x`, "Coverage ratio threshold for gap highlighting"],
    ["sync.historical_months", "24", "Months of CRM history imported"],
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-mist-600">Workspace: Meridian Labs (Demo) · settings are read-only in the demo workspace.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section aria-labelledby="sync-heading">
          <h2 id="sync-heading" className="text-lg font-semibold">CRM connection</h2>
          <div className="mt-3 rounded-xl border border-mist-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 font-heading text-xs font-bold text-navy-700">SF</span>
                <div>
                  <div className="font-medium">Salesforce</div>
                  <div className="flex items-center gap-1.5 text-xs text-mist-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden /> Connected · read-only
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                Healthy
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs uppercase tracking-wide text-mist-600">Last sync</dt><dd className="mt-0.5 font-data">{new Date(sync.lastSync).toLocaleTimeString()}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-mist-600">Next sync</dt><dd className="mt-0.5 font-data">{new Date(sync.nextSync).toLocaleTimeString()}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-mist-600">Records synced</dt><dd className="mt-0.5 font-data">{sync.recordsSynced.toLocaleString()}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-mist-600">Sync interval</dt><dd className="mt-0.5 font-data">{sync.intervalMinutes} minutes</dd></div>
            </dl>
            <p className="mt-4 text-xs text-mist-600">
              Demo workspace uses a synthetic dataset ({store.deals.length.toLocaleString()} deals, {store.activities.length.toLocaleString()} activities).
              In production this panel manages the Salesforce/HubSpot OAuth connection.
            </p>
          </div>

          <h2 className="mt-6 text-lg font-semibold">Stage mapping</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-mist-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-mist-100 text-left text-xs uppercase tracking-wide text-mist-600">
                <tr>
                  <th className="px-4 py-2.5 font-medium">CRM stage</th>
                  <th className="px-4 py-2.5 font-medium">Standard stage</th>
                  <th className="px-4 py-2.5 font-medium">Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {stageMapping.map(([crm, std]) => (
                  <tr key={crm}>
                    <td className="px-4 py-2.5 font-data text-xs">{crm}</td>
                    <td className="px-4 py-2.5">{std}</td>
                    <td className="px-4 py-2.5 font-data text-xs text-mist-600">
                      {STAGE_BENCHMARK_DAYS[std] ? `${STAGE_BENCHMARK_DAYS[std]} days median` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="config-heading">
          <h2 id="config-heading" className="text-lg font-semibold">Workspace configuration</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-mist-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-mist-100 text-left text-xs uppercase tracking-wide text-mist-600">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Setting</th>
                  <th className="px-4 py-2.5 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {config.map(([key, value, desc]) => (
                  <tr key={key}>
                    <td className="px-4 py-2.5">
                      <div className="font-data text-xs">{key}</div>
                      <div className="mt-0.5 text-xs text-mist-600">{desc}</div>
                    </td>
                    <td className="px-4 py-2.5 font-data text-xs font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-6 text-lg font-semibold">API access</h2>
          <div className="mt-3 rounded-xl border border-mist-200 bg-white p-5 text-sm">
            <p className="text-navy-700">
              REST API at <code className="rounded bg-mist-100 px-1.5 py-0.5 font-data text-xs">/api/v1</code> with bearer-token auth.
            </p>
            <div className="mt-3 rounded-lg bg-navy-950 p-3.5 font-data text-xs leading-relaxed text-navy-100">
              <div className="text-mist-500"># Demo API key (demo workspace only)</div>
              <div>curl -H &quot;Authorization: Bearer rok_demo_meridian&quot; \</div>
              <div className="pl-4">{`https://<host>/api/v1/forecast?period=${new Date().getFullYear()}`}</div>
            </div>
            <ul className="mt-3 space-y-1 font-data text-xs text-mist-600">
              <li>GET /api/v1/deals · /deals/:id · /forecast · /forecast/history</li>
              <li>GET /api/v1/alerts · PATCH /alerts/:id · /pipeline/trends · /pipeline/coverage</li>
              <li>GET /api/v1/sync/status · POST /api/v1/sync/trigger · GET /api/health</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
