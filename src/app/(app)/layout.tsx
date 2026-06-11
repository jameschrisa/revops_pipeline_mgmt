import { AppShell } from "@/components/AppShell";
import { getAlerts, getSyncStatus } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const alertCount = getAlerts().filter((a) => a.status === "active").length;
  const sync = getSyncStatus();
  const mins = Math.max(0, Math.round((Date.now() - new Date(sync.lastSync).getTime()) / 60_000));
  return (
    <AppShell alertCount={alertCount} lastSync={mins === 0 ? "just now" : `${mins}m ago`}>
      {children}
    </AppShell>
  );
}
