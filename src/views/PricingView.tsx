import React from 'react';
import { 
  Crown, 
  Check, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  CreditCard,
  Flame,
  Globe2,
  Users,
  Building2,
  Send,
  Mail,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PricingView: React.FC = () => {
  const { openPostJobModal, openEmailAlertModal } = useApp();

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Free For Job Seekers & Candidates</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-950 tracking-tight">
          Post a Job & Reach 25,000+ Verified Remote Talent
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
          Zero paywalls for candidates. High-intent traffic for employers. Distribute your remote openings to vetted software engineers, AI trainers, designers, and operators.
        </p>
      </div>

      {/* Free Candidate Guarantee Box */}
      <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-[#EDE8DF] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <h3 className="text-base font-black text-stone-950">Looking for remote jobs?</h3>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
              You never need to pay. Search, filter, ATS score match, and apply directly to official employer portals for free.
            </p>
          </div>
        </div>
        <button
          onClick={openEmailAlertModal}
          className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-black flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <Mail className="w-4 h-4 text-amber-400" />
          <span>Get Free Job Alerts</span>
        </button>
      </div>

      {/* Employer Monetization Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Standard Free Posting */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE8DF] flex flex-col justify-between space-y-6 shadow-xs hover:border-stone-400 transition-colors">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-black text-stone-500 uppercase tracking-wider">Free Employer Tier</span>
              <h3 className="text-xl font-black text-stone-950 mt-1">Standard Listing</h3>
              <p className="text-xs text-stone-600 font-medium mt-1">Publish open remote roles directly to our search index.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-stone-950">$0</span>
              <span className="text-xs text-stone-500 font-semibold">/ 30 days active</span>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs text-stone-700 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Indexed in Discover Remote Jobs Feed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct link to your ATS (Greenhouse / Lever)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Searchable by tech stack & salary tier</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>30 days live on remotejobs.io</span>
              </div>
            </div>
          </div>

          <button
            onClick={openPostJobModal}
            className="w-full py-3 rounded-xl text-xs font-black border border-stone-300 hover:border-stone-900 bg-stone-50 hover:bg-stone-100 text-stone-900 transition-all cursor-pointer"
          >
            Post Free Listing
          </button>
        </div>

        {/* Featured Post ($99) */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-50/60 via-white to-white border-2 border-amber-500 flex flex-col justify-between space-y-6 relative shadow-lg">
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
            <Flame className="w-3 h-3 fill-current" />
            Most Popular
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider">Maximum Exposure</span>
              <h3 className="text-xl font-black text-stone-950 mt-1">Featured & Pinned</h3>
              <p className="text-xs text-stone-600 font-medium mt-1">5x more qualified candidate views and direct clicks.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-stone-950">$99</span>
              <span className="text-xs text-stone-500 font-semibold">/ 30 days active</span>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-amber-200 text-xs text-stone-800 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-bold text-stone-950">Pinned to the top of Discover Feed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-bold text-stone-950">Distinctive 🔥 Featured badge & amber border</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Distributed in weekly email newsletter (15,000+ subscribers)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Syndicated across Twitter & Telegram channels</span>
              </div>
            </div>
          </div>

          <button
            onClick={openPostJobModal}
            className="w-full py-3.5 rounded-xl font-black text-xs text-stone-950 bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Featured Job ($99)</span>
          </button>
        </div>

        {/* Company Spotlight & Partner */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE8DF] flex flex-col justify-between space-y-6 shadow-xs hover:border-stone-400 transition-colors">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-black text-stone-500 uppercase tracking-wider">Employer Branding</span>
              <h3 className="text-xl font-black text-stone-950 mt-1">Company Spotlight</h3>
              <p className="text-xs text-stone-600 font-medium mt-1">For scale-ups hiring multiple remote engineers monthly.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-stone-950">$249</span>
              <span className="text-xs text-stone-500 font-semibold">/ month</span>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs text-stone-700 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-stone-950">Up to 5 Featured Job Postings active</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Exclusive top banner placement across job board</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated employer profile & culture showcase</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Slack/WhatsApp onboarding assistance</span>
              </div>
            </div>
          </div>

          <button
            onClick={openPostJobModal}
            className="w-full py-3 rounded-xl text-xs font-black bg-stone-900 hover:bg-black text-white transition-all cursor-pointer"
          >
            Get Company Spotlight
          </button>
        </div>
      </div>

      {/* Traffic & Audience Metrics */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE8DF] space-y-6">
        <h3 className="text-base font-black text-stone-950">Why Tech Companies Post on remotejobs.io</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EDE8DF] text-center">
            <span className="text-2xl sm:text-3xl font-black text-stone-950">25,000+</span>
            <p className="text-xs text-stone-600 font-bold mt-1">Monthly Active Talent</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EDE8DF] text-center">
            <span className="text-2xl sm:text-3xl font-black text-stone-950">15,000+</span>
            <p className="text-xs text-stone-600 font-bold mt-1">Email Newsletter Subscribers</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EDE8DF] text-center">
            <span className="text-2xl sm:text-3xl font-black text-stone-950">84%</span>
            <p className="text-xs text-stone-600 font-bold mt-1">Software & AI Engineers</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EDE8DF] text-center">
            <span className="text-2xl sm:text-3xl font-black text-stone-950">&lt; 24h</span>
            <p className="text-xs text-stone-600 font-bold mt-1">Average First Applicant Time</p>
          </div>
        </div>
      </div>

      {/* Payment Rails */}
      <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#EDE8DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600 font-medium">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-stone-800" />
          <span>Supported payment methods for featured listings: Stripe, Cards, Apple Pay, Google Pay, Flutterwave, and Paystack.</span>
        </div>
        <span className="text-emerald-700 font-black">100% Instant Live Activation</span>
      </div>
    </div>
  );
};
