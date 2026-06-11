import { NextRequest, NextResponse } from "next/server";
import { getAlerts } from "@/lib/data/store";
import { requireAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const params = req.nextUrl.searchParams;
  const status = params.get("status") ?? "active";
  const severity = params.get("severity");

  let alerts = getAlerts().filter((a) => a.status === status);
  if (severity) alerts = alerts.filter((a) => a.severity === severity);

  return NextResponse.json({
    alerts: alerts.map((a) => ({
      id: a.id,
      deal_id: a.dealId,
      alert_type: a.alertType,
      severity: a.severity,
      title: a.title,
      detail: a.detail,
      status: a.status,
      snoozed_until: a.snoozedUntil,
      created_at: a.createdAt,
    })),
    count: alerts.length,
  });
}
