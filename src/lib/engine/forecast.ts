import {
  ForecastHistoryPoint,
  ForecastScenarios,
  ForecastSegment,
  ScoredDeal,
} from "../types";
import {
  CURRENT_QUARTER,
  DAY_MS,
  TODAY,
  iso,
  quarterRange,
} from "../data/generator";

// Org-configurable thresholds (SS18 defaults).
export const COMMIT_THRESHOLD = 70;
export const BEST_CASE_THRESHOLD = 30;

function inPeriod(dateIso: string, period: string): boolean {
  const { start, end } = quarterRange(period);
  const d = new Date(dateIso);
  return d >= start && d <= end;
}

// Confidence interval widens with the fraction of the quarter remaining.
function confidenceSpread(period: string): number {
  const { start, end } = quarterRange(period);
  if (TODAY < start) return 0.22; // future quarter
  const total = end.getTime() - start.getTime();
  const remaining = Math.max(0, end.getTime() - TODAY.getTime());
  return 0.05 + 0.15 * (remaining / total);
}

export function computeScenarios(deals: ScoredDeal[], period: string): ForecastScenarios {
  const inQuarter = deals.filter((d) => inPeriod(d.closeDate, period));
  const open = inQuarter.filter((d) => d.isOpen);
  const closedWon = inQuarter
    .filter((d) => d.outcome === "won")
    .reduce((s, d) => s + d.amount, 0);

  const commit = open
    .filter((d) => d.score.score >= COMMIT_THRESHOLD)
    .reduce((s, d) => s + d.amount, 0);
  const bestCase = open
    .filter((d) => d.score.score >= BEST_CASE_THRESHOLD)
    .reduce((s, d) => s + d.amount, 0);
  // Probability-weighted sum, lightly calibrated against historical close rates.
  const mostLikely = open.reduce((s, d) => s + d.amount * Math.min(0.95, (d.score.score / 100) * 0.92), 0);

  const spread = confidenceSpread(period);
  return {
    bestCase: Math.round(bestCase + closedWon),
    commit: Math.round(commit + closedWon),
    mostLikely: Math.round(mostLikely + closedWon),
    confidenceLow: Math.round((mostLikely + closedWon) * (1 - spread)),
    confidenceHigh: Math.round((mostLikely + closedWon) * (1 + spread)),
    closedWon: Math.round(closedWon),
    dealCount: open.length,
  };
}

export function computeSegments(
  deals: ScoredDeal[],
  period: string,
  dimension: "team" | "product_line" | "region"
): ForecastSegment[] {
  const key = (d: ScoredDeal) =>
    dimension === "team" ? d.team : dimension === "product_line" ? d.productLine : d.region;
  const names = Array.from(new Set(deals.map(key))).sort();
  return names.map((name) => ({
    name,
    ...computeScenarios(deals.filter((d) => key(d) === name), period),
  }));
}

// Weekly forecast history for the current quarter: a deterministic series
// converging on today's computed scenarios (stands in for stored snapshots).
export function forecastHistory(deals: ScoredDeal[], period = CURRENT_QUARTER): ForecastHistoryPoint[] {
  const now = computeScenarios(deals, period);
  const { start } = quarterRange(period);
  const points: ForecastHistoryPoint[] = [];
  const weeks = Math.max(1, Math.floor((TODAY.getTime() - start.getTime()) / (7 * DAY_MS)));
  let h = 11;
  for (let w = weeks; w >= 0; w--) {
    h = (h * 29 + 13) % 17;
    const t = 1 - w / Math.max(weeks, 1);
    const wobble = (h - 8) / 100;
    // Early-quarter forecasts run optimistic on best case, light on commit.
    points.push({
      date: iso(new Date(TODAY.getTime() - w * 7 * DAY_MS)),
      bestCase: Math.round(now.bestCase * (1.08 - 0.08 * t + wobble)),
      commit: Math.round(now.commit * (0.72 + 0.28 * t + wobble)),
      mostLikely: Math.round(now.mostLikely * (0.86 + 0.14 * t + wobble)),
    });
  }
  const last = points[points.length - 1];
  last.bestCase = now.bestCase;
  last.commit = now.commit;
  last.mostLikely = now.mostLikely;
  return points;
}
