import { NextRequest, NextResponse } from "next/server";
import { getSyncStatus } from "@/lib/data/store";
import { requireAuth } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const s = getSyncStatus();
  return NextResponse.json({
    crm_type: s.crmType,
    connected: s.connected,
    last_sync: s.lastSync,
    next_sync: s.nextSync,
    records_synced: s.recordsSynced,
    errors: s.errors,
    sync_interval_minutes: s.intervalMinutes,
  });
}
