import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  // Demo workspace: sync is simulated, so a manual trigger acks immediately.
  return NextResponse.json(
    {
      sync_id: `sync_${Date.now().toString(36)}`,
      status: "started",
      note: "Demo workspace — synthetic data refreshes daily; no CRM connection to sync.",
    },
    { status: 202 }
  );
}
