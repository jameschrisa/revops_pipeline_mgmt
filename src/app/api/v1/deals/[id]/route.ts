import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import { apiError, requireAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const store = getStore();
  const deal = store.deals.find((d) => d.id === id);
  if (!deal) {
    return apiError(404, "invalid_request_error", "Deal not found", "resource_not_found", "id");
  }

  return NextResponse.json({
    deal: {
      id: deal.id,
      crm_deal_id: deal.crmDealId,
      name: deal.name,
      amount: deal.amount,
      owner_name: deal.ownerName,
      team: deal.team,
      product_line: deal.productLine,
      region: deal.region,
      current_stage: deal.currentStage,
      close_date: deal.closeDate,
      created_date: deal.createdDate,
      last_activity: deal.lastActivity,
      is_open: deal.isOpen,
      outcome: deal.outcome,
    },
    scores: deal.isOpen
      ? [
          {
            score: deal.score.score,
            band: deal.score.band,
            factors: deal.score.factors,
            scored_at: deal.score.scoredAt,
            model_version: deal.score.modelVersion,
            history: deal.score.history,
          },
        ]
      : [],
    transitions: store.transitions
      .filter((t) => t.dealId === id)
      .map((t) => ({
        from_stage: t.fromStage,
        to_stage: t.toStage,
        transitioned_at: t.transitionedAt,
        days_in_stage: t.daysInStage,
      })),
  });
}
