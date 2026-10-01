import React, { useState } from 'react';
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
  TrendingUp, 
  Award, 
  Send, 
  BookOpen, 
  DollarSign, 
  AlertTriangle, 
  Copy, 
  Check, 
  RotateCw, 
  UserCheck, 
  Lock, 
  Compass, 
  ListChecks, 
  Wallet, 
  HelpCircle,
  Laptop
} from 'lucide-react';
import { EarnPlatformData } from '../data/earnPlatformsData';
import { useApp } from '../context/AppContext';
import { askTaskPlatformQAApi } from '../lib/api';

interface EarnPlatformCardProps {
  platform: EarnPlatformData;
  initialExpanded?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

type InstructionTabId = 'roadmap' | 'prerequisites' | 'exam_secrets' | 'safety' | 'payout' | 'ai_chat';

export const EarnPlatformCard: React.FC<EarnPlatformCardProps> = ({
  platform,
}) => {
  const { openInAppBrowser, showToast } = useApp();
  
  const [activeTab, setActiveTab] = useState<InstructionTabId>('roadmap');
  
  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'ai',
      text: `👋 Hello! I am your dedicated AI Mentor for **${platform.name}**.\n\nI have verified intelligence on **${platform.name}** registration steps, screening exams, rubric calibration, and Nigerian/African payout setups.\n\nAsk me anything below about passing the screening test, avoiding empty queues, or cashing out your first dollar!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isAiThinking) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAiThinking(true);

    try {
      const res = await askTaskPlatformQAApi({
        platform: platform.name,
        roleTitle: platform.tagline,
        category: platform.category,
        question: textToSend,
        chatHistory: chatMessages.slice(-6)
      });

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: res.answer || `Here is verified guidance for ${platform.name}: Focus on completing the onboarding test with 90%+ accuracy and setting up your ${platform.payoutMethods[0]} account.`,
        timestamp: 'Just now'
      };

      setChatMessages(prev => [...prev, aiMsg]);
    } catch {
      // High-quality local fallback from our deep platform knowledge base
      let matchedAnswer = '';
      const lower = textToSend.toLowerCase();
      
      if (lower.includes('test') || lower.includes('exam') || lower.includes('pass') || lower.includes('screen')) {
        matchedAnswer = `### 🎯 How to Pass the ${platform.name} Screening Exam:\n\n${platform.aiGuide.screeningExamSecrets.map(s => `• ${s}`).join('\n\n')}\n\n**Key Benchmark:** ${platform.testBenchmark}`;
      } else if (lower.includes('payout') || lower.includes('pay') || lower.includes('nigeria') || lower.includes('withdraw') || lower.includes('bank') || lower.includes('geegpay') || lower.includes('grey') || lower.includes('airtm')) {
        matchedAnswer = `### 💳 Setting Up Nigerian / African Payouts for ${platform.name}:\n\n${platform.aiGuide.nigeriaPayoutSetupSteps.map(s => `• ${s}`).join('\n\n')}\n\n**Payout Frequency:** ${platform.payoutSchedule} (Minimum threshold: ${platform.payoutMinimum})`;
      } else if (lower.includes('empty') || lower.includes('queue') || lower.includes('task') || lower.includes('calibration') || lower.includes('disqualif') || lower.includes('ban')) {
        matchedAnswer = `### ⚡ Sandbox Calibration & Queue Optimization for ${platform.name}:\n\n${platform.aiGuide.sandboxCalibrationTips.map(s => `• ${s}`).join('\n\n')}\n\n**Rules to Avoid Disqualification:**\n${platform.aiGuide.avoidDisqualificationRules.map(r => `⚠️ ${r}`).join('\n\n')}`;
      } else {
        matchedAnswer = `### 🚀 Action Guide for ${platform.name}:\n\n1. **Register & Verify**: Complete account setup at [${platform.officialUrl}](${platform.officialUrl}).\n2. **Pass Benchmark**: Complete the **${platform.testType}** aiming for **${platform.testBenchmark}**.\n3. **Peak Hours (WAT)**: Work during **${platform.peakHoursWAT}** for priority volume.\n4. **Payout Setup**: Link ${platform.payoutMethods.join(', ')}.\n\nFeel free to ask more specific questions about rubrics or test questions!`;
      }

      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: matchedAnswer,
        timestamp: 'Just now'
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const instructionTabs = [
    { id: 'roadmap' as InstructionTabId, label: '1. Roadmap to First $', icon: Compass, badge: '5 Steps' },
    { id: 'prerequisites' as InstructionTabId, label: '2. Setup & Prerequisites', icon: ListChecks },
    { id: 'exam_secrets' as InstructionTabId, label: '3. Exam Secrets & Rubric', icon: BookOpen },
    { id: 'safety' as InstructionTabId, label: '4. Quality & Safety Rules', icon: ShieldCheck },
    { id: 'payout' as InstructionTabId, label: '5. African Bank Payouts', icon: Wallet },
    { id: 'ai_chat' as InstructionTabId, label: '6. Ask AI Mentor', icon: Bot, isNew: true },
  ];

