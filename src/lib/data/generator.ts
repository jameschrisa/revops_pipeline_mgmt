import {
  Activity,
  Deal,
  PipelineSnapshot,
  QuotaTarget,
  StageTransition,
  StandardStage,
} from "../types";

// Deterministic PRNG (mulberry32) so the demo dataset is stable across builds.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0xf3f3f3);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const between = (min: number, max: number) => min + rand() * (max - min);
const intBetween = (min: number, max: number) => Math.floor(between(min, max + 1));

export const DAY_MS = 86_400_000;

// Anchor "today" at midnight so all derived values are stable within a day.
export const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const daysAgo = (n: number) => new Date(TODAY.getTime() - n * DAY_MS);
export const daysFromNow = (n: number) => new Date(TODAY.getTime() + n * DAY_MS);

export function quarterOf(d: Date): string {
  return `Q${Math.floor(d.getMonth() / 3) + 1}-${d.getFullYear()}`;
}

export function quarterRange(period: string): { start: Date; end: Date } {
  const [q, y] = period.split("-");
  const qi = parseInt(q.slice(1), 10) - 1;
  const year = parseInt(y, 10);
  const start = new Date(year, qi * 3, 1);
  const end = new Date(year, qi * 3 + 3, 0);
  return { start, end };
}

export const CURRENT_QUARTER = quarterOf(TODAY);
export const NEXT_QUARTER = (() => {
  const { end } = quarterRange(CURRENT_QUARTER);
  return quarterOf(new Date(end.getTime() + 2 * DAY_MS));
})();

export const TEAMS = ["West", "East", "Central", "EMEA"];
export const PRODUCT_LINES = ["Platform", "Analytics", "Signals Add-on"];
export const REGION_BY_TEAM: Record<string, string> = {
  West: "NA-West",
  East: "NA-East",
  Central: "NA-Central",
  EMEA: "EMEA",
};

// Median days a healthy deal spends in each open stage (org benchmark).
export const STAGE_BENCHMARK_DAYS: Record<string, number> = {
  Lead: 9,
  Qualified: 14,
  Proposal: 12,
  Negotiation: 11,
};
export const MEDIAN_CYCLE_DAYS = 46;

const OWNERS = [
  { name: "Priya Raman", team: "West" },
  { name: "Marcus Webb", team: "West" },
  { name: "Elena Vasquez", team: "West" },
  { name: "Tom Okafor", team: "East" },
  { name: "Rachel Stein", team: "East" },
  { name: "Devon Park", team: "East" },
  { name: "Hannah Liu", team: "Central" },
  { name: "Jake Morrison", team: "Central" },
  { name: "Sofia Andersen", team: "EMEA" },
  { name: "Lukas Brandt", team: "EMEA" },
  { name: "Amara Diallo", team: "EMEA" },
  { name: "Chris Donnelly", team: "Central" },
];

const ACCOUNT_PREFIX = [
  "Northwind", "Apex", "Bluepeak", "Cinder", "Drift", "Everline", "Fathom",
  "Granite", "Halcyon", "Ironwood", "Juniper", "Kestrel", "Lattice", "Meridian",
  "Nimbus", "Orchard", "Pinnacle", "Quarry", "Redwood", "Summit", "Tidewater",
  "Umbra", "Vector", "Wavecrest", "Zenith", "Caldera", "Foxglove", "Harbor",
  "Linden", "Monarch", "Outpost", "Sterling", "Tundra", "Vantage", "Westbrook",
];
const ACCOUNT_SUFFIX = [
  "Industries", "Systems", "Logistics", "Health", "Financial", "Manufacturing",
  "Robotics", "Software", "Energy", "Media", "Biotech", "Networks", "Retail Group",
  "Aerospace", "Foods", "Insurance", "Labs", "Dynamics",
];
const DEAL_KIND = [
  "Platform License", "Expansion", "Enterprise Rollout", "Annual Renewal Uplift",
  "Pilot Conversion", "Multi-Region Deployment", "Analytics Suite", "Signal Engine Add-on",
  "Team Expansion", "Migration",
];

