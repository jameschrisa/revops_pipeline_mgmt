# Product & System Specification — Pipeline Management & Forecasting

> **Purpose of this document.** This is a structured specification designed to be analyzed and built collaboratively by five specialist agents. Each section names an **owner** (accountable), **contributors** (consulted), the **questions it must answer**, the **inputs** it needs, the **deliverable** it produces, and **done criteria** that signal it is ready to converge. Agents work their assigned sections in parallel, hand off at defined gates, and converge into a single implementation-ready spec that QA can test against.

---

## 0. Document Metadata

| Field | Value |
|---|---|
| Product / system name | **F3 Pipeline Intelligence** |
| Spec version | `v0.1` |
| Status | `Draft` |
| Owner (human) | James Christensen |
| Last updated | 2026-06-11 |
| Target release / milestone | MVP — Q3 2026 |
| Linked artifacts | RevOps1 repo (`/Users/jchrisa/CODE/RevOps1`), F3 Insights Brand Guide, RevOps1 vision doc (`/Users/jchrisa/Downloads/RevOps1.md`) |

---

## 1. Agent Roster & Responsibilities

Five agents share this spec. Each is **accountable** for some sections and **consulted** on others. Use the single-accountable-owner rule: every section has exactly one owner, even when several agents contribute.

| Agent | Mandate | Owns (accountable for) |
|---|---|---|
| **Product Marketer (PMM)** | Why this exists, who it's for, what it's worth. Owns positioning, narrative, and value. | About, Long Description, Who Is It For, Pain Points, Goals, Key Benefits |
| **UX Designer (UX)** | The human experience of the system: journeys, use cases, onboarding, usability. | Use Cases / When They Use It, Getting Started, User Journey & Flows, Accessibility |
| **Software Architect (ARCH)** | How it's built and whether it holds up. Owns structure, data, and technical risk. | Key Features (implementation view), Architecture, Data Model, Tech Stack, Dependencies & Libraries, Non-Functional Requirements |
| **Solutions Engineer (SE)** | How it lands in the customer's real environment. Owns fit, setup, configuration, integration. | Workflow & Environment Fit, Setup, Configuration, Integration & Deployment, Enablement & Troubleshooting |
| **Technical Marketer (TMM)** | The technical story for a technical audience. Owns "what it does" framing, feature messaging, differentiation. | What Does It Do, Key Features (capability view), Differentiation, Proof & Evidence |

### Section -> Agent assignment matrix

`O` = Owner (accountable) - `C` = Contributor (consulted) - `R` = Reviewer (sign-off)

| Section | PMM | UX | ARCH | SE | TMM |
|---|:--:|:--:|:--:|:--:|:--:|
| 2. About | **O** | | | | C |
| 3. Long Description | **O** | C | | | C |
| 4. What Does It Do | C | | C | | **O** |
| 5. Who Is It For | **O** | C | | | C |
| 6. Pain Points | **O** | C | | C | |
| 7. Workflow & Environment Fit | | C | C | **O** | |
| 8. Use Cases / When They Use It | C | **O** | | C | |
| 9. Key Features | | C | **O** | C | C |
| 10. Goals | **O** | | C | | |
| 11. Key Benefits | **O** | | | | C |
| 12. Getting Started | | **O** | | C | |
| 13. Architecture & System Design | | | **O** | C | |
| 14. Data Model & Contracts | | | **O** | C | |
| 15. Tech Stack | | | **O** | C | |
| 16. Dependencies & Libraries | | | **O** | C | |
| 17. Setup & Installation | | | C | **O** | |
| 18. Configuration | | | C | **O** | |
| 19. Integration & Deployment | | | C | **O** | |
| 20. Non-Functional Requirements | | C | **O** | C | |
| 21. Differentiation & Proof | C | | | | **O** |
| 22. Acceptance Criteria & Test Plan | C | C | C | C | C |
| 23. Open Questions & Decision Log | C | C | C | C | C |
| 24. Implementation Roadmap | R | R | **O** | C | R |

---

## PART A — Product Story

### 2. About
**Owner:** PMM - **Contributors:** TMM

F3 Pipeline Intelligence is a predictive pipeline analytics platform that analyzes historical CRM data — conversion rates, sales velocity, deal activity, and stage progression — to tell revenue leaders which deals will close, which will stall, and what the quarter actually looks like. It sits alongside the existing F3 Insights signal-routing platform, adding a forecasting and pipeline health layer that CRM systems alone cannot provide.

**Tagline candidate:** _Know your number before the quarter knows it for you._

**Why now:** CRM systems store deal data but don't interpret it. Leadership teams still forecast in spreadsheets, gut-checking pipeline by multiplying stage-weighted amounts. Meanwhile, deal slippage is discovered in weekly pipeline reviews — days or weeks after activity stopped. The convergence of accessible ML inference, real-time CRM webhooks, and the operational data already flowing through RevOps1's signal engine makes predictive pipeline intelligence viable as a lightweight, connected module rather than a standalone enterprise product.

---

### 3. Long Description
**Owner:** PMM - **Contributors:** UX, TMM

Revenue forecasting is broken at most companies. Reps commit deals they believe will close; managers haircut those numbers based on experience; VPs add their own adjustments; and the board sees a single number that nobody trusts. The problem isn't dishonesty — it's that the forecast is built on opinion layered on opinion, with no systematic analysis of what the pipeline data actually says.

