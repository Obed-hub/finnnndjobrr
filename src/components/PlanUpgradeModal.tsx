import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Bot, 
  FileText, 
  TrendingUp, 
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PlanUpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, upgradeToPro, userProfile } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      upgradeToPro();
    }, 1200);
  };

  const proFeatures = [
    'Unlimited AI Tailored Pitches, Cover Letters & Recruiter DMs',
    'Full ATS Resume Intelligence & Instant Keyword Optimizer',
    'Real-Time Instant Telegram & WhatsApp Job Alerts',
    'Personal 90-Day Remote Career Roadmap Generator',
    'Full Africa Tech & Founder Network Direct Outreach Contacts',
    'Direct Application Auto-Tracker with Interview Reminders',
    'Unlimited Web3 Bounty & AI Evaluator Opportunity Indexer',
    'Verified Remote Compensation & Salary Intelligence Benchmarks'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
        
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border-b border-slate-800 flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Findjobber PRO</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase font-mono">
                  Career Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                The full career acceleration stack for high-earning remote professionals.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUpgradeModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Toggle */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Select Billing Cycle</span>
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly ($12/mo)
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span>Annual ($7.50/mo)</span>
              <span className="px-1.5 py-0.2 bg-slate-950 text-amber-300 text-[9px] rounded font-mono font-black">
                Save 38%
              </span>
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {proFeatures.map((feat, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>

          {/* Payment rails note */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Supported checkouts: Paystack (NGN Naira Card / Bank / USSD), Flutterwave, Stripe USD.</span>
            </div>
            <span className="text-emerald-400 font-bold font-mono">Instant Activation</span>
          </div>
        </div>

        {/* Footer with Checkout CTA */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white font-mono">
                {billingCycle === 'annual' ? '$90' : '$12'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {billingCycle === 'annual' ? '/ year ($7.50/mo)' : '/ month'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Cancel anytime with 1-click</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
          >
            {isProcessing ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <Crown className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Activating PRO...' : 'Upgrade Now & Unlock PRO'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
