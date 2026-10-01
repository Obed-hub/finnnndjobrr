import React, { useState, useMemo } from 'react';
import { 
  Bot, 
  Code, 
  Database, 
  Headphones, 
  FileText, 
  Coins, 
  GraduationCap, 
  ShieldCheck, 
  Building2, 
  Zap, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  SlidersHorizontal, 
  Sparkles, 
  Bookmark, 
  ExternalLink, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ChevronLeft, 
  X, 
  Briefcase, 
  Filter, 
  Layers,
  Check,
  Flame,
  Globe,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_JOBS } from '../data/initialData';
import { Job } from '../types';

interface SubCategoryDef {
  id: string;
  name: string;
  matchTerms: string[];
}

interface CategoryGroup {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  matchTerms: string[];
  subCategories: SubCategoryDef[];
}

const CATEGORY_DEFINITIONS: CategoryGroup[] = [
  {
    id: 'ai_annotation',
    name: 'AI & Data Annotation',
    icon: Bot,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    description: 'RLHF, LLM Evaluation, Prompt Engineering & AI Training',
    matchTerms: ['ai & data annotation', 'ai trainer', 'ai training', 'prompt engineer', 'llm evaluator', 'ai code', 'multilingual audio', 'frontier ai'],
    subCategories: [
      {
        id: 'rlhf_prompt_eval',
        name: 'RLHF & Prompt Evaluation',
        matchTerms: ['prompt', 'rlhf', 'evaluat', 'rating', 'rater', 'quality rater', 'grader', 'alignment']
      },
      {
        id: 'ai_code_training',
        name: 'AI Code & Domain Training',
        matchTerms: ['code', 'coding', 'developer', 'python', 'technical', 'frontier', 'benchmark', 'algorithm']
      },
      {
        id: 'multilingual_speech',
        name: 'Speech & Multilingual Annotation',
        matchTerms: ['audio', 'speech', 'multilingual', 'transcription', 'voice', 'accent', 'language', 'acoustic']
      }
    ]
  },
  {
    id: 'software_engineering',
    name: 'Software Engineering',
    icon: Code,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    description: 'Full-stack, Backend, Frontend, Cloud & System Architecture',
    matchTerms: ['software engineering', 'engineering & tech', 'coding', 'coding evaluator', 'silicon valley', 'pan-african & global engineering'],
    subCategories: [
      {
        id: 'frontend_fullstack',
        name: 'Frontend & Full-Stack',
        matchTerms: ['react', 'frontend', 'front-end', 'full-stack', 'fullstack', 'web', 'ui', 'next', 'vue', 'tailwind']
      },
      {
        id: 'backend_distributed',
        name: 'Backend & Cloud Systems',
        matchTerms: ['backend', 'back-end', 'api', 'golang', 'node', 'django', 'distributed', 'fastapi', 'database', 'microservice']
      },
      {
        id: 'mobile_devops',
        name: 'Mobile & Cloud Infrastructure',
        matchTerms: ['mobile', 'ios', 'android', 'flutter', 'react native', 'cloud', 'aws', 'devops', 'kubernetes']
      }
    ]
  },
  {
    id: 'data_analytics',
    name: 'Data & Analytics',
    icon: Database,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    description: 'SQL, BI Dashboards, Data Pipelines & Modeling',
    matchTerms: ['data & analytics', 'data & ai', 'data annotator', 'data entry'],
    subCategories: [
      {
        id: 'bi_dashboards',
        name: 'BI & Business Dashboards',
        matchTerms: ['bi', 'tableau', 'power bi', 'dashboard', 'analyst', 'business analyst', 'excel', 'reporting', 'looker']
      },
      {
        id: 'data_engineering',
        name: 'Data Pipelines & Warehousing',
        matchTerms: ['pipeline', 'etl', 'sql', 'warehouse', 'dbt', 'lakehouse', 'spark', 'modeling', 'postgres']
      },
      {
        id: 'data_science',
        name: 'Data Science & Machine Learning',
        matchTerms: ['science', 'scientist', 'machine learning', 'predictive', 'ml', 'statistics', 'deep learning']
      }
    ]
  },
  {
    id: 'customer_support',
    name: 'Customer Support & Ops',
    icon: Headphones,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    description: 'Technical Support, Customer Success & Operations',
    matchTerms: ['customer support', 'customer operations', 'customer support & ops', 'operations & support'],
    subCategories: [
      {
        id: 'tech_support',
        name: 'Technical & Tier 2 Support',
        matchTerms: ['technical support', 'tier', 'troubleshoot', 'it support', 'helpdesk', 'hardware', 'incident']
      },
      {
        id: 'customer_success',
        name: 'Customer Success & Retention',
        matchTerms: ['success', 'relationship', 'onboarding', 'account manager', 'client', 'growth']
      },
      {
        id: 'live_chat_tickets',
        name: 'Live Chat & Operations Support',
        matchTerms: ['chat', 'email', 'inbox', 'ticket', 'support agent', 'rep', 'operations', 'service']
      }
    ]
  },
  {
    id: 'content_moderation',
    name: 'Writing & Moderation',
    icon: FileText,
    color: 'text-rose-600',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    description: 'Technical Writing, Content Moderation & Translation',
    matchTerms: ['content moderation', 'content & technical writing', 'writing', 'transcription & audio', 'translation'],
    subCategories: [
      {
        id: 'tech_writing',
        name: 'Technical Writing & Documentation',
        matchTerms: ['technical writing', 'doc', 'api doc', 'writer', 'copywriting', 'blog', 'article', 'editor']
      },
      {
        id: 'trust_safety',
        name: 'Trust, Safety & Moderation',
        matchTerms: ['moderation', 'trust', 'safety', 'policy', 'review', 'compliance', 'content moderator']
      },
      {
        id: 'translation_audio',
        name: 'Translation & Localization',
        matchTerms: ['translation', 'transcription', 'subtitling', 'audio text', 'interpreter', 'localization']
      }
    ]
  },
  {
    id: 'freelance_tasks',
    name: 'Freelance & AI First-Dollar',
    icon: Coins,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    description: 'High-Volume Micro-Tasks, Verified Task Platforms & Gigs',
    matchTerms: ['freelance & gigs', 'micro-tasks & surveys', 'ai training aggregator', 'high-volume'],
    subCategories: [
      {
        id: 'microtasks_platforms',
        name: 'High-Volume Micro-Tasks',
        matchTerms: ['micro-task', 'microtask', 'task', 'crowdsource', 'clickworker', 'remotasks', 'outlier', 'applaud']
      },
      {
        id: 'freelance_contracts',
        name: 'Fixed & Hourly Freelance Contracts',
        matchTerms: ['freelance', 'contract', 'hourly', 'upwork', 'gig', 'project', 'freelancer']
      }
    ]
  },
  {
    id: 'online_tutoring',
    name: 'Online Tutoring & Teaching',
    icon: GraduationCap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
    description: 'Language, STEM & Professional Subject Tutoring',
    matchTerms: ['online tutoring'],
    subCategories: [
      {
        id: 'stem_coding_tutors',
        name: 'STEM & Coding Instruction',
        matchTerms: ['coding', 'stem', 'math', 'computer science', 'python', 'algorithm', 'science', 'physics']
      },
      {
        id: 'language_humanities',
        name: 'Language & Academic Tutoring',
        matchTerms: ['language', 'english', 'esl', 'ielts', 'academic', 'curriculum', 'humanities', 'teacher']
      }
    ]
  },
  {
    id: 'qa_testing',
    name: 'QA & Search Quality',
    icon: ShieldCheck,
    color: 'text-teal-600',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20',
    description: 'Website Testing, Usability Benchmarks & Search Quality',
    matchTerms: ['website testing', 'search quality', 'cybersecurity & it'],
    subCategories: [
      {
        id: 'functional_qa',
        name: 'Manual & Usability QA',
        matchTerms: ['functional', 'manual', 'qa tester', 'test case', 'bug', 'exploratory', 'usability', 'user testing']
      },
      {
        id: 'search_eval_automation',
        name: 'Search Quality & Automation',
        matchTerms: ['automation', 'selenium', 'cypress', 'playwright', 'search', 'evaluator', 'rater', 'quality rater']
      }
    ]
  },
  {
    id: 'pan_african_global',
    name: 'Pan-African & Global Tech',
    icon: Globe,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-600/10',
    borderColor: 'border-emerald-600/20',
    description: 'Direct African Employer ATS & Worldwide Remote Gateways',
    matchTerms: ['direct african employer ats', 'european / emea remote feed', 'verified global remote api', 'worldwide tech roles'],
    subCategories: [
      {
        id: 'direct_african_employers',
        name: 'Direct African Tech ATS',
        matchTerms: ['paystack', 'flutterwave', 'moniepoint', 'kuda', 'andela', 'african', 'lagos', 'nairobi', 'direct']
      },
      {
        id: 'worldwide_remote_gateways',
        name: 'Global EMEA & Worldwide Gateways',
        matchTerms: ['global', 'worldwide', 'emea', 'europe', 'international', 'us remote', 'remote gateway', 'cross-border']
      }
    ]
  },
  {
    id: 'bounties_web3',
    name: 'Bounties & Web3',
    icon: Zap,
    color: 'text-violet-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
    description: 'Code challenges, bug bounties & algorithmic tasks',
    matchTerms: ['web3 & bounty board sync', 'bounty', 'bounties'],
    subCategories: [
      {
        id: 'security_bug_bounties',
        name: 'Security & Bug Bounties',
        matchTerms: ['security', 'bug bounty', 'vulnerability', 'audit', 'immunefi', 'hack', 'penetration']
      },
      {
        id: 'code_challenges_grants',
        name: 'Algorithmic Challenges & Grants',
        matchTerms: ['challenge', 'grant', 'bounty', 'algorithm', 'gitcoin', 'solana', 'web3', 'protocol', 'smart contract']
      }
    ]
  }
];