function dealAmount(productLine: string): number {
  // Log-normal-ish: many mid-size deals, a long tail of large ones.
  const base = productLine === "Platform" ? 48000 : productLine === "Analytics" ? 32000 : 18000;
  const mult = Math.exp(between(-0.9, 1.4));
  return Math.round((base * mult) / 500) * 500;
}

const ownerEmail = (name: string) =>
  name.toLowerCase().replace(/[^a-z ]/g, "").replace(/ /g, ".") + "@meridiandemo.com";

export interface GeneratedData {
  deals: Deal[];
  transitions: StageTransition[];
  activities: Activity[];
  snapshots: PipelineSnapshot[];
  quotaTargets: QuotaTarget[];
}

function makeAccount(): string {
  return `${pick(ACCOUNT_PREFIX)} ${pick(ACCOUNT_SUFFIX)}`;
}

let dealSeq = 1000;

function buildClosedDeal(closedDaysAgo: number): { deal: Deal; transitions: StageTransition[] } {
  const owner = pick(OWNERS);
  const productLine = pick(PRODUCT_LINES);
  const won = rand() < 0.34;
  const account = makeAccount();
  // Lost deals tend to die faster or drag much longer.
  const cycleDays = won
    ? Math.round(MEDIAN_CYCLE_DAYS * between(0.55, 1.9))
    : Math.round(MEDIAN_CYCLE_DAYS * (rand() < 0.5 ? between(0.3, 0.9) : between(1.2, 2.8)));
  const closeDate = daysAgo(closedDaysAgo);
  const createdDate = new Date(closeDate.getTime() - cycleDays * DAY_MS);
  const id = `deal_${dealSeq++}`;

  const stages: StandardStage[] = ["Lead", "Qualified", "Proposal", "Negotiation"];
  // Lost deals may exit early; won deals traverse all stages.
  const reached = won ? 4 : intBetween(1, 4);
  const transitions: StageTransition[] = [];
  let cursor = createdDate.getTime();
  const slice = cycleDays / (reached + 1);
  let prev: StandardStage | null = null;
  for (let i = 0; i < reached; i++) {
    const dwell = Math.max(1, Math.round(slice * between(0.5, 1.6)));
    transitions.push({
      dealId: id,
      fromStage: prev,
      toStage: stages[i],
      transitionedAt: new Date(cursor).toISOString(),
      daysInStage: dwell,
    });
    prev = stages[i];
    cursor += dwell * DAY_MS;
  }
  transitions.push({
    dealId: id,
    fromStage: prev,
    toStage: won ? "Closed Won" : "Closed Lost",
    transitionedAt: closeDate.toISOString(),
    daysInStage: 0,
  });

  const deal: Deal = {
    id,
    crmDealId: `006${dealSeq}SF`,
    name: `${account} — ${pick(DEAL_KIND)}`,
    accountName: account,
    amount: dealAmount(productLine),
    currency: "USD",
    ownerName: owner.name,
    ownerEmail: ownerEmail(owner.name),
    team: owner.team,
    productLine,
    region: REGION_BY_TEAM[owner.team],
    currentStage: won ? "Closed Won" : "Closed Lost",
    closeDate: iso(closeDate),
    createdDate: iso(createdDate),
    lastActivity: closeDate.toISOString(),
    isOpen: false,
    outcome: won ? "won" : "lost",
    stageEnteredAt: iso(closeDate),
  };
  return { deal, transitions };
}

