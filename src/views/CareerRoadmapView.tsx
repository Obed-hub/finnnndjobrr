import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Target, 
  ArrowRight, 
  Crown,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateCareerRoadmapApi } from '../lib/api';

export const CareerRoadmapView: React.FC = () => {
  const { userProfile, consumeAiAssist, showToast, setIsUpgradeModalOpen } = useApp();

  const [targetRole, setTargetRole] = useState(userProfile.targetRoles[0] || 'Junior Data Analyst');
  const [isLoading, setIsLoading] = useState(false);
  const [completedGoals, setCompletedGoals] = useState<string[]>([
    'Days 1–30: Proof of Work & Resume Hardening-0'
  ]);

  const [roadmapData, setRoadmapData] = useState<{
    targetRole: string;
    phases: Array<{ phaseName: string; goals: string[] }>;
  }>({
    targetRole: 'Junior Data Analyst',
    phases: [
      {
        phaseName: 'Phase 1 (Days 1–30): Proof of Work & Resume Hardening',
        goals: [
          'Audit and rewrite resume using Findjobber PRO AI ATS Scanner to achieve an 85%+ score.',
          'Build an African E-Commerce transaction dataset dashboard with SQL and Power BI, published publicly.',
          'Setup and verify international receiving accounts (Deel, Grey, Geegpay, Payoneer) for payment readiness.',
          'Write a detailed LinkedIn case study post breaking down your analytics workflow.'
        ]
      },
      {
        phaseName: 'Phase 2 (Days 31–60): Targeted Application Sprint',
        goals: [
          'Apply to at least 5 high-opportunity score (>88) Nigeria-eligible or Worldwide roles weekly.',
          'Generate tailored application pitches for each role using the AI Application Assistant.',
          'Connect with 15 verified tech recruiters and hiring managers at Moniepoint, Paystack, Chowdeck, and Kuda.',
          'Complete 2 paid Web3 bounties on Superteam Earn or AI evaluation hours on Outlier to build live cash flow.'
        ]
      },
      {
        phaseName: 'Phase 3 (Days 61–90): Interview Mastery & Offer Negotiation',
        goals: [
          'Practice live SQL whiteboard queries (window functions, subqueries, self-joins).',
          'Conduct mock asynchronous video interviews for international screening rounds.',
          'Prepare salary benchmark data using Findjobber Market Intelligence to negotiate USD contracts with confidence.'
        ]
      }
    ]
  });

  const handleGenerate = async () => {
    const canProceed = consumeAiAssist();
    if (!canProceed) return;

    setIsLoading(true);
    try {
      const data = await generateCareerRoadmapApi({
        targetRole,
        experienceLevel: userProfile.experienceLevel,
        skills: userProfile.skills
      });
      setRoadmapData(data);
      showToast(`Generated personalized roadmap for ${targetRole}`, 'success');
    } catch {
      showToast('Generated benchmark career roadmap', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGoal = (key: string) => {
    setCompletedGoals(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const isPro = userProfile.subscriptionPlan === 'pro';

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-[24px] sm:rounded-[32px] bg-white border border-[#EDE8DF] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#0B5CFF]/10 text-[#0B5CFF] font-mono flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Career Roadmap Engine</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00875A]/10 text-[#00875A] font-mono">
              90-Day Execution Cycle
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            90-Day Remote Career Milestone Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-[#767676] max-w-xl leading-relaxed">
            A structured, step-by-step execution plan from foundational proof-of-work to negotiating your first international USD remote contract.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <input
            type="text"
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            placeholder="Target role (e.g. Data Analyst)..."
            className="px-4 py-2.5 rounded-full bg-[#FAF9F5] border border-[#EDE8DF] text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] min-w-[200px]"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Generating...' : 'Customize'}</span>
          </button>
        </div>
      </div>

      {/* Phases Timeline */}
      <div className="space-y-5">
        {roadmapData.phases.map((phase, phaseIdx) => {
          const completedInPhase = phase.goals.filter((_, gIdx) => completedGoals.includes(`${phase.phaseName}-${gIdx}`)).length;
          const isPhaseComplete = completedInPhase === phase.goals.length;

          return (
            <div key={phaseIdx} className="p-6 sm:p-7 rounded-[28px] bg-white border border-[#EDE8DF] space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#0B5CFF]/10 text-[#0B5CFF] font-mono font-bold text-sm flex items-center justify-center">
                    {phaseIdx + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">{phase.phaseName}</h3>
                </div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                  isPhaseComplete ? 'bg-emerald-50 text-[#00875A]' : 'bg-[#FAF9F5] text-[#767676]'
                }`}>
                  {completedInPhase} / {phase.goals.length} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {phase.goals.map((goal, goalIdx) => {
                  const goalKey = `${phase.phaseName}-${goalIdx}`;
                  const isDone = completedGoals.includes(goalKey);
                  return (
                    <button
                      key={goalIdx}
                      onClick={() => toggleGoal(goalKey)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50/50 border-emerald-200 text-[#1A1A1A]'
                          : 'bg-[#FAF9F5] border-[#EDE8DF] hover:border-stone-300 text-[#1A1A1A]'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'line-through text-stone-400' : 'text-[#1A1A1A]'}`}>
                        {goal}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
