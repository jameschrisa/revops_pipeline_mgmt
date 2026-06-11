import {
  Activity,
  Alert,
  AlertStatus,
  Deal,
  PipelineSnapshot,
  QuotaTarget,
  ScoredDeal,
  StageTransition,
  SyncStatus,
} from "../types";
import { generateData, TODAY } from "./generator";
import { scoreDeal } from "../engine/scoring";
import { evaluateAlerts } from "../engine/alerts";

export interface Store {
  deals: ScoredDeal[];
  openDeals: ScoredDeal[];
  transitions: StageTransition[];
  activities: Activity[];
  snapshots: PipelineSnapshot[];
  quotaTargets: QuotaTarget[];
  alerts: Alert[];
  // mutable overlay so snooze/dismiss works within a warm serverless instance
  alertStatusOverrides: Map<string, { status: AlertStatus; snoozedUntil: string | null }>;
}

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function buildStore(): Store {
  const { deals, transitions, activities, snapshots, quotaTargets } = generateData();

  // Segment medians (by product line) feed the size-vs-segment scoring factor.
  const medians = new Map<string, number>();
  for (const pl of new Set(deals.map((d) => d.productLine))) {
    medians.set(pl, median(deals.filter((d) => d.productLine === pl).map((d) => d.amount)));
  }

  const scored: ScoredDeal[] = deals.map((d) => ({
    ...d,
    score: d.isOpen
      ? scoreDeal(d, transitions, medians.get(d.productLine) ?? 30000)
      : {
          dealId: d.id,
          score: d.outcome === "won" ? 100 : 0,
          band: d.outcome === "won" ? ("good" as const) : ("risk" as const),
          factors: [],
          scoredAt: d.lastActivity,
          modelVersion: "v1.2-weighted-factor",
          history: [],
        },
  }));

  const openDeals = scored.filter((d) => d.isOpen);
  return {
    deals: scored,
    openDeals,
    transitions,
    activities,
    snapshots,
    quotaTargets,
    alerts: evaluateAlerts(openDeals),
    alertStatusOverrides: new Map(),
  };
}

// Cache on globalThis so dev HMR and warm lambdas reuse one dataset.
// Rebuilt when the calendar day changes so "today"-relative data stays fresh.
const g = globalThis as unknown as { __f3Store?: Store; __f3StoreDay?: string };

export function getStore(): Store {
  const day = TODAY.toISOString().slice(0, 10);
  if (!g.__f3Store || g.__f3StoreDay !== day) {
    g.__f3Store = buildStore();
    g.__f3StoreDay = day;
  }
  return g.__f3Store;
}

export function getAlerts(): Alert[] {
  const store = getStore();
  return store.alerts.map((a) => {
    const o = store.alertStatusOverrides.get(a.id);
    return o ? { ...a, status: o.status, snoozedUntil: o.snoozedUntil } : a;
  });
}

export function updateAlertStatus(
  id: string,
  status: AlertStatus,
  snoozedUntil: string | null = null
): Alert | null {
  const store = getStore();
  const alert = store.alerts.find((a) => a.id === id);
  if (!alert) return null;
  store.alertStatusOverrides.set(id, { status, snoozedUntil });
  return { ...alert, status, snoozedUntil };
}

export function getSyncStatus(): SyncStatus {
  const now = new Date();
  const minutes = now.getMinutes();
  const lastSyncMin = minutes - (minutes % 15);
  const last = new Date(now);
  last.setMinutes(lastSyncMin, 12, 0);
  const next = new Date(last.getTime() + 15 * 60_000);
  const store = getStore();
  return {
    crmType: "salesforce",
    connected: true,
    lastSync: last.toISOString(),
    nextSync: next.toISOString(),
    recordsSynced: store.deals.length + store.activities.length,
    errors: [],
    intervalMinutes: 15,
  };
}
