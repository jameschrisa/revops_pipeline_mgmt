import { NextRequest, NextResponse } from "next/server";
import { updateAlertStatus } from "@/lib/data/store";
import { apiError, requireAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  let body: { status?: string; snoozed_until?: string | null };
  try {
    body = await req.json();
  } catch {
    return apiError(400, "invalid_request_error", "Request body must be JSON", "invalid_body");
  }

  if (!body.status || !["active", "snoozed", "dismissed"].includes(body.status)) {
    return apiError(400, "invalid_request_error", "status must be active, snoozed, or dismissed", "invalid_parameter", "status");
  }

  const alert = updateAlertStatus(
    id,
    body.status as "active" | "snoozed" | "dismissed",
    body.snoozed_until ?? null
  );
  if (!alert) {
    return apiError(404, "invalid_request_error", "Alert not found", "resource_not_found", "id");
  }

  return NextResponse.json({
    alert: {
      id: alert.id,
      deal_id: alert.dealId,
      status: alert.status,
      snoozed_until: alert.snoozedUntil,
    },
  });
}