export const JobCategorySidebar: React.FC = () => {
  const { 
    searchFilters, 
    setSearchFilters, 
    setSelectedJobForDetails,
    setSelectedJobForPitch,
    savedJobIds,
    toggleSaveJob,
    setActiveTab,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'nigeria' | 'africa' | 'ai' | 'high_salary' | 'saved'>('all');
  
  // Expanded main categories state
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    ai_annotation: true,
    software_engineering: true,
    data_analytics: true,
    customer_support: false,
    content_moderation: false,
    freelance_tasks: false,
    online_tutoring: false,
    qa_testing: false,
    pan_african_global: false,
    bounties_web3: false
  });

  // Expanded sub-categories state (keyed by `${categoryId}::${subCategoryId}`)
  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CATEGORY_DEFINITIONS.forEach(cat => {
      cat.subCategories.forEach((sub, idx) => {
        // Open the first subcategory in each category by default
        initial[`${cat.id}::${sub.id}`] = idx === 0;
      });
    });
    return initial;
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubCategory = (categoryId: string, subCategoryId: string) => {
    const key = `${categoryId}::${subCategoryId}`;
    setExpandedSubCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleAllSubCategoriesForCategory = (categoryId: string, expand: boolean) => {
    const cat = CATEGORY_DEFINITIONS.find(c => c.id === categoryId);
    if (!cat) return;
    setExpandedSubCategories(prev => {
      const next = { ...prev };
      cat.subCategories.forEach(sub => {
        next[`${categoryId}::${sub.id}`] = expand;
      });
      return next;
    });
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    CATEGORY_DEFINITIONS.forEach(cat => {
      allExpanded[cat.id] = true;
    });
    setExpandedCategories(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    CATEGORY_DEFINITIONS.forEach(cat => {
      allCollapsed[cat.id] = false;
    });
    setExpandedCategories(allCollapsed);
  };

  // Group all jobs into categories and sub-categories
  const categorizedData = useMemo(() => {
    const groups: Record<string, { 
      definition: CategoryGroup; 
      totalJobs: number; 
      subCategoryMap: Record<string, Job[]>; 
      unmatchedJobs: Job[];
    }> = {};

    CATEGORY_DEFINITIONS.forEach(cat => {
      const subMap: Record<string, Job[]> = {};
      cat.subCategories.forEach(sub => {
        subMap[sub.id] = [];
      });
      groups[cat.id] = {
        definition: cat,
        totalJobs: 0,
        subCategoryMap: subMap,
        unmatchedJobs: []
      };
    });

    const otherJobs: Job[] = [];

    // Filter source jobs according to quick filter & search
    let sourceJobs = INITIAL_JOBS;

    if (quickFilter === 'nigeria') {
      sourceJobs = sourceJobs.filter(j => j.isNigeriaEligible || j.locationTier === 'tier1_nigeria');
    } else if (quickFilter === 'africa') {
      sourceJobs = sourceJobs.filter(j => j.isAfricaEligible || j.locationTier === 'tier1_nigeria' || j.locationTier === 'tier2_africa');
    } else if (quickFilter === 'ai') {
      sourceJobs = sourceJobs.filter(j => 
        j.category?.toLowerCase().includes('ai') || 
        j.skills?.some(s => s.toLowerCase().includes('ai') || s.toLowerCase().includes('prompt') || s.toLowerCase().includes('llm'))
      );
    } else if (quickFilter === 'high_salary') {
      sourceJobs = sourceJobs.filter(j => (j.salaryMin && j.salaryMin >= 2000) || (j.salaryFormatted && j.salaryFormatted.includes('$2,')) || (j.salaryFormatted && j.salaryFormatted.includes('$3,')) || (j.salaryFormatted && j.salaryFormatted.includes('$4,')));
    } else if (quickFilter === 'saved') {
      sourceJobs = sourceJobs.filter(j => savedJobIds.includes(j.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      sourceJobs = sourceJobs.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Distribute jobs into category definitions and their sub-categories
    sourceJobs.forEach(job => {
      const jobCatLower = (job.category || '').toLowerCase();
      const jobFullText = `${job.title} ${job.company} ${job.category} ${(job.skills || []).join(' ')} ${(job.description || '')}`.toLowerCase();
      let matchedCatId: string | null = null;

      for (const catDef of CATEGORY_DEFINITIONS) {
        if (catDef.matchTerms.some(term => jobCatLower.includes(term))) {
          matchedCatId = catDef.id;
          break;
        }
      }

      if (!matchedCatId) {
        const titleLower = job.title.toLowerCase();
        if (titleLower.includes('data') || titleLower.includes('sql') || titleLower.includes('analyst')) {
          matchedCatId = 'data_analytics';
        } else if (titleLower.includes('developer') || titleLower.includes('engineer') || titleLower.includes('software')) {
          matchedCatId = 'software_engineering';
        } else if (titleLower.includes('support') || titleLower.includes('customer')) {
          matchedCatId = 'customer_support';
        }
      }

      if (matchedCatId && groups[matchedCatId]) {
        const group = groups[matchedCatId];
        group.totalJobs += 1;

        // Find matching sub-category
        let matchedSubId: string | null = null;
        for (const subDef of group.definition.subCategories) {
          if (subDef.matchTerms.some(term => jobFullText.includes(term))) {
            matchedSubId = subDef.id;
            break;
          }
        }

        if (matchedSubId && group.subCategoryMap[matchedSubId]) {
          group.subCategoryMap[matchedSubId].push(job);
        } else if (group.definition.subCategories.length > 0) {
          group.subCategoryMap[group.definition.subCategories[0].id].push(job);
        } else {
          group.unmatchedJobs.push(job);
        }
      } else {
        otherJobs.push(job);
      }
    });

    return { groups, otherJobs };
  }, [quickFilter, searchQuery, savedJobIds]);

  const totalFilteredJobs = useMemo(() => {
    let total = 0;
    Object.values(categorizedData.groups).forEach(g => {
      total += g.totalJobs;
    });
    total += categorizedData.otherJobs.length;
    return total;
  }, [categorizedData]);

  const handleSelectJob = (job: Job) => {
    setSelectedJobForDetails(job);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleFilterByCategory = (catName: string) => {
    setSearchFilters(prev => ({
      ...prev,
      category: prev.category === catName ? 'all' : catName
    }));
    setActiveTab('discover');
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const renderJobCard = (job: Job) => {
    const isSaved = savedJobIds.includes(job.id);
    return (
      <div
        key={job.id}
        onClick={() => handleSelectJob(job)}
        className="group/job relative p-2.5 rounded-xl bg-white hover:bg-[#FAF8F2] border border-[#EDE8DF] hover:border-stone-400 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
      >
        {/* Top row: Title and Match Score */}
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-black text-stone-950 group-hover/job:text-[#D84315] truncate transition-colors leading-tight">
              {job.title}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
              <span className="font-extrabold text-stone-800 truncate max-w-[120px]">
                {job.company}
              </span>
              {job.verificationStatus === 'Official Employer' && (
                <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
              )}
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="flex flex-col items-end shrink-0">
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black font-mono bg-emerald-50 text-emerald-950 border border-emerald-300">
              {job.matchScore || 85}%
            </span>
          </div>
        </div>

        {/* Bottom row: Salary Pill & Location Badge */}
        <div className="flex items-center justify-between gap-1 mt-1.5 pt-1.5 border-t border-[#F0ECE1]">
          <div className="flex items-center gap-1 min-w-0 overflow-hidden">
            <span className="text-[10px] font-mono font-black text-stone-900 truncate">
              {job.salaryFormatted || '$1,500 – $3,000/mo'}
            </span>
            {job.isNigeriaEligible && (
              <span className="px-1.5 py-0.2 text-[8px] font-black rounded bg-emerald-100 text-emerald-950 shrink-0 border border-emerald-300">
                🇳🇬 NG
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
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
              className={`p-1 rounded hover:bg-stone-200 transition-colors ${
                isSaved ? 'text-[#D84315]' : 'text-stone-400 hover:text-stone-700'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
            >
              <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectJob(job);
              }}
              className="p-1 rounded text-stone-400 hover:text-[#D84315] hover:bg-stone-200 transition-colors"
              title="Open Job Application & Intelligence"
            >
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Content rendered inside both desktop sidebar and mobile drawer
  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#EDE8DF] text-[#1A1A1A] select-none">
      
      {/* 1. Header with Title, Live Counter & Controls */}
      <div className="p-3.5 sm:p-4 border-b border-[#EDE8DF] bg-[#FBF9F4]/80 backdrop-blur-xs shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Layers className="w-4 h-4 text-[#D84315]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold tracking-tight text-[#1A1A1A] flex items-center gap-1.5 truncate">
                <span>Job Categories</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#D84315]/10 text-[#D84315] font-mono text-[10px] font-black">
                  {totalFilteredJobs}
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Expand / Collapse All Toggle */}
            <button
              onClick={() => {
                const areSomeExpanded = Object.values(expandedCategories).some(Boolean);
                if (areSomeExpanded) collapseAll();
                else expandAll();
              }}
              className="px-2 py-1 text-[10px] font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-[#EDE8DF] rounded-md transition-colors cursor-pointer"
              title="Toggle Expand / Collapse All Categories"
            >
              {Object.values(expandedCategories).some(Boolean) ? 'Collapse' : 'Expand'}
            </button>

            {/* Desktop Collapse Icon */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md text-stone-500 hover:text-stone-900 hover:bg-[#EDE8DF] transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar to Icon Strip'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Mobile Close Drawer Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="flex lg:hidden w-7 h-7 items-center justify-center rounded-md text-stone-500 hover:text-stone-900 hover:bg-[#EDE8DF] transition-colors cursor-pointer"
              aria-label="Close Sidebar Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Category Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, skills, categories..."
            className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#EDE8DF] rounded-lg text-xs placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D84315] focus:ring-1 focus:ring-[#D84315] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick Filter Chips Strip */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setQuickFilter('all')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              quickFilter === 'all'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setQuickFilter('nigeria')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              quickFilter === 'nigeria'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
            }`}
          >
            🇳🇬 Nigeria
          </button>
          <button
            onClick={() => setQuickFilter('ai')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              quickFilter === 'ai'
                ? 'bg-[#D84315] text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100'
            }`}
          >
            🤖 AI Work
          </button>
          <button
            onClick={() => setQuickFilter('high_salary')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              quickFilter === 'high_salary'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-50 text-blue-800 border border-blue-200/60 hover:bg-blue-100'
            }`}
          >
            💵 $2k+/mo
          </button>
          <button
            onClick={() => setQuickFilter('saved')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              quickFilter === 'saved'
                ? 'bg-rose-700 text-white'
                : 'bg-rose-50 text-rose-800 border border-rose-200/60 hover:bg-rose-100'
            }`}
          >
            Saved ({savedJobIds.length})
          </button>
        </div>
      </div>

      {/* 2. Scrollable Category List with Sub-Category Accordions */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-2 divide-y divide-[#F0ECE1]/60">
        
        {CATEGORY_DEFINITIONS.map(cat => {
          const Icon = cat.icon;
          const groupData = categorizedData.groups[cat.id];
          const totalCategoryJobs = groupData?.totalJobs || 0;
          const isExpanded = expandedCategories[cat.id];
          const hasJobs = totalCategoryJobs > 0;
          const isCategoryFilterActive = searchFilters.category === cat.name;

          return (
            <div key={cat.id} className="pt-2 first:pt-0">
              
              {/* Category Header Row */}
              <div 
                className={`group flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                  isCategoryFilterActive 
                    ? 'bg-[#D84315]/10 border border-[#D84315]/30 text-[#D84315]' 
                    : isExpanded
                    ? 'bg-[#F7F5EE] text-[#1A1A1A]'
                    : 'hover:bg-[#FAF8F2] text-[#1A1A1A]'
                }`}
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg ${cat.bgColor} ${cat.color} border ${cat.borderColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 truncate block">
                      {totalCategoryJobs} {totalCategoryJobs === 1 ? 'role' : 'roles'} in {cat.subCategories.length} sub-tracks
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                    hasJobs 
                      ? 'bg-white text-stone-700 border border-[#EDE8DF]' 
                      : 'bg-stone-100 text-stone-400'
                  }`}>
                    {totalCategoryJobs}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterByCategory(cat.name);
                    }}
                    className={`p-1 rounded-md text-[10px] hover:bg-white hover:text-[#D84315] transition-colors ${
                      isCategoryFilterActive ? 'text-[#D84315] font-bold' : 'text-stone-400'
                    }`}
                    title="Filter main feed to this category"
                  >
                    <Filter className="w-3 h-3" />
                  </button>

                  <div className="text-stone-400">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Category with Sub-Category Accordions */}
              {isExpanded && (
                <div className="mt-1.5 pl-2 sm:pl-2.5 pr-1 space-y-2 animate-in slide-in-from-top-1 duration-150">
                  {/* Sub-categories Action Sub-bar */}
                  <div className="flex items-center justify-between px-1 text-[10px] text-stone-500">
                    <span className="font-mono">Sub-tracks</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const anySubOpen = cat.subCategories.some(sub => expandedSubCategories[`${cat.id}::${sub.id}`]);
                        toggleAllSubCategoriesForCategory(cat.id, !anySubOpen);
                      }}
                      className="text-[#D84315] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      {cat.subCategories.some(sub => expandedSubCategories[`${cat.id}::${sub.id}`]) ? (
                        <>
                          <span>Collapse All</span>
                          <ChevronDown className="w-2.5 h-2.5" />
                        </>
                      ) : (
                        <>
                          <span>Expand All</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sub-Category Groups Accordion */}
                  {cat.subCategories.map(sub => {
                    const subJobs = groupData?.subCategoryMap[sub.id] || [];
                    const isSubExpanded = Boolean(expandedSubCategories[`${cat.id}::${sub.id}`]);

                    return (
                      <div 
                        key={sub.id} 
                        className={`rounded-lg border transition-all overflow-hidden ${
                          isSubExpanded ? 'border-[#EDE8DF] bg-[#FAF8F2]/60' : 'border-[#EDE8DF]/80 bg-white hover:border-stone-400/60'
                        }`}
                      >
                        {/* Sub-Category Accordion Header Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleSubCategory(cat.id, sub.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-colors cursor-pointer select-none ${
                            isSubExpanded 
                              ? 'bg-[#F2EDE2]/70 text-stone-900 border-b border-[#EDE8DF]' 
                              : 'bg-white hover:bg-[#FAF8F2] text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubExpanded ? 'bg-[#D84315]' : 'bg-stone-300'}`} />
                            <span className="text-[11px] font-bold truncate">{sub.name}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                              subJobs.length > 0 ? 'bg-white text-stone-800 border border-[#EDE8DF]' : 'bg-stone-100 text-stone-400'
                            }`}>
                              {subJobs.length}
                            </span>
                            <div className="text-stone-400">
                              {isSubExpanded ? (
                                <ChevronDown className="w-3 h-3 text-[#D84315]" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Nested Job Cards when Sub-Category is Expanded */}
                        {isSubExpanded && (
                          <div className="p-1.5 space-y-1.5 animate-in fade-in duration-150">
                            {subJobs.length === 0 ? (
                              <div className="py-2 px-2 text-center text-[10px] text-stone-400 italic bg-white/60 rounded-md border border-dashed border-[#EDE8DF]">
                                No active roles in this sub-track
                              </div>
                            ) : (
                              subJobs.map(job => renderJobCard(job))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Other / Unclassified Category if present */}
        {categorizedData.otherJobs && categorizedData.otherJobs.length > 0 && (
          <div className="pt-2">
            <div 
              className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F2] transition-colors cursor-pointer text-[#1A1A1A]"
              onClick={() => toggleCategory('other')}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block">Other Verified Roles</span>
                  <span className="text-[10px] text-stone-500 block">
                    {categorizedData.otherJobs.length} additional listings
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-stone-100 text-stone-700">
                  {categorizedData.otherJobs.length}
                </span>
                {expandedCategories['other'] ? <ChevronDown className="w-3.5 h-3.5 text-stone-400" /> : <ChevronRight className="w-3.5 h-3.5 text-stone-400" />}
              </div>
            </div>

            {expandedCategories['other'] && (
              <div className="mt-1 pl-2 sm:pl-3 pr-1 space-y-1.5">
                {categorizedData.otherJobs.map(job => renderJobCard(job))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 3. Footer Summary */}
      <div className="p-3 bg-[#FBF9F4] border-t border-[#EDE8DF] text-[11px] text-stone-600 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D84315]" />
          <span>{CATEGORY_DEFINITIONS.length} Categorized Tracks</span>
        </div>
        <button
          onClick={() => {
            setSearchFilters(prev => ({ ...prev, category: 'all' }));
            setActiveTab('discover');
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          className="text-stone-800 hover:text-[#D84315] font-bold hover:underline"
        >
          View All Feed →
        </button>
      </div>

    </div>
  );

  // Compact Collapsed Mode (Desktop Icon Strip)
  if (isSidebarCollapsed) {
    return (
      <aside 
        className="hidden md:flex flex-col items-center w-14 shrink-0 bg-white border-r border-[#EDE8DF] h-[calc(100vh-4rem)] sticky top-16 z-30 py-3 select-none"
        aria-label="Collapsed Category Sidebar"
      >
        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-black transition-colors mb-4 shadow-xs cursor-pointer group"
          title="Expand Category Sidebar"
        >
          <Layers className="w-4 h-4 text-[#D84315] group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 py-1 w-full flex flex-col items-center no-scrollbar">
          {CATEGORY_DEFINITIONS.map(cat => {
            const Icon = cat.icon;
            const count = categorizedData.groups[cat.id]?.totalJobs || 0;
            const isActive = searchFilters.category === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setIsSidebarCollapsed(false);
                  toggleCategory(cat.id);
                  handleFilterByCategory(cat.name);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center relative transition-all cursor-pointer group ${
                  isActive 
                    ? 'bg-[#D84315] text-white shadow-xs' 
                    : `${cat.bgColor} ${cat.color} hover:scale-105`
                }`}
                title={`${cat.name} (${count} jobs)`}
              >
                <Icon className="w-4 h-4" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1A1A1A] text-white text-[9px] font-mono font-bold flex items-center justify-center border border-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer mt-2"
          title="Expand Sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <>
      {/* Desktop & Tablet Standard Sidebar (Sticky Column) */}
      <aside className="hidden md:block w-72 lg:w-80 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30 shadow-2xs">
        {sidebarContent}
      </aside>
    </>
  );
};
