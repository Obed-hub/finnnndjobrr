import { Job, BountyItem, AIWorkJob, LocationTier, EmploymentType, ScoreBreakdown } from '../../types';

export type SourceCategory = 
  | 'remote' 
  | 'freelance' 
  | 'web3' 
  | 'africa' 
  | 'ai_work' 
  | 'startup' 
  | 'aggregator';

export type SourceStatus = 'active' | 'degraded' | 'failed' | 'disabled' | 'requires_config';

export type AuthType = 'none' | 'api_key' | 'oauth';

export interface IngestionLogEntry {
  id: string;
  timestamp: string;
  sourceId: string;
  sourceName: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  details?: any;
}

export interface SourceTelemetry {
  sourceId: string;
  sourceName: string;
  category: SourceCategory;
  endpointUrl: string;
  authType: AuthType;
  isConfigured: boolean;
  enabled: boolean;
  status: SourceStatus;
  syncIntervalMinutes: number;
  lastSync: string | null;
  nextSync: string | null;
  latencyMs: number;
  discoveredCount: number;
  importedCount: number;
  updatedCount: number;
  expiredCount: number;
  duplicatesPrevented: number;
  errorCount: number;
  consecutiveFailures: number;
  lastError?: string;
  description: string;
  supportedJobTypes: string[];
}

export interface IngestionResult {
  sourceId: string;
  sourceName: string;
  status: 'success' | 'partial' | 'failed';
  jobs: Job[];
  bounties?: BountyItem[];
  aiJobs?: AIWorkJob[];
  discoveredCount: number;
  importedCount: number;
  updatedCount: number;
  duplicatesCount: number;
  latencyMs: number;
  errorMessage?: string;
}

export interface SourceAdapter {
  id: string;
  name: string;
  category: SourceCategory;
  endpointUrl: string;
  authType: AuthType;
  description: string;
  syncIntervalMinutes: number;
  supportedJobTypes: string[];
  
  isConfigured(): boolean;
  fetch(): Promise<any[]>;
  normalize(rawItem: any, index: number): Job | null;
  testConnection(): Promise<{ success: boolean; latencyMs: number; message: string; sampleCount?: number }>;
}

export interface GlobalIngestionMetrics {
  totalJobsIndexed: number;
  totalActiveSources: number;
  totalSourcesCount: number;
  lastGlobalSync: string;
  isIngesting: boolean;
  averageLatencyMs: number;
  duplicatesPreventedTotal: number;
  nigeriaEligibleCount: number;
  africaEligibleCount: number;
  worldwideCount: number;
  aiWorkCount: number;
  web3BountiesCount: number;
  byCategory: Record<string, number>;
  bySource: Record<string, number>;
}
