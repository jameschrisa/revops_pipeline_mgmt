import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import { apiError, requireAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

const METRICS = ["total_value", "weighted_value", "deal_count"] as const;

export async function GET(req: NextRequest) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const params = req.nextUrl.searchParams;
  const metric = params.get("metric") ?? "total_value";
  if (!METRICS.includes(metric as (typeof METRICS)[number])) {
    return apiError(400, "invalid_request_error", `metric must be one of: ${METRICS.join(", ")}`, "invalid_parameter", "metric");
  }
  const from = params.get("from");
  const to = params.get("to");

  let snapshots = getStore().snapshots;
  if (from) snapshots = snapshots.filter((s) => s.date >= from);
  if (to) snapshots = snapshots.filter((s) => s.date <= to);

  return NextResponse.json({
    metric,
    data_points: snapshots.map((s) => ({
      date: s.date,
      value:
        metric === "total_value"
          ? s.totalPipeline
          : metric === "weighted_value"
            ? s.weightedPipeline
            : s.dealCount,
    })),
  });
}
