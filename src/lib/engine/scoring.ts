import {
  Deal,
  DealScore,
  ScoreFactor,
  StageTransition,
} from "../types";
import {
  DAY_MS,
  MEDIAN_CYCLE_DAYS,
  STAGE_BENCHMARK_DAYS,
  TODAY,
  iso,
} from "../data/generator";

export const MODEL_VERSION = "v1.2-weighted-factor";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const daysBetween = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / DAY_MS);

// Weighted factor model (D-01): explainable, no training pipeline.
// Each factor contributes a signed impact; the base score is 60.
export function scoreDeal(deal: Deal, transitions: StageTransition[], segmentMedianAmount: number): DealScore {
  const factors: ScoreFactor[] = [];
  const benchmark = STAGE_BENCHMARK_DAYS[deal.currentStage] ?? 12;
  const daysInStage = daysBetween(TODAY, new Date(deal.stageEnteredAt));
  const daysSinceActivity = daysBetween(TODAY, new Date(deal.lastActivity.slice(0, 10)));
  const age = daysBetween(TODAY, new Date(deal.createdDate));
  const daysToClose = daysBetween(new Date(deal.closeDate), TODAY);

  // 1. Stage duration vs. benchmark (weight ~30)
  const stageRatio = daysInStage / benchmark;
  const stageImpact = clamp(Math.round((1 - stageRatio) * 18), -30, 12);
  factors.push({
    name: "Time in stage",
    impact: stageImpact,
    value: `${daysInStage} days in ${deal.currentStage}`,
    benchmark: `${benchmark} days typical`,
    description:
      stageRatio > 2
        ? `Deal has been in ${deal.currentStage} for ${daysInStage} days — ${stageRatio.toFixed(1)}x the ${benchmark}-day average for this stage.`
        : stageRatio > 1.2
          ? `Deal is running ${Math.round((stageRatio - 1) * 100)}% over the ${benchmark}-day average for ${deal.currentStage}.`
          : `Stage duration is on track (${daysInStage} of ~${benchmark} days typical for ${deal.currentStage}).`,
  });

  // 2. Activity recency (weight ~25)
  const activityImpact = daysSinceActivity <= 3 ? 12 : daysSinceActivity <= 7 ? 4 : daysSinceActivity <= 14 ? -12 : -25;
  factors.push({
    name: "Activity recency",
    impact: activityImpact,
    value: daysSinceActivity === 0 ? "Activity today" : `${daysSinceActivity} days since last activity`,
    benchmark: "Active deals show touches every 3–7 days",
    description:
      daysSinceActivity > 14
        ? `No emails, calls, or meetings logged in ${daysSinceActivity} days — a strong stall signal.`
        : daysSinceActivity > 7
          ? `Activity gap of ${daysSinceActivity} days exceeds the 7-day healthy-engagement window.`
          : `Recent engagement: last activity ${daysSinceActivity === 0 ? "today" : `${daysSinceActivity} day(s) ago`}.`,
  });

  // 3. Close date status (weight ~15)
  let closeImpact = 0;
  let closeDesc = `Close date ${deal.closeDate} is ${daysToClose} days out.`;
  if (daysToClose < 0) {
    closeImpact = -15;
    closeDesc = `Close date passed ${Math.abs(daysToClose)} days ago without a stage change — classic slippage.`;
  } else if (daysToClose < 14 && (deal.currentStage === "Lead" || deal.currentStage === "Qualified")) {
    closeImpact = -10;
    closeDesc = `Close date is ${daysToClose} days away but the deal is still in ${deal.currentStage} — timeline at risk.`;
  } else if (daysToClose < 30 && deal.currentStage === "Negotiation") {
    closeImpact = 8;
    closeDesc = `In Negotiation with close date ${daysToClose} days out — consistent with a closing pattern.`;
  }
  factors.push({
    name: "Close date risk",
    impact: closeImpact,
    value: daysToClose < 0 ? `${Math.abs(daysToClose)} days past due` : `Closes in ${daysToClose} days`,
    benchmark: "Late-stage deals close within 30 days",
    description: closeDesc,
  });

  // 4. Deal age vs. typical cycle (weight ~10)
  const ageRatio = age / MEDIAN_CYCLE_DAYS;
  const ageImpact = ageRatio > 2.5 ? -10 : ageRatio > 1.5 ? -5 : 4;
  factors.push({
    name: "Deal age",
    impact: ageImpact,
    value: `${age} days old`,
    benchmark: `${MEDIAN_CYCLE_DAYS}-day median won cycle`,
    description:
      ageRatio > 1.5
        ? `Deal is ${age} days old vs. a ${MEDIAN_CYCLE_DAYS}-day median winning cycle — older deals convert at lower rates.`
        : `Deal age (${age} days) is within the normal winning-cycle range.`,
  });

  // 5. Size vs. segment (weight ~10)
  const sizeRatio = deal.amount / Math.max(1, segmentMedianAmount);
  const sizeImpact = sizeRatio > 4 ? -8 : sizeRatio > 2 ? -4 : 2;
  factors.push({
    name: "Deal size vs. segment",
    impact: sizeImpact,
    value: `$${deal.amount.toLocaleString()}`,
    benchmark: `$${Math.round(segmentMedianAmount).toLocaleString()} segment median`,
    description:
      sizeRatio > 2
        ? `Deal is ${sizeRatio.toFixed(1)}x the segment median — outsized deals historically close at lower rates and slip more.`
        : `Deal size is in the segment's normal winning range.`,
  });

  // 6. Stage progression momentum (weight ~10)
  const recentAdvances = transitions.filter(
    (t) => t.dealId === deal.id && daysBetween(TODAY, new Date(t.transitionedAt.slice(0, 10))) <= 30 && t.fromStage !== null
  ).length;
  const momentumImpact = recentAdvances >= 2 ? 8 : recentAdvances === 1 ? 5 : -4;
  factors.push({
    name: "Stage momentum",
    impact: momentumImpact,
    value: `${recentAdvances} stage advance(s) in 30 days`,
    benchmark: "Winning deals advance every 2–3 weeks",
    description:
      recentAdvances > 0
        ? `Deal advanced ${recentAdvances} stage(s) in the last 30 days — positive momentum.`
        : `No stage progression in the last 30 days.`,
  });

  const raw = 60 + factors.reduce((s, f) => s + f.impact, 0);
  const score = clamp(Math.round(raw), 4, 98);
  const band = score >= 70 ? "good" : score >= 40 ? "warn" : "risk";

  // Deterministic 8-week score history drifting toward the current score.
  const seed = deal.id.split("_")[1] ?? "0";
  let h = parseInt(seed, 10) % 23;
  const history: { date: string; score: number }[] = [];
  for (let w = 7; w >= 0; w--) {
    h = (h * 31 + 7) % 19;
    const drift = (h - 9) * (w / 7) * 1.6;
    history.push({
      date: iso(new Date(TODAY.getTime() - w * 7 * DAY_MS)),
      score: clamp(Math.round(score + drift + w * (score > 55 ? -1.2 : 1.8)), 4, 98),
    });
  }
  history[history.length - 1].score = score;

  return {
    dealId: deal.id,
    score,
    band,
    factors: factors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)),
    scoredAt: new Date(TODAY.getTime() + 9 * 3600_000).toISOString(),
    modelVersion: MODEL_VERSION,
    history,
  };
}
