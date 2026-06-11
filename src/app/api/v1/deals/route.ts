import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import { requireAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const params = req.nextUrl.searchParams;
  const status = params.get("status") ?? "open";
  const sort = params.get("sort") ?? "score";
  const limit = Math.min(200, Math.max(1, parseInt(params.get("limit") ?? "50", 10) || 50));
  const offset = Math.max(0, parseInt(params.get("offset") ?? "0", 10) || 0);

  const store = getStore();
  let deals = store.deals.filter((d) =>
    status === "open" ? d.isOpen : status === "closed" ? !d.isOpen : true
  );
  deals = [...deals].sort((a, b) =>
    sort === "amount"
      ? b.amount - a.amount
      : sort === "close_date"
        ? a.closeDate.localeCompare(b.closeDate)
        : a.score.score - b.score.score
  );

  const page = deals.slice(offset, offset + limit);
  return NextResponse.json({
    deals: page.map((d) => ({
      id: d.id,
      crm_deal_id: d.crmDealId,
      name: d.name,
      amount: d.amount,
      currency: d.currency,
      owner_name: d.ownerName,
      team: d.team,
      product_line: d.productLine,
      region: d.region,
      current_stage: d.currentStage,
      close_date: d.closeDate,
      created_date: d.createdDate,
      last_activity: d.lastActivity,
      is_open: d.isOpen,
      outcome: d.outcome,
      score: d.isOpen ? d.score.score : null,
      score_band: d.isOpen ? d.score.band : null,
    })),
    pagination: { total: deals.length, limit, offset },
  });
}
