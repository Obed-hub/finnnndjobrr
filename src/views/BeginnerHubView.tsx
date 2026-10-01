import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BeginnerHubView: React.FC = () => {
  const { setActiveTab, setSearchFilters, openTaskPlatformIntelligence } = useApp();
  const [selectedPathway, setSelectedPathway] = useState<string>('no_exp');

  const popularTaskPlatforms = [
    { name: 'Paidwork', rate: '$3–$8/hr', timeline: '2 hrs', category: 'Micro-Tasks' },
    { name: 'Arise', rate: '$10–$20/hr', timeline: '3–5 days', category: 'Customer Support' },
    { name: 'KellyConnect', rate: '$15–$17/hr', timeline: '5–7 days', category: 'Tech Support' },
    { name: 'Clickworker', rate: '$8–$18/hr', timeline: '1 day', category: 'AI & Data Tasks' },
    { name: 'Rev', rate: '$15–$25/hr', timeline: '24–48 hrs', category: 'Transcription' },
    { name: 'Preply', rate: '$15–$40/hr', timeline: '2–4 days', category: 'Online Tutoring' }
  ];

  const pathways = [
    {
      id: 'no_exp',
      title: '1. No Work Experience',
      tagline: 'Start with immediate AI evaluation jobs',
      steps: [
        'Register on Outlier AI, Alignerr, and TELUS International.',
        'Pass the 20-min English & reasoning test.',
        'Earn your first $50–$200/wk while upskilling.',
        'Withdraw via Grey, Geegpay, or Payoneer.'
      ],
      action: () => setActiveTab('aiwork'),
      actionLabel: 'View AI Platforms'
    },
    {
      id: 'have_skills',
      title: '2. Skills but No History',
      tagline: 'Build 2 public proof-of-work case studies',
      steps: [
        'Skip generic certificate screenshots.',
        'Build a real Nigerian/African dataset project.',
        'Deploy on Power BI Web, GitHub Pages, or Vercel.',
        'Write a 3-sentence executive summary in your README.'
      ],
      action: () => setActiveTab('playbook'),
      actionLabel: 'View Playbook'
    },
    {
      id: 'need_first_usd',
      title: '3. First USD Payment',
      tagline: 'Complete Web3 micro-bounties',
      steps: [
        'Browse open bounties on Superteam Earn.',
        'Pick low-barrier review or translation tasks.',
        'Submit deliverables before deadline.',
        'Receive instant on-chain USDC/USDT directly to wallet.'
      ],
      action: () => setActiveTab('bounties'),
      actionLabel: 'Open Bounties'
    },
    {
      id: 'rejection_fix',
      title: '4. Fix Rejections & Ghosting',
      tagline: 'Audit ATS filters and resume formatting',
      steps: [
        'Scan CV for missing ATS industry keywords.',
        'Replace passive phrasing with quantifiable metrics.',
        'Target "Worldwide Remote" or "Nigeria Eligible" tags only.',
        'Tailor pitch using AI Job Intel tool.'
      ],
      action: () => setActiveTab('resume'),
      actionLabel: 'Run Resume Scan'
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white border border-[#EDE8DF] p-5 sm:p-6 space-y-1 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00875A]/10 text-[#00875A] font-mono flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Junior Fast-Track</span>
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
          Starter Career Hub
        </h1>
        <p className="text-xs text-stone-600">
          Actionable roadmaps designed for emerging African talent to secure their first remote income.
        </p>
      </div>

      {/* Pathway Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pathways.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPathway(p.id)}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
              selectedPathway === p.id
                ? 'bg-blue-50/50 border-[#0B5CFF] ring-2 ring-[#0B5CFF]/20 shadow-2xs'
                : 'bg-white border-[#EDE8DF] hover:border-stone-300'
            }`}
          >
            <div>
              <h3 className={`text-xs font-bold ${selectedPathway === p.id ? 'text-[#0B5CFF]' : 'text-[#1A1A1A]'}`}>
                {p.title}
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">{p.tagline}</p>
            </div>
            <span className={`text-[10px] font-mono font-bold mt-3 ${selectedPathway === p.id ? 'text-[#0B5CFF]' : 'text-stone-400'}`}>
              View steps →
            </span>
          </button>
        ))}
      </div>

      {/* Active Pathway Details */}
      {(() => {
        const active = pathways.find(p => p.id === selectedPathway) || pathways[0];
        return (
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#EDE8DF] space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE8DF] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A]">{active.title}</h2>
                <p className="text-xs text-stone-500">{active.tagline}</p>
              </div>

              <button
                onClick={active.action}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer w-fit"
              >
                <span>{active.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {active.steps.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EDE8DF] flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-white border border-[#EDE8DF] text-[#0B5CFF] font-bold font-mono text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Task & Micro-Gigs Platform Grid */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE8DF] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Micro-Task Platforms
            </h2>
            <p className="text-xs text-stone-500">
              Verified low-barrier platforms with prompt payout timelines.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('aiwork')}
            className="text-xs font-bold text-[#0B5CFF] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularTaskPlatforms.map((plat) => (
            <div
              key={plat.name}
              className="p-4 rounded-xl bg-[#FAF9F5] border border-[#EDE8DF] hover:bg-white transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 font-mono">
                    {plat.name}
                  </span>
                  <span className="text-xs font-bold text-[#00875A] font-mono">
                    {plat.rate}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500">
                  {plat.category} • Payout: <strong className="text-stone-800">{plat.timeline}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openTaskPlatformIntelligence({
                  platform: plat.name,
                  roleTitle: `${plat.category} Specialist`,
                  category: plat.category,
                  advertisedRate: plat.rate
                })}
                className="w-full py-2 px-3 rounded-lg bg-[#0B5CFF] hover:bg-[#0948CA] text-white text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Roadmap Guide</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Junior Jobs Filter Shortcut */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EDE8DF] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-[#00875A] shrink-0" />
          <div>
            <h3 className="text-xs font-bold text-stone-900">Junior (0–1 Year) Jobs Only</h3>
            <p className="text-[11px] text-stone-500">Filters out senior/lead roles to show only entry-level opportunities.</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSearchFilters(prev => ({ ...prev, experienceLevel: '0_1_years' }));
            setActiveTab('discover');
          }}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          Filter Listings
        </button>
      </div>
    </div>
  );
};
