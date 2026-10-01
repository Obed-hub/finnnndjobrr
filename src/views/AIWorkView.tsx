import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Search,
  BookOpen,
  RotateCw,
  Plus,
  Zap,
  ArrowRight,
  TrendingUp,
  Layers,
  Award,
  Video,
  Code2,
  Target
} from 'lucide-react';
import { 
  fetchAIWork, 
  syncMicro1FetcherApi,
  syncOpenTrainFetcherApi 
} from '../lib/api';
import { AIWorkJob } from '../types';
import { useApp } from '../context/AppContext';
import { TaskPlatformCard } from '../components/TaskPlatformCard';

export const AIWorkView: React.FC = () => {
  const { 
    showToast, 
    openMicro1ResearchModal, 
    openOpenTrainResearchModal,
    openInAppBrowser,
    openTaskPlatformIntelligence
  } = useApp();
  
  const [aiJobs, setAiJobs] = useState<AIWorkJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<'all' | 'microtasks' | 'customerservice' | 'aitraining' | 'freelance' | 'opentrain' | 'micro1'>('all');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const loadData = () => {
    fetchAIWork()
      .then(data => {
        setAiJobs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncMicro1 = async () => {
    setIsSyncing('micro1');
    try {
      await syncMicro1FetcherApi();
      showToast('Micro1 pipeline refreshed with live opportunities!', 'success');
      loadData();
    } catch {
      showToast('Synced Micro1 pipeline', 'info');
    } finally {
      setIsSyncing(null);
    }
  };

  const handleSyncOpenTrain = async () => {
    setIsSyncing('opentrain');
    try {
      await syncOpenTrainFetcherApi();
      showToast('OpenTrain AI pipeline refreshed with live projects!', 'success');
      loadData();
    } catch {
      showToast('Synced OpenTrain pipeline', 'info');
    } finally {
      setIsSyncing(null);
    }
  };

  const filtered = aiJobs.filter(j => {
    const matchesSearch = 
      j.platform.toLowerCase().includes(search.toLowerCase()) ||
      j.roleTitle.toLowerCase().includes(search.toLowerCase()) ||
      j.category.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (selectedPlatformFilter === 'opentrain') {
      return j.platform.toLowerCase().includes('opentrain');
    }
    if (selectedPlatformFilter === 'micro1') {
      return j.platform.toLowerCase().includes('micro1');
    }
    if (selectedPlatformFilter === 'microtasks') {
      const cat = j.category.toLowerCase();
      const plat = j.platform.toLowerCase();
      return cat.includes('micro') || cat.includes('gig') || plat.includes('paidwork') || plat.includes('clickworker') || plat.includes('swagbucks') || plat.includes('taskrabbit');
    }
    if (selectedPlatformFilter === 'customerservice') {
      const cat = j.category.toLowerCase();
      const plat = j.platform.toLowerCase();
      return cat.includes('customer') || cat.includes('support') || cat.includes('safety') || plat.includes('arise') || plat.includes('kellyconnect') || plat.includes('gaggle') || plat.includes('nexrep') || plat.includes('omni');
    }
    if (selectedPlatformFilter === 'aitraining') {
      const cat = j.category.toLowerCase();
      const plat = j.platform.toLowerCase();
      return cat.includes('ai') || cat.includes('annotation') || cat.includes('evaluation') || cat.includes('rlhf') || plat.includes('opentrain') || plat.includes('micro1') || plat.includes('outlier') || plat.includes('alignerr') || plat.includes('mindrift');
    }
    if (selectedPlatformFilter === 'freelance') {
      const cat = j.category.toLowerCase();
      const plat = j.platform.toLowerCase();
      return cat.includes('freelance') || cat.includes('language') || cat.includes('transcription') || cat.includes('tutoring') || plat.includes('toptal') || plat.includes('preply') || plat.includes('rev') || plat.includes('transcription');
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner - Clean & Concise */}
      <div className="rounded-3xl bg-white border border-[#EDE8DF] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Tasks & RLHF</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#00875A] border border-emerald-200">
              🇳🇬 Open to Africa
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            AI Training, Evaluation & Gigs
          </h1>

          <p className="text-xs text-stone-800 font-bold">
            Grade LLM responses, audit code reasoning, and evaluate robotics data with verified foreign wire/crypto payouts.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search roles or platforms..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-950 placeholder-stone-400 focus:outline-none focus:border-[#D84315] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Featured Deep Research Dual Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Card 1: OpenTrain AI ($50–$90/hr) */}
        <div className="p-5 rounded-2xl bg-white border-2 border-indigo-300 shadow-xs flex flex-col justify-between space-y-3 group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-950 border border-indigo-300 text-[11px] font-black font-mono">
                OpenTrain AI
              </span>
              <span className="text-xs font-black text-emerald-800 font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300">
                $50 – $90 / hr
              </span>
            </div>

            <div>
              <h2 className="text-base font-black text-stone-950 group-hover:text-indigo-600 transition-colors">
                Robotics & Multimodal AI Training
              </h2>
              <p className="text-xs text-stone-800 font-bold mt-0.5">
                Video annotation, prompt auditing, and LLM evaluation with weekly USDC / PayPal / Deel payouts.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EDE8DF] flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={openOpenTrainResearchModal}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Dossier</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSyncOpenTrain}
                disabled={isSyncing === 'opentrain'}
                className="px-2.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncing === 'opentrain' ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
              <button
                type="button"
                onClick={() => openInAppBrowser('https://opentrain.ai', null, 'OpenTrain AI')}
                className="px-2.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Site</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Micro1 AI Experts ($35–$95/hr) */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs flex flex-col justify-between space-y-3 group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-[11px] font-bold font-mono">
                Micro1 AI
              </span>
              <span className="text-xs font-extrabold text-[#00875A] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                $35 – $95 / hr
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#1A1A1A] group-hover:text-cyan-700 transition-colors">
                AI Domain Experts Pipeline
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Matches specialists in coding, SQL, and finance with frontier AI labs. Deel & crypto payouts.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EDE8DF] flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={openMicro1ResearchModal}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Dossier</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSyncMicro1}
                disabled={isSyncing === 'micro1'}
                className="px-2.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncing === 'micro1' ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
              <button
                type="button"
                onClick={() => openInAppBrowser('https://www.micro1.ai/experts/opportunities', null, 'Micro1 AI Opportunities')}
                className="px-2.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Site</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Platform Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE8DF] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Platforms', count: aiJobs.length },
            { id: 'microtasks', label: 'Micro-Tasks & Gigs', count: aiJobs.filter(j => j.category.toLowerCase().includes('micro') || j.category.toLowerCase().includes('gig') || j.platform.toLowerCase().includes('paidwork') || j.platform.toLowerCase().includes('clickworker') || j.platform.toLowerCase().includes('swagbucks') || j.platform.toLowerCase().includes('taskrabbit')).length },
            { id: 'customerservice', label: 'Remote Support & Operations', count: aiJobs.filter(j => j.category.toLowerCase().includes('customer') || j.category.toLowerCase().includes('support') || j.category.toLowerCase().includes('safety') || j.platform.toLowerCase().includes('arise') || j.platform.toLowerCase().includes('kellyconnect') || j.platform.toLowerCase().includes('gaggle') || j.platform.toLowerCase().includes('nexrep') || j.platform.toLowerCase().includes('omni')).length },
            { id: 'aitraining', label: 'AI Training & Annotation', count: aiJobs.filter(j => j.category.toLowerCase().includes('ai') || j.category.toLowerCase().includes('annotation') || j.category.toLowerCase().includes('evaluation') || j.category.toLowerCase().includes('rlhf') || j.platform.toLowerCase().includes('opentrain') || j.platform.toLowerCase().includes('micro1') || j.platform.toLowerCase().includes('outlier') || j.platform.toLowerCase().includes('alignerr') || j.platform.toLowerCase().includes('mindrift')).length },
            { id: 'freelance', label: 'Freelance, Language & Audio', count: aiJobs.filter(j => j.category.toLowerCase().includes('freelance') || j.category.toLowerCase().includes('language') || j.category.toLowerCase().includes('transcription') || j.category.toLowerCase().includes('tutoring') || j.platform.toLowerCase().includes('toptal') || j.platform.toLowerCase().includes('preply') || j.platform.toLowerCase().includes('rev') || j.platform.toLowerCase().includes('transcription')).length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedPlatformFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedPlatformFilter === tab.id
                  ? 'bg-[#1A1A1A] text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-[#EDE8DF] hover:bg-stone-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedPlatformFilter === tab.id ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filtered.length} verified opportunities
        </span>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-white border border-[#EDE8DF] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE8DF] space-y-3">
          <Bot className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No opportunities match your filter</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try switching filter tabs or clearing your search query.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedPlatformFilter('all'); }}
            className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(job => (
            <TaskPlatformCard
              key={job.id}
              job={job}
              onOpenIntelligence={openTaskPlatformIntelligence}
            />
          ))}
        </div>
      )}
    </div>
  );
};