  return (
    <div
      id={`earn-card-${platform.id}`}
      className="rounded-3xl bg-white border border-[#EDE8DF] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      {/* ========================================================================= */}
      {/* 1. PLATFORM HEADER & KEY STATS                                            */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 space-y-4 border-b border-[#EDE8DF] bg-white">
        
        {/* Top Header: Logo, Name, Badges & Direct Register Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-[#EDE8DF] p-1.5 shrink-0 overflow-hidden shadow-2xs">
              <img 
                src={platform.logo} 
                alt={platform.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black text-stone-950 font-mono tracking-tight">
                  {platform.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-900 text-[10px] font-black uppercase font-mono">
                  {platform.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-[10px] font-black font-mono flex items-center gap-1">
                  <span>🇳🇬</span>
                  <span>Nigeria & Africa Eligible</span>
                </span>
              </div>
              <p className="text-xs text-stone-600 font-bold mt-1 max-w-2xl">
                {platform.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => openInAppBrowser(platform.signupUrl, null, `Create Account on ${platform.name}`)}
              className="px-4 py-2.5 rounded-xl bg-[#D84315] hover:bg-[#BF360C] text-white text-xs font-black flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
              title={`Create Account on ${platform.name}`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Create Account & Unlock Tasks</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </button>
          </div>
        </div>

        {/* Earning & Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-[#FBF9F4] border border-[#EDE8DF]">
          <div>
            <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">Verified Pay Rate</span>
            <span className="text-sm sm:text-base font-black text-emerald-700 font-mono block truncate">
              {platform.verifiedRate}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">Monthly Potential</span>
            <span className="text-xs sm:text-sm font-black text-stone-900 font-mono block truncate">
              {platform.earningPotentialMonthly}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">Speed to First $</span>
            <span className="text-xs sm:text-sm font-black text-stone-900 font-mono block truncate">
              {platform.speedToFirstDollar}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">Peak Hours (WAT)</span>
            <span className="text-xs font-bold text-stone-800 font-mono block truncate">
              {platform.peakHoursWAT}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PROPERLY ARRANGED INSTRUCTION TABS                                      */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF8F5] border-b border-[#EDE8DF] px-4 sm:px-6 pt-3">
        <div className="flex items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-black text-stone-900 uppercase font-mono">
              Step-by-Step Instructions & Intelligence:
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono hidden sm:inline-block">
            Select a step below to view instructions
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 no-scrollbar">
          {instructionTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-[#EDE8DF] hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.isNew && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-orange-600 text-white font-mono font-black">
                    Live
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INSTRUCTION TAB PANELS                                                 */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 bg-white flex-1">
        
        {/* TAB 1: 5-STEP MILESTONE ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EDE8DF]">
              <div>
                <h4 className="text-xs font-black text-stone-900 font-mono uppercase flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-orange-600" />
                  <span>5-Step Roadmap: From Zero to Your First Dollar on {platform.name}</span>
                </h4>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                  Follow each milestone in exact sequential order to unlock contractor project queues.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-mono font-black border border-emerald-200 self-start sm:self-auto">
                Timeline: {platform.speedToFirstDollar}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {platform.milestones.map((m) => (
                <div 
                  key={m.step}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] flex flex-col md:flex-row md:items-start justify-between gap-3.5 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-orange-600 text-white font-black text-xs flex items-center justify-center shrink-0 font-mono shadow-2xs">
                      {m.step}
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="text-xs font-black text-stone-950 font-mono">
                          {m.title}
                        </h5>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-800 font-bold font-mono">
                          {m.duration}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 font-medium leading-relaxed">
                        {m.description}
                      </p>
                      <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1.5 pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Deliverable: <strong>{m.deliverable}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-950 font-medium md:max-w-xs shrink-0 self-stretch md:self-auto">
                    <strong className="font-black text-amber-900 flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Mentor Pro-Tip:</span>
                    </strong>
                    <span>{m.proTip}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quick Action */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">
                Ready to begin Step 1?
              </span>
              <button
                type="button"
                onClick={() => openInAppBrowser(platform.signupUrl, null, `Register on ${platform.name}`)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open Registration Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SETUP & PREREQUISITES */}
        {activeTab === 'prerequisites' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="pb-2 border-b border-[#EDE8DF]">
              <h4 className="text-xs font-black text-stone-900 font-mono uppercase flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-emerald-600" />
                <span>Account Unlock Checklist & Platform Prerequisites</span>
              </h4>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                Verify you have these requirements ready before opening the registration form.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Unlock Checklist */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] space-y-3">
                <span className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mandatory Account Checklist:</span>
                </span>
                <ul className="space-y-2 text-xs text-stone-800 font-medium">
                  {platform.accountRequirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-[#EDE8DF]">
                      <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0 font-mono">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] space-y-2.5">
                  <span className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-orange-600" />
                    <span>Hardware & Domain Skills:</span>
                  </span>
                  
                  <div className="space-y-2 text-xs text-stone-800 font-medium">
                    <div className="p-2.5 rounded-xl bg-white border border-[#EDE8DF]">
                      <strong className="text-stone-950 font-bold block mb-1">Key Skills Tested:</strong>
                      <div className="flex flex-wrap gap-1.5">
                        {platform.skillsRequired.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-mono font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#EDE8DF] flex items-center justify-between">
                      <span className="text-stone-600">Entry Difficulty:</span>
                      <span className="font-mono font-black text-stone-900 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                        {platform.difficulty}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#EDE8DF] flex items-center justify-between">
                      <span className="text-stone-600">Best Hours for Queue Volume:</span>
                      <span className="font-mono font-bold text-stone-900">
                        {platform.peakHoursWAT}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium flex items-start gap-2">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Strict Identity Policy: </strong> Do not use VPNs during ID verification. Use your real Nigerian/African international passport, driver's license, or national ID.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXAM SECRETS & RUBRIC */}
        {activeTab === 'exam_secrets' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="pb-2 border-b border-[#EDE8DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black text-stone-900 font-mono uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>Screening Assessment Secrets & Rubric Benchmarks</span>
                </h4>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                  Insider strategies to score 90%+ and pass the {platform.name} entry quiz on attempt #1.
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-black self-start sm:self-auto">
                Passing Benchmark: {platform.testBenchmark}
              </div>
            </div>

            {/* Test Details Card */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 font-bold font-mono">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">Assessment Format</span>
                <span className="text-xs font-black text-stone-900 font-mono">
                  {platform.testType}
                </span>
              </div>
            </div>

            {/* Numbered Secrets */}
            <div className="space-y-2.5">
              <span className="text-xs font-black text-stone-900 uppercase font-mono block">
                Field-Tested Exam Strategies:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {platform.aiGuide.screeningExamSecrets.map((secret, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] text-xs text-stone-800 font-medium">
                    <span className="w-6 h-6 rounded-xl bg-orange-600 text-white font-black text-xs flex items-center justify-center shrink-0 font-mono shadow-2xs">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{secret}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rubric Criteria */}
            {platform.aiGuide.commonTestQuestionsAndRubric.length > 0 && (
              <div className="pt-2 border-t border-[#EDE8DF] space-y-2.5">
                <span className="text-xs font-black text-stone-900 uppercase font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Key Graded Rubric Standards:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {platform.aiGuide.commonTestQuestionsAndRubric.map((rub, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 font-medium space-y-1">
                      <strong className="font-black text-amber-900 font-mono block">{rub.type}</strong>
                      <p className="leading-relaxed">{rub.advice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: QUALITY & SAFETY RULES */}
        {activeTab === 'safety' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="pb-2 border-b border-[#EDE8DF]">
              <h4 className="text-xs font-black text-stone-900 font-mono uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sandbox Calibration & Account Safety Guidelines</span>
              </h4>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                How to maintain 5/5 quality scores, avoid empty task queues (EQ), and protect your account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Calibration Tips */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <span className="text-xs font-black text-emerald-950 uppercase font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Calibration & High-Pay Queue Rules:</span>
                </span>
                <div className="space-y-2 text-xs text-emerald-950 font-medium">
                  {platform.aiGuide.sandboxCalibrationTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-emerald-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avoid Disqualification */}
              <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
                <span className="text-xs font-black text-red-950 uppercase font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Strict Disqualification Triggers:</span>
                </span>
                <div className="space-y-2 text-xs text-red-950 font-medium">
                  {platform.aiGuide.avoidDisqualificationRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-red-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AFRICAN BANK PAYOUTS */}
        {activeTab === 'payout' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="pb-2 border-b border-[#EDE8DF]">
              <h4 className="text-xs font-black text-stone-900 font-mono uppercase flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-orange-600" />
                <span>Nigerian & African Bank Payout Setup</span>
              </h4>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                Verified instructions to withdraw USD earnings directly to your local bank account (GTBank, Access, Kuda, Zenith, etc.).
              </p>
            </div>

            {/* Payout Details Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF]">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">Supported Rails</span>
                <span className="text-xs font-black text-stone-900 font-mono block">
                  {platform.payoutMethods.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">Payout Schedule</span>
                <span className="text-xs font-black text-stone-900 font-mono block">
                  {platform.payoutSchedule}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">Minimum Cashout</span>
                <span className="text-xs font-black text-emerald-700 font-mono block">
                  {platform.payoutMinimum}
                </span>
              </div>
            </div>

            {/* Step-by-Step Payout Setup */}
            <div className="space-y-2.5">
              <span className="text-xs font-black text-stone-900 uppercase font-mono block">
                Step-by-Step Withdrawal Configuration:
              </span>
              <div className="space-y-2">
                {platform.aiGuide.nigeriaPayoutSetupSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] text-xs text-stone-800 font-medium">
                    <span className="w-6 h-6 rounded-xl bg-stone-900 text-white font-black text-xs flex items-center justify-center shrink-0 font-mono">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ASK DEDICATED AI MENTOR */}
        {activeTab === 'ai_chat' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE8DF]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-black text-stone-950 font-mono">
                  Interactive AI Mentor • Grounded in {platform.name}
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold">
                Online & Ready
              </span>
            </div>

            {/* Messages Area */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-stone-500">
                    <span>{msg.sender === 'user' ? 'You' : `AI Mentor (${platform.name})`}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs max-w-xl leading-relaxed relative group ${
                      msg.sender === 'user'
                        ? 'bg-[#1A1A1A] text-white font-medium rounded-tr-none'
                        : 'bg-stone-50 border border-[#EDE8DF] text-stone-900 font-medium rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {msg.sender === 'ai' && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="absolute top-2 right-2 p-1 rounded-lg bg-white/80 hover:bg-white text-stone-500 hover:text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity border border-stone-200"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-stone-50 border border-[#EDE8DF] text-xs text-stone-600 w-fit">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-orange-600" />
                  <span>AI Mentor is analyzing verified {platform.name} knowledge base...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-2 border-t border-[#EDE8DF]">
              <span className="text-[10px] font-black text-stone-600 uppercase font-mono">
                Suggested Questions for {platform.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {platform.aiGuide.quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors cursor-pointer border border-stone-200/60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={`Ask AI Mentor about tests, rubric rules, or payouts on ${platform.name}...`}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-[#EDE8DF] text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-600 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={isAiThinking || !inputQuery.trim()}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-[#D84315] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 cursor-pointer shrink-0"
              >
                <span>Ask AI</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. PERSISTENT AI GUIDANCE SYSTEM FOOTER                                   */}
      {/* ========================================================================= */}
      <div className="border-t border-[#EDE8DF] bg-gradient-to-r from-orange-50/90 via-[#FAF8F5] to-emerald-50/70 p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-orange-400 flex items-center justify-center shrink-0 shadow-sm border border-stone-800">
              <Bot className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-xs font-black text-stone-950 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                  <span>AI Guidance System • Confused or Unsure What to Do?</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-[10px] font-black font-mono">
                  Dedicated AI Mentor Active
                </span>
              </div>
              <p className="text-xs text-stone-700 font-medium leading-relaxed max-w-2xl">
                <strong>Whenever you feel confused, stuck on an entry test, or don't know what to do next:</strong> consult the AI Mentor grounded in {platform.name}. It guides you step-by-step through test answers, rubric guidelines, sandbox calibrations, and bank cashouts.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab('ai_chat');
              }}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Bot className="w-3.5 h-3.5 text-orange-400" />
              <span>{activeTab === 'ai_chat' ? 'Chatting with AI Mentor' : `Ask ${platform.name} AI Mentor`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Direct-to-AI prompt chips for confused users */}
        <div className="mt-3 pt-3 border-t border-[#EDE8DF]/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-stone-600 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
            <span>If confused, click a question to ask AI immediately:</span>
          </span>
          {[
            { label: "❓ I'm confused — what do I do first?", query: `I'm totally new and confused about ${platform.name}. Exactly what step-by-step actions should I take today to register, pass the screening, and start earning?` },
            { label: "🎯 How to pass the entry test?", query: `What are the exact secrets, trick questions, and rubric standards I need to score 90%+ and pass the ${platform.name} screening assessment on my first try?` },
            { label: "💳 How to withdraw to Nigerian/African bank?", query: `Walk me step-by-step through setting up ${platform.payoutMethods.join(' or ')} to withdraw USD earnings directly into my local bank account.` },
            { label: "⚡ Why is my task queue empty?", query: `My task queue on ${platform.name} is empty or says no tasks available. How do I calibrate my profile and get assigned high-paying project queues?` },
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveTab('ai_chat');
                handleSendMessage(chip.query);
              }}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-medium border border-[#EDE8DF] hover:border-orange-300 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
