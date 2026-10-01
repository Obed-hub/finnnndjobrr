import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  Award,
  Layers,
  Filter,
  UserCheck,
  Lock,
  Compass,
  ArrowUpDown,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { EARN_PLATFORMS_DATA, EarnPlatformData } from '../data/earnPlatformsData';
import { EarnPlatformCard } from '../components/EarnPlatformCard';
import { useApp } from '../context/AppContext';

export const EarnPlatformsView: React.FC = () => {
  const { setActiveTab } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'highest_pay' | 'fastest_payout' | 'beginner'>('recommended');

  const categories = [
    { id: 'all', label: 'All Platforms', count: EARN_PLATFORMS_DATA.length },
    { id: 'Frontier AI & RLHF', label: 'Frontier AI & RLHF ($20–$120/hr)', count: EARN_PLATFORMS_DATA.filter(p => p.category === 'Frontier AI & RLHF').length },
    { id: 'Code & Tech Experts', label: 'Code & Tech Experts ($35–$90/hr)', count: EARN_PLATFORMS_DATA.filter(p => p.category === 'Code & Tech Experts').length },
    { id: 'Web3 Bounties & Escrow', label: 'Web3 Bounties & Escrow', count: EARN_PLATFORMS_DATA.filter(p => p.category === 'Web3 Bounties & Escrow').length },
    { id: 'Microtasks & Annotation', label: 'Microtasks & Annotation ($3–$18/hr)', count: EARN_PLATFORMS_DATA.filter(p => p.category === 'Microtasks & Annotation').length },
    { id: 'Software & Usability Testing', label: 'Usability & QA Testing', count: EARN_PLATFORMS_DATA.filter(p => p.category === 'Software & Usability Testing').length },
  ];

  const filteredPlatforms = EARN_PLATFORMS_DATA.filter(platform => {
    const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory;
    const matchesSearch = 
      platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      platform.payoutMethods.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'highest_pay') {
      const getMin = (str: string) => {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
      return getMin(b.verifiedRate) - getMin(a.verifiedRate);
    }
    if (sortBy === 'fastest_payout') {
      const isFast = (speed: string) => speed.toLowerCase().includes('immediate') || speed.toLowerCase().includes('instant') || speed.toLowerCase().includes('1 to') || speed.toLowerCase().includes('2 to');
      return (isFast(b.speedToFirstDollar) ? 1 : 0) - (isFast(a.speedToFirstDollar) ? 1 : 0);
    }
    if (sortBy === 'beginner') {
      const rank = (diff: string) => diff === 'Beginner' ? 3 : diff === 'Intermediate' ? 2 : 1;
      return rank(b.difficulty) - rank(a.difficulty);
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* 1. HERO BANNER */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-neutral-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border border-stone-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Account Earning & Contractor Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-mono">
            Create Accounts & Earn in USD/Crypto
          </h1>

          <p className="text-sm sm:text-base text-stone-300 font-medium leading-relaxed">
            Curated websites where you must create a contractor account to unlock live tasks and earn. Each platform features an <strong className="text-white font-bold">embedded dedicated AI Mentor</strong> trained on entry screening tests, rubric calibration, and verified Nigerian payout setups.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-mono uppercase block">Total Platforms</span>
              <span className="text-lg font-black text-white font-mono">{EARN_PLATFORMS_DATA.length} Verified</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-mono uppercase block">Verified Pay Range</span>
              <span className="text-lg font-black text-emerald-400 font-mono">$3 – $120 / hr</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-mono uppercase block">African Eligibility</span>
              <span className="text-lg font-black text-white font-mono">🇳🇬 100% Eligible</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-mono uppercase block">AI Mentor Grounding</span>
              <span className="text-lg font-black text-orange-400 font-mono">Dedicated per Card</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACCOUNT CREATION NOTICE & WORKFLOW SUMMARY */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-950 font-mono">
              How to Earn on These Platforms:
            </h3>
            <p className="text-xs text-amber-900 font-medium mt-0.5 leading-relaxed">
              1. <strong>Sign Up & Setup</strong> (Tab 1 & 2) → 2. <strong>Pass Entry Screening Quiz</strong> (Tab 3 for Exam Secrets) → 3. <strong>Complete Calibration Tasks</strong> (Tab 4 for Quality Rules) → 4. <strong>Link African Bank Payout Rails</strong> (Tab 5) → 5. <strong>Withdraw Dollars</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('beginner')}
          className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0"
        >
          View Beginner Guides →
        </button>
      </div>

      {/* 3. SEARCH & CATEGORY FILTERS */}
      <div className="space-y-4">
        
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platforms by name, skill (Python, Writing, QA), or payout (AirTM, Deel, Solana)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#EDE8DF] text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-600 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-[#EDE8DF] text-xs font-bold text-stone-700 shadow-2xs w-full sm:w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-[11px] text-stone-500 font-mono">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-xs font-black text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="highest_pay">Highest Hourly Pay</option>
                <option value="fastest_payout">Fastest to First $</option>
                <option value="beginner">Beginner Friendly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white shadow-2xs'
                    : 'bg-white text-stone-700 border border-[#EDE8DF] hover:bg-stone-100'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. PLATFORM CARDS LIST */}
      <div className="space-y-6">
        {filteredPlatforms.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#EDE8DF] space-y-3">
            <Bot className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-900">No platforms matching your filter</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Try adjusting your search keyword or switching category tabs to explore all 14 contractor platforms.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPlatforms.map((platform, idx) => (
            <EarnPlatformCard
              key={platform.id}
              platform={platform}
              initialExpanded={idx === 0} // First card expanded by default for instant onboarding preview
            />
          ))
        )}
      </div>

    </div>
  );
};
