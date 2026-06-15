"use client";

import Link from "next/link";
import { useState } from "react";
import type { Alert } from "@/lib/types";

const sevStyles = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-mist-100 text-mist-600",
} as const;

const typeLabels = {
  inactivity: "Inactivity",
  slippage: "Close date slipped",
  stage_duration: "Stuck in stage",
} as const;

export function AlertFeed({ initialAlerts }: { initialAlerts: Alert[] }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<"active" | "snoozed" | "dismissed">("active");
  const [leaving, setLeaving] = useState<Set<string>>(new Set());

  async function persist(id: string, status: "snoozed" | "dismissed" | "active", snoozedUntil: string | null) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status, snoozedUntil } : a)));
    setLeaving((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await fetch(`/api/v1/alerts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer rok_demo_meridian",
      },
      body: JSON.stringify({ status, snoozed_until: snoozedUntil }),
    }).catch(() => {});
  }

  function update(id: string, status: "snoozed" | "dismissed" | "active") {
    const snoozedUntil =
      status === "snoozed" ? new Date(Date.now() + 7 * 86_400_000).toISOString() : null;
    // Cards leave the current filter view — play the exit, then commit the change.
    setLeaving((prev) => new Set(prev).add(id));
    window.setTimeout(() => persist(id, status, snoozedUntil), 260);
  }

  const visible = alerts.filter((a) => a.status === filter);
  const counts = {
    active: alerts.filter((a) => a.status === "active").length,
    snoozed: alerts.filter((a) => a.status === "snoozed").length,
    dismissed: alerts.filter((a) => a.status === "dismissed").length,
  };

  return (
    <div>
      <div className="flex gap-2 text-sm">
        {(["active", "snoozed", "dismissed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 capitalize ${
              filter === f ? "bg-navy-800 text-white" : "bg-white ring-1 ring-mist-200 hover:bg-mist-100"
            }`}
          >
            {f} <span className="font-data text-xs">({counts[f]})</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-mist-200 bg-white p-8 text-center text-sm text-mist-600">
            {filter === "active" ? "No active alerts — pipeline looks healthy." : `No ${filter} alerts.`}
          </div>
        ) : (
          visible.map((a, i) => (
            <div
              key={a.id}
              className={`rounded-2xl border border-mist-200 bg-white p-4 ${leaving.has(a.id) ? "anim-card-out" : "anim-rise"}`}
              style={{ "--i": Math.min(i, 6) } as React.CSSProperties}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 font-data text-[10px] font-semibold uppercase ${sevStyles[a.severity]}`}>
                      {a.severity}
                    </span>
                    <span className="rounded bg-navy-50 px-1.5 py-0.5 font-data text-[10px] font-semibold uppercase text-navy-600">
                      {typeLabels[a.alertType]}
                    </span>
                    <span className="font-medium text-navy-900">{a.title}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-navy-700">{a.detail}</p>
                  {a.status === "snoozed" && a.snoozedUntil ? (
                    <p className="mt-1 font-data text-xs text-mist-600">
                      Snoozed until {new Date(a.snoozedUntil).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2 text-sm">
                  <Link href={`/deals/${a.dealId}`} className="rounded-full bg-navy-800 px-3.5 py-1.5 text-white hover:bg-navy-700">
                    View deal
                  </Link>
                  {a.status === "active" ? (
                    <>
                      <button onClick={() => update(a.id, "snoozed")} className="rounded-full border border-mist-300 px-3.5 py-1.5 hover:border-navy-400">
                        Snooze 7d
                      </button>
                      <button onClick={() => update(a.id, "dismissed")} className="rounded-full border border-mist-300 px-3.5 py-1.5 text-mist-600 hover:border-red-300 hover:text-red-600">
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <button onClick={() => update(a.id, "active")} className="rounded-full border border-mist-300 px-3.5 py-1.5 hover:border-navy-400">
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
