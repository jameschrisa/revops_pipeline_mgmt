export type StandardStage =
  | "Lead"
  | "Qualified"
  | "Proposal"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export const OPEN_STAGES: StandardStage[] = [
  "Lead",
  "Qualified",
  "Proposal",
  "Negotiation",
];

export interface Deal {
  id: string;
  crmDealId: string;
  name: string;
  accountName: string;
  amount: number;
  currency: "USD";
  ownerName: string;
  ownerEmail: string;
  team: string;
  productLine: string;
  region: string;
  currentStage: StandardStage;
  closeDate: string; // ISO date
  createdDate: string; // ISO date
  lastActivity: string; // ISO datetime
  isOpen: boolean;
  outcome: "won" | "lost" | null;
  stageEnteredAt: string; // ISO date — when the deal entered its current stage
}

export interface StageTransition {
  dealId: string;
  fromStage: StandardStage | null;
  toStage: StandardStage;
  transitionedAt: string;
  daysInStage: number;
}

export interface Activity {
  dealId: string;
  activityType: "email" | "call" | "meeting" | "note" | "stage_change";
  occurredAt: string;
  summary: string;
}

export interface ScoreFactor {
  name: string;
  impact: number; // signed contribution to the score
  value: string;
  benchmark: string;
  description: string;
}

export interface DealScore {
  dealId: string;
  score: number; // 0-100
  band: "good" | "warn" | "risk";
  factors: ScoreFactor[];
  scoredAt: string;
  modelVersion: string;
  history: { date: string; score: number }[];
}

export interface ScoredDeal extends Deal {
  score: DealScore;
}

export type AlertType = "inactivity" | "slippage" | "stage_duration";
export type AlertStatus = "active" | "snoozed" | "dismissed";

export interface Alert {
  id: string;
  dealId: string;
  alertType: AlertType;
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  status: AlertStatus;
  snoozedUntil: string | null;
  createdAt: string;
}

export interface PipelineSnapshot {
  date: string;
  totalPipeline: number;
  weightedPipeline: number;
  dealCount: number;
  stageBreakdown: Record<string, number>;
}

export interface ForecastScenarios {
  bestCase: number;
  commit: number;
  mostLikely: number;
  confidenceLow: number;
  confidenceHigh: number;
  closedWon: number;
  dealCount: number;
}

export interface ForecastSegment extends ForecastScenarios {
  name: string;
}

export interface ForecastHistoryPoint {
  date: string;
  bestCase: number;
  commit: number;
  mostLikely: number;
}

export interface QuotaTarget {
  period: string;
  dimension: string; // e.g. "team:West"
  targetAmount: number;
}

export interface CoverageSegment {
  name: string;
  dimension: string;
  weightedPipeline: number;
  rawPipeline: number;
  quota: number;
  coverageRatio: number;
  gap: number;
  dealCount: number;
}

export interface SyncStatus {
  crmType: "salesforce";
  connected: boolean;
  lastSync: string;
  nextSync: string;
  recordsSynced: number;
  errors: string[];
  intervalMinutes: number;
}
