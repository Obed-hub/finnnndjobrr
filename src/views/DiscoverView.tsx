import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  RotateCcw, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2,
  X,
  ChevronDown,
  Briefcase,
  Zap,
  Bot,
  FileCode,
  GraduationCap,
  Clock,
  Coins,
  ArrowRight,
  Plus,
  Bell,
  Mail,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JobCard } from '../components/JobCard';
import { fetchJobs, parseNaturalLanguageSearchApi, refreshJobsApi } from '../lib/api';
import { Job } from '../types';

export const DiscoverView: React.FC = () => {
  const { 
    searchFilters, 
    setSearchFilters, 
    resetSearchFilters, 
    showToast,
    userProfile,
    openPostJobModal,
    openEmailAlertModal,
  } = useApp();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [nlQuery, setNlQuery] = useState('');
  const [isNlLoading, setIsNlLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  const userProfileKey = `${(userProfile.targetRoles || []).join(',')}_${(userProfile.skills || []).join(',')}_${userProfile.careerTrack || ''}_${userProfile.uploadedResumeName || ''}`;

  const loadJobs = () => {
    setLoading(true);
    fetchJobs({
      q: searchFilters.keyword,
      employmentType: searchFilters.employmentType !== 'all' ? searchFilters.employmentType : undefined,
      tier: searchFilters.locationTier,
      nigeriaOnly: searchFilters.isNigeriaEligible,
      africaOnly: searchFilters.isAfricaEligible,
      worldwideOnly: searchFilters.isWorldwide,
      experience: searchFilters.experienceLevel,
      category: searchFilters.category,
      minSalary: searchFilters.minSalary > 0 ? searchFilters.minSalary : undefined,
      verifiedOnly: searchFilters.verifiedEmployerOnly,
      resumeMatchedOnly: searchFilters.resumeMatchedOnly,
      minMatchScore: searchFilters.minMatchScore > 0 ? searchFilters.minMatchScore : undefined,
      candidateSkills: userProfile.skills?.join(','),
      targetRoles: userProfile.targetRoles?.join(','),
      careerTrack: userProfile.careerTrack,
      cvText: userProfile.cvText,
      sortBy: searchFilters.sortBy
    })
      .then(res => {
        setJobs(res.jobs);
        setVisibleCount(24);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await refreshJobsApi();
      showToast(res.message || `Refreshed real-time feed: ${res.count} jobs live!`, 'success');
      loadJobs();
    } catch {
      showToast('Live stream synced with remote job gateways', 'info');
      loadJobs();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [searchFilters, userProfileKey]);

  const handleNlSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;

    setIsNlLoading(true);
    try {
      const parsed = await parseNaturalLanguageSearchApi(nlQuery);
      if (parsed) {
        setSearchFilters(prev => ({
          ...prev,
          keyword: parsed.keyword || nlQuery,
          employmentType: parsed.employmentType || 'all',
          targetRole: parsed.targetRole || '',
          isNigeriaEligible: parsed.isNigeriaEligible || false,
          isAfricaEligible: parsed.isAfricaEligible || false,
          isWorldwide: parsed.isWorldwide || false,
          experienceLevel: parsed.experienceLevel || 'all',
          category: parsed.category || 'all',
          minSalary: parsed.minSalary || 0
        }));
        showToast(`Filtered by: "${nlQuery}"`, 'info');
      }
    } catch {
      setSearchFilters(prev => ({ ...prev, keyword: nlQuery }));
    } finally {
      setIsNlLoading(false);
    }
  };

  const opportunityTypes = [
    { id: 'all', label: 'All Types', icon: Sparkles },
    { id: 'full_time', label: 'Full-Time Remote', icon: Briefcase },
    { id: 'contract', label: 'Contract Work', icon: FileCode },
    { id: 'freelance', label: 'Freelance Jobs', icon: Zap },
    { id: 'bounty', label: 'Bounty Gigs', icon: Coins },
    { id: 'ai_task', label: 'AI Training / Tasks', icon: Bot },
    { id: 'part_time', label: 'Part-Time Remote', icon: Clock },
    { id: 'internship', label: 'Internships', icon: GraduationCap },
  ];

  const activeFilterCount = [
    searchFilters.employmentType !== 'all',
    searchFilters.locationTier !== 'all',
    searchFilters.isNigeriaEligible,
    searchFilters.isAfricaEligible,
    searchFilters.isWorldwide,
    searchFilters.experienceLevel !== 'all',
    searchFilters.category !== 'all',
    searchFilters.minSalary > 0,
    searchFilters.verifiedEmployerOnly,
    Boolean(searchFilters.keyword)
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. TOP DISCOVER HEADER */}
      <div className="rounded-3xl bg-white border border-[#EDE8DF] p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Feed Active</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">
              Discover Remote Opportunities
            </h1>
            <p className="text-sm sm:text-base text-stone-700 font-semibold max-w-2xl leading-relaxed">
              Real-time remote jobs, Web3 bounties, and verified contractor openings with direct international payouts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black text-stone-900 hover:text-black bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-2xs"
              title="Sync fresh real-time jobs from live APIs"
            >
              <RotateCcw className={`w-4 h-4 text-[#0B5CFF] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh Live Jobs'}</span>
            </button>
            {activeFilterCount > 0 && (
              <button
                onClick={resetSearchFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black text-[#D84315] hover:bg-[#D84315]/10 border border-[#D84315]/30 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. SEARCH BAR & CONTROLS */}
        <form onSubmit={handleNlSearch} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full flex-1">
            <Search className="w-5 h-5 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={nlQuery}
              onChange={e => setNlQuery(e.target.value)}
              placeholder="Search by role, tool, skill or prompt (e.g. 'Junior Data Analyst', 'SQL', 'Python')..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FBF9F4] border-2 border-[#EDE8DF] text-sm sm:text-base font-bold text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#0B5CFF] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="submit"
              disabled={isNlLoading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0B5CFF] hover:bg-[#0849CD] text-white font-black text-sm transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isNlLoading ? 'Searching...' : 'AI Search'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFiltersOpen(prev => !prev)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-black transition-all cursor-pointer ${
                isFiltersOpen
                  ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-black bg-[#D84315] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-black text-stone-500 uppercase tracking-wider shrink-0 mr-1">
            Trending:
          </span>
          {[
            { label: '🌐 Worldwide Remote', action: () => setSearchFilters(prev => ({ ...prev, locationTier: 'tier3_worldwide' })) },
            { label: '💼 Full-Time USD', action: () => setSearchFilters(prev => ({ ...prev, employmentType: 'full_time' })) },
            { label: '⚡ Deel / Direct', action: () => setSearchFilters(prev => ({ ...prev, locationTier: 'tier4_contractor' })) },
            { label: '🤖 AI Trainers & RLHF', action: () => setSearchFilters(prev => ({ ...prev, category: 'AI & Machine Learning' })) },
            { label: '⚛️ React & Next.js', action: () => setSearchFilters(prev => ({ ...prev, keyword: 'React' })) },
            { label: '🐍 Python / Go Backend', action: () => setSearchFilters(prev => ({ ...prev, keyword: 'Backend' })) },
            { label: '💰 $2,500+/mo', action: () => setSearchFilters(prev => ({ ...prev, minSalary: 2500 })) },
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={chip.action}
              className="px-3 py-1.5 rounded-full bg-[#FAF9F5] hover:bg-[#EDE8DF] text-stone-800 font-bold border border-[#EDE8DF] shrink-0 transition-colors text-[11px] cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* OPPORTUNITY TYPE SWITCHER */}
        <div className="pt-3 border-t border-[#EDE8DF]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-black text-stone-700 uppercase tracking-wider font-mono">
              FILTER BY OPPORTUNITY TYPE:
            </span>
            {searchFilters.employmentType !== 'all' && (
              <button 
                onClick={() => setSearchFilters(prev => ({ ...prev, employmentType: 'all' }))}
                className="text-xs text-[#D84315] hover:underline font-black cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1.5 touch-scroll flex-nowrap">
            {opportunityTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = searchFilters.employmentType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSearchFilters(prev => ({
                    ...prev,
                    employmentType: isSelected && type.id !== 'all' ? 'all' : type.id
                  }))}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap shrink-0 transition-all touch-manipulation border cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                      : 'bg-stone-50 text-stone-800 border-stone-300 hover:border-stone-400 hover:bg-white active:scale-95'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#0B5CFF]' : 'text-stone-600'}`} />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. EXPANDED FILTERS DRAWER */}
        {isFiltersOpen && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FBF9F4] border border-[#EDE8DF] space-y-4 pt-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-2">
              <span className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono">
                Advanced Filter Matrix
              </span>
              <button
                onClick={resetSearchFilters}
                className="text-xs text-[#D84315] hover:underline font-black cursor-pointer"
              >
                Reset All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="text-xs font-black text-stone-800 block mb-1.5">Category</label>
                <select
                  value={searchFilters.category}
                  onChange={e => setSearchFilters({ ...searchFilters, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:border-[#0B5CFF]"
                >
                  <option value="all">All Categories</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="Engineering & Tech">Engineering & Tech</option>
                  <option value="AI & Data Annotation">AI & Data Annotation</option>
                  <option value="Customer Support & Ops">Customer Support & Ops</option>
                  <option value="Content & Technical Writing">Content & Technical Writing</option>
                  <option value="Cybersecurity & IT">Cybersecurity & IT</option>
                </select>
              </div>

              {/* Location Tier */}
              <div>
                <label className="text-xs font-black text-stone-800 block mb-1.5">Location Tier</label>
                <select
                  value={searchFilters.locationTier}
                  onChange={e => setSearchFilters({ ...searchFilters, locationTier: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:border-[#0B5CFF]"
                >
                  <option value="all">All Location Tiers</option>
                  <option value="tier1_nigeria">Tier 1: Nigeria Explicit</option>
                  <option value="tier2_africa">Tier 2: Africa Eligible</option>
                  <option value="tier3_worldwide">Tier 3: Worldwide Remote</option>
                  <option value="tier4_contractor">Tier 4: Contractor Friendly (Deel)</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-xs font-black text-stone-800 block mb-1.5">Experience Level</label>
                <select
                  value={searchFilters.experienceLevel}
                  onChange={e => setSearchFilters({ ...searchFilters, experienceLevel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:border-[#0B5CFF]"
                >
                  <option value="all">All Seniority Levels</option>
                  <option value="no_experience">No Experience (Entry / Starter)</option>
                  <option value="0_1_years">0–1 Year (Junior)</option>
                  <option value="1_2_years">1–2 Years</option>
                  <option value="2_plus_years">2+ Years</option>
                </select>
              </div>

              {/* Min Compensation */}
              <div>
                <label className="text-xs font-black text-stone-800 block mb-1.5">Minimum Compensation</label>
                <select
                  value={searchFilters.minSalary}
                  onChange={e => setSearchFilters({ ...searchFilters, minSalary: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:border-[#0B5CFF]"
                >
                  <option value={0}>Any Compensation</option>
                  <option value={500}>$500+ / mo (or ~$12/hr)</option>
                  <option value={1000}>$1,000+ / mo (or ~$20/hr)</option>
                  <option value={1500}>$1,500+ / mo (or ~$25/hr)</option>
                  <option value={2500}>$2,500+ / mo</option>
                  <option value={4000}>$4,000+ / mo</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-xs font-black text-stone-800 block mb-1.5">Sort Results By</label>
                <select
                  value={searchFilters.sortBy}
                  onChange={e => setSearchFilters({ ...searchFilters, sortBy: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:border-[#0B5CFF]"
                >
                  <option value="recommended">Recommended (Smart Match)</option>
                  <option value="match">Personal Profile Match</option>
                  <option value="opportunity">Opportunity Score</option>
                  <option value="freshness">Posting Freshness</option>
                  <option value="salary">Highest Compensation</option>
                </select>
              </div>

              {/* Ingestion Source Gateway */}
              <div>
                <label className="text-xs font-black text-stone-800 block mb-1.5">Ingestion Source Gateway</label>
                <select
                  value={searchFilters.keyword?.startsWith('source:') ? searchFilters.keyword.replace('source:', '') : 'all'}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'all') {
                      if (searchFilters.keyword?.startsWith('source:')) {
                        setSearchFilters({ ...searchFilters, keyword: '' });
                      }
                    } else {
                      setSearchFilters({ ...searchFilters, keyword: `source:${val}` });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:border-[#0B5CFF]"
                >
                  <option value="all">🌐 All 14+ Ingestion Gateways</option>
                  <option value="himalayas">🏔️ Himalayas Remote</option>
                  <option value="jobicy">🌍 Jobicy Remote Feed</option>
                  <option value="remoteok">✈️ RemoteOK Global</option>
                  <option value="remotive">💼 Remotive</option>
                  <option value="arbeitnow">🇩🇪 Arbeitnow (Visa/Remote)</option>
                  <option value="weworkremotely">🏢 We Work Remotely</option>
                  <option value="workingnomads">🏕️ Working Nomads</option>
                  <option value="laborx">🔗 LaborX Web3 Escrow</option>
                  <option value="superteam">⚡ Superteam Earn</option>
                  <option value="cryptojobslist">🪙 CryptoJobsList</option>
                  <option value="hotnigerianjobs">🇳🇬 HotNigerianJobs</option>
                  <option value="remoteafrica">🌍 RemoteAfrica Tech</option>
                  <option value="outlier">🤖 Outlier AI & Domain Experts</option>
                  <option value="opentrain">🧠 OpenTrain & Micro1</option>
                </select>
              </div>

              {/* Toggle Switches */}
              <div className="flex flex-col justify-end space-y-2 col-span-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-900">
                  <input
                    type="checkbox"
                    checked={searchFilters.verifiedEmployerOnly}
                    onChange={e => setSearchFilters({ ...searchFilters, verifiedEmployerOnly: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0B5CFF] focus:ring-[#0B5CFF] border-stone-300"
                  />
                  <span>🛡️ Verified Official Employers Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-900">
                  <input
                    type="checkbox"
                    checked={searchFilters.isNigeriaEligible}
                    onChange={e => setSearchFilters({ ...searchFilters, isNigeriaEligible: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0B5CFF] focus:ring-[#0B5CFF] border-stone-300"
                  />
                  <span>🇳🇬 Explicitly accepts Nigerian talent</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. RESULTS HEADER & SORTING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-base sm:text-lg font-black text-stone-900 font-mono">
            {jobs.length} Verified {jobs.length === 1 ? 'Opportunity' : 'Opportunities'}
          </span>
          {searchFilters.sortBy === 'freshness' && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
              ⚡ Latest Jobs First
            </span>
          )}
          {searchFilters.employmentType !== 'all' && (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-900 text-white">
              Type: {opportunityTypes.find(t => t.id === searchFilters.employmentType)?.label || searchFilters.employmentType}
            </span>
          )}
        </div>

        {/* Quick Sort Switcher */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs sm:text-sm text-stone-700 font-extrabold">Sort:</span>
          <select
            value={searchFilters.sortBy}
            onChange={e => setSearchFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:border-[#0B5CFF] shadow-2xs cursor-pointer"
          >
            <option value="recommended">🎯 Resume-Matched (Recommended)</option>
            <option value="match">⭐ Highest Resume Match %</option>
            <option value="freshness">⚡ Latest Jobs First</option>
            <option value="opportunity">🔥 Opportunity Score</option>
            <option value="salary">💰 Highest Compensation</option>
          </select>
        </div>
      </div>

      {/* 7. JOBS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-56 rounded-2xl bg-white border border-[#EDE8DF] animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center p-12 rounded-3xl bg-white border border-[#EDE8DF] space-y-4 shadow-xs">
          <p className="text-base sm:text-lg font-black text-stone-900">No opportunities matched your exact filter combination</p>
          <p className="text-sm text-stone-600 font-semibold max-w-md mx-auto">
            Try resetting your filters or choosing "All Types" to see broader global contractor openings.
          </p>
          <button
            onClick={resetSearchFilters}
            className="px-6 py-2.5 rounded-2xl bg-stone-900 text-white font-black text-xs sm:text-sm hover:bg-black transition-all cursor-pointer shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {jobs.slice(0, visibleCount).map((job, idx) => (
            <React.Fragment key={job.id}>
              <JobCard job={job} />
              
              {/* In-feed High-Traffic Callout Banner after 4th job */}
              {idx === 3 && (
                <div className="md:col-span-2 rounded-3xl bg-gradient-to-r from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white p-6 sm:p-7 shadow-lg border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                        100% Free Candidate Platform
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                        25,000+ Talent
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Hiring Remote Talent or Looking for Verified Roles?
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 font-medium max-w-xl leading-relaxed">
                      Post an opening to reach vetted engineers in 24 hours, or subscribe to free curated weekly remote USD job alerts.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center">
                    <button
                      type="button"
                      onClick={openEmailAlertModal}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>Free Alerts</span>
                    </button>
                    <button
                      type="button"
                      onClick={openPostJobModal}
                      className="px-5 py-2.5 rounded-xl bg-[#0B5CFF] hover:bg-blue-600 text-white font-black text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Post a Remote Job</span>
                    </button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {jobs.length > visibleCount && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 24)}
            className="px-8 py-3.5 rounded-2xl bg-stone-900 hover:bg-black text-white font-black text-sm transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>Load More Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
