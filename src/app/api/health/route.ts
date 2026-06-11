import { NextResponse } from "next/server";
import { getSyncStatus } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const sync = getSyncStatus();
  return NextResponse.json({
    status: "ok",
    db: "connected (in-memory demo store)",
    last_sync: sync.lastSync,
    version: "0.1.0-demo",
  });
}
