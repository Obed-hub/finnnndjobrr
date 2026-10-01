import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Bot, 
  Code2, 
  Server, 
  Palette, 
  Briefcase, 
  Globe, 
  ArrowUpRight, 
  Bookmark,
  TrendingUp,
  RotateCw,
  Home,
  Receipt,
  Keyboard,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchJobs } from '../lib/api';
import { Job } from '../types';
import { INITIAL_JOBS } from '../data/initialData';

export const LandingPageView: React.FC = () => {
  const { 
    setActiveTab, 
    setSearchFilters, 
    setSelectedJobForDetails,
    setSelectedJobForPitch,
    savedJobIds,
    toggleSaveJob,
    openOpenTrainResearchModal,
    openMicro1ResearchModal
  } = useApp();

  const [heroSearch, setHeroSearch] = useState('');
  const [feedFilter, setFeedFilter] = useState<'all' | 'hot' | 'nigeria' | 'ai' | 'high_salary' | 'saved'>('all');
  const [liveJobs, setLiveJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // Load real-time jobs
  useEffect(() => {
    fetchJobs({ sortBy: 'recent' })
      .then(res => {
        if (res.jobs && res.jobs.length > 0) {
          setLiveJobs(res.jobs);
        } else {
          setLiveJobs(INITIAL_JOBS);
        }
        setIsLoadingJobs(false);
      })
      .catch(() => {
        setLiveJobs(INITIAL_JOBS);
        setIsLoadingJobs(false);
      });
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) {
      setActiveTab('discover');
      return;
    }
    setSearchFilters(prev => ({ ...prev, keyword: heroSearch }));
    setActiveTab('discover');
  };

  const handleCategoryPillClick = (catId: string, keyword?: string) => {
    setSearchFilters(prev => ({
      ...prev,
      category: catId === 'all' ? 'all' : catId,
      keyword: keyword || ''
    }));
    setActiveTab('discover');
  };

  const filteredFeedJobs = useMemo(() => {
    let list = [...liveJobs];
    if (feedFilter === 'hot') {
      list = list.filter(j => (j.opportunityScore || 0) >= 88 || j.matchScore >= 88);
    } else if (feedFilter === 'nigeria') {
      list = list.filter(j => j.isNigeriaEligible || j.location.toLowerCase().includes('nigeria') || j.location.toLowerCase().includes('africa'));
    } else if (feedFilter === 'ai') {
      list = list.filter(j => j.category === 'ai' || j.title.toLowerCase().includes('ai') || j.employmentType === 'ai_task');
    } else if (feedFilter === 'high_salary') {
      list = list.filter(j => (j.salaryMin && j.salaryMin >= 30000) || j.salaryFormatted.includes('hr') || j.salaryFormatted.includes('$'));
    } else if (feedFilter === 'saved') {
      list = list.filter(j => savedJobIds.includes(j.id));
    }
    return list.slice(0, 15);
  }, [liveJobs, feedFilter, savedJobIds]);

  return (
    <div className="w-full space-y-12 pb-20 pt-2 sm:pt-4">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        
        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF9F5] border border-[#EDE8DF] text-xs sm:text-sm font-bold text-stone-800 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] animate-pulse" />
          <span>Over 120+ verified remote roles & AI gigs open now</span>
        </div>

        {/* Crisp Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-[1.15]">
            Find Verified Remote Jobs <br className="hidden sm:inline" />
            <span className="text-[#0B5CFF]">& High-Paying AI Gigs</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-800 font-bold max-w-xl mx-auto leading-relaxed">
            Curated international contractor roles, RLHF evaluation tasks, and remote tech jobs with verified foreign payouts.
          </p>
        </div>

        {/* Clean Search Bar */}
        <form onSubmit={handleHeroSearchSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl sm:rounded-full border-2 border-[#EDE8DF] hover:border-[#0B5CFF] focus-within:border-[#0B5CFF] shadow-sm transition-all">
            <div className="flex items-center gap-3 w-full px-3 py-1.5 sm:py-0">
              <Search className="w-5 h-5 text-stone-600 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                placeholder="Search job title, skill, or keyword (e.g. React, Python, Data)..."
                className="w-full bg-transparent text-sm sm:text-base font-bold text-stone-950 placeholder-stone-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-[#0B5CFF] hover:bg-[#0849CD] text-white font-black text-sm sm:text-base transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
          <span className="font-black text-stone-800 mr-1">Popular:</span>
          {[
            { label: 'Software Engineer', query: 'Software' },
            { label: 'AI Evaluator ($50+/hr)', query: 'AI' },
            { label: 'UI/UX Design', query: 'Design' },
            { label: 'Data Analyst', query: 'Data' },
            { label: 'Customer Support', query: 'Support' }
          ].map(tag => (
            <button
              key={tag.label}
              type="button"
              onClick={() => {
                setSearchFilters(prev => ({ ...prev, keyword: tag.query, category: 'all' }));
                setActiveTab('discover');
              }}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 border border-stone-300 text-stone-900 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
            >
              {tag.label}
            </button>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORY PILLS                                                         */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* Software */}
          <button
            onClick={() => handleCategoryPillClick('engineering', 'Software')}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EDE8DF] hover:border-[#00875A] hover:shadow-xs transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00875A] flex items-center justify-center group-hover:scale-105 transition-transform font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-sm text-stone-950 group-hover:text-[#00875A] transition-colors">
                  Software Engineering
                </div>
                <div className="text-xs text-stone-700 font-bold">$60k – $120k / yr</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-[#00875A]" />
          </button>

          {/* AI & RLHF */}
          <button
            onClick={() => {
              setSearchFilters(prev => ({ ...prev, category: 'ai', employmentType: 'ai_task' as any }));
              setActiveTab('aiwork');
            }}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EDE8DF] hover:border-indigo-500 hover:shadow-xs transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-sm text-stone-950 group-hover:text-indigo-600 transition-colors">
                  AI & RLHF Evaluation
                </div>
                <div className="text-xs text-stone-700 font-bold">$35 – $90 / hr</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-indigo-600" />
          </button>

          {/* Product Design */}
          <button
            onClick={() => handleCategoryPillClick('design', 'Design')}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EDE8DF] hover:border-purple-500 hover:shadow-xs transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform font-bold">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-sm text-stone-950 group-hover:text-purple-600 transition-colors">
                  Product & UI/UX Design
                </div>
                <div className="text-xs text-stone-700 font-bold">$50k – $90k / yr</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-purple-600" />
          </button>

          {/* Data Science */}
          <button
            onClick={() => handleCategoryPillClick('data', 'Data')}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EDE8DF] hover:border-blue-500 hover:shadow-xs transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-sm text-stone-950 group-hover:text-blue-600 transition-colors">
                  Data Science & Analytics
                </div>
                <div className="text-xs text-stone-700 font-bold">$50k – $85k / yr</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-blue-600" />
          </button>

          {/* Customer Ops */}
          <button
            onClick={() => handleCategoryPillClick('support', 'Support')}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EDE8DF] hover:border-amber-500 hover:shadow-xs transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-sm text-stone-950 group-hover:text-amber-600 transition-colors">
                  Customer Support & Ops
                </div>
                <div className="text-xs text-stone-700 font-bold">$1,500 – $3,500 / mo</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-600" />
          </button>

          {/* Virtual Assistant */}
          <button
            onClick={() => handleCategoryPillClick('support', 'Virtual Assistant')}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EDE8DF] hover:border-[#0B5CFF] hover:shadow-xs transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0B5CFF] flex items-center justify-center group-hover:scale-105 transition-transform font-bold">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-sm text-stone-950 group-hover:text-[#0B5CFF] transition-colors">
                  Virtual Assistant
                </div>
                <div className="text-xs text-stone-700 font-bold">$1,200 – $2,800 / mo</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-[#0B5CFF]" />
          </button>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TOP COMPANIES LOGO STRIP                                              */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono">
          Companies Hiring Remotely
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80">
          <span className="font-black text-lg sm:text-xl text-stone-800">Google</span>
          <span className="font-black text-lg sm:text-xl text-stone-800">amazon</span>
          <span className="font-black text-lg sm:text-xl text-stone-800">DOORDASH</span>
          <span className="font-bold text-lg sm:text-xl text-stone-800">Zillow</span>
          <span className="font-bold text-lg sm:text-xl text-stone-800">twilio</span>
          <span className="font-black text-lg sm:text-xl text-stone-800">micro1</span>
          <span className="font-black text-lg sm:text-xl text-indigo-700">OpenTrain</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. KEY ADVANTAGES (CONCISE 2-CARD LAYOUT)                                */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
              <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
              <span>100% Verified International Eligibility</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every job is checked for remote candidate eligibility with zero geo-blocking surprises.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
              <ShieldCheck className="w-5 h-5 text-[#0B5CFF]" />
              <span>Reliable Foreign Wire & Crypto Payouts</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Direct settlement via Deel, Geegpay, Grey, Wise, Payoneer, or USDC/crypto.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. LIVE REMOTE JOBS STREAM                                               */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE8DF] pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight">
              Featured Remote Opportunities
            </h2>
            <p className="text-xs text-stone-500">
              Updated live with confirmed remote eligibility.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All Jobs' },
              { id: 'hot', label: '🔥 Top Matches' },
              { id: 'nigeria', label: '🇳🇬 Nigeria Eligible' },
              { id: 'ai', label: '🤖 AI Work' },
              { id: 'high_salary', label: '💵 $2k+/mo' },
              { id: 'saved', label: `⭐ Saved (${savedJobIds.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFeedFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  feedFilter === tab.id
                    ? 'bg-[#0B5CFF] text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-3">
          {isLoadingJobs ? (
            <div className="py-12 text-center text-stone-500 space-y-2">
              <RotateCw className="w-5 h-5 animate-spin mx-auto text-[#0B5CFF]" />
              <p className="text-xs">Loading live jobs...</p>
            </div>
          ) : filteredFeedJobs.length === 0 ? (
            <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-[#EDE8DF] text-stone-500 text-xs">
              No jobs found for this filter.
            </div>
          ) : (
            filteredFeedJobs.map(job => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobForDetails(job)}
                  className="group p-4 sm:p-5 rounded-2xl bg-white border border-[#EDE8DF] hover:border-[#0B5CFF]/60 hover:shadow-xs transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#EDE8DF] flex items-center justify-center font-bold text-stone-800 text-base shrink-0 group-hover:scale-105 transition-transform">
                      {job.company.charAt(0)}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A] group-hover:text-[#0B5CFF] transition-colors truncate">
                          {job.title}
                        </h3>
                        {job.isNigeriaEligible && (
                          <span className="hidden sm:inline-block px-2 py-0.2 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            🇳🇬 Eligible
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-semibold text-stone-700">{job.company}</span>
                        <span>•</span>
                        <span>{job.location || 'Worldwide Remote'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                    <div className="text-left md:text-right">
                      <div className="text-xs sm:text-sm font-bold font-mono text-[#00875A]">
                        {job.salaryFormatted || '$1,800 – $3,500/mo'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id, {
                            title: job.title,
                            company: job.company,
                            salary: job.salaryFormatted,
                            location: job.location
                          });
                        }}
                        className={`p-2 rounded-xl border transition-colors ${
                          isSaved 
                            ? 'bg-rose-50 border-rose-200 text-[#D84315]' 
                            : 'bg-white border-[#EDE8DF] text-stone-400 hover:text-stone-700'
                        }`}
                        title="Bookmark Job"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJobForPitch(job);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Pitch</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJobForDetails(job);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0B5CFF] hover:bg-[#0849CD] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Explore All CTA */}
        <div className="text-center pt-3">
          <button
            onClick={() => {
              setSearchFilters(prev => ({ ...prev, category: 'all', keyword: '' }));
              setActiveTab('discover');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
          >
            <span>Explore All Remote Roles</span>
            <ArrowRight className="w-4 h-4 text-[#0B5CFF]" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EARN PLATFORMS & AI WORK SPOTLIGHT BANNER                               */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-neutral-900 to-stone-950 text-white p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg border border-stone-800">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-orange-400 uppercase font-mono">14 Verified Direct Earning Platforms</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold">
              Create Account & Unlock Dollar Tasks with Dedicated AI Guides
            </h3>
            <p className="text-xs text-stone-400 max-w-xl">
              Outlier, OpenTrain, Micro1, Alignerr, DataAnnotation, Superteam & more. Each platform includes an interactive AI Mentor with exam secrets and Nigerian payout guides.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('earn')}
              className="px-5 py-2.5 rounded-xl bg-[#D84315] hover:bg-[#BF360C] text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <span>Explore Earn Platforms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
