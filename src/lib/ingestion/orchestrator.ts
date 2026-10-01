import { 
  SourceAdapter, 
  SourceTelemetry, 
  IngestionResult, 
  IngestionLogEntry, 
  GlobalIngestionMetrics 
} from './types';
import { ALL_SOURCE_ADAPTERS } from './adapters';
import { deduplicateAndMergeJobs } from './engine/deduplicator';
import { Job, BountyItem, AIWorkJob } from '../../types';
import { INITIAL_JOBS } from '../../data/initialData';

class IngestionOrchestrator {
  private adapters: Map<string, SourceAdapter> = new Map();
  private telemetry: Map<string, SourceTelemetry> = new Map();
  private jobsCache: Job[] = [];
  private logs: IngestionLogEntry[] = [];
  private isIngesting = false;
  private timer: NodeJS.Timeout | null = null;
  private onUpdateCallback?: (jobs: Job[]) => void;

  constructor() {
    this.initializeAdapters();
  }

  private initializeAdapters() {
    for (const adapter of ALL_SOURCE_ADAPTERS) {
      this.adapters.set(adapter.id, adapter);
      
      const isConfigured = adapter.isConfigured();
      this.telemetry.set(adapter.id, {
        sourceId: adapter.id,
        sourceName: adapter.name,
        category: adapter.category,
        endpointUrl: adapter.endpointUrl,
        authType: adapter.authType,
        isConfigured,
        enabled: isConfigured,
        status: isConfigured ? 'active' : 'requires_config',
        syncIntervalMinutes: adapter.syncIntervalMinutes,
        lastSync: null,
        nextSync: new Date(Date.now() + adapter.syncIntervalMinutes * 60 * 1000).toISOString(),
        latencyMs: 0,
        discoveredCount: 0,
        importedCount: 0,
        updatedCount: 0,
        expiredCount: 0,
        duplicatesPrevented: 0,
        errorCount: 0,
        consecutiveFailures: 0,
        description: adapter.description,
        supportedJobTypes: adapter.supportedJobTypes
      });
    }

    this.log('info', 'system', 'Job Ingestion Orchestrator initialized with 14 production source adapters.');
  }

