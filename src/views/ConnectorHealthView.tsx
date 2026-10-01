import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Server, 
  Clock, 
  ShieldCheck,
  Zap,
  ExternalLink,
  BookOpen,
  Filter,
  Terminal,
  X,
  Play,
  Check,
  Radio,
  ToggleLeft,
  ToggleRight,
  Database,
  Globe,
  Coins,
  Cpu,
  MapPin,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import { 
  fetchIngestionSourcesApi, 
  fetchIngestionMetricsApi, 
  fetchIngestionLogsApi, 
  syncAllIngestionSourcesApi, 
  syncSingleSourceApi, 
  testSourceConnectionApi, 
  toggleSourceEnabledApi 
} from '../lib/api';
import { SourceTelemetry, GlobalIngestionMetrics, IngestionLogEntry, SourceCategory } from '../lib/ingestion/types';
import { useApp } from '../context/AppContext';

export const ConnectorHealthView: React.FC = () => {
  const { showToast, openMicro1ResearchModal } = useApp();
  const [sources, setSources] = useState<SourceTelemetry[]>([]);
  const [metrics, setMetrics] = useState<GlobalIngestionMetrics | null>(null);
  const [logs, setLogs] = useState<IngestionLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [activeSyncSourceId, setActiveSyncSourceId] = useState<string | null>(null);
  const [activeTestingSourceId, setActiveTestingSourceId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string; latencyMs: number }>>({});
  
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);
  const [logLevelFilter, setLogLevelFilter] = useState<string>('all');

  const loadData = async () => {
    try {
      const [sourcesRes, metricsRes, logsRes] = await Promise.all([
        fetchIngestionSourcesApi(),
        fetchIngestionMetricsApi(),
        fetchIngestionLogsApi(100)
      ]);
      setSources(sourcesRes.sources);
      setMetrics(metricsRes.metrics);
      setLogs(logsRes.logs);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      const res = await syncAllIngestionSourcesApi();
      setMetrics(res.metrics);
      showToast(res.message || 'Full ingestion sweep completed successfully!', 'success');
      loadData();
    } catch (err: any) {
      showToast(err?.message || 'Ingestion sweep initiated', 'info');
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleSyncSingle = async (sourceId: string, sourceName: string) => {
    setActiveSyncSourceId(sourceId);
    try {
      const res = await syncSingleSourceApi(sourceId);
      if (res.success) {
        showToast(`Synced ${res.result.importedCount} opportunities from ${sourceName}`, 'success');
      } else {
        showToast(res.result.errorMessage || `Failed to sync ${sourceName}`, 'error');
      }
      loadData();
    } catch (err: any) {
      showToast(`Sync error: ${err.message}`, 'error');
    } finally {
      setActiveSyncSourceId(null);
    }
  };

  const handleTestSource = async (sourceId: string, sourceName: string) => {
    setActiveTestingSourceId(sourceId);
    try {
      const res = await testSourceConnectionApi(sourceId);
      setTestResults(prev => ({
        ...prev,
        [sourceId]: { success: res.success, message: res.message, latencyMs: res.latencyMs }
      }));
      if (res.success) {
        showToast(`Connection test passed for ${sourceName} (${res.latencyMs}ms)`, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast(`Test failed: ${err.message}`, 'error');
    } finally {
      setActiveTestingSourceId(null);
    }
  };

  const handleToggleSource = async (sourceId: string, currentEnabled: boolean) => {
    try {
      const res = await toggleSourceEnabledApi(sourceId, !currentEnabled);
      setSources(prev => prev.map(s => s.sourceId === sourceId ? res.source : s));
      showToast(`${res.source.sourceName} is now ${res.source.enabled ? 'ENABLED' : 'DISABLED'}`, 'info');
    } catch (err: any) {
      showToast(`Failed to toggle source: ${err.message}`, 'error');
    }
  };

  const filteredSources = sources.filter(s => {
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesQuery = searchQuery === '' || 
      s.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.endpointUrl.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const filteredLogs = logs.filter(l => {
    if (logLevelFilter === 'all') return true;
    return l.level === logLevelFilter;
  });

  const categories: Array<{ id: string; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All Pipelines', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'remote', label: 'Remote Gateways', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'web3', label: 'Web3 & Escrow', icon: <Coins className="w-3.5 h-3.5" /> },
    { id: 'ai_work', label: 'AI Training & RLHF', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'africa', label: 'Africa & Nigeria', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'aggregator', label: 'External Aggregators', icon: <Database className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/15 text-emerald-300 font-mono flex items-center gap-1.5 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Multi-Source Ingestion Engine</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              {sources.filter(s => s.status === 'active').length} Active Source Pipelines
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              Continuous 24/7 Scheduler
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Job Ingestion & Source Observability
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Real-time telemetry, automated background workers, smart deduplication, and Africa/Nigeria eligibility classification across global remote job feeds, Web3 crypto escrow platforms, and frontier AI training hubs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setShowLogsModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 transition-colors"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Telemetry Logs</span>
            {logs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px]">
                {logs.length}
              </span>
            )}
          </button>

          <button
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            <RotateCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Ingesting All Sources...' : 'Run Global Ingestion Sweep'}</span>
          </button>
        </div>
      </div>

      {/* Global Ingestion Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-mono tracking-wider">Total Indexed Jobs</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics?.totalJobsIndexed.toLocaleString() || '...'}
            </span>
            <span className="text-[11px] text-emerald-400 block mt-0.5 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>Unified & Deduplicated Feed</span>
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-mono tracking-wider">Duplicates Prevented</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
              {metrics?.duplicatesPreventedTotal.toLocaleString() || '0'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
              Cross-source fingerprint matched
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-mono tracking-wider">Nigeria / Africa Friendly</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {((metrics?.nigeriaEligibleCount || 0) + (metrics?.africaEligibleCount || 0)).toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
              Direct USD / NGN & Crypto Escrow
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-mono tracking-wider">Average Feed Latency</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {metrics?.averageLatencyMs || 280}ms
            </span>
            <span className="text-[11px] text-emerald-400/80 block mt-0.5 font-mono">
              Non-blocking async workers
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => {
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                {cat.id !== 'all' && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
                    {sources.filter(s => s.category === cat.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search source by name, domain, URL..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Ingestion Sources Registry Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Registered Ingestion Source Adapters</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Polymorphic adapters handling Discovery, Fetch, Parse, Normalization, Eligibility Assessment, and Deduplication.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredSources.length} of {sources.length} sources
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Source & Category</th>
                <th className="p-4">Status & Sync Health</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Live Items</th>
                <th className="p-4">Duplicates Blocked</th>
                <th className="p-4">Sync Interval</th>
                <th className="p-4 text-right">Actions & Testing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredSources.map(source => {
                const isTesting = activeTestingSourceId === source.sourceId;
                const isSyncing = activeSyncSourceId === source.sourceId;
                const testResult = testResults[source.sourceId];

                let statusBadge = (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[10px] font-bold uppercase font-mono flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                );

                if (source.status === 'degraded') {
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-800/80 text-amber-300 text-[10px] font-bold uppercase font-mono flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Degraded</span>
                    </span>
                  );
                } else if (source.status === 'requires_config') {
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded-lg bg-purple-950/80 border border-purple-800/80 text-purple-300 text-[10px] font-bold uppercase font-mono flex items-center gap-1 w-fit">
                      <span>Requires Env Key</span>
                    </span>
                  );
                } else if (source.status === 'disabled') {
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-bold uppercase font-mono flex items-center gap-1 w-fit">
                      <span>Disabled</span>
                    </span>
                  );
                }

                return (
                  <tr key={source.sourceId} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-xs sm:text-sm">
                            {source.sourceName}
                          </span>
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {source.category.toUpperCase()}
                          </span>
                          {source.authType !== 'none' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300">
                              API Key
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                          {source.description}
                        </p>
                        {source.endpointUrl && (
                          <div className="flex items-center gap-1 text-[10px] text-cyan-500 font-mono pt-0.5">
                            <span className="truncate max-w-xs">{source.endpointUrl}</span>
                          </div>
                        )}
                        {testResult && (
                          <div className={`text-[10px] font-mono p-1.5 rounded-lg border mt-1.5 flex items-center gap-1.5 ${
                            testResult.success 
                              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50' 
                              : 'bg-rose-950/40 text-rose-300 border-rose-800/50'
                          }`}>
                            {testResult.success ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            <span>{testResult.message}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1.5">
                        {statusBadge}
                        <span className="text-[10px] text-slate-500 font-mono block">
                          Last Sync: {source.lastSync ? new Date(source.lastSync).toLocaleTimeString() : 'Awaiting sync'}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-300 font-mono">
                      {source.latencyMs > 0 ? `${source.latencyMs}ms` : '—'}
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-emerald-400 font-mono text-sm block">
                          {source.importedCount || 0}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Discovered: {source.discoveredCount || 0}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-purple-400">
                      {source.duplicatesPrevented || 0}
                    </td>

                    <td className="p-4 text-slate-400 font-mono text-xs">
                      Every {source.syncIntervalMinutes}m
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Enable/Disable Toggle */}
                        <button
                          onClick={() => handleToggleSource(source.sourceId, source.enabled)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            source.enabled 
                              ? 'text-emerald-400 hover:bg-emerald-500/10' 
                              : 'text-slate-600 hover:bg-slate-800'
                          }`}
                          title={source.enabled ? 'Disable source' : 'Enable source'}
                        >
                          {source.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>

                        {/* Test Connection Button */}
                        <button
                          onClick={() => handleTestSource(source.sourceId, source.sourceName)}
                          disabled={isTesting}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-mono text-[11px] font-bold flex items-center gap-1 transition-colors"
                          title="Test Connection & Latency"
                        >
                          <Zap className={`w-3 h-3 text-amber-400 ${isTesting ? 'animate-bounce' : ''}`} />
                          <span>{isTesting ? 'Testing...' : 'Test'}</span>
                        </button>

                        {/* Sync Single Source Button */}
                        <button
                          onClick={() => handleSyncSingle(source.sourceId, source.sourceName)}
                          disabled={isSyncing}
                          className="p-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 disabled:opacity-40 transition-colors"
                          title="Trigger instant sync for this source"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Telemetry Logs Inspector Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Live Ingestion Event & Telemetry Stream</h3>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Log Filters */}
            <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {['all', 'info', 'success', 'warn', 'error'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setLogLevelFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold uppercase transition-colors ${
                      logLevelFilter === lvl
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-850 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {filteredLogs.length} events logged
              </span>
            </div>

            {/* Logs Window */}
            <div className="p-4 overflow-y-auto font-mono text-[11px] space-y-2 flex-1 bg-slate-950/90 text-slate-300">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No log entries recorded for this filter.
                </div>
              ) : (
                filteredLogs.map(log => {
                  let badge = 'text-cyan-400';
                  if (log.level === 'success') badge = 'text-emerald-400';
                  if (log.level === 'warn') badge = 'text-amber-400';
                  if (log.level === 'error') badge = 'text-rose-400';

                  return (
                    <div key={log.id} className="p-2 rounded bg-slate-900/60 border border-slate-800/60 flex items-start gap-2.5">
                      <span className="text-slate-500 shrink-0 text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`font-bold uppercase text-[10px] shrink-0 ${badge}`}>
                        [{log.level}]
                      </span>
                      <span className="text-cyan-300/80 font-bold shrink-0">
                        {log.sourceName}:
                      </span>
                      <span className="text-slate-200 break-all flex-1">
                        {log.message}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Auto-refreshes periodically with ongoing worker cycles
              </span>
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Stream</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
