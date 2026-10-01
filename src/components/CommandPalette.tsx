import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  Compass, 
  Building2, 
  Bot, 
  Zap, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  Crown,
  ArrowRight,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { parseNaturalLanguageSearchApi } from '../lib/api';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setActiveTab, 
    setSearchFilters, 
    showToast 
  } = useApp();

  const [query, setQuery] = useState('');
  const [isProcessingNL, setIsProcessingNL] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickNav = [
    { label: 'Discover Remote Jobs', tab: 'discover', icon: Compass, desc: 'Search 600+ verified remote jobs' },
    { label: 'AI Evaluation & Data Work', tab: 'aiwork', icon: Bot, desc: 'Outlier, DataAnnotation, Alignerr, TELUS' },
    { label: 'Web3 & Freelance Bounties', tab: 'bounties', icon: Zap, desc: 'USDC/USDT crypto reward tasks' },
    { label: 'Beginner & 0-Exp Starter Hub', tab: 'beginner', icon: GraduationCap, desc: 'Step-by-step career pathways' },
    { label: 'ATS Resume Intelligence', tab: 'resume', icon: FileText, desc: 'AI CV scoring and keyword optimizer' },
    { label: 'Market Salary Intelligence', tab: 'trends', icon: TrendingUp, desc: 'Verified tech compensation benchmarks' },
    { label: 'PRO Membership & Plans', tab: 'pricing', icon: Crown, desc: 'Unlock unlimited AI career assists' },
  ];

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsCommandPaletteOpen(false);
  };

  const handleNLSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessingNL(true);
    try {
      const parsed = await parseNaturalLanguageSearchApi(query);
      if (parsed) {
        setSearchFilters(prev => ({
          ...prev,
          keyword: parsed.keyword || query,
          targetRole: parsed.targetRole || '',
          isNigeriaEligible: parsed.isNigeriaEligible || false,
          isAfricaEligible: parsed.isAfricaEligible || false,
          isWorldwide: parsed.isWorldwide || false,
          experienceLevel: parsed.experienceLevel || 'all',
          category: parsed.category || 'all',
          minSalary: parsed.minSalary || 0
        }));
        setActiveTab('discover');
        setIsCommandPaletteOpen(false);
        showToast(`Parsed search: "${query}"`, 'info');
      }
    } catch (err) {
      // Fallback simple search
      setSearchFilters(prev => ({ ...prev, keyword: query }));
      setActiveTab('discover');
      setIsCommandPaletteOpen(false);
    } finally {
      setIsProcessingNL(false);
    }
  };

  const filteredNav = quickNav.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleNLSubmit} className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search jobs, run AI natural search, or type 'Paystack' / 'Data Analyst'..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isProcessingNL || !query.trim()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs font-bold text-slate-950 transition-colors shrink-0"
          >
            {isProcessingNL ? (
              <span className="animate-spin text-xs">⏳</span>
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>AI Search</span>
          </button>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded">
            ESC
          </kbd>
        </form>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {query.trim().length > 0 && (
            <div className="px-3 py-2 text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Natural Language Prompt</span>
            </div>
          )}

          {query.trim().length > 0 && (
            <button
              onClick={handleNLSubmit}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-800/40 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Run Smart AI Match for &quot;{query}&quot;</p>
                  <p className="text-[11px] text-slate-400">Filter location eligibility, role seniority, and skill prerequisites automatically</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          )}

          <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Navigation & Tools
          </div>

          {filteredNav.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                onClick={() => handleSelectTab(item.tab)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-left group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-white">{item.label}</p>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <strong className="text-slate-300">Cmd+K</strong> anytime to jump to opportunities</span>
          <button onClick={() => setIsCommandPaletteOpen(false)} className="hover:text-slate-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