function buildOpenDeal(idx: number): {
  deal: Deal;
  transitions: StageTransition[];
  activities: Activity[];
} {
  const owner = pick(OWNERS);
  const productLine = pick(PRODUCT_LINES);
  const account = makeAccount();
  const id = `deal_${dealSeq++}`;
  const stages: StandardStage[] = ["Lead", "Qualified", "Proposal", "Negotiation"];
  const stageIdx = intBetween(0, 3);
  const currentStage = stages[stageIdx];

  // Archetypes: ~55% healthy, ~25% drifting, ~20% stalled — gives the demo
  // a realistic mix of green/yellow/red and material for the alert feed.
  const archetype = rand() < 0.55 ? "healthy" : rand() < 0.55 ? "drifting" : "stalled";

  const benchmark = STAGE_BENCHMARK_DAYS[currentStage];
  const daysInStage =
    archetype === "healthy"
      ? intBetween(1, benchmark)
      : archetype === "drifting"
        ? Math.round(benchmark * between(1.2, 2.0))
        : Math.round(benchmark * between(2.1, 4.5));

  const activityGap =
    archetype === "healthy" ? intBetween(0, 4) : archetype === "drifting" ? intBetween(5, 9) : intBetween(8, 24);

  // Age accumulates through earlier stages.
  let age = daysInStage;
  const transitions: StageTransition[] = [];
  for (let i = stageIdx - 1; i >= 0; i--) {
    age += Math.round(STAGE_BENCHMARK_DAYS[stages[i]] * between(0.6, 1.5));
  }
  const createdDate = daysAgo(age);
  let cursor = createdDate.getTime();
  let prev: StandardStage | null = null;
  for (let i = 0; i <= stageIdx; i++) {
    const dwell = i === stageIdx ? daysInStage : Math.round(STAGE_BENCHMARK_DAYS[stages[i]] * between(0.6, 1.5));
    transitions.push({
      dealId: id,
      fromStage: prev,
      toStage: stages[i],
      transitionedAt: new Date(cursor).toISOString(),
      daysInStage: i === stageIdx ? daysInStage : dwell,
    });
    prev = stages[i];
    cursor += dwell * DAY_MS;
  }

  // Close dates: mostly this quarter, some next; stalled deals often past due.
  let closeDate: Date;
  if (archetype === "stalled" && rand() < 0.5) {
    closeDate = daysAgo(intBetween(2, 21)); // slipped past close date
  } else {
    closeDate = daysFromNow(intBetween(7, 110));
  }

  const lastActivityDate = new Date(daysAgo(activityGap).getTime() + Math.floor(between(8, 18)) * 3600_000);

  const activities: Activity[] = [];
  const kinds: Activity["activityType"][] = ["email", "call", "meeting", "note"];
  const summaries: Record<string, string[]> = {
    email: ["Sent proposal follow-up", "Pricing questions answered", "Intro to security team", "Shared case study"],
    call: ["Discovery call", "Technical deep-dive", "Procurement check-in", "Champion sync"],
    meeting: ["Executive briefing", "Demo with eval team", "Onsite workshop", "Contract review meeting"],
    note: ["Champion confirmed budget", "Competitor mentioned: Clari", "Legal redlines received", "Waiting on security review"],
  };
  const activityCount = intBetween(4, 10);
  let aCursor = lastActivityDate.getTime();
  for (let i = 0; i < activityCount; i++) {
    const kind = pick(kinds);
    activities.push({
      dealId: id,
      activityType: kind,
      occurredAt: new Date(aCursor).toISOString(),
      summary: pick(summaries[kind]),
    });
    aCursor -= Math.floor(between(1, 9)) * DAY_MS;
    if (aCursor < createdDate.getTime()) break;
  }

  const amount =
    idx % 17 === 0
      ? Math.round(between(180000, 420000) / 1000) * 1000 // a few whales for concentration-risk stories
      : dealAmount(productLine);

  const deal: Deal = {
    id,
    crmDealId: `006${dealSeq}SF`,
    name: `${account} — ${pick(DEAL_KIND)}`,
    accountName: account,
    amount,
    currency: "USD",
    ownerName: owner.name,
    ownerEmail: ownerEmail(owner.name),
    team: owner.team,
    productLine,
    region: REGION_BY_TEAM[owner.team],
    currentStage,
    closeDate: iso(closeDate),
    createdDate: iso(createdDate),
    lastActivity: lastActivityDate.toISOString(),
    isOpen: true,
    outcome: null,
    stageEnteredAt: iso(daysAgo(daysInStage)),
  };
  return { deal, transitions, activities };
}

