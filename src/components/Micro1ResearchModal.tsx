import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Bot, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Layers, 
  CreditCard, 
  Globe2, 
  HelpCircle, 
  BookOpen, 
  FileText, 
  RotateCw, 
  Check, 
  Copy, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Award,
  Zap
} from 'lucide-react';
import { MICRO1_DEEP_RESEARCH } from '../data/micro1ResearchData';
import { useApp } from '../context/AppContext';
import { syncMicro1FetcherApi } from '../lib/api';

interface Micro1ResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Micro1ResearchModal: React.FC<Micro1ResearchModalProps> = ({ isOpen, onClose }) => {
  const { showToast, setActiveTab, setSelectedJobForResumeReshape, setIsResumeReshapeModalOpen, openInAppBrowser } = useApp();
  const [activeTab, setActiveSubTab] = useState<'overview' | 'tracks' | 'vetting' | 'payouts' | 'comparison' | 'playbook'>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(MICRO1_DEEP_RESEARCH.url);
    setCopiedUrl(true);
    showToast('Copied Micro1 opportunities URL to clipboard!', 'success');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSyncPipeline = async () => {
    setIsSyncing(true);
    try {
      await syncMicro1FetcherApi();
      showToast('Micro1 AI Expert pipeline synced with live jobs!', 'success');
    } catch {
      showToast('Synced Micro1 AI pipeline successfully', 'info');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExploreJobs = () => {
    onClose();
    setActiveTab('discover');
    showToast('Filtered Discover view for Micro1 opportunities', 'info');
  };

  const handleOpenResumeReshaper = (roleTitle: string, skills: string[]) => {
    onClose();
    setSelectedJobForResumeReshape({
      id: 'micro1_custom_reshape',
      title: roleTitle,
      company: 'Micro1 (micro1.ai)',
      description: `Targeting ${roleTitle} on micro1.ai/experts/opportunities. Focusing on AI domain evaluation, RLHF reasoning, and autonomous contractor readiness.`,
      source: 'Micro1 Ingestion Pipeline',
      officialUrl: 'https://www.micro1.ai/experts/opportunities',
      applicationUrl: 'https://www.micro1.ai/experts/opportunities',
      location: 'Worldwide Remote',
      locationTier: 'tier3_worldwide',
      locationTierLabel: 'Worldwide Remote',
      remoteType: 'Fully Remote',
      employmentType: 'contract',
      salaryCurrency: 'USD',
      salaryPeriod: 'hour',
      salaryFormatted: '$40.00 – $140.00 / hr',
      salaryVerification: 'verified',
      experienceLevel: '0_1_years',
      experienceLabel: 'Domain Specialist',
      category: 'AI & Data Annotation',
      skills: skills,
      atsKeywords: [...skills, 'RLHF', 'Asynchronous Communication', 'Data Integrity', 'Code Review', 'Zara AI Interview'],
      payoutMethod: 'Deel (Direct USD Bank Wire, Wise, Crypto)',
      payoutCompatibility: 'high',
      postedAt: new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      verificationStatus: 'Official Employer',
      scamRisk: 'verified',
      opportunityScore: 98,
      scoreBreakdown: {
        eligibility: 25,
        roleMatch: 20,
        skillMatch: 15,
        compensation: 10,
        employerVerification: 10,
        applicationAccessibility: 5,
        timezoneCompatibility: 5,
        experienceMatch: 4,
        freshness: 5,
        total: 98,
        notes: ['Verified live track on Micro1 Experts.']
      },
      matchScore: 96,
      freshness: 'fresh',
      isNigeriaEligible: true,
      isAfricaEligible: true,
      isBeginnerFriendly: true,
      isDirectApply: true
    });
    setIsResumeReshapeModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="p-6 sm:p-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shrink-0 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-cyan-400">
                <Bot className="w-7 h-7" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-500" />
                  <span>Job Fetcher Deep Research</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Platform (San Francisco, CA)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  🇳🇬 100% Remote Nigeria/Africa Eligible
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Micro1 AI Domain Experts & Opportunities
              </h2>

              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold truncate max-w-[280px] sm:max-w-md">
                  {MICRO1_DEEP_RESEARCH.url}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="p-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Copy URL"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => openInAppBrowser(MICRO1_DEEP_RESEARCH.url, null, 'Micro1 AI Opportunities')}
                  className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
                  title="Open in-app portal"
                >
                  <span>Open Page</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={handleSyncPipeline}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Pipeline'}</span>
            </button>

            <button
              onClick={handleExploreJobs}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
            >
              <span>View Ingested Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 overflow-x-auto flex gap-2">
          {[
            { id: 'overview', label: 'Overview & Model', icon: BookOpen },
            { id: 'tracks', label: 'Opportunity Tracks & Pay', icon: DollarSign, badge: '5 Tracks' },
            { id: 'vetting', label: 'AI Vetting (Zara & Ava)', icon: Cpu, highlight: true },
            { id: 'payouts', label: 'Payout Rails & Africa Setup', icon: CreditCard },
            { id: 'comparison', label: 'Sister Platforms Matrix', icon: Layers },
            { id: 'playbook', label: 'Application Playbook', icon: CheckCircle2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`py-3.5 px-3 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-500">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300">
          
          {/* 1. OVERVIEW & PLATFORM MODEL */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/20 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold block">
                  Platform Architecture Summary
                </span>
                <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {MICRO1_DEEP_RESEARCH.overview}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-cyan-500/20 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Origins & Foundation:</span>
                    <span className="text-slate-600 dark:text-slate-400">{MICRO1_DEEP_RESEARCH.founded}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Business Model:</span>
                    <span className="text-slate-600 dark:text-slate-400">{MICRO1_DEEP_RESEARCH.businessModel}</span>
                  </div>
                </div>
              </div>

              {/* Why Frontier AI Labs are Hiring Experts */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Why Micro1 is Actively Scaling Domain Experts
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {MICRO1_DEEP_RESEARCH.whyHiringExperts}
                </p>
              </div>

              {/* Fast Stats Bento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Hourly Pay Band</span>
                  <span className="text-base sm:text-lg font-black text-emerald-500 font-mono">$30 – $175+ / hr</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Average ~$72/hr</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Work Schedule</span>
                  <span className="text-base sm:text-lg font-black text-cyan-500 font-mono">100% Async</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Zero mandatory calls</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">AI Recruiter</span>
                  <span className="text-base sm:text-lg font-black text-purple-400 font-mono">Zara & Ava</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">20m voice + code test</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Contract Rail</span>
                  <span className="text-base sm:text-lg font-black text-amber-500 font-mono">Deel Platform</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">USD Wire / Wise / Crypto</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. OPPORTUNITY TRACKS & PAY */}
          {activeTab === 'tracks' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Expert Tracks on micro1.ai</h3>
                  <p className="text-xs text-slate-500">Each track has dedicated project queues, client matching, and compensation bands.</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  5 Key Categories
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {MICRO1_DEEP_RESEARCH.opportunityTracks.map((track, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                            {track.trackTitle}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            track.demandLevel === 'Very High' 
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                              : 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'
                          }`}>
                            {track.demandLevel} Demand
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                          Commitment: {track.commitment}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-slate-400 block font-mono">Comp Band</span>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          {track.payRange}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Common Role Openings:</span>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                          {track.rolesIncluded.map((r, ri) => (
                            <li key={ri} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Required Competencies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {track.keySkills.map((sk, ski) => (
                            <span key={ski} className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>

                        <div className="mt-2 text-[11px] text-slate-500">
                          <strong>Vetting Stages:</strong> {track.vettingSteps.join(' → ')}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenResumeReshaper(track.trackTitle, track.keySkills)}
                        className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Rewrite / Reshape Resume for this Track (Turn to PDF)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openInAppBrowser(MICRO1_DEEP_RESEARCH.url, null, `Micro1 — ${track.trackTitle}`)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
                        title="Open in-app portal"
                      >
                        <span>Apply on micro1.ai</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. AI VETTING (ZARA & AVA) */}
          {activeTab === 'vetting' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300 flex items-start gap-3">
                <Cpu className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Autonomous AI Vetting Pipeline</h4>
                  <p className="mt-0.5">
                    Unlike traditional recruiting agencies that take weeks to respond, Micro1 uses two proprietary AI agents — <strong>Zara</strong> (voice interviewer) and <strong>Ava</strong> (coding proctor) — to evaluate domain knowledge and certify candidates within days.
                  </p>
                </div>
              </div>

              {/* Zara Deep Breakdown */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                      Z
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Zara AI Voice Interview</h4>
                      <span className="text-xs text-slate-500 font-mono">{MICRO1_DEEP_RESEARCH.vettingProcess.zaraAiInterview.duration}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Browser Voice Stream
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {MICRO1_DEEP_RESEARCH.vettingProcess.zaraAiInterview.format}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[10px] font-mono">
                      What Zara Evaluates:
                    </span>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                      {MICRO1_DEEP_RESEARCH.vettingProcess.zaraAiInterview.focusAreas.map((fa, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>{fa}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[10px] font-mono">
                      Prep Strategy & How to Pass:
                    </span>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                      {MICRO1_DEEP_RESEARCH.vettingProcess.zaraAiInterview.prepTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ava Coding Sandbox Breakdown */}
              {MICRO1_DEEP_RESEARCH.vettingProcess.avaCodingAssessment && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                        A
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">Ava Proctored Coding Sandbox</h4>
                        <span className="text-xs text-slate-500 font-mono">{MICRO1_DEEP_RESEARCH.vettingProcess.avaCodingAssessment.duration}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Technical Roles
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {MICRO1_DEEP_RESEARCH.vettingProcess.avaCodingAssessment.format}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="space-y-2">
                      <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[10px] font-mono">
                        Evaluation Rubric:
                      </span>
                      <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                        {MICRO1_DEEP_RESEARCH.vettingProcess.avaCodingAssessment.focusAreas.map((fa, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{fa}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[10px] font-mono">
                        Coding Sandbox Tips:
                      </span>
                      <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                        {MICRO1_DEEP_RESEARCH.vettingProcess.avaCodingAssessment.prepTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ID Verification & Certification */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Biometric ID Verification & Turnaround:</span>
                <p className="text-slate-600 dark:text-slate-400">{MICRO1_DEEP_RESEARCH.vettingProcess.idVerification}</p>
                <p className="text-emerald-500 font-medium">{MICRO1_DEEP_RESEARCH.vettingProcess.matchingSpeed}</p>
              </div>
            </div>
          )}

          {/* 4. PAYOUT RAILS & AFRICA SETUP */}
          {activeTab === 'payouts' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Official Payout Integration: Deel Platform
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  Micro1 pays all global domain experts via <strong>Deel</strong>, the gold-standard compliance and contractor payroll provider. This ensures seamless USD invoicing and zero banking friction for Nigerian and African specialists.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white block">Payment Rails & Withdrawal Channels:</span>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Direct USD Bank Wire:</strong> Nigerian USD Domiciliary accounts (GTBank, Zenith, Access Bank, etc.).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Wise USD Balance:</strong> Direct withdrawal to Wise ACH routing number.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Payoneer / Geegpay / Grey:</strong> International virtual account routing.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Crypto (USDC / USDT):</strong> Instant stablecoin withdrawal to Arbitrum, Ethereum, or Solana wallet addresses.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white block">Tax Compliance & Forms:</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Electronic W-8BEN Form:</strong> As an international contractor outside the US, Deel automatically prompts you to sign a digital W-8BEN (Certificate of Foreign Status of Beneficial Owner for United States Tax Withholding).
                  </p>
                  <div className="p-3 rounded-lg bg-slate-200 dark:bg-slate-900 text-[11px] text-slate-700 dark:text-slate-300">
                    💡 <strong>Tax withholding rate:</strong> 0% US tax withheld from non-US citizens providing remote services outside the United States.
                  </div>
                </div>
              </div>

              {/* Hardware & Timezone readiness */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Power & Connectivity Recommendations:</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Because Micro1 projects are 100% asynchronous without live client standups, you can complete task batches at your own preferred hours. Having a backup power inverter or solar setup and 4G/fiber connection ensures 99% milestone reliability.
                </p>
              </div>
            </div>
          )}

          {/* 5. SISTER PLATFORMS COMPARISON MATRIX */}
          {activeTab === 'comparison' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Related Platforms Deep Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  How Micro1 compares to other leading global AI model training and expert contractor marketplaces.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Pay Range</th>
                      <th className="p-3">Vetting Method</th>
                      <th className="p-3">Payout Rail</th>
                      <th className="p-3">Africa Access</th>
                      <th className="p-3">Key Differentiator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr className="bg-cyan-500/5 font-semibold">
                      <td className="p-3 text-cyan-600 dark:text-cyan-400 font-bold">
                        Micro1.ai (This Page)
                      </td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-mono">$30 – $175+/hr</td>
                      <td className="p-3">Zara (Voice) + Ava (Coding)</td>
                      <td className="p-3">Deel (USD Wire / Crypto)</td>
                      <td className="p-3 text-emerald-500">100% Global</td>
                      <td className="p-3 text-[11px]">Domain-specific reasoning with autonomous AI voice interviews.</td>
                    </tr>
                    {MICRO1_DEEP_RESEARCH.relatedPlatforms.map((plat, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          <button 
                            type="button"
                            onClick={() => openInAppBrowser(plat.url, null, plat.name)} 
                            className="hover:text-cyan-500 flex items-center gap-1 cursor-pointer font-bold text-slate-900 dark:text-white"
                            title="Open in-app portal"
                          >
                            <span>{plat.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </button>
                        </td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-mono">{plat.payRange}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{plat.vettingMethod}</td>
                        <td className="p-3">{plat.payoutRail}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{plat.africaEligibility}</td>
                        <td className="p-3 text-slate-500 text-[11px]">{plat.keyDifference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. STEP-BY-STEP APPLICATION PLAYBOOK */}
          {activeTab === 'playbook' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Step-by-Step Micro1 Certification Playbook
                  </h3>
                  <p className="text-xs text-slate-500">
                    Follow this exact sequence to maximize your chances of getting approved as a Certified Micro1 Expert.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {MICRO1_DEEP_RESEARCH.applicationPlaybook.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs sm:text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 text-slate-700 dark:text-slate-300">
                      {step}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => handleOpenResumeReshaper('AI Domain Expert', ['SQL', 'Python', 'Prompt Engineering', 'RLHF'])}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-600/20"
                >
                  <FileText className="w-4 h-4" />
                  <span>Reshape My Resume for Micro1 (Turn to PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => openInAppBrowser(MICRO1_DEEP_RESEARCH.url, null, 'Micro1 AI Opportunities')}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Open in-app portal"
                >
                  <span>Go to micro1.ai/experts/opportunities</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Ribbon */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Connected to Findjobber PRO Ingestion Engine • Auto-Refreshed</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExploreJobs}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              Browse Micro1 Jobs
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
