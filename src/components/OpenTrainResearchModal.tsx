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
  RotateCw, 
  Check, 
  Copy, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Video,
  Award,
  Zap,
  Briefcase
} from 'lucide-react';
import { OPENTRAIN_DEEP_RESEARCH } from '../data/openTrainResearchData';
import { useApp } from '../context/AppContext';

interface OpenTrainResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenTrainResearchModal: React.FC<OpenTrainResearchModalProps> = ({ isOpen, onClose }) => {
  const { showToast, setActiveTab, setSelectedJobForResumeReshape, setIsResumeReshapeModalOpen, openInAppBrowser } = useApp();
  const [activeTab, setActiveTabKey] = useState<'roles' | 'peer_platforms' | 'portfolio' | 'vetting' | 'nigeria_payouts' | 'playbook'>('roles');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(OPENTRAIN_DEEP_RESEARCH.url);
    setCopiedUrl(true);
    showToast('Copied OpenTrain AI URL to clipboard!', 'success');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/40 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 font-mono flex items-center gap-1 border border-indigo-500/30">
                <Bot className="w-3 h-3 text-indigo-400" />
                <span>Deep Research Dossier</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                $50 – $90/hr Verified
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                🇳🇬 100% Remote Worldwide
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>OpenTrain AI & Frontier AI Gig Platforms</span>
            </h2>
            
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Complete intelligence report on <strong>opentrain.ai</strong> and peer frontier AI training marketplaces paying $50–$90/hr for video robotics annotation, model evaluation, and prompt auditing.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => openInAppBrowser('https://opentrain.ai', null, 'OpenTrain AI')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="Open in-app portal"
            >
              <span>Visit opentrain.ai</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar shrink-0 py-2">
          <button
            onClick={() => setActiveTabKey('roles')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'roles' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>OpenTrain $50–$90/hr Roles</span>
          </button>

          <button
            onClick={() => setActiveTabKey('peer_platforms')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'peer_platforms' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>More Platforms Like This (7)</span>
          </button>

          <button
            onClick={() => setActiveTabKey('portfolio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'portfolio' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Unified Portfolio System</span>
          </button>

          <button
            onClick={() => setActiveTabKey('vetting')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'vetting' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Qualification & Vetting</span>
          </button>

          <button
            onClick={() => setActiveTabKey('nigeria_payouts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'nigeria_payouts' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Nigeria Payout Channels</span>
          </button>

          <button
            onClick={() => setActiveTabKey('playbook')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'playbook' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>6-Step Playbook</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm">
          
          {/* TAB 1: OPENTRAIN ROLES ($50–$90/HR) */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              {/* Highlight Card: Verified Match to User's Uploaded Screenshot */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-300">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Direct Match to Your Search</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold">
                        Hourly · $50–$90/hr
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      OpenTrain AI advertises open roles including <strong>Video Annotation Specialist for Robotics AI</strong> (Remote · Worldwide · English · Part-time Flexible · Entry Level).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openInAppBrowser('https://opentrain.ai', null, 'OpenTrain AI Opportunities')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Open in-app portal"
                >
                  <span>Apply on OpenTrain AI</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Grid of All 6 OpenTrain Opportunity Tracks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OPENTRAIN_DEEP_RESEARCH.opportunityTracks.map((track, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-white leading-snug">
                          {track.trackTitle}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                          {track.payRange.split('(')[0]}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-400 font-medium">Included Roles:</div>
                        <ul className="space-y-1">
                          {track.rolesIncluded.map((role, rIdx) => (
                            <li key={rIdx} className="flex items-center gap-1.5 text-xs text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                              <span>{role}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-400 font-medium">Key Skills & Requirements:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {track.keySkills.map((sk, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">
                        {track.commitment.split('(')[0]}
                      </span>
                      <button
                        type="button"
                        onClick={() => openInAppBrowser('https://opentrain.ai', null, `OpenTrain — ${track.trackTitle}`)}
                        className="font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                        title="Open in-app portal"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PEER PLATFORMS LIKE OPENTRAIN AI */}
          {activeTab === 'peer_platforms' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <h3 className="text-sm font-bold text-white">7 High-Paying AI Training Platforms Similar to OpenTrain AI</h3>
                <p className="text-xs text-slate-300">
                  We conducted deep research to uncover the top global platforms offering remote AI evaluation, annotation, and prompt testing paying in USD to worldwide contributors.
                </p>
              </div>

              <div className="space-y-3.5">
                {OPENTRAIN_DEEP_RESEARCH.peerPlatforms.map((plat, idx) => (
                  <div 
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-extrabold text-white">{plat.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {plat.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                          {plat.payRange}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {plat.keyDifference}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-medium">
                        <span><strong>Vetting:</strong> {plat.vettingMethod}</span>
                        <span><strong>Payout Rails:</strong> {plat.payoutRail}</span>
                        <span className="text-emerald-400 font-semibold">{plat.africaEligibility}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openInAppBrowser(plat.url, null, plat.name)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer"
                      title="Open in-app portal"
                    >
                      <span>Visit {plat.name.split(' ')[0]}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: UNIFIED PORTFOLIO SYSTEM */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">
                    What is OpenTrain AI’s "Unified AI Training Portfolio"?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {OPENTRAIN_DEEP_RESEARCH.portfolioSystem.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {OPENTRAIN_DEEP_RESEARCH.portfolioSystem.benefits.map((benefit, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-slate-200 leading-relaxed font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Reputation Portability: {OPENTRAIN_DEEP_RESEARCH.portfolioSystem.reputationPortability}</span>
                </div>
                <p>
                  As an AI trainer from Nigeria, having verified accuracy metrics (e.g. 98% prompt adherence score) in an OpenTrain portfolio lets you bypass cold applications and gain instant access to high-tier $90–$140/hr queues.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: QUALIFICATION & VETTING */}
          {activeTab === 'vetting' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>How the Screening Works</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300">
                    {OPENTRAIN_DEEP_RESEARCH.vettingProcess.screening.duration}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {OPENTRAIN_DEEP_RESEARCH.vettingProcess.screening.format}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-white">Focus Areas Evaluated:</div>
                  <ul className="space-y-1.5">
                    {OPENTRAIN_DEEP_RESEARCH.vettingProcess.screening.focusAreas.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Important Screening Prep Tips</span>
                </div>
                <ul className="space-y-2 text-xs text-amber-100/90">
                  {OPENTRAIN_DEEP_RESEARCH.vettingProcess.screening.prepTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Accepted Nigerian IDs:</span>
                <span className="text-white font-semibold">International Passport, Driver's License, NIN Slip</span>
              </div>
            </div>
          )}

          {/* TAB 5: NIGERIAN PAYOUT CHANNELS */}
          {activeTab === 'nigeria_payouts' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Confirmed Payout Rails for Nigerian Contributors</span>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {OPENTRAIN_DEEP_RESEARCH.payoutAndContractInfo.nigeriaSupport}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-xs">Geegpay / Grey</div>
                  <div className="text-[11px] text-emerald-400 font-mono">USD Virtual Account</div>
                  <p className="text-[11px] text-slate-400">
                    Receive USD wire, convert to NGN at black-market parallel rates, or keep as USD savings.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-xs">USDC (Crypto Stablecoin)</div>
                  <div className="text-[11px] text-emerald-400 font-mono">Solana / Ethereum</div>
                  <p className="text-[11px] text-slate-400">
                    Instant withdrawals to your self-custody wallet or Binance/Bybit account with zero foreign transaction fees.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-xs">Payoneer / AirTM</div>
                  <div className="text-[11px] text-emerald-400 font-mono">Global E-Wallets</div>
                  <p className="text-[11px] text-slate-400">
                    Directly linked to standard Nigerian local bank accounts (GTBank, Zenith, Access, Kuda).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 text-xs text-slate-300">
                <strong>Tax Compliance Note:</strong> As a Nigerian contractor working on US/EU platforms, you fill out a standard <strong>W-8BEN</strong> form indicating foreign tax residency. This ensures 0% US tax withholding.
              </div>
            </div>
          )}

          {/* TAB 6: 6-STEP APPLICATION PLAYBOOK */}
          {activeTab === 'playbook' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Follow this exact step-by-step procedure to get approved and receive your first $50–$90/hr task assignments:
              </div>

              <div className="space-y-3">
                {OPENTRAIN_DEEP_RESEARCH.applicationPlaybook.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed font-medium pt-0.5">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Official Portal: <strong>opentrain.ai</strong></span>
            <button
              onClick={handleCopyUrl}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                setActiveTab('resume');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tailor Resume for AI Training</span>
            </button>

            <button
              type="button"
              onClick={() => openInAppBrowser('https://opentrain.ai', null, 'OpenTrain AI')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="Open in-app portal"
            >
              <span>Apply on OpenTrain AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