  public log(level: IngestionLogEntry['level'], sourceId: string, message: string, details?: any) {
    const entry: IngestionLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      sourceId,
      sourceName: this.adapters.get(sourceId)?.name || sourceId,
      level,
      message,
      details
    };
    this.logs.unshift(entry);
    if (this.logs.length > 200) {
      this.logs.pop();
    }
  }

  /**
   * Run ingestion for a single adapter
   */
  public async syncSingleSource(sourceId: string): Promise<IngestionResult> {
    const adapter = this.adapters.get(sourceId);
    const telem = this.telemetry.get(sourceId);

    if (!adapter || !telem) {
      throw new Error(`Source adapter "${sourceId}" not found`);
    }

    if (!telem.enabled && !adapter.isConfigured()) {
      return {
        sourceId,
        sourceName: adapter.name,
        status: 'failed',
        jobs: [],
        discoveredCount: 0,
        importedCount: 0,
        updatedCount: 0,
        duplicatesCount: 0,
        latencyMs: 0,
        errorMessage: 'Source is not configured or requires API credentials'
      };
    }

    const t0 = Date.now();
    this.log('info', sourceId, `Starting ingestion sync for ${adapter.name}...`);

    try {
      const rawItems = await adapter.fetch();
      const latency = Date.now() - t0;

      const normalizedJobs: Job[] = [];
      for (let i = 0; i < rawItems.length; i++) {
        const job = adapter.normalize(rawItems[i], i);
        if (job) {
          normalizedJobs.push(job);
        }
      }

      telem.lastSync = new Date().toISOString();
      telem.nextSync = new Date(Date.now() + telem.syncIntervalMinutes * 60 * 1000).toISOString();
      telem.latencyMs = latency;
      telem.discoveredCount = rawItems.length;
      telem.importedCount = normalizedJobs.length;
      telem.status = 'active';
      telem.consecutiveFailures = 0;
      telem.lastError = undefined;

      this.log('success', sourceId, `Synced ${normalizedJobs.length} live opportunities from ${adapter.name} (${latency}ms).`);

      // Merge into in-memory store
      const { mergedJobs, duplicatesPrevented } = deduplicateAndMergeJobs(normalizedJobs, this.jobsCache);
      this.jobsCache = mergedJobs;
      telem.duplicatesPrevented += duplicatesPrevented;

      if (this.onUpdateCallback) {
        this.onUpdateCallback(this.jobsCache);
      }

      return {
        sourceId,
        sourceName: adapter.name,
        status: 'success',
        jobs: normalizedJobs,
        discoveredCount: rawItems.length,
        importedCount: normalizedJobs.length,
        updatedCount: 0,
        duplicatesCount: duplicatesPrevented,
        latencyMs: latency
      };
    } catch (err: any) {
      const latency = Date.now() - t0;
      telem.errorCount += 1;
      telem.consecutiveFailures += 1;
      telem.latencyMs = latency;
      telem.lastError = err?.message || String(err);
      telem.status = telem.consecutiveFailures > 2 ? 'failed' : 'degraded';

      this.log('error', sourceId, `Failed to ingest from ${adapter.name}: ${err?.message}`, err);

      return {
        sourceId,
        sourceName: adapter.name,
        status: 'failed',
        jobs: [],
        discoveredCount: 0,
        importedCount: 0,
        updatedCount: 0,
        duplicatesCount: 0,
        latencyMs: latency,
        errorMessage: err?.message
      };
    }
  }

  /**
   * Run full parallel ingestion across all enabled source adapters
   */
  public async syncAllSources(force = false): Promise<IngestionResult[]> {
    if (this.isIngesting && !force) {
      this.log('warn', 'system', 'Ingestion cycle already in progress, skipping redundant trigger.');
      return [];
    }

    this.isIngesting = true;
    const t0 = Date.now();
    this.log('info', 'system', 'Initiating continuous multi-source ingestion sweep across all active pipelines...');

    const enabledAdapters = Array.from(this.adapters.values()).filter(a => {
      const telem = this.telemetry.get(a.id);
      return telem?.enabled && a.isConfigured();
    });

    const results = await Promise.allSettled(
      enabledAdapters.map(adapter => this.syncSingleSource(adapter.id))
    );

    const successfulResults: IngestionResult[] = [];
    const allFetchedJobs: Job[] = [];

    for (const r of results) {
      if (r.status === 'fulfilled') {
        successfulResults.push(r.value);
        allFetchedJobs.push(...r.value.jobs);
      }
    }

    // Include initial curated jobs as base foundation
    const { mergedJobs, duplicatesPrevented } = deduplicateAndMergeJobs(allFetchedJobs, INITIAL_JOBS);
    this.jobsCache = mergedJobs;

    const totalDuration = Date.now() - t0;
    this.isIngesting = false;

    this.log('success', 'system', `Ingestion cycle complete in ${totalDuration}ms. Total ${mergedJobs.length} active opportunities unified across ${enabledAdapters.length} live sources.`);

    if (this.onUpdateCallback) {
      this.onUpdateCallback(this.jobsCache);
    }

    return successfulResults;
  }

  /**
   * Starts background continuous scheduling
   */
  public startContinuousIngestion(onUpdate?: (jobs: Job[]) => void, intervalMinutes = 15) {
    if (onUpdate) {
      this.onUpdateCallback = onUpdate;
    }

    // Execute immediately on start
    this.syncAllSources();

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.syncAllSources();
    }, intervalMinutes * 60 * 1000);

    this.log('info', 'system', `Continuous ingestion worker scheduled every ${intervalMinutes} minutes.`);
  }

  public stopContinuousIngestion() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public toggleSourceEnabled(sourceId: string, enabled: boolean): SourceTelemetry {
    const telem = this.telemetry.get(sourceId);
    if (!telem) throw new Error(`Source ${sourceId} not found`);
    telem.enabled = enabled;
    telem.status = enabled ? (telem.isConfigured ? 'active' : 'requires_config') : 'disabled';
    this.log('info', sourceId, `Source ${telem.sourceName} is now ${enabled ? 'ENABLED' : 'DISABLED'}.`);
    return telem;
  }

  public async testSource(sourceId: string) {
    const adapter = this.adapters.get(sourceId);
    if (!adapter) throw new Error(`Source ${sourceId} not found`);
    this.log('info', sourceId, `Testing live connection for ${adapter.name}...`);
    const res = await adapter.testConnection();
    if (res.success) {
      this.log('success', sourceId, `Test connection succeeded (${res.latencyMs}ms): ${res.message}`);
    } else {
      this.log('error', sourceId, `Test connection failed: ${res.message}`);
    }
    return res;
  }

  public getTelemetry(): SourceTelemetry[] {
    return Array.from(this.telemetry.values());
  }

  public getLogs(limit = 100): IngestionLogEntry[] {
    return this.logs.slice(0, limit);
  }

  public getAllJobs(): Job[] {
    return this.jobsCache.length > 0 ? this.jobsCache : INITIAL_JOBS;
  }

  public getGlobalMetrics(): GlobalIngestionMetrics {
    const telems = Array.from(this.telemetry.values());
    const active = telems.filter(t => t.status === 'active').length;
    const totalDuplicates = telems.reduce((acc, t) => acc + t.duplicatesPrevented, 0);
    const avgLatency = telems.length > 0 
      ? Math.round(telems.reduce((acc, t) => acc + t.latencyMs, 0) / telems.filter(t => t.latencyMs > 0).length || 260)
      : 260;

    const jobs = this.getAllJobs();
    const byCategory: Record<string, number> = {};
    const bySource: Record<string, number> = {};

    let nigeriaEligibleCount = 0;
    let africaEligibleCount = 0;
    let worldwideCount = 0;
    let aiWorkCount = 0;
    let web3BountiesCount = 0;

    for (const j of jobs) {
      byCategory[j.category] = (byCategory[j.category] || 0) + 1;
      bySource[j.source] = (bySource[j.source] || 0) + 1;

      if (j.isNigeriaEligible) nigeriaEligibleCount++;
      if (j.isAfricaEligible) africaEligibleCount++;
      if (j.locationTier === 'tier3_worldwide' || j.locationTier === 'tier4_contractor') worldwideCount++;
      if (j.employmentType === 'ai_task' || j.category === 'AI & Data Annotation') aiWorkCount++;
      if (j.employmentType === 'bounty' || j.source.toLowerCase().includes('laborx') || j.source.toLowerCase().includes('superteam')) web3BountiesCount++;
    }

    return {
      totalJobsIndexed: jobs.length,
      totalActiveSources: active,
      totalSourcesCount: telems.length,
      lastGlobalSync: telems[0]?.lastSync || new Date().toISOString(),
      isIngesting: this.isIngesting,
      averageLatencyMs: avgLatency,
      duplicatesPreventedTotal: totalDuplicates,
      nigeriaEligibleCount,
      africaEligibleCount,
      worldwideCount,
      aiWorkCount,
      web3BountiesCount,
      byCategory,
      bySource
    };
  }
}

// Global Singleton
export const ingestionOrchestrator = new IngestionOrchestrator();
