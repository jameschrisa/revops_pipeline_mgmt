import { getAlerts } from "@/lib/data/store";
import { AlertFeed } from "@/components/AlertFeed";
import { INACTIVITY_DAYS, MIN_DEAL_AMOUNT } from "@/lib/engine/alerts";

export const dynamic = "force-dynamic";

export default function AlertsPage() {
  const alerts = getAlerts();
  return (
    <div>
      <h1 className="text-2xl font-bold">Deal slippage alerts</h1>
      <p className="mt-1 text-sm text-mist-600">
        Rules: no activity for {INACTIVITY_DAYS}+ days · close date passed · 2x+ average stage duration.
        Minimum deal value ${MIN_DEAL_AMOUNT.toLocaleString()}. Same deal/trigger never re-alerts within 48h.
      </p>
      <div className="mt-5">
        <AlertFeed initialAlerts={alerts} />
      </div>
    </div>
  );
}
