import { CoverageSegment, QuotaTarget, ScoredDeal } from "../types";

export const TARGET_COVERAGE_RATIO = 3.0;

// Coverage uses probability-weighted pipeline (per F-08 acceptance criteria),
// not raw pipeline.
export function computeCoverage(
  deals: ScoredDeal[],
  quotas: QuotaTarget[],
  period: string,
  dimension: "team" | "product_line"
): CoverageSegment[] {
  const open = deals.filter((d) => d.isOpen);
  const key = (d: ScoredDeal) => (dimension === "team" ? d.team : d.productLine);
  const relevant = quotas.filter(
    (q) => q.period === period && q.dimension.startsWith(`${dimension}:`)
  );

  return relevant
    .map((q) => {
      const name = q.dimension.split(":")[1];
      const segDeals = open.filter((d) => key(d) === name);
      const raw = segDeals.reduce((s, d) => s + d.amount, 0);
      const weighted = segDeals.reduce((s, d) => s + d.amount * (d.score.score / 100), 0);
      const ratio = q.targetAmount ? weighted / q.targetAmount : 0;
      return {
        name,
        dimension: q.dimension,
        weightedPipeline: Math.round(weighted),
        rawPipeline: Math.round(raw),
        quota: q.targetAmount,
        coverageRatio: Math.round(ratio * 100) / 100,
        gap: Math.max(0, Math.round(q.targetAmount * TARGET_COVERAGE_RATIO - weighted)),
        dealCount: segDeals.length,
      };
    })
    .sort((a, b) => a.coverageRatio - b.coverageRatio);
}
