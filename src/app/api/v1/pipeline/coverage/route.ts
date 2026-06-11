import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import { computeCoverage } from "@/lib/engine/coverage";
import { CURRENT_QUARTER, NEXT_QUARTER } from "@/lib/data/generator";
import { apiError, requireAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const params = req.nextUrl.searchParams;
  const dimension = params.get("dimension") ?? "team";
  if (!["team", "product_line"].includes(dimension)) {
    return apiError(400, "invalid_request_error", "dimension must be team or product_line", "invalid_parameter", "dimension");
  }
  const period = params.get("period") ?? CURRENT_QUARTER;
  if (![CURRENT_QUARTER, NEXT_QUARTER].includes(period)) {
    return apiError(400, "invalid_request_error", `period must be ${CURRENT_QUARTER} or ${NEXT_QUARTER}`, "invalid_parameter", "period");
  }

  const store = getStore();
  const segments = computeCoverage(store.openDeals, store.quotaTargets, period, dimension as "team" | "product_line");

  return NextResponse.json({
    period,
    dimension,
    segments: segments.map((s) => ({
      name: s.name,
      pipeline: s.rawPipeline,
      weighted_pipeline: s.weightedPipeline,
      quota: s.quota,
      coverage_ratio: s.coverageRatio,
      gap: s.gap,
      deal_count: s.dealCount,
    })),
  });
}
