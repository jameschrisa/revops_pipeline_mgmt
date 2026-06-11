# F3 Pipeline Intelligence

> Know your number before the quarter knows it for you.

Predictive pipeline analytics for revenue leaders: deal health scoring, multi-scenario
forecasting, and deal slippage alerts — built per the [Pipeline Management & Forecasting
spec](docs/pipeline-forecasting-spec.md) (v0.1) for the F3 Insights ecosystem.

**This is the stub-data MVP.** It runs entirely on a deterministic synthetic dataset
(no database, no CRM connection) so the full product experience can be demoed and
deployed anywhere Next.js runs. The data layer is isolated in `src/lib/data/` so the
generator can be swapped for the PostgreSQL/Neon + CRM-sync implementation described in
the spec without touching the engines or UI.

## What's implemented

| Spec feature | Status | Where |
|---|---|---|
| F-01 Deal Health Scoring (weighted factor model, explainable factors, score history) | ✅ stub-complete | `src/lib/engine/scoring.ts` |
| F-02 Multi-Scenario Forecasting (commit / most likely / best case, segments, confidence intervals, WoW movement) | ✅ stub-complete | `src/lib/engine/forecast.ts` |
| F-03 Deal Slippage Alerts (inactivity, slipped close date, stage duration; snooze/dismiss) | ✅ stub-complete | `src/lib/engine/alerts.ts` |
| F-04 Pipeline Trends & Cohorts (value over time, conversion, velocity, win rate, QoQ) | ✅ stub-complete | `src/lib/engine/trends.ts` |
| F-05 CRM Data Sync | 🟡 simulated (sync status panel + API; no live OAuth) | `src/lib/data/store.ts` |
| F-06 Notification Delivery | 🟡 in-app feed only (Slack/email deferred) | `src/components/AlertFeed.tsx` |
| F-07 Historical Data Store | 🟡 in-memory synthetic snapshots (24 months) | `src/lib/data/generator.ts` |
| F-08 Pipeline Coverage Analysis (weighted coverage vs. quota, gap analysis) | ✅ stub-complete | `src/lib/engine/coverage.ts` |
| REST API `/api/v1` with bearer auth + Stripe-style errors | ✅ | `src/app/api/v1/` |

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000 → "Enter demo workspace"
```

No environment variables required — the demo workspace ("Meridian Labs") generates
~700 closed deals (24 months of history), ~150 open deals, activities, stage
transitions, daily pipeline snapshots, and quota targets from a seeded PRNG. Data is
deterministic per calendar day and always anchored to "today," so the demo never goes
stale.

## API

All `/api/v1` endpoints require the demo bearer token:

```bash
curl -H "Authorization: Bearer rok_demo_meridian" \
  "http://localhost:3000/api/v1/forecast?dimension=team"
```

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/deals` | GET | Scored deal list (`?status=open&sort=score&limit=50&offset=0`) |
| `/api/v1/deals/:id` | GET | Deal detail + score factors + stage transitions |
| `/api/v1/forecast` | GET | Three-scenario forecast (`?period=Qx-YYYY&dimension=team\|product_line\|region`) |
| `/api/v1/forecast/history` | GET | Weekly forecast snapshots (`?from=YYYY-MM-DD`) |
| `/api/v1/alerts` | GET | Alert feed (`?status=active&severity=high`) |
| `/api/v1/alerts/:id` | PATCH | Snooze / dismiss / reactivate an alert |
| `/api/v1/pipeline/trends` | GET | Snapshot time series (`?metric=total_value\|weighted_value\|deal_count`) |
| `/api/v1/pipeline/coverage` | GET | Coverage vs. quota (`?dimension=team\|product_line`) |
| `/api/v1/sync/status` | GET | Simulated CRM sync status |
| `/api/v1/sync/trigger` | POST | Simulated manual sync trigger |
| `/api/health` | GET | Unauthenticated health check |

## Stack

Next.js 15 (App Router, RSC) · React 19 · Tailwind CSS 4 · Recharts · TypeScript.
Brand: Hanken Grotesk headings, Inter body, IBM Plex Mono data, navy/mist/gold palette
(F3 Insights brand guide), light theme.

## Path to production (per spec)

1. Replace `src/lib/data/generator.ts` with the PostgreSQL data layer (Neon, schema in spec §14).
2. Add the CRM Sync module (Salesforce/HubSpot OAuth, Vercel Cron incremental sync — spec §13/§19).
3. Wire NextAuth for real workspaces and org-scoped RLS (spec D-05).
4. Add Slack/SendGrid notification channels (F-06).

The engines (`src/lib/engine/*`) operate on the types in `src/lib/types.ts` and carry
over unchanged.
