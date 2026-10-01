import React from 'react';
import { 
  Bot, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Target,
  DollarSign,
  TrendingUp,
  Award
} from 'lucide-react';
import { AIWorkJob } from '../types';
import { useApp } from '../context/AppContext';

interface TaskPlatformCardProps {
  job: AIWorkJob;
  onOpenIntelligence: (job: AIWorkJob) => void;
}

export const TaskPlatformCard: React.FC<TaskPlatformCardProps> = ({
  job,
  onOpenIntelligence
}) => {
  const { openInAppBrowser, openTaskAssistant } = useApp();

  const isOpenTrain = job.platform.toLowerCase().includes('opentrain');
  const isMicro1 = job.platform.toLowerCase().includes('micro1');

  // Compute daily potential estimate if available
  const parseHourlyToDaily = (rateStr: string) => {
    const numbers = rateStr.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const min = parseInt(numbers[0], 10);
      const max = numbers.length > 1 ? parseInt(numbers[1], 10) : min * 1.5;
      return `$${min * 4} – $${max * 6} / day`;
    }
    return '$50 – $120 / day';
  };

  const dailyEstimate = parseHourlyToDaily(job.advertisedRate || job.verifiedRate);

  return (
    <div
      className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between space-y-5 hover:shadow-xs ${
        isOpenTrain 
          ? 'border-indigo-300 ring-1 ring-indigo-200/50' 
          : isMicro1 
          ? 'border-cyan-300 ring-1 ring-cyan-200/50'
          : 'border-[#EDE8DF]'
      }`}
    >
      <div className="space-y-4">
        {/* Top Header: Logo, Platform Name & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-stone-50 border border-[#EDE8DF] overflow-hidden flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
              {job.logo ? (
                <img 
                  src={job.logo} 
                  alt={job.platform} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Bot className="w-6 h-6 text-stone-400" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-stone-950 font-mono uppercase tracking-wide">
                  {job.platform}
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-[10px] rounded-full font-black font-mono">
                  🇳🇬 Nigeria Eligible
                </span>
                <span className="px-2 py-0.5 bg-stone-100 border border-stone-300 text-stone-900 text-[10px] rounded-full font-extrabold">
                  {job.category}
                </span>
              </div>
              <h3 className="text-base font-black text-stone-950 mt-1 leading-snug">
                {job.roleTitle}
              </h3>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black shrink-0 font-mono ${
            job.difficulty === 'Beginner'
              ? 'bg-emerald-50 text-emerald-950 border border-emerald-300'
              : job.difficulty === 'Expert'
              ? 'bg-purple-50 text-purple-950 border border-purple-300'
              : 'bg-blue-50 text-blue-950 border border-blue-300'
          }`}>
            {job.difficulty}
          </span>
        </div>

        {/* Earning Matrix Highlight Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-stone-50/90 border border-[#EDE8DF]">
          <div>
            <span className="text-[10px] text-stone-700 block uppercase font-mono font-black">Verified Rate</span>
            <span className="text-sm font-black text-emerald-700 font-mono block truncate">
              {job.advertisedRate || job.verifiedRate}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-stone-700 block uppercase font-mono font-black">Daily Potential</span>
            <span className="text-xs font-black text-stone-950 font-mono block truncate">
              {dailyEstimate}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-stone-700 block uppercase font-mono font-black">Payout Schedule</span>
            <span className="text-xs font-extrabold text-stone-900 block truncate">
              {job.paymentFrequency || 'Weekly'}
            </span>
          </div>
        </div>

        {/* Onboarding Checklist & Requirements */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-black text-stone-800 uppercase tracking-wider font-mono">
            Onboarding & Qualifications:
          </span>
          <ul className="space-y-1 text-xs text-stone-800 font-bold">
            {job.onboardingRequirements?.slice(0, 3).map((req, i) => (
              <li key={i} className="flex items-start gap-2 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span className="line-clamp-1 font-bold">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payout Methods List */}
        <div className="flex items-center gap-2 text-xs text-stone-800 font-bold pt-0.5">
          <CreditCard className="w-3.5 h-3.5 text-stone-600 shrink-0" />
          <span className="line-clamp-1 font-bold">
            Payout rails: <strong className="text-stone-950 font-black">{(job.payoutMethods || ['Payoneer', 'PayPal', 'Direct Wire']).join(', ')}</strong>
          </span>
        </div>
      </div>

      {/* DEDICATED AI INTELLIGENCE & FIRST-DOLLAR GUIDANCE FOOTER */}
      <div className="space-y-3 pt-3 border-t border-[#EDE8DF]">
        {/* AI Guide Notification Pill */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border border-amber-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D84315] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D84315]"></span>
            </span>
            <span className="text-stone-900 font-bold">
              AI Intelligence is active to guide you until you make your first dollar on <strong className="font-black">{job.platform}</strong>.
            </span>
          </div>
        </div>

        {/* Quick Task AI Triggers */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => openTaskAssistant({
              taskTitle: job.roleTitle,
              platform: job.platform,
              category: job.category,
              rewardOrRate: job.advertisedRate || job.verifiedRate,
              description: `Onboarding: ${(job.onboardingRequirements || []).join(', ')}. Payout: ${(job.payoutMethods || []).join(', ')}`,
              officialUrl: job.officialUrl
            }, 'analyze')}
            className="px-2 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 text-[10.5px] font-black border border-stone-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Zap className="w-3 h-3 text-amber-600" />
            <span>Analyze Task</span>
          </button>

          <button
            type="button"
            onClick={() => openTaskAssistant({
              taskTitle: job.roleTitle,
              platform: job.platform,
              category: job.category,
              rewardOrRate: job.advertisedRate || job.verifiedRate,
              description: `Onboarding: ${(job.onboardingRequirements || []).join(', ')}. Payout: ${(job.payoutMethods || []).join(', ')}`,
              officialUrl: job.officialUrl
            }, 'complete')}
            className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-[10.5px] font-black border border-emerald-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Help Complete</span>
          </button>

          <button
            type="button"
            onClick={() => openTaskAssistant({
              taskTitle: job.roleTitle,
              platform: job.platform,
              category: job.category,
              rewardOrRate: job.advertisedRate || job.verifiedRate,
              description: `Onboarding: ${(job.onboardingRequirements || []).join(', ')}. Payout: ${(job.payoutMethods || []).join(', ')}`,
              officialUrl: job.officialUrl
            }, 'qa')}
            className="px-2 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 text-[10.5px] font-black border border-stone-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Bot className="w-3 h-3 text-[#D84315]" />
            <span>Ask AI</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onOpenIntelligence(job)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-[#D84315] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 group"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span>Open AI First-Dollar Guide</span>
          </button>

          <button
            type="button"
            onClick={() => openInAppBrowser(job.officialUrl, null, `${job.roleTitle} — ${job.platform}`)}
            className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
            title={`Apply on ${job.platform}`}
          >
            <span>Apply</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
