import { Deal, PipelineSnapshot, StageTransition } from "../types";
import { DAY_MS, OPEN_STAGES_ORDER, TODAY } from "./trend-helpers";

export interface MonthlyMetric {
  month: string; // "2026-03"
  value: number;
}

export interface StageConversion {
  stage: string;
  entered: number;
  advanced: number;
  rate: number; // 0-1
}

export interface TrendBundle {
  pipelineValue: { date: string; total: number; weighted: number }[];
  dealsCreatedPerMonth: MonthlyMetric[];
  winRatePerMonth: MonthlyMetric[];
  velocityPerMonth: MonthlyMetric[]; // avg days created->won
  stageConversion: StageConversion[];
  quarterComparison: {
    label: string;
    thisQuarter: number;
    lastQuarter: number;
    delta: number;
  }[];
}

const monthKey = (d: Date) => d.toISOString().slice(0, 7);

export function computeTrends(
  deals: Deal[],
  transitions: StageTransition[],
  snapshots: PipelineSnapshot[]
): TrendBundle {
  const closed = deals.filter((d) => !d.isOpen);

  // Monthly buckets for the trailing 12 months.
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    months.push(monthKey(new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1)));
  }

  const createdPerMonth = months.map((m) => ({
    month: m,
    value: deals.filter((d) => d.createdDate.slice(0, 7) === m).length,
  }));

  const winRatePerMonth = months.map((m) => {
    const inMonth = closed.filter((d) => d.closeDate.slice(0, 7) === m);
    const won = inMonth.filter((d) => d.outcome === "won").length;
    return { month: m, value: inMonth.length ? Math.round((won / inMonth.length) * 100) : 0 };
  });

  const velocityPerMonth = months.map((m) => {
    const won = closed.filter((d) => d.outcome === "won" && d.closeDate.slice(0, 7) === m);
    const avg = won.length
      ? won.reduce(
          (s, d) => s + (new Date(d.closeDate).getTime() - new Date(d.createdDate).getTime()) / DAY_MS,
          0
        ) / won.length
      : 0;
    return { month: m, value: Math.round(avg) };
  });

  // Stage-to-stage conversion from transition history.
  const stageConversion: StageConversion[] = OPEN_STAGES_ORDER.map((stage, i) => {
    const entered = transitions.filter((t) => t.toStage === stage).length;
    const nextStages = [...OPEN_STAGES_ORDER.slice(i + 1), "Closed Won"];
    const dealIdsEntered = new Set(transitions.filter((t) => t.toStage === stage).map((t) => t.dealId));
    const advanced = new Set(
      transitions
        .filter((t) => dealIdsEntered.has(t.dealId) && nextStages.includes(t.toStage))
        .map((t) => t.dealId)
    ).size;
    return {
      stage,
      entered,
      advanced,
      rate: entered ? advanced / entered : 0,
    };
  });

  // Quarter-over-quarter at the same point in the quarter.
  const qStartMonth = Math.floor(TODAY.getMonth() / 3) * 3;
  const thisQStart = new Date(TODAY.getFullYear(), qStartMonth, 1);
  const dayOfQuarter = Math.floor((TODAY.getTime() - thisQStart.getTime()) / DAY_MS);
  const lastQStart = new Date(TODAY.getFullYear(), qStartMonth - 3, 1);
  const lastQSamePoint = new Date(lastQStart.getTime() + dayOfQuarter * DAY_MS);

  const snapAt = (d: Date) => {
    const key = d.toISOString().slice(0, 10);
    return snapshots.find((s) => s.date === key) ?? snapshots[0];
  };
  const nowSnap = snapshots[snapshots.length - 1];
  const lastSnap = snapAt(lastQSamePoint);

  const wonInRange = (start: Date, end: Date) =>
    closed
      .filter((d) => d.outcome === "won" && new Date(d.closeDate) >= start && new Date(d.closeDate) <= end)
      .reduce((s, d) => s + d.amount, 0);

  const thisQWon = wonInRange(thisQStart, TODAY);
  const lastQWon = wonInRange(lastQStart, lastQSamePoint);

  const cmp = (label: string, a: number, b: number) => ({
    label,
    thisQuarter: Math.round(a),
    lastQuarter: Math.round(b),
    delta: b ? Math.round(((a - b) / b) * 100) : 0,
  });

  return {
    pipelineValue: snapshots
      .filter((_, i) => i % 3 === 0)
      .map((s) => ({ date: s.date, total: s.totalPipeline, weighted: s.weightedPipeline })),
    dealsCreatedPerMonth: createdPerMonth,
    winRatePerMonth,
    velocityPerMonth,
    stageConversion,
    quarterComparison: [
      cmp("Open pipeline value", nowSnap.totalPipeline, lastSnap.totalPipeline),
      cmp("Weighted pipeline", nowSnap.weightedPipeline, lastSnap.weightedPipeline),
      cmp("Closed won (QTD)", thisQWon, lastQWon),
      cmp("Open deal count", nowSnap.dealCount, lastSnap.dealCount),
    ],
  };
}
