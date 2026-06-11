import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import { forecastHistory } from "@/lib/engine/forecast";
import { CURRENT_QUARTER } from "@/lib/data/generator";
import { requireAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const from = req.nextUrl.searchParams.get("from");
  const store = getStore();
  let snapshots = forecastHistory(store.deals, CURRENT_QUARTER);
  if (from) snapshots = snapshots.filter((s) => s.date >= from);

  return NextResponse.json({
    period: CURRENT_QUARTER,
    snapshots: snapshots.map((s) => ({
      date: s.date,
      best_case: s.bestCase,
      commit: s.commit,
      most_likely: s.mostLikely,
    })),
  });
}
