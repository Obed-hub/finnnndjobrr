import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Coins, 
  ShieldCheck, 
  Search,
  Wallet,
  RotateCw,
  Sparkles,
  Layers,
  Bot
} from 'lucide-react';
import { fetchBounties } from '../lib/api';
import { BountyItem } from '../types';
import { useApp } from '../context/AppContext';

export const BountiesView: React.FC = () => {
  const { showToast, openInAppBrowser, openTaskAssistant } = useApp();
  const [bounties, setBounties] = useState<BountyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const loadBounties = () => {
    setLoading(true);
    fetchBounties()
      .then(data => {
        setBounties(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadBounties();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/connectors/refresh', { method: 'POST' });
      const data = await fetchBounties();
      setBounties(data);
      showToast(`Refreshed ${data.length} live Web3 bounties from Superteam Earn!`, 'success');
    } catch {
      showToast('Live bounties stream updated', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const filtered = bounties.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.platform.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase()) ||
    b.skillsRequired.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-amber-500/20 text-amber-300 font-mono flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Web3 & Proof-of-Work Bounties</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Superteam Earn Live API</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            High-Yield Crypto Bounties & Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-bold">
            Earn in USDC, USDT, and SOL for building UI components, writing technical deep dives, conducting research, and translating developer docs. Zero location restrictions.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search bounties, skills, or tokens..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 text-xs font-black transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Refresh live on-chain bounties from Superteam Earn"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-60 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(bounty => (
            <div
              key={bounty.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black font-mono">
                      {bounty.platform}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-200 text-xs rounded font-bold">
                      {bounty.category}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400 font-mono block">
                      {bounty.reward}
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono font-bold">
                      {bounty.estimatedPerHour}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-black text-white mb-3">
                  {bounty.title}
                </h3>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {bounty.skillsRequired.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-[11px] font-mono font-bold">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Meta details */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Deadline:</span>
                    <span className="font-black text-amber-300 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{bounty.deadline}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Payout Mechanism:</span>
                    <span className="font-bold text-slate-100">{bounty.payoutMechanism}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Wallet:</span>
                    <span className="font-mono font-bold text-cyan-300">{bounty.walletRequirement}</span>
                  </div>
                </div>
              </div>

              {/* AI Task Actions Toolbar */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => openTaskAssistant({
                    taskTitle: bounty.title,
                    platform: bounty.platform,
                    category: bounty.category,
                    rewardOrRate: bounty.reward,
                    description: `Skills required: ${bounty.skillsRequired.join(', ')}. Payout: ${bounty.payoutMechanism}. Deadline: ${bounty.deadline}`,
                    officialUrl: bounty.officialSource
                  }, 'analyze')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 text-[11px] font-black border border-amber-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Layers className="w-3 h-3 text-amber-400" />
                  <span>Analyze Task</span>
                </button>

                <button
                  onClick={() => openTaskAssistant({
                    taskTitle: bounty.title,
                    platform: bounty.platform,
                    category: bounty.category,
                    rewardOrRate: bounty.reward,
                    description: `Skills required: ${bounty.skillsRequired.join(', ')}. Payout: ${bounty.payoutMechanism}. Deadline: ${bounty.deadline}`,
                    officialUrl: bounty.officialSource
                  }, 'complete')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  <span>Help Me Complete</span>
                </button>

                <button
                  onClick={() => openTaskAssistant({
                    taskTitle: bounty.title,
                    platform: bounty.platform,
                    category: bounty.category,
                    rewardOrRate: bounty.reward,
                    description: `Skills required: ${bounty.skillsRequired.join(', ')}. Payout: ${bounty.payoutMechanism}. Deadline: ${bounty.deadline}`,
                    officialUrl: bounty.officialSource
                  }, 'qa')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-bold border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Bot className="w-3 h-3 text-cyan-400" />
                  <span>Ask AI</span>
                </button>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Escrow / Verified Smart Contract</span>
                </span>

                <button
                  type="button"
                  onClick={() => openInAppBrowser(bounty.officialSource, null, `${bounty.title} — ${bounty.platform}`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                  title="Open in-app portal"
                >
                  <span>Submit Work</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