F3 Pipeline Intelligence replaces opinion-stacked forecasting with data-driven pipeline analysis. The platform ingests deal data from CRM systems (Salesforce, HubSpot, or any system connected through RevOps1's signal engine), analyzes historical patterns of conversion, velocity, and engagement, and produces three outputs: (1) deal-level health scores that predict close likelihood, (2) multi-scenario revenue forecasts segmented by team, product line, or region, and (3) proactive alerts when high-value deals show signs of stalling.

The core promise: leadership sees the real pipeline — not the pipeline reps want them to see — and gets early warning when deals drift, before the quarter is lost.

**What it is not:** This is not a CRM replacement, a sales engagement tool, or a coaching platform. It does not tell reps what to do — it tells leaders what is happening and what is likely to happen. It does not own deal data; it reads from and analyzes data that lives in the CRM. It is not a general-purpose BI tool — it is purpose-built for revenue pipeline.

---

### 4. What Does It Do
**Owner:** TMM - **Contributors:** PMM, ARCH

The platform delivers five core capabilities:

1. **Predicts deal outcomes from historical patterns.** Analyzes conversion rates by stage, deal size, segment, rep, and time-in-stage against the organization's own historical data to produce a close-probability score for every open deal. Input: CRM deal records with stage history and activity timestamps. Output: per-deal health score (0-100) with contributing factors.

2. **Generates multi-scenario revenue forecasts.** Produces "best case," "commit," and "most likely" forecast scenarios by aggregating deal-level predictions across configurable dimensions — team, product line, region, or custom segments. Input: scored pipeline + dimension configuration. Output: three revenue numbers per segment with confidence intervals.

3. **Detects and alerts on deal slippage.** Monitors high-value deals for missed close dates, prolonged stage duration, and activity gaps (no emails, calls, meetings, or stage changes within a configurable window). Input: deal activity stream + alert rules. Output: prioritized alert feed delivered via dashboard, email, or Slack.

4. **Surfaces pipeline trends and cohort analysis.** Tracks pipeline creation rate, stage conversion rates, average deal velocity, and win/loss patterns over time, enabling period-over-period comparison and trend identification. Input: historical deal data. Output: trend dashboards with drill-down.

5. **Provides pipeline coverage analysis.** Compares active pipeline against quota targets to calculate coverage ratios by segment, highlighting where pipeline generation needs to accelerate to hit the number. Input: pipeline data + quota targets. Output: coverage heatmap with gap analysis.

Each capability traces to features in SS9 and resolves pains identified in SS6.

---

### 5. Who Is It For
**Owner:** PMM - **Contributors:** UX, TMM

#### Primary Personas

**VP of Sales / CRO ("The Number Owner")**
- **Role:** Owns the revenue target; reports forecast to the board/CEO.
- **Context:** Manages 3-10 front-line managers; reviews pipeline weekly; presents forecast monthly or quarterly.
- **Goals:** Deliver an accurate forecast; identify risk early enough to act; avoid end-of-quarter surprises.
- **Sophistication:** Understands pipeline math (coverage, conversion, velocity) but is not technical. Uses CRM dashboards and spreadsheets.
- **Tools today:** Salesforce/HubSpot reports, Excel/Google Sheets forecast models, BI tools (Tableau/Looker) for historical analysis.
- **Success:** Forecast accuracy within 10% of actual; no "surprise miss" quarters; pipeline risks surfaced 2+ weeks before close date.

**Front-Line Sales Manager ("The Deal Shepherd")**
- **Role:** Manages 5-12 reps; coaches deals; owns team forecast roll-up.
- **Context:** Runs weekly 1:1s and pipeline reviews; spends significant time scrubbing deals in CRM.
- **Goals:** Know which deals need intervention; give leadership an honest forecast without sandbagging or overcommitting; catch stalled deals before they age out.
- **Sophistication:** CRM power user; comfortable with dashboards; not a data analyst.
- **Tools today:** CRM list views, pipeline reports, activity dashboards, Gong/Clari/spreadsheets for deal inspection.
- **Success:** Fewer "zombie deals" in pipeline; less time spent on manual deal scrubbing; rep coaching informed by data, not just call review.

#### Secondary Personas

**Revenue Operations Analyst ("The Pipeline Plumber")**
- **Role:** Configures CRM, builds reports, maintains data hygiene, defines sales process stages.
- **Context:** Owns the data infrastructure that sales leaders rely on; bridges sales and data/engineering.
- **Goals:** Automate pipeline reporting that leadership keeps requesting manually; ensure forecast models use clean, consistent data; reduce time spent building ad-hoc reports.
- **Sophistication:** Technical; comfortable with data modeling, APIs, and integrations.
- **Tools today:** CRM admin, Salesforce Reports/SOQL, BI tools, RevOps1 signal engine, dbt/SQL for pipeline analytics.
- **Success:** Self-serve forecasting replaces ad-hoc report requests; integration setup takes hours, not weeks; data quality issues are surfaced automatically.

#### Anti-Personas

- **Individual sales reps** — This tool is not built for daily rep workflow. Reps are data sources, not primary users. Building for reps would pull the product toward activity tracking and coaching, which is a different category.
- **Marketing teams** — Pipeline intelligence here means sales pipeline post-MQL. Marketing funnel analytics is out of scope.
- **Finance/FP&A** — While they consume forecast numbers, their needs (GAAP recognition, deferred revenue, multi-year contract modeling) are beyond scope. They receive the forecast output, not the tool.

---

### 6. Pain Points
**Owner:** PMM - **Contributors:** UX, SE

#### Acute Pains (urgent, will pay to fix)

**P-01: Forecast inaccuracy erodes board confidence** (VP of Sales)
- Current workaround: VPs manually adjust manager roll-ups in spreadsheets, applying "haircuts" based on gut feel and historical over-commitment patterns.
- Why inadequate: Adjustments are inconsistent, undocumented, and not data-driven. Two VPs with the same pipeline will produce different forecasts. Boards lose trust.
- Cost of inaction: Missed quarters trigger leadership changes, hiring freezes, and valuation hits. A 15% forecast miss at a $50M ARR company is $7.5M of misallocated resources.

**P-02: Deal slippage discovered too late** (Front-Line Manager)
- Current workaround: Managers manually scan deal lists in weekly pipeline reviews, looking for deals that haven't moved or whose close dates have passed.
- Why inadequate: Weekly cadence means a deal can stall for 5-7 days before anyone notices. High-value deals get lost in the noise of 50-200 open opportunities per manager.
- Cost of inaction: Stalled deals that could have been saved with early intervention slip to next quarter or are lost entirely. Each missed $100K deal costs $100K in revenue and $20K+ in wasted sales effort.

**P-03: Pipeline review meetings are unproductive** (Front-Line Manager, VP of Sales)
- Current workaround: Managers and reps spend 60-90 minutes per week walking through deal lists, with the manager asking "what's the update?" on each deal.
- Why inadequate: Time is spent gathering status, not strategizing. Managers can't distinguish real updates from reps restating what's in the CRM.
- Cost of inaction: 4-6 hours per week per manager spent on status gathering instead of coaching. At a 20-manager org, that's 80-120 hours/week of manager time.

#### Chronic Pains (annoying, tolerated)

**P-04: No single source of truth for pipeline health** (RevOps Analyst)
- Current workaround: RevOps builds custom CRM reports, Excel models, and BI dashboards that each show a slightly different view of pipeline.
- Why inadequate: Different stakeholders reference different reports; disagreements about "the number" waste meeting time.
- Cost of inaction: 10-15 hours/week of RevOps analyst time maintaining parallel reporting systems.

**P-05: Historical pipeline data is hard to analyze** (VP of Sales, RevOps Analyst)
- Current workaround: Point-in-time snapshots exported to spreadsheets; manual cohort analysis comparing this quarter's pipeline shape to last quarter's.
- Why inadequate: CRMs store current state, not time-series. Reconstructing "what did the pipeline look like 30 days ago?" requires snapshots that were often never taken.
- Cost of inaction: Inability to answer "are we better or worse than last quarter at this point?" — the most basic pipeline health question.

---

### 7. Workflow & Environment Fit
**Owner:** SE - **Contributors:** UX, ARCH

#### Before / With-Us / After

**Before (current state):**
1. CRM (Salesforce/HubSpot) holds deal records with stages, amounts, close dates, and activity logs.
2. Reps update deals in CRM (sporadically).
3. Managers pull CRM reports or export to spreadsheets weekly for pipeline review.
4. VP asks managers for forecast numbers via email/Slack.
5. Managers submit forecast in spreadsheet or Clari-like tool.
6. VP aggregates and adjusts.
7. VP presents to board.

**With F3 Pipeline Intelligence (target state):**
1. CRM holds deal records (unchanged).
2. Reps update deals in CRM (unchanged — we don't touch rep workflow).
3. **F3 Pipeline Intelligence ingests deal data via CRM sync or RevOps1 signal engine** (new).
4. **Platform scores every deal and generates multi-scenario forecasts continuously** (new).
5. **Managers receive deal slippage alerts proactively; review pipeline in F3 dashboard** (replaces manual scrubbing).
6. **VP views forecast dashboard with scenarios and drill-down** (replaces spreadsheet aggregation).
7. **VP exports or shares forecast view with board** (replaces manual deck building).

**After (handoffs):**
- Deal coaching/intervention happens in CRM, Gong, or direct conversation (out of scope).
- Board reporting may pull forecast numbers via API or export.
- FP&A takes forecast output as input to their financial models.

#### Surrounding Tools & Integration Surface

| System | Integration Type | Data Direction | Priority |
|---|---|---|---|
| Salesforce | REST API (Bulk + Streaming) | Inbound (deals, stages, activities) | Must |
| HubSpot | REST API + Webhooks | Inbound (deals, stages, activities) | Must |
| RevOps1 Signal Engine | Internal (shared DB or internal API) | Inbound (signals, entity mappings) | Must |
| Slack | Webhooks (outbound) | Outbound (alerts, forecast summaries) | Should |
| Email (SMTP/SendGrid) | API | Outbound (alert digests) | Should |
| BI Tools (Looker, Tableau) | API / Export | Outbound (forecast data, scored pipeline) | Could |
| Google Sheets | API / Export | Outbound (forecast export) | Could |

#### Triggers (what pulls the user into the product)

- **Daily:** Manager opens dashboard to check deal health scores and alerts before 1:1s.
- **Weekly:** VP opens forecast view before pipeline review / leadership meeting.
- **Event-driven:** Slack/email alert fires when a deal stalls or slips — user clicks through to deal detail.
- **Monthly/Quarterly:** VP generates forecast scenario comparison for board prep.

#### Handoffs

- Deal data flows IN from CRM; the platform never writes back to CRM (read-only integration).
- Alerts flow OUT to Slack/email; the platform links back to its own deal detail view, not the CRM record (though CRM links are provided for context).
- Forecast data can be exported OUT via API or CSV for consumption by FP&A or BI tools.

#### Environment Constraints

- CRM API rate limits (Salesforce: 100K calls/day on Enterprise; HubSpot: 500K calls/day on Pro).
- Data privacy: deal amounts and customer names are commercially sensitive; must not leak across org boundaries.
- Most customers are on Salesforce Enterprise or HubSpot Pro/Enterprise; smaller customers may be on HubSpot Free (limited API access).
- Users access via web browser; no native mobile requirement for MVP (responsive web is sufficient).

---

### 8. Use Cases / When They Use It
**Owner:** UX - **Contributors:** PMM, SE

#### UC-01: Morning Pipeline Health Check (P0, daily)
- **Trigger:** Manager starts their day, opens F3 Pipeline Intelligence dashboard.
- **Actor:** Front-Line Sales Manager.
- **Goal:** Quickly identify which deals need attention today.
- **Steps:** (1) View deal health dashboard sorted by risk score. (2) Review top 5 at-risk deals. (3) Click into a deal to see contributing factors (days in stage, activity gap, historical pattern match). (4) Note which deals to discuss in 1:1s.
- **Successful outcome:** Manager identifies 2-3 deals needing intervention in under 5 minutes.
- **Edge cases:** Empty pipeline (new manager); all deals healthy (show positive confirmation); deal data stale due to CRM sync lag.

#### UC-02: Weekly Forecast Review (P0, weekly)
- **Trigger:** VP prepares for weekly leadership meeting or pipeline review.
- **Actor:** VP of Sales / CRO.
- **Goal:** Understand the current forecast across scenarios and identify where risk is concentrated.
- **Steps:** (1) Open forecast view. (2) Review "most likely," "commit," and "best case" numbers. (3) Drill down by team, product line, or region to find variance. (4) Compare to prior week's forecast to see movement. (5) Export or screenshot for meeting.
- **Successful outcome:** VP can articulate the forecast, where risk sits, and what changed since last week in a 5-minute leadership update.
- **Edge cases:** Insufficient historical data for new segment; forecast swing due to single large deal (highlight concentration risk).

#### UC-03: Deal Slippage Alert Response (P0, event-driven)
- **Trigger:** Manager receives Slack/email alert that a high-value deal has stalled.
- **Actor:** Front-Line Sales Manager.
- **Goal:** Assess whether the deal is truly stalled and decide on next action.
- **Steps:** (1) Read alert (deal name, amount, days since last activity, original close date vs. current). (2) Click through to deal detail in F3. (3) Review activity timeline and health score trend. (4) Navigate to CRM record for full context. (5) Reach out to rep or directly to prospect.
- **Successful outcome:** Manager intervenes on a stalling deal within 24 hours of the first inactivity signal, rather than discovering it in the next weekly review.
- **Edge cases:** False positive (deal is progressing via channels not tracked in CRM, e.g., in-person meetings); deal already lost but not updated in CRM; alert fatigue from too many low-value alerts.

#### UC-04: Quarterly Board Forecast Preparation (P1, quarterly)
- **Trigger:** VP needs to prepare revenue forecast for board meeting.
- **Actor:** VP of Sales / CRO.
- **Goal:** Generate a defensible, data-backed forecast with scenario analysis.
- **Steps:** (1) Open forecast view filtered to current quarter. (2) Review three scenarios with confidence intervals. (3) Drill into "commit" deals to verify high-confidence items. (4) Generate quarter-over-quarter trend comparison. (5) Export forecast summary (PDF or data) for board deck.
- **Successful outcome:** VP presents forecast backed by data, not opinion; board asks fewer "how confident are you?" questions.
- **Edge cases:** Mid-quarter — forecast is volatile early in the quarter (show confidence interval widening).

#### UC-05: Pipeline Coverage Gap Analysis (P1, monthly)
- **Trigger:** RevOps analyst or VP reviews whether enough pipeline exists to hit quota.
- **Actor:** RevOps Analyst or VP of Sales.
- **Goal:** Identify segments where pipeline coverage is below target (e.g., < 3x).
- **Steps:** (1) Open coverage analysis view. (2) Set quota targets by segment (or import from CRM/spreadsheet). (3) View coverage ratio heatmap. (4) Identify red zones where pipeline needs to be generated. (5) Share with marketing/SDR leadership to drive demand gen.
- **Successful outcome:** Coverage gaps are identified early enough to adjust demand gen strategy.
- **Edge cases:** No quota data configured (prompt user to set targets); single large deal inflates coverage for a segment.

#### UC-06: Initial System Setup (P0, one-time)
- **Trigger:** RevOps analyst decides to implement F3 Pipeline Intelligence.
- **Actor:** RevOps Analyst.
- **Goal:** Connect CRM, configure pipeline stages, and validate initial data import.
- **Steps:** (1) Create account / workspace. (2) Connect CRM via OAuth. (3) Map CRM pipeline stages to standard stages. (4) Configure deal value thresholds and alert rules. (5) Trigger initial historical data import. (6) Validate deal counts and amounts match CRM. (7) Review initial health scores and forecasts for sanity.
- **Successful outcome:** Platform is populated with deal data and producing reasonable scores within 2 hours of starting setup.
- **Edge cases:** Multiple pipelines in CRM; custom fields used for deal amount; CRM data quality issues (missing close dates, duplicate deals).

---

### 9. Key Features (to be implemented)
**Owner:** ARCH - **Contributors:** UX, SE, TMM

#### F-01: Deal Health Scoring Engine
- **Description:** Ingests deal records with stage history, calculates a 0-100 health score per deal based on historical conversion rates, time-in-stage benchmarks, deal size relative to segment, and activity recency. Scores update on each CRM sync cycle.
- **User-facing behavior:** Each deal shows a health score badge (green/yellow/red) with a tooltip explaining top contributing factors. Score history is shown as a sparkline.
- **Acceptance criteria:**
  - Score is computed for every deal with at least stage and amount data.
  - Score updates within 15 minutes of CRM data sync.
  - Contributing factors are shown in plain language (e.g., "Deal has been in Negotiation for 45 days; average for this stage is 12 days").
  - Score correlates with actual outcomes at r > 0.6 after 90 days of historical data.
- **Priority:** Must
- **Dependencies:** F-05 (CRM Data Sync), F-07 (Historical Data Store)
- **Maps to:** P-02 (deal slippage), P-03 (unproductive reviews), UC-01, UC-03

#### F-02: Multi-Scenario Forecasting
- **Description:** Aggregates deal-level scores into three forecast scenarios — "best case" (all deals above a low threshold close), "commit" (only high-confidence deals), "most likely" (probability-weighted sum). Forecasts are segmentable by team, product line, region, or custom dimension.
- **User-facing behavior:** Forecast dashboard with three scenario numbers displayed prominently, drill-down by dimension, week-over-week change indicators, and confidence intervals visualized as ranges.
- **Acceptance criteria:**
  - Three scenarios are computed and displayed for the current quarter and next quarter.
  - Forecasts can be segmented by at least: team/owner, product line, region.
  - Week-over-week and month-over-month forecast changes are shown.
  - Confidence intervals narrow as the quarter progresses (validated against historical accuracy).
- **Priority:** Must
- **Dependencies:** F-01 (Deal Health Scoring), F-07 (Historical Data Store)
- **Maps to:** P-01 (forecast inaccuracy), UC-02, UC-04

#### F-03: Deal Slippage Alerts
- **Description:** Monitors open deals against configurable rules: (a) close date has passed without stage change, (b) no CRM activity (email, call, meeting, note, stage change) for N days (configurable, default 7), (c) deal has been in current stage longer than 2x the historical average for that stage. Alerts are delivered via in-app notification, Slack, and/or email digest.
- **User-facing behavior:** Alert feed in dashboard with priority ranking. Each alert shows deal name, amount, owner, the specific trigger, and a "view deal" action. Slack alerts include a deep link back to the deal view.
- **Acceptance criteria:**
  - Alerts fire within 1 hour of a rule being triggered.
  - Users can configure: inactivity threshold (days), minimum deal value for alerts, alert channels (in-app, Slack, email).
  - Alert deduplication: the same deal/trigger combination does not re-alert within 48 hours.
  - Users can snooze or dismiss individual alerts.
- **Priority:** Must
- **Dependencies:** F-01 (for health context), F-05 (CRM Data Sync), F-06 (Notification Delivery)
- **Maps to:** P-02 (deal slippage), UC-03

#### F-04: Pipeline Trend & Cohort Analysis
- **Description:** Tracks pipeline state over time by snapshotting pipeline daily. Provides trend views for: total pipeline value, stage distribution, conversion rates by stage, average deal velocity, win/loss ratio. Supports cohort analysis (e.g., "deals created in January" tracked through their lifecycle).
- **User-facing behavior:** Time-series charts with selectable date ranges and comparison periods. Cohort view showing deal progression through stages over time (waterfall or funnel). Drill-down to deal lists from any data point.
- **Acceptance criteria:**
  - Daily pipeline snapshots are stored and queryable for at least 12 months.
  - At least 5 standard trend charts are available (total pipeline, stage distribution, conversion rate, velocity, win rate).
  - Period-over-period comparison (this quarter vs. last quarter at same point) is available.
  - Drill-down from any chart data point to the underlying deal list.
- **Priority:** Should
- **Dependencies:** F-07 (Historical Data Store)
- **Maps to:** P-05 (historical analysis), P-04 (single source of truth)

#### F-05: CRM Data Sync
- **Description:** Connects to Salesforce and HubSpot via OAuth, performs initial historical import (up to 24 months of closed deals + all open deals), and maintains incremental sync on a configurable schedule (default: every 15 minutes). Maps CRM objects (Opportunity/Deal, Stage, Contact, Activity) to the internal data model.
- **User-facing behavior:** Connection setup wizard with OAuth flow. Sync status indicator showing last sync time, records synced, and any errors. Stage mapping UI where users map CRM stages to standard lifecycle stages.
- **Acceptance criteria:**
  - Salesforce and HubSpot OAuth connections can be established and maintained.
  - Initial import completes within 2 hours for up to 100K historical deals.
  - Incremental sync captures deal changes within 15 minutes.
  - Sync errors are surfaced with actionable guidance (e.g., "Permission denied on Activity object — grant read access in Salesforce").
  - Stage mapping supports custom pipeline configurations.
- **Priority:** Must
- **Dependencies:** None (foundational)
- **Maps to:** All use cases (data foundation)

#### F-06: Notification Delivery
- **Description:** Delivers alerts and digest summaries via three channels: in-app notification feed, Slack (via incoming webhook or bot), and email (via SendGrid or SMTP). Users configure channel preferences per alert type.
- **User-facing behavior:** Notification preferences page where users enable/disable channels and set digest frequency (real-time, daily digest, weekly digest). In-app notification bell with unread count.
- **Acceptance criteria:**
  - In-app notifications are delivered in real-time.
  - Slack messages are delivered within 5 minutes of alert trigger.
  - Email digests are sent at the configured time (default: 8am local).
  - Users can configure preferences per alert type (slippage, forecast change, coverage gap).
- **Priority:** Should
- **Dependencies:** F-03 (Alert Engine)
- **Maps to:** P-02, UC-03

#### F-07: Historical Data Store
- **Description:** Maintains a time-series store of pipeline snapshots, deal state transitions, and computed metrics. Supports the analytics queries needed by F-01, F-02, and F-04 without hitting the CRM API. Handles data retention, archival, and privacy (org-isolated).
- **User-facing behavior:** Not directly visible; enables all analytics features. Data retention settings in admin (default: 24 months).
- **Acceptance criteria:**
  - Daily snapshots are taken automatically and stored.
  - Queries for trend analysis across 12 months complete in < 3 seconds.
  - Data is strictly isolated by organization; no cross-org data leakage.
  - Storage scales to 500K deal records per organization.
- **Priority:** Must
- **Dependencies:** F-05 (CRM Data Sync)
- **Maps to:** P-05, F-01, F-02, F-04

#### F-08: Pipeline Coverage Analysis
- **Description:** Compares active weighted pipeline against quota targets to compute coverage ratios. Supports quota input via manual entry, CSV import, or CRM sync (if available). Highlights segments below configurable coverage thresholds (default: 3x).
- **User-facing behavior:** Coverage heatmap by segment (team, product, region) with green/yellow/red color coding. Drill-down to contributing deals. Gap amount shown in dollars.
- **Acceptance criteria:**
  - Quota targets can be entered manually or imported via CSV.
  - Coverage ratio is calculated using probability-weighted pipeline (not raw pipeline).
  - Heatmap updates in real-time as deals are scored.
  - Segments below threshold are highlighted and sortable by gap amount.
- **Priority:** Should
- **Dependencies:** F-01, F-02
- **Maps to:** UC-05

---

### 10. Goals
**Owner:** PMM - **Contributors:** ARCH

#### User Goals
- See a trustworthy, data-driven forecast without manual spreadsheet work.
- Get early warning on stalling deals — days, not weeks, after activity stops.
- Spend pipeline review time on strategy and coaching, not status gathering.

#### Business Goals
- Land 10 paying customers within 6 months of launch (targeting $100K+ ARR companies).
- Achieve > 80% weekly active usage among deployed managers within 60 days of onboarding.
- Establish F3 Pipeline Intelligence as the forecasting layer for the F3 Insights ecosystem, driving cross-sell with RevOps1.

#### Success Metrics / KPIs

| Metric | Target | Timeframe |
|---|---|---|
| Forecast accuracy (predicted vs. actual quarterly revenue) | Within 10% | After 2 full quarters of data |
| Mean time to detect deal slippage | < 24 hours from last activity | Within 30 days of deployment |
| Weekly active users (managers + VPs) | > 80% of provisioned users | Within 60 days of onboarding |
| Time spent in weekly pipeline review | Reduced by 30%+ (self-reported) | Within 90 days |
| Deal health score correlation with outcomes | r > 0.6 | After 90 days of historical data |
| NPS among RevOps personas | > 40 | 6 months post-launch |

#### Non-Goals (this cycle)
- Rep-facing features (activity tracking, coaching prompts, task creation).
- Write-back to CRM (updating deal fields, stages, or close dates from this platform).
- Marketing funnel analytics (pre-MQL pipeline).
- Multi-currency support (USD-only for MVP).
- Mobile native app.

---

### 11. Key Benefits
**Owner:** PMM - **Contributors:** TMM

**B-01: Forecast the quarter with data, not opinions** (resolves P-01)
Leadership sees probability-weighted scenarios based on the organization's own historical conversion patterns. No more gut-feel haircuts. _Feature cluster: F-01, F-02._

**B-02: Catch stalling deals before they die** (resolves P-02)
Automated alerts surface inactivity and slippage within hours, not the days-to-weeks lag of weekly pipeline reviews. Managers can intervene while the deal is still recoverable. _Feature cluster: F-01, F-03, F-06._

**B-03: Transform pipeline reviews from status meetings into strategy sessions** (resolves P-03)
When the dashboard already shows deal health, status gathering is eliminated. Managers can focus meeting time on the 3-5 deals that need coaching, not the 50 that are progressing normally. _Quantified: estimated 30%+ reduction in pipeline review time._ _Feature cluster: F-01, F-04._

**B-04: One source of pipeline truth for the entire revenue org** (resolves P-04)
Every stakeholder — rep manager, VP, RevOps, board — references the same data and the same forecast methodology. Disagreements about "the number" become disagreements about strategy, not data. _Feature cluster: F-02, F-04, F-07._

**B-05: Understand pipeline trajectory, not just pipeline state** (resolves P-05)
Time-series snapshots and cohort analysis answer the question CRMs can't: "At this point in the quarter, are we ahead or behind where we were last quarter?" _Feature cluster: F-04, F-07._

---

### 12. Getting Started
**Owner:** UX - **Contributors:** SE

#### Prerequisites
- An active Salesforce (Enterprise+) or HubSpot (Pro+) account with admin/API access.
- At least 6 months of closed-deal history in CRM (12+ months recommended for accurate scoring).
- CRM pipeline stages defined and in use.
- A user with CRM admin permissions to authorize the OAuth connection.

#### First-Run Steps to First Value

1. **Create workspace** — Sign up at f3insights.com/pipeline; name your workspace.
2. **Connect your CRM** — Click "Connect Salesforce" or "Connect HubSpot"; authorize via OAuth. Takes 30 seconds.
3. **Map your stages** — The platform auto-detects your pipeline stages and proposes a mapping to standard stages (Lead, Qualified, Proposal, Negotiation, Closed Won/Lost). Review and adjust. Takes 2-5 minutes.
4. **Set alert thresholds** — Configure minimum deal value for alerts and inactivity window (defaults provided). Takes 1 minute.
5. **Wait for initial sync** — Historical data imports in the background. Progress bar shows completion. Typical: 15-60 minutes for most orgs.
6. **Review your first forecast** — Once sync completes, the dashboard populates with deal health scores, your first three-scenario forecast, and any existing deal slippage alerts.

**First moment of value:** Seeing your pipeline scored by health and your first data-driven forecast — typically within 1 hour of starting setup.

**What could block it:** Insufficient CRM permissions (OAuth will fail with a clear error message); very dirty CRM data (many deals missing close dates or amounts) will reduce scoring accuracy (the platform will flag data quality issues).

**Where technical setup takes over:** If the customer wants Slack/email alerts (SS17-19), custom forecast dimensions beyond team/product/region, or API access for BI tool integration, those are configured in Settings after the initial setup.

---

## PART B — Technical Specification

### 13. Architecture & System Design
**Owner:** ARCH - **Contributors:** SE

#### Architecture Overview

F3 Pipeline Intelligence follows a modular monolith architecture (consistent with RevOps1), deployed as a Next.js application with a PostgreSQL database. The system has four logical modules:

```
+------------------------------------------------------------------+
|                    F3 Pipeline Intelligence                        |
|                                                                    |
|  +-------------+  +---------------+  +-----------+  +----------+ |
|  | CRM Sync    |  | Scoring       |  | Forecast  |  | Alert    | |
|  | Module      |  | Engine        |  | Engine    |  | Engine   | |
|  |             |  |               |  |           |  |          | |
|  | - OAuth     |  | - Historical  |  | - Scenario|  | - Rules  | |
|  | - Import    |  |   analysis    |  |   calc    |  | - Detect | |
|  | - Incr sync |  | - Feature     |  | - Segment |  | - Notify | |
|  | - Stage map |  |   extraction  |  |   rollup  |  |          | |
|  +------+------+  +-------+-------+  +-----+-----+  +----+-----+ |
|         |                 |                |              |        |
|  +------+-----------------+----------------+--------------+------+|
|  |                   PostgreSQL (Neon)                           | |
|  |  deals | stages | activities | snapshots | scores | forecasts | |
|  +--------------------------------------------------------------+ |
+------------------------------------------------------------------+
         |                                              |
    CRM APIs                                    Slack/Email
  (Salesforce,                                  (outbound
   HubSpot)                                     notifications)
```

#### Request/Data Flow — Primary Use Cases

**Deal scoring flow (background, every sync cycle):**
1. CRM Sync Module pulls changed deals via incremental API query.
2. Changed deals are upserted into the deals/stages/activities tables.
3. Scoring Engine is triggered for each changed deal.
4. Engine queries historical benchmarks (median time-in-stage, conversion rate by stage+segment).
5. Score is computed using a weighted factor model (not ML for MVP — see Decision Log).
6. Score is written to the scores table with timestamp and contributing factors.
7. If score crosses an alert threshold, Alert Engine evaluates rules.

**Forecast generation flow (on-demand + periodic):**
1. User requests forecast view (or scheduled job fires).
2. Forecast Engine queries all open deals with current scores.
3. Deals are bucketed into scenarios based on score thresholds (configurable).
4. Aggregation runs across requested dimensions (team, product, region).
5. Historical accuracy data is used to compute confidence intervals.
6. Result is cached and served to the dashboard.

#### Key Architectural Decisions

| Decision | Choice | Trade-off | Ref |
|---|---|---|---|
| Scoring approach | Weighted factor model, not ML | Simpler, explainable, no training pipeline; less accurate for complex patterns. Revisit when we have 50+ customer datasets. | D-01 |
| Data architecture | Shared PostgreSQL, not separate analytics DB | Simpler ops, lower cost; may need to separate read replicas if query load grows. | D-02 |
| CRM integration | Direct API, not iPaaS/Fivetran | Full control, no vendor dependency; more dev work per CRM. | D-03 |
| Monolith vs. services | Modular monolith | Consistent with RevOps1; faster to build and deploy; harder to scale modules independently. | D-04 |
| Multi-tenancy | Schema-level isolation (org_id on every table, RLS) | Simpler than separate schemas; relies on disciplined query patterns and RLS enforcement. | D-05 |

#### Boundaries

- **Trust boundary:** CRM OAuth tokens are stored encrypted. All API calls to CRM are authenticated per-org. No CRM credentials are shared across orgs.
- **State:** All state lives in PostgreSQL. No in-memory state survives restarts. Background jobs are idempotent.
- **Failure model:** CRM sync failures are retried with exponential backoff (max 3 retries). Scoring failures for individual deals do not block other deals. Forecast queries degrade gracefully if scores are stale (show "last updated" timestamp).

---

### 14. Data Model & Contracts
**Owner:** ARCH - **Contributors:** SE

#### Core Entities

```
organizations
  id              UUID PK
  name            TEXT NOT NULL
  slug            TEXT UNIQUE NOT NULL
  crm_type        TEXT ('salesforce' | 'hubspot')
  crm_credentials JSONB (encrypted: access_token, refresh_token, instance_url)
  settings        JSONB (alert_thresholds, forecast_config, sync_interval)
  api_key         TEXT (Stripe-style: rok_...)
  created_at      TIMESTAMPTZ
  updated_at      TIMESTAMPTZ

pipelines
  id              UUID PK
  org_id          UUID FK -> organizations
  crm_pipeline_id TEXT (external ID)
  name            TEXT NOT NULL
  stages          JSONB[] (ordered array of {crm_stage_id, name, standard_stage, sort_order})
  is_default      BOOLEAN
  created_at      TIMESTAMPTZ

deals
  id              UUID PK
  org_id          UUID FK -> organizations
  pipeline_id     UUID FK -> pipelines
  crm_deal_id     TEXT (external ID, unique per org)
  name            TEXT NOT NULL
  amount          NUMERIC(15,2)
  currency        TEXT DEFAULT 'USD'
  owner_name      TEXT
  owner_email     TEXT
  team            TEXT
  product_line    TEXT
  region          TEXT
  current_stage   TEXT
  close_date      DATE
  created_date    DATE
  last_activity   TIMESTAMPTZ
  is_open         BOOLEAN DEFAULT true
  outcome         TEXT ('won' | 'lost' | NULL)
  crm_data        JSONB (raw CRM fields for extensibility)
  created_at      TIMESTAMPTZ
  updated_at      TIMESTAMPTZ
  UNIQUE(org_id, crm_deal_id)

stage_transitions
  id              UUID PK
  deal_id         UUID FK -> deals
  org_id          UUID FK -> organizations
  from_stage      TEXT
  to_stage        TEXT NOT NULL
  transitioned_at TIMESTAMPTZ NOT NULL
  days_in_stage   INTEGER

activities
  id              UUID PK
  deal_id         UUID FK -> deals
  org_id          UUID FK -> organizations
  activity_type   TEXT ('email' | 'call' | 'meeting' | 'note' | 'stage_change' | 'other')
  occurred_at     TIMESTAMPTZ NOT NULL
  crm_activity_id TEXT
  summary         TEXT

deal_scores
  id              UUID PK
  deal_id         UUID FK -> deals
  org_id          UUID FK -> organizations
  score           INTEGER (0-100)
  factors         JSONB ({factor_name, value, benchmark, impact, description}[])
  scored_at       TIMESTAMPTZ NOT NULL
  model_version   TEXT

pipeline_snapshots
  id              UUID PK
  org_id          UUID FK -> organizations
  snapshot_date   DATE NOT NULL
  snapshot_data   JSONB (aggregated: {total_pipeline, stage_breakdown, deal_count, weighted_pipeline})
  UNIQUE(org_id, snapshot_date)

forecasts
  id              UUID PK
  org_id          UUID FK -> organizations
  period          TEXT ('Q3-2026', 'Q4-2026')
  dimension       TEXT ('all' | 'team:West' | 'product:Enterprise')
  best_case       NUMERIC(15,2)
  commit          NUMERIC(15,2)
  most_likely     NUMERIC(15,2)
  confidence_low  NUMERIC(15,2)
  confidence_high NUMERIC(15,2)
  deal_count      INTEGER
  computed_at     TIMESTAMPTZ NOT NULL

alert_rules
  id              UUID PK
  org_id          UUID FK -> organizations
  rule_type       TEXT ('inactivity' | 'slippage' | 'stage_duration' | 'coverage')
  config          JSONB ({threshold_days, min_amount, channels[]})
  is_active       BOOLEAN DEFAULT true

alerts
  id              UUID PK
  org_id          UUID FK -> organizations
  deal_id         UUID FK -> deals (nullable for coverage alerts)
  rule_id         UUID FK -> alert_rules
  alert_type      TEXT
  severity        TEXT ('high' | 'medium' | 'low')
  title           TEXT
  detail          JSONB
  status          TEXT ('active' | 'snoozed' | 'dismissed')
  snoozed_until   TIMESTAMPTZ
  created_at      TIMESTAMPTZ

quota_targets
  id              UUID PK
  org_id          UUID FK -> organizations
  period          TEXT
  dimension       TEXT
  target_amount   NUMERIC(15,2)
```

#### API Contracts (REST, /api/v1/)

**Authentication:** Bearer token via `Authorization: Bearer rok_...` header.

| Endpoint | Method | Purpose | Request | Response |
|---|---|---|---|---|
| `/api/v1/deals` | GET | List deals with scores | `?status=open&sort=score&limit=50` | `{deals: Deal[], pagination}` |
| `/api/v1/deals/:id` | GET | Deal detail with score history | — | `{deal: Deal, scores: Score[], transitions: Transition[]}` |
| `/api/v1/forecast` | GET | Current forecast | `?period=Q3-2026&dimension=team` | `{scenarios: {best_case, commit, most_likely, confidence}, segments: Segment[]}` |
| `/api/v1/forecast/history` | GET | Forecast over time | `?period=Q3-2026&from=2026-04-01` | `{snapshots: ForecastSnapshot[]}` |
| `/api/v1/alerts` | GET | Active alerts | `?status=active&severity=high` | `{alerts: Alert[], count}` |
| `/api/v1/alerts/:id` | PATCH | Snooze/dismiss alert | `{status: 'snoozed', snoozed_until}` | `{alert: Alert}` |
| `/api/v1/pipeline/trends` | GET | Pipeline trends | `?metric=total_value&from=...&to=...` | `{data_points: {date, value}[]}` |
| `/api/v1/pipeline/coverage` | GET | Coverage analysis | `?dimension=team` | `{segments: {name, pipeline, quota, coverage_ratio}[]}` |
| `/api/v1/sync/status` | GET | CRM sync status | — | `{last_sync, records_synced, errors, next_sync}` |
| `/api/v1/sync/trigger` | POST | Trigger manual sync | — | `{sync_id, status: 'started'}` |

Error format (Stripe-style, consistent with RevOps1):
```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "Deal not found",
    "code": "resource_not_found",
    "param": "id"
  }
}
```

---

### 15. Tech Stack
**Owner:** ARCH - **Contributors:** SE

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 16 (App Router, RSC) | Consistent with RevOps1; SSR for dashboard performance; RSC for data-heavy views |
| **UI Components** | Tailwind CSS + custom components | Consistent with RevOps1 and F3 brand guide; no component library dependency |
| **Charts** | Recharts or Tremor | React-native charting; good time-series support; SSR-compatible |
| **Backend** | Next.js API Routes + Server Actions | Monolith; no separate API server needed for MVP |
| **Database** | PostgreSQL 17 (Neon serverless) | Consistent with RevOps1; excellent JSON support; Neon scales to zero for dev |
| **DB Access** | `pg` (node-postgres) directly | Consistent with RevOps1; no ORM overhead; explicit SQL |
| **Background Jobs** | Vercel Cron + edge functions | Simple scheduling for sync and scoring; no separate worker infrastructure |
| **Auth** | NextAuth.js / Auth.js | Standard; supports email + Google SSO; session management |
| **Email** | SendGrid API | Reliable transactional email; generous free tier |
| **Hosting** | Vercel (Pro) | Consistent with RevOps1; edge functions for API; preview deployments |
| **Encryption** | Node.js crypto (AES-256-GCM) | CRM tokens encrypted at rest; key via env var |

**Alternatives considered:**

| Alternative | Why rejected |
|---|---|
| Separate Python ML service for scoring | Premature; weighted factor model is sufficient for MVP; adds operational complexity |
| ClickHouse for analytics | Overkill for expected data volume (< 500K deals/org); Postgres handles this with proper indexing |
| Temporal for workflows | CRM sync is simple enough for cron + retry logic; Temporal adds significant infra |
| dbt for data transforms | Good for analytics-heavy orgs but adds a build step; direct SQL is clearer for this scope |

---

### 16. Dependencies & Libraries
**Owner:** ARCH - **Contributors:** SE

| Dependency | Version | Purpose | License | Criticality | Fallback |
|---|---|---|---|---|---|
| `next` | 16.x | App framework | MIT | Core | None (foundational) |
| `react` | 19.x | UI library | MIT | Core | None |
| `pg` | 8.x | PostgreSQL client | MIT | Core | `postgres` (porsager) |
| `recharts` | 2.x | Dashboard charts | MIT | Core | `tremor`, `nivo` |
| `next-auth` | 5.x | Authentication | ISC | Core | Custom JWT implementation |
| `@sendgrid/mail` | 8.x | Email delivery | MIT | Optional | `nodemailer` + SMTP |
| `jsforce` | 3.x | Salesforce API client | MIT | Core (SF orgs) | Direct REST calls |
| `@hubspot/api-client` | 12.x | HubSpot API client | Apache-2.0 | Core (HS orgs) | Direct REST calls |
| `next-themes` | 0.4.x | Dark/light mode | MIT | Optional | CSS media query |
| `date-fns` | 4.x | Date manipulation | MIT | Core | `dayjs` |
| `zod` | 3.x | Schema validation | MIT | Core | `joi`, `yup` |
| `tailwindcss` | 4.x | Styling | MIT | Core | None (foundational) |

**External Services:**

| Service | Auth Model | Rate Limits | Cost | SLA |
|---|---|---|---|---|
| Salesforce API | OAuth 2.0 | 100K calls/day (Enterprise) | Included in SF license | 99.9% |
| HubSpot API | OAuth 2.0 | 500K calls/day (Pro) | Included in HS license | 99.99% |
| Neon PostgreSQL | Connection string | 500 connections (Pro) | ~$19/mo base | 99.95% |
| SendGrid | API key | 100/day free; 100K/mo paid | Free tier; $19.95/mo Essentials | 99.95% |
| Vercel | Deploy token | 100 deploys/day | Pro plan ($20/mo/member) | 99.99% |

---

### 17. Setup & Installation
**Owner:** SE - **Contributors:** ARCH

#### Environment Prerequisites
- Node.js 22+ (LTS)
- pnpm 9+
- PostgreSQL 17 (local dev) or Neon account (production)
- Salesforce Developer Org or HubSpot Developer Account (for OAuth app setup)
- Vercel account (Pro plan recommended)
- SendGrid account (optional, for email alerts)

#### Local Development Setup

```bash
# 1. Clone and install
git clone <repo-url> f3-pipeline
cd f3-pipeline/app
pnpm install

# 2. Set up local PostgreSQL
createdb pipeline_intel
psql pipeline_intel -c "CREATE ROLE pipeline_app WITH LOGIN PASSWORD 'pipeline_dev_pw';"
psql pipeline_intel -c "GRANT ALL ON DATABASE pipeline_intel TO pipeline_app;"

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with:
#   DATABASE_URL=postgresql://pipeline_app:pipeline_dev_pw@localhost:5432/pipeline_intel
#   NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
#   NEXTAUTH_URL=http://localhost:3000
#   SALESFORCE_CLIENT_ID=<from Connected App>
#   SALESFORCE_CLIENT_SECRET=<from Connected App>
#   HUBSPOT_CLIENT_ID=<from HubSpot Developer Portal>
#   HUBSPOT_CLIENT_SECRET=<from HubSpot Developer Portal>
#   SENDGRID_API_KEY=<optional>

# 4. Run migrations and seed
pnpm db:migrate
pnpm db:seed  # Seeds a demo org with synthetic deal history

# 5. Start dev server
pnpm dev
# Open http://localhost:3000
```

#### Verification Steps
1. `http://localhost:3000` loads the login screen.
2. Sign in with the demo account (seeded).
3. Dashboard shows synthetic deal data with health scores.
4. Forecast view shows three scenarios for the demo org.
5. `http://localhost:3000/api/v1/sync/status` returns JSON with demo sync status.

#### Common Install Failures

| Symptom | Cause | Fix |
|---|---|---|
| `ECONNREFUSED :5432` | PostgreSQL not running | `brew services start postgresql@17` |
| `role "pipeline_app" does not exist` | Skipped step 2 | Run the CREATE ROLE command |
| OAuth redirect error | Wrong callback URL | Ensure `NEXTAUTH_URL` matches the running server URL |
| `relation "deals" does not exist` | Migrations not run | `pnpm db:migrate` |

---

### 18. Configuration
**Owner:** SE - **Contributors:** ARCH

#### Environment Variables

| Variable | Purpose | Default | Required | Sensitive |
|---|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | — | Yes | Yes |
| `APP_DATABASE_URL` | RLS-enforced connection (prod) | — | Prod only | Yes |
| `NEXTAUTH_SECRET` | Session encryption key | — | Yes | Yes |
| `NEXTAUTH_URL` | Canonical app URL | `http://localhost:3000` | Yes | No |
| `SALESFORCE_CLIENT_ID` | SF Connected App ID | — | If SF enabled | No |
| `SALESFORCE_CLIENT_SECRET` | SF Connected App secret | — | If SF enabled | Yes |
| `HUBSPOT_CLIENT_ID` | HS Developer App ID | — | If HS enabled | No |
| `HUBSPOT_CLIENT_SECRET` | HS Developer App secret | — | If HS enabled | Yes |
| `SENDGRID_API_KEY` | Email delivery | — | No (alerts degrade to in-app only) | Yes |
| `SLACK_SIGNING_SECRET` | Slack app verification | — | No (Slack alerts disabled) | Yes |
| `ENCRYPTION_KEY` | AES-256 key for CRM tokens | — | Yes | Yes |
| `SYNC_INTERVAL_MINUTES` | CRM sync frequency | `15` | No | No |
| `SCORE_MODEL_VERSION` | Scoring algorithm version | `v1` | No | No |
| `LOG_LEVEL` | Application log verbosity | `info` | No | No |

#### Application-Level Configuration (per-organization, stored in DB)

| Setting | Purpose | Default |
|---|---|---|
| `alert.inactivity_days` | Days of no activity before alert | `7` |
| `alert.min_deal_amount` | Minimum deal value to trigger alerts | `10000` |
| `alert.channels` | Notification channels enabled | `['in_app']` |
| `forecast.commit_threshold` | Minimum score for "commit" scenario | `70` |
| `forecast.best_case_threshold` | Minimum score for "best case" scenario | `30` |
| `forecast.dimensions` | Available segmentation dimensions | `['team', 'product_line', 'region']` |
| `coverage.target_ratio` | Default coverage ratio threshold | `3.0` |
| `sync.historical_months` | Months of history to import | `24` |

#### Configuration Profiles

**Dev:**
```env
DATABASE_URL=postgresql://pipeline_app:pipeline_dev_pw@localhost:5432/pipeline_intel
NEXTAUTH_URL=http://localhost:3000
SYNC_INTERVAL_MINUTES=60
LOG_LEVEL=debug
```

**Production:**
```env
DATABASE_URL=<neon-connection-string>
APP_DATABASE_URL=<neon-rls-connection-string>
NEXTAUTH_URL=https://pipeline.f3insights.com
SYNC_INTERVAL_MINUTES=15
LOG_LEVEL=warn
```

#### Minimal Viable Config (to get running)
`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ENCRYPTION_KEY`. Everything else has defaults or disables gracefully.

---

### 19. Integration & Deployment
**Owner:** SE - **Contributors:** ARCH

#### Integration Setup

**Salesforce Integration:**
1. Create a Connected App in Salesforce Setup (API > Create > Connected App).
2. Set callback URL to `{NEXTAUTH_URL}/api/auth/callback/salesforce`.
3. Request scopes: `api`, `refresh_token`, `offline_access`.
4. Copy Client ID and Secret to environment variables.
5. In F3 Pipeline Intelligence: Settings > Integrations > Connect Salesforce.
6. OAuth flow authorizes read access to Opportunity, OpportunityStage, Task, Event objects.
7. Data direction: **inbound only** — the platform never writes to Salesforce.

**HubSpot Integration:**
1. Create a Developer App in HubSpot Developer Portal.
2. Set redirect URL to `{NEXTAUTH_URL}/api/auth/callback/hubspot`.
3. Request scopes: `crm.objects.deals.read`, `crm.objects.contacts.read`, `crm.schemas.deals.read`.
4. Copy Client ID and Secret to environment variables.
5. In F3 Pipeline Intelligence: Settings > Integrations > Connect HubSpot.
6. OAuth flow authorizes read access to Deals, Contacts, Engagements.
7. Data direction: **inbound only**.

**Slack Integration:**
1. Create a Slack App at api.slack.com.
2. Add Incoming Webhooks capability.
3. Install to workspace and select a channel.
4. Copy webhook URL to F3 Pipeline Intelligence settings.
5. Alerts and digest summaries are sent to the configured channel.

#### Deployment Pipeline

```
Developer Push → GitHub → Vercel Build → Preview Deploy → Manual Promote → Production
```

1. **Build:** `pnpm build` (Next.js production build, ~2 minutes).
2. **Test:** `pnpm test` (unit + integration tests) and `pnpm test:e2e` (Playwright).
3. **Preview:** Every PR gets a Vercel preview deployment with its own URL.
4. **Production:** Merge to `main` triggers auto-deploy to production. Manual promotion available.
5. **Rollback:** Vercel instant rollback to any previous deployment via dashboard or CLI.

#### Deployment Topology

| Component | Environment | Notes |
|---|---|---|
| Next.js app | Vercel (Edge + Serverless) | Auto-scaling; edge for static, serverless for API |
| Database | Neon PostgreSQL (Pro) | Auto-scaling compute; branching for preview deploys |
| CRM Sync jobs | Vercel Cron Functions | Triggered every 15 min; max 300s execution |
| Scoring jobs | Vercel Serverless Functions | Triggered by sync completion; batch processing |

#### Observability

- **Logging:** Structured JSON logs via `pino`; sent to Vercel Log Drains or Axiom.
- **Metrics:** Vercel Analytics (Web Vitals); custom metrics for sync duration, scoring latency, alert counts via a lightweight metrics table.
- **Alerting:** Vercel monitoring for deploy failures; application-level health check at `/api/health` returning sync status and DB connectivity.
- **Health check endpoint:** `GET /api/health` returns `{status: 'ok', db: 'connected', last_sync: '...', version: '...'}`.

#### Operational Runbook

| Action | Command / Process |
|---|---|
| Start/restart | Managed by Vercel (automatic) |
| Force re-deploy | `vercel deploy --prod` from `app/` directory |
| Rollback | `vercel rollback` or Vercel dashboard |
| Trigger manual sync | `POST /api/v1/sync/trigger` with Bearer token |
| Check sync health | `GET /api/v1/sync/status` |
| Database migration | `pnpm db:migrate` (run before deploy via build script) |
| Scale database | Neon dashboard: adjust compute units |

---

### 20. Non-Functional Requirements
**Owner:** ARCH - **Contributors:** UX, SE

| Category | Requirement | Threshold | Test Method |
|---|---|---|---|
| **Performance** | Dashboard initial load (LCP) | < 2.5 seconds on 4G connection | Lighthouse CI |
| **Performance** | Forecast query response | < 3 seconds for 100K deals | Load test with synthetic data |
| **Performance** | Deal list page (50 deals) | < 1.5 seconds server render | Lighthouse CI |
| **Performance** | CRM sync cycle (incremental) | < 5 minutes for 1000 changed deals | Timed test against sandbox CRM |
| **Reliability** | Application uptime | 99.9% monthly (< 44 min downtime/month) | Vercel status + uptime monitor |
| **Reliability** | Data sync recovery | Auto-retry within 30 min of transient CRM failure | Chaos test: kill CRM mock mid-sync |
| **Security** | CRM token storage | AES-256-GCM encrypted at rest | Security audit; no plaintext tokens in DB |
| **Security** | Multi-tenancy isolation | Zero cross-org data leakage | Penetration test with two orgs |
| **Security** | API authentication | Bearer token required on all endpoints | Automated test: unauthenticated requests return 401 |
| **Security** | OAuth token refresh | Tokens refreshed before expiry; never exposed to frontend | Integration test with expired token |
| **Privacy** | Data retention | Configurable; default 24 months; deletion on account close | Manual verification |
| **Privacy** | PII handling | Deal contact names/emails stored; accessible only by org members | Access control test |
| **Scalability** | Deal volume per org | 500K historical + 50K open deals | Load test with synthetic dataset |
| **Scalability** | Concurrent users | 100 simultaneous dashboard users per org | Load test with k6 |
| **Accessibility** | WCAG compliance | Level AA (2.1) | Automated (axe-core) + manual audit |
| **Accessibility** | Keyboard navigation | All interactive elements reachable via keyboard | Manual test |
| **Accessibility** | Chart accessibility | Alt text and data tables for all charts | Manual test |

---

## PART C — Positioning, Convergence & Readiness

### 21. Differentiation & Proof
**Owner:** TMM - **Contributors:** PMM

#### Competitive Frame

| Alternative | What it does well | Where F3 Pipeline Intelligence wins |
|---|---|---|
| **Clari** | Enterprise forecasting, activity intelligence | F3 is lighter-weight, faster to deploy, integrated with RevOps1 signal engine, lower cost. Clari requires 6+ weeks of professional services; F3 targets < 2 hours to first value. |
| **Gong Forecast** | Conversation intelligence-powered forecasting | F3 is CRM-data-driven (no call recording needed), works for orgs that don't use Gong. Gong forecast requires Gong platform; F3 is standalone. |
| **InsightSquared** | Revenue analytics and reporting | F3 focuses on predictive scoring + alerting, not just reporting. IS shows what happened; F3 shows what will happen. |
| **CRM native (SF Einstein, HS Forecasting)** | Zero integration; built into CRM | F3 provides cross-CRM consistency, deeper historical analysis, multi-scenario forecasting not available in native tools. CRM forecasting is basic stage-weighted math. |
| **Spreadsheets (do nothing)** | Free, fully customizable | F3 automates what spreadsheets require manually: data collection, scoring, scenario math, alerting. Spreadsheets don't alert you when a deal stalls. |

#### Defensible Differentiators

1. **< 2 hours to first data-driven forecast** — No professional services, no 6-week implementation. Connect CRM, map stages, see scores. (Feature: F-05, F-01, F-02)
2. **Proactive deal slippage detection** — Alerts fire within hours of inactivity, not discovered in next week's review. Most competitors surface risk only on-demand. (Feature: F-03, F-06)
3. **RevOps1 signal engine integration** — Deals are enriched with signal data from the broader F3 Insights ecosystem, enabling scoring factors that CRM-only tools can't see. (Feature: F-05, F-07; dependent on RevOps1 integration)
4. **Explainable scores, not black-box AI** — Every health score shows the contributing factors in plain language. Leadership can interrogate the model, not just trust it. (Feature: F-01)

#### Proof Points (available at launch)

- **Correlation metric:** Deal health score vs. actual outcomes measured on customer data after 90 days (target: r > 0.6).
- **Time-to-value benchmark:** Measured setup-to-first-forecast time across beta customers (target: median < 1 hour).
- **Forecast accuracy:** Predicted vs. actual quarterly revenue for beta customers (target: within 10%).

#### Messaging Guardrails (claims to avoid)

- Do NOT claim "AI-powered" or "machine learning" — the MVP uses a weighted factor model, not ML. Say "data-driven" or "analytics-powered."
- Do NOT claim real-time — sync cycle is 15 minutes. Say "near real-time" or "within minutes."
- Do NOT compare accuracy to Clari/Gong without published benchmarks.
- Do NOT claim to replace CRM — we augment it.

---

### 22. Acceptance Criteria & Test Plan
**Owner:** Shared (all agents contribute; ARCH consolidates) - **Sign-off:** all

#### Must Feature Acceptance Tests

| Feature | Test ID | Scenario | Expected Result | Type |
|---|---|---|---|---|
| F-01 Deal Health Scoring | T-01a | Score a deal with 30 days in Negotiation (avg: 12 days) | Score < 40; factor shows "3x average stage duration" | Unit + Integration |
| F-01 Deal Health Scoring | T-01b | Score a deal with recent activity and on-track stage duration | Score > 70 | Unit + Integration |
| F-01 Deal Health Scoring | T-01c | Score updates within 15 min of CRM sync | New score exists with updated timestamp | Integration |
| F-02 Multi-Scenario Forecast | T-02a | Generate forecast for org with 100 scored deals | Three scenario numbers returned; commit < best_case; most_likely between them | Integration |
| F-02 Multi-Scenario Forecast | T-02b | Segment forecast by team with 3 teams | Three sets of scenario numbers, one per team | Integration |
| F-02 Multi-Scenario Forecast | T-02c | Compare forecast week-over-week | Delta values shown; direction indicators correct | E2E |
| F-03 Deal Slippage Alerts | T-03a | Deal has no activity for 8 days (threshold: 7) | Alert created with severity and detail | Integration |
| F-03 Deal Slippage Alerts | T-03b | Same deal/trigger re-evaluated within 48 hours | No duplicate alert created | Integration |
| F-03 Deal Slippage Alerts | T-03c | User snoozes alert for 7 days | Alert status = snoozed; no re-alert for 7 days | Integration |
| F-05 CRM Data Sync | T-05a | Connect Salesforce via OAuth | Access token stored encrypted; deals imported | Integration |
| F-05 CRM Data Sync | T-05b | Incremental sync captures deal stage change | Stage transition recorded; deal updated | Integration |
| F-05 CRM Data Sync | T-05c | Sync failure with CRM API down | Error logged; retry scheduled; user sees error status | Integration |
| F-07 Historical Data Store | T-07a | Query 12-month trend for org with 100K deals | Results returned in < 3 seconds | Performance |
| F-07 Historical Data Store | T-07b | Two orgs query simultaneously | Each sees only their own data | Security |

#### P0 Use Case Test Scenarios

| Use Case | Test ID | Scenario | Steps | Expected |
|---|---|---|---|---|
| UC-01 Morning Health Check | T-UC01 | Manager views at-risk deals | Login > Dashboard > Sort by score ascending | Top deals are red/yellow with factor explanations |
| UC-02 Weekly Forecast | T-UC02 | VP reviews forecast with drill-down | Login > Forecast > Click "By Team" > Click team name | Scenarios shown for selected team; deal list below |
| UC-03 Alert Response | T-UC03 | Manager clicks Slack alert link | Receive Slack message > Click link > View deal | Deal detail loads with score, timeline, CRM link |
| UC-06 Initial Setup | T-UC06 | RevOps connects CRM first time | Create account > Connect SF > Map stages > Wait for sync | Dashboard populated with real deals within 2 hours |

#### NFR Tests

| NFR | Test ID | Method | Pass Criteria |
|---|---|---|---|
| Dashboard LCP | T-NFR01 | Lighthouse CI on preview deploy | LCP < 2.5s |
| Forecast query perf | T-NFR02 | k6 load test with 100K deal dataset | p95 < 3s |
| Multi-tenant isolation | T-NFR03 | API calls with Org A token requesting Org B data | 404 on all cross-org requests |
| CRM token encryption | T-NFR04 | Direct DB query for crm_credentials | No plaintext tokens visible |
| WCAG AA | T-NFR05 | axe-core scan on all pages | Zero violations at AA level |

#### Test Data Requirements
- Synthetic dataset generator producing realistic deal distributions: stage distribution, close rates, seasonal patterns, deal size ranges.
- Demo org with 2 years of synthetic history and 500 open deals.
- Two test orgs for multi-tenancy verification.
- Salesforce and HubSpot sandbox accounts with test data.

#### Definition of Done (Release)
- All Must features pass acceptance tests.
- All P0 use case scenarios pass E2E tests.
- All NFR thresholds met.
- No critical or high-severity bugs open.
- Setup documentation validates on a clean machine.
- Demo org is live and accessible for sales demos.

---

### 23. Open Questions & Decision Log

#### Open Questions

| # | Question | Blocked By | Owner | By When | Status |
|---|---|---|---|---|---|
| OQ-01 | Should we support multiple pipelines per CRM connection in MVP, or only the primary pipeline? | F-05 scope | ARCH | 2026-06-20 | Open |
| OQ-02 | What is the minimum historical data needed for reliable scoring? 3 months? 6 months? | F-01 accuracy | ARCH + PMM | 2026-06-25 | Open |
| OQ-03 | Should forecasts include renewal/expansion pipeline or only new business? | F-02 scope | PMM | 2026-06-20 | Open |
| OQ-04 | How should we handle deals with missing amounts ($0 or null)? Exclude from forecast or impute? | F-01, F-02 | ARCH | 2026-06-20 | Open |
| OQ-05 | Do we share the RevOps1 Neon database or provision a separate one? | Architecture cost | ARCH + SE | 2026-06-18 | Open |
| OQ-06 | Is this a new Next.js app or a route group within the existing RevOps1 app? | Architecture | ARCH | 2026-06-18 | Open — major |
| OQ-07 | Pricing model: per-seat, per-org, or usage-based? | GTM | PMM | 2026-07-01 | Open |

#### Decision Log

| # | Decision | Context | Options Considered | Choice | Rationale | Date | Affects |
|---|---|---|---|---|---|---|---|
| D-01 | Weighted factor model for scoring, not ML | MVP needs explainable scores; insufficient training data across customers | (a) Logistic regression (b) XGBoost (c) Weighted factor model (d) Simple stage-weighted | (c) Weighted factor model | Explainable, no training pipeline, works with single-org data, upgradeable to ML later | 2026-06-11 | SS9 F-01, SS13 |
| D-02 | Shared PostgreSQL, not separate analytics DB | Data volume at MVP is modest; operational simplicity | (a) Separate ClickHouse (b) Postgres + materialized views (c) Shared Postgres with indexes | (c) Shared Postgres | Keeps ops simple; materialized views for dashboards if perf degrades; revisit at > 1M deals | 2026-06-11 | SS13, SS15 |
| D-03 | Direct CRM API integration, not iPaaS | Full control over data mapping and sync behavior | (a) Fivetran (b) Airbyte (c) Direct API (d) RevOps1 webhook ingestion | (c) Direct API | No vendor dependency for core data path; RevOps1 webhooks can supplement but shouldn't be the only source | 2026-06-11 | SS16, SS19 |
| D-04 | Modular monolith architecture | Consistent with RevOps1; faster to build | (a) Microservices (b) Modular monolith (c) Serverless functions | (b) Modular monolith | Single deploy unit; modules can be extracted later if needed | 2026-06-11 | SS13 |
| D-05 | RLS-based multi-tenancy | Consistent with RevOps1 pattern | (a) Separate databases (b) Separate schemas (c) Shared schema + RLS | (c) Shared schema + RLS | Lower cost, simpler operations, proven pattern in RevOps1 | 2026-06-11 | SS13, SS14, SS20 |

---

### 24. Implementation Roadmap
**Owner:** ARCH - **Reviewers:** PMM, UX, TMM - **Contributor:** SE

#### Phase 1: Walking Skeleton (2 weeks)
**Scope:** End-to-end data path with minimal UI.
- F-05 (CRM Data Sync): Salesforce OAuth + initial import + incremental sync.
- F-07 (Historical Data Store): Core schema, migrations, daily snapshots.
- F-01 (Deal Health Scoring): V1 scoring with 3 factors (stage duration, activity recency, deal age).
- Minimal dashboard: deal list with health scores.
- **Features:** F-01 (partial), F-05 (SF only), F-07
- **Exit criteria:** Deals from a Salesforce sandbox are synced, scored, and displayed on a page. Score updates after a deal change in Salesforce.
- **Test slice:** T-01a, T-01b, T-05a, T-05b, T-07b
- **Risk:** Salesforce API complexity (bulk vs. REST); mitigate with jsforce library.

#### Phase 2: MVP (3 weeks)
**Scope:** Core product experience complete.
- F-01 (Deal Health Scoring): Full factor model (5-7 factors), score history, factor explanations.
- F-02 (Multi-Scenario Forecasting): Three scenarios, segmentation, week-over-week comparison.
- F-03 (Deal Slippage Alerts): Rule engine, in-app notifications.
- F-05 (CRM Data Sync): HubSpot support added.
- Dashboard: deal health view, forecast view, alert feed.
- Auth: user accounts with org membership.
- **Features:** F-01, F-02, F-03, F-05 (full), F-07
- **Exit criteria:** A user can connect a CRM, see scored deals, view a three-scenario forecast, and receive in-app slippage alerts. Demo org is live.
- **Test slice:** All T-01x, T-02x, T-03x, T-05x, T-07x, T-UC01, T-UC02, T-UC06
- **Risk:** Scoring accuracy with limited data; mitigate by testing against RevOps1 demo data.

#### Phase 3: V1 (3 weeks)
**Scope:** Production-ready with notifications and analytics.
- F-04 (Pipeline Trends): Trend dashboards, cohort analysis.
- F-06 (Notification Delivery): Slack integration, email digests.
- F-08 (Pipeline Coverage): Coverage heatmap, quota targets.
- Public API (consistent with RevOps1 API patterns).
- NFR hardening: performance optimization, accessibility audit, security review.
- **Features:** F-04, F-06, F-08, API
- **Exit criteria:** Full feature set deployed; all NFR thresholds met; 3 beta customers onboarded.
- **Test slice:** All acceptance tests, all NFR tests, all P0 use case E2E tests.
- **Risk:** Slack app approval process (2-4 weeks); mitigate by using incoming webhooks initially.

#### Critical Path
```
F-05 (CRM Sync) → F-07 (Data Store) → F-01 (Scoring) → F-02 (Forecast) → F-03 (Alerts)
                                                       → F-04 (Trends)
                                                                        → F-08 (Coverage)
                                           F-06 (Notifications) ← F-03
```

CRM Sync is the critical dependency — nothing works without data. Scoring is next — forecasts and alerts both depend on scored deals. Trends and coverage can be built in parallel once the data store is populated.

---

## Convergence Workflow

### Phase 0 — Intake & Alignment *(all agents)*
Read the metadata and RevOps1 context. Agree: this is a pipeline analytics module for the F3 Insights ecosystem, not a standalone CRM or sales engagement tool. Scope boundary: read-only CRM integration, leadership-facing (not rep-facing), USD-only for MVP.
**Exit gate:** All agents agree on scope boundaries. OQ-06 (separate app vs. route group) must be resolved before Phase 3 work begins.

### Phase 1 — Problem & Audience *(PMM lead, UX + TMM contribute)*
Lock SS2, 3, 5, 6, 10, 11. Three personas defined; five pains ranked; goals with measurable KPIs.
**Exit gate:** Personas and pains are stable. UX can build journeys; ARCH can decompose features.

### Phase 2 — Experience & Capability *(UX lead, PMM + SE + TMM contribute)*
Lock SS4, 7, 8, 12. Six use cases defined (4 P0, 2 P1); workflow fit mapped; getting started flow designed.
**Exit gate:** Every P0 use case has a defined trigger, actor, steps, and outcome. Capability list agreed.

### Phase 3 — Features & Architecture *(ARCH lead, UX + SE + TMM contribute)*
Lock SS9, 13, 14, 15, 16, 20. Eight features decomposed; architecture designed; data model defined; NFRs measurable.
**Exit gate:** Every Must feature maps to a component and data contract. SE confirms Vercel + Neon deployment feasibility.

### Phase 4 — Setup, Config & Deployment *(SE lead, ARCH contributes)*
Lock SS17, 18, 19. Setup guide, config reference, deployment pipeline, and integration guides complete.
**Exit gate:** A clean machine can reach a running dev instance following the setup guide.

### Phase 5 — Positioning & Proof *(TMM lead, PMM contributes)*
Lock SS21. Competitive positioning finalized; messaging guardrails set; proof points identified.
**Exit gate:** Every differentiator traces to a committed feature. "AI-powered" is explicitly quarantined.

### Phase 6 — Convergence & Test Readiness *(all agents, ARCH consolidates)*
Build SS22 from acceptance criteria aggregated across features, use cases, and NFRs. Clear blocking questions in SS23. Sequence SS24.
**Exit gate (Test-Ready):**
- Every Must feature (F-01, F-02, F-03, F-05, F-07): defined, mapped to pain/use case, with acceptance criteria and tests.
- Every P0 use case (UC-01 through UC-03, UC-06): covered by E2E test scenario.
- Every NFR: measurable threshold with test method defined.
- No open question blocks a Must feature (OQ-06 is the current risk).
- Phase 1 (Walking Skeleton) is scoped and immediately startable.

---

## Traceability Chain

> **Persona (SS5) -> Pain (SS6) -> Use Case (SS8) -> Feature (SS9) -> Benefit (SS11) -> Component (SS13) -> Contract (SS14) -> Test (SS22)**

| Persona | Pain | Use Case | Feature | Benefit | Component | Test |
|---|---|---|---|---|---|---|
| VP of Sales | P-01 Forecast inaccuracy | UC-02, UC-04 | F-02 Forecasting | B-01 Data-driven forecast | Forecast Engine | T-02a-c, T-UC02 |
| Manager | P-02 Late slippage discovery | UC-01, UC-03 | F-01 Scoring, F-03 Alerts | B-02 Catch stalls early | Scoring + Alert Engine | T-01a-c, T-03a-c, T-UC01, T-UC03 |
| Manager, VP | P-03 Unproductive reviews | UC-01 | F-01 Scoring, F-04 Trends | B-03 Strategy over status | Scoring + Analytics | T-01a-c, T-UC01 |
| RevOps | P-04 No single source | UC-05, UC-06 | F-07 Data Store, F-08 Coverage | B-04 One source of truth | Data Store | T-07a-b, T-UC06 |
| VP, RevOps | P-05 Hard to analyze history | UC-04, UC-05 | F-04 Trends, F-07 Data Store | B-05 Trajectory, not just state | Analytics + Data Store | T-NFR02, T-UC02 |

No orphan features: every feature resolves at least one pain and supports at least one use case. No orphan pains: every pain has a feature addressing it.

---

## Conventions

- Feature IDs (`F-01`) are stable join keys across SS9, SS22, SS24.
- Unknowns are in SS23, not guessed in prose.
- All thresholds in SS20 are testable numbers, not adjectives.
- Each agent edits its owned sections freely and proposes edits to contributed sections via SS23.
- Brand and design follow the F3 Insights Brand Guide (Hanken Grotesk headings, Inter body, IBM Plex Mono data, navy/mist/gold palette, light default theme).
