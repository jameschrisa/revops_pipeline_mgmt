import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import { computeScenarios, computeSegments } from "@/lib/engine/forecast";
import { CURRENT_QUARTER, NEXT_QUARTER } from "@/lib/data/generator";
import { apiError, requireAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const params = req.nextUrl.searchParams;
  const period = params.get("period") ?? CURRENT_QUARTER;
  if (![CURRENT_QUARTER, NEXT_QUARTER].includes(period)) {
    return apiError(
      400,
      "invalid_request_error",
      `Unsupported period. Use ${CURRENT_QUARTER} or ${NEXT_QUARTER}.`,
      "invalid_parameter",
      "period"
    );
  }
  const dimension = params.get("dimension") ?? "team";
  if (!["team", "product_line", "region"].includes(dimension)) {
    return apiError(400, "invalid_request_error", "dimension must be team, product_line, or region", "invalid_parameter", "dimension");
  }

  const store = getStore();
  const scenarios = computeScenarios(store.deals, period);
  const segments = computeSegments(store.deals, period, dimension as "team" | "product_line" | "region");

  return NextResponse.json({
    period,
    scenarios: {
      best_case: scenarios.bestCase,
      commit: scenarios.commit,
      most_likely: scenarios.mostLikely,
      confidence: { low: scenarios.confidenceLow, high: scenarios.confidenceHigh },
      closed_won_to_date: scenarios.closedWon,
      open_deal_count: scenarios.dealCount,
    },
    segments: segments.map((s) => ({
      name: s.name,
      best_case: s.bestCase,
      commit: s.commit,
      most_likely: s.mostLikely,
      confidence: { low: s.confidenceLow, high: s.confidenceHigh },
      open_deal_count: s.dealCount,
    })),
  });
}