function buildSnapshots(openDeals: Deal[]): PipelineSnapshot[] {
  const currentTotal = openDeals.reduce((s, d) => s + d.amount, 0);
  const currentCount = openDeals.length;
  const snapshots: PipelineSnapshot[] = [];
  const noise = mulberry32(0xbeef01);
  for (let n = 364; n >= 0; n--) {
    // Pipeline grew ~35% over the trailing year with weekly texture and a
    // quarter-end dip (deals closing out) — anchored to today's real total.
    const t = 1 - n / 364;
    const growth = 0.74 + 0.26 * t;
    const date = daysAgo(n);
    const week = Math.sin((date.getTime() / DAY_MS / 7) * Math.PI) * 0.04;
    const month = date.getMonth();
    const qEndDip = [2, 5, 8, 11].includes(month) && date.getDate() > 20 ? -0.05 : 0;
    const jitter = (noise() - 0.5) * 0.05;
    const total = Math.round(currentTotal * (growth + week + qEndDip + jitter));
    const count = Math.round(currentCount * (growth + jitter));
    snapshots.push({
      date: iso(date),
      totalPipeline: total,
      weightedPipeline: Math.round(total * (0.38 + (noise() - 0.5) * 0.04)),
      dealCount: count,
      stageBreakdown: {
        Lead: Math.round(total * 0.31),
        Qualified: Math.round(total * 0.27),
        Proposal: Math.round(total * 0.24),
        Negotiation: Math.round(total * 0.18),
      },
    });
  }
  return snapshots;
}

function buildQuotaTargets(openDeals: Deal[]): QuotaTarget[] {
  const targets: QuotaTarget[] = [];
  for (const period of [CURRENT_QUARTER, NEXT_QUARTER]) {
    for (const team of TEAMS) {
      const pipeline = openDeals.filter((d) => d.team === team).reduce((s, d) => s + d.amount, 0);
      // Quotas set so coverage lands in a 1.8x–4.2x band across segments.
      targets.push({
        period,
        dimension: `team:${team}`,
        targetAmount: Math.round((pipeline * between(0.11, 0.30)) / 5000) * 5000,
      });
    }
    for (const pl of PRODUCT_LINES) {
      const pipeline = openDeals.filter((d) => d.productLine === pl).reduce((s, d) => s + d.amount, 0);
      targets.push({
        period,
        dimension: `product_line:${pl}`,
        targetAmount: Math.round((pipeline * between(0.11, 0.30)) / 5000) * 5000,
      });
    }
  }
  return targets;
}

export function generateData(): GeneratedData {
  const deals: Deal[] = [];
  const transitions: StageTransition[] = [];
  const activities: Activity[] = [];

  // ~700 closed deals across the trailing 24 months (denser in recent months).
  for (let i = 0; i < 700; i++) {
    const closedDaysAgo = Math.round(Math.pow(rand(), 1.35) * 720) + 1;
    const { deal, transitions: t } = buildClosedDeal(closedDaysAgo);
    deals.push(deal);
    transitions.push(...t);
  }

  // ~150 open deals.
  for (let i = 0; i < 150; i++) {
    const { deal, transitions: t, activities: a } = buildOpenDeal(i);
    deals.push(deal);
    transitions.push(...t);
    activities.push(...a);
  }

  const openDeals = deals.filter((d) => d.isOpen);
  return {
    deals,
    transitions,
    activities,
    snapshots: buildSnapshots(openDeals),
    quotaTargets: buildQuotaTargets(openDeals),
  };
}
