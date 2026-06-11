import { Alert, ScoredDeal } from "../types";
import { DAY_MS, STAGE_BENCHMARK_DAYS, TODAY } from "../data/generator";

// Org alert config defaults (SS18).
export const INACTIVITY_DAYS = 7;
export const MIN_DEAL_AMOUNT = 10_000;

const fmtMoney = (n: number) => `$${n.toLocaleString()}`;
const daysBetween = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / DAY_MS);

function severityFor(amount: number): Alert["severity"] {
  return amount >= 100_000 ? "high" : amount >= 50_000 ? "medium" : "low";
}

// Rule engine (F-03): inactivity, slippage (close date passed), stage duration.
export function evaluateAlerts(deals: ScoredDeal[]): Alert[] {
  const alerts: Alert[] = [];
  for (const d of deals) {
    if (!d.isOpen || d.amount < MIN_DEAL_AMOUNT) continue;

    const inactiveDays = daysBetween(TODAY, new Date(d.lastActivity.slice(0, 10)));
    const daysPastClose = daysBetween(TODAY, new Date(d.closeDate));
    const daysInStage = daysBetween(TODAY, new Date(d.stageEnteredAt));
    const benchmark = STAGE_BENCHMARK_DAYS[d.currentStage] ?? 12;

    if (inactiveDays > INACTIVITY_DAYS) {
      alerts.push({
        id: `alrt_${d.id}_inactivity`,
        dealId: d.id,
        alertType: "inactivity",
        severity: severityFor(d.amount),
        title: `No activity for ${inactiveDays} days — ${d.name}`,
        detail: `${fmtMoney(d.amount)} deal owned by ${d.ownerName} has had no emails, calls, or meetings in ${inactiveDays} days (threshold: ${INACTIVITY_DAYS}). Health score: ${d.score.score}.`,
        status: "active",
        snoozedUntil: null,
        createdAt: new Date(TODAY.getTime() - Math.min(inactiveDays - INACTIVITY_DAYS, 3) * DAY_MS + 9 * 3600_000).toISOString(),
      });
    }

    if (daysPastClose > 0) {
      alerts.push({
        id: `alrt_${d.id}_slippage`,
        dealId: d.id,
        alertType: "slippage",
        severity: severityFor(d.amount),
        title: `Close date slipped ${daysPastClose} days — ${d.name}`,
        detail: `${fmtMoney(d.amount)} deal was due to close on ${d.closeDate} and is still in ${d.currentStage}. Owner: ${d.ownerName}.`,
        status: "active",
        snoozedUntil: null,
        createdAt: new Date(TODAY.getTime() - Math.min(daysPastClose, 5) * DAY_MS + 8 * 3600_000).toISOString(),
      });
    }

    if (daysInStage > benchmark * 2) {
      alerts.push({
        id: `alrt_${d.id}_stage`,
        dealId: d.id,
        alertType: "stage_duration",
        severity: severityFor(d.amount),
        title: `${Math.round(daysInStage / benchmark)}x average time in ${d.currentStage} — ${d.name}`,
        detail: `${fmtMoney(d.amount)} deal has spent ${daysInStage} days in ${d.currentStage}; the historical average is ${benchmark} days. Owner: ${d.ownerName}.`,
        status: "active",
        snoozedUntil: null,
        createdAt: new Date(TODAY.getTime() - 1 * DAY_MS + 10 * 3600_000).toISOString(),
      });
    }
  }

  const sevRank = { high: 0, medium: 1, low: 2 };
  return alerts.sort(
    (a, b) => sevRank[a.severity] - sevRank[b.severity] || a.title.localeCompare(b.title)
  );
}
