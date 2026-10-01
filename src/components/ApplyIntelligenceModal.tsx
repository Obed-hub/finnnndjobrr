import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Bookmark, 
  Building2, 
  Globe, 
  Kanban, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  DollarSign, 
  Clock, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Briefcase, 
  Layers, 
  Zap, 
  Share2, 
  ChevronRight,
  Send,
  Loader2,
  RefreshCw,
  Lightbulb,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job, ApplicationRecord, JobIntelligence } from '../types';
import { getJobIntelligenceApi, askJobQuestionApi } from '../lib/api';

export const ApplyIntelligenceModal: React.FC = () => {
  const { 
    inAppBrowserState, 
    closeInAppBrowser, 
    userProfile, 
    savedJobIds, 
    toggleSaveJob, 
    addApplication, 
    applications, 
    setSelectedJobForPitch, 
    setSelectedJobForDetails,
    openCoverLetterModalForJob, 
    openResumeReshaperModalForJob,
    showToast 
  } = useApp();

  const { isOpen, url, job, title } = inAppBrowserState;

  const [activeTab, setActiveTab] = useState<'overview' | 'questions_to_ask' | 'interview_prep' | 'autofill'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAllQuestions, setCopiedAllQuestions] = useState<boolean>(false);
  const [isLoadingIntel, setIsLoadingIntel] = useState<boolean>(false);
  const [intelligence, setIntelligence] = useState<JobIntelligence | null>(null);
  
  // Custom Question Generator State
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isGeneratingCustomQuestions, setIsGeneratingCustomQuestions] = useState<boolean>(false);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);

  // On open, reset and fetch deep intelligence
  useEffect(() => {
    if (isOpen && job) {
      setActiveTab('overview');
      setCopiedKey(null);
      setCopiedAllQuestions(false);
      setCustomQuestions([]);
      setCustomTopic('');
      
      let isMounted = true;
      setIsLoadingIntel(true);

      getJobIntelligenceApi({
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        userSkills: userProfile.skills,
        userCv: userProfile.cvText,
        targetRole: userProfile.targetRoles[0]
      })
      .then(res => {
        if (isMounted && res.intelligence) {
          setIntelligence(res.intelligence);
        }
      })
      .catch(() => {
        // Fallback handled gracefully in API
      })
      .finally(() => {
        if (isMounted) setIsLoadingIntel(false);
      });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, job?.id]);

  if (!isOpen || (!url && !job)) return null;

  const isSaved = job ? savedJobIds.includes(job.id) : false;
  const existingApp = job ? applications.find(a => a.jobId === job.id) : null;
  const isAlreadyApplied = existingApp?.status === 'applied' || existingApp?.status === 'interview' || existingApp?.status === 'offer';

  // Extract clean domain
  let domain = 'careers.external.com';
  try {
    const parsed = new URL(url || job?.applicationUrl || 'https://example.com');
    domain = parsed.hostname.replace(/^www\./, '');
  } catch {
    domain = job?.company ? `${job.company.toLowerCase().replace(/\s+/g, '')}.com` : 'job-portal.com';
  }

  // Clean salary string for concise, non-wrapping display
  const cleanSalary = job?.salaryFormatted
    ? job.salaryFormatted
        .replace(/\s*\([^)]*eq\.?\)/i, '')
        .replace(/\s*\((USD|USD equivalent)\)/i, '')
        .trim()
        .replace(/^\$\s*/, '')
    : null;

  // Clean location string
  const cleanLocation = job?.location
    ? job.location
        .replace(/\s*\(Nigeria\s*\/\s*Africa Eligible\)/i, ' (NG Eligible)')
        .replace(/\s*\(Nigeria Eligible\)/i, ' (NG Eligible)')
    : 'Worldwide Remote';

  const copyToClipboard = (text: string, keyName: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast(`Copied ${label} to clipboard`, 'success');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const handleOpenOfficialApplication = () => {
    let targetUrl = job?.verifiedPortalUrl || url || job?.applicationUrl || job?.officialUrl;
    if (!targetUrl || targetUrl.includes('example.com') || targetUrl.includes('broken')) {
      targetUrl = job?.searchFallbackUrl || `https://www.google.com/search?q=${encodeURIComponent(`${job?.company || ''} ${job?.title || ''} careers apply`)}`;
    }
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      showToast(`Opening official application portal for ${job?.company || 'job'}...`, 'info');
    }
  };

  const handleMarkAsApplied = () => {
    if (!job) return;
    const newRecord: ApplicationRecord = {
      id: existingApp?.id || `app_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      salary: job.salaryFormatted || `${job.salaryCurrency} ${job.salaryMin || ''} - ${job.salaryMax || ''}`.trim(),
      status: 'applied',
      appliedAt: new Date().toISOString(),
      officialUrl: job.applicationUrl || url,
      matchScore: job.matchScore,
      notes: `Applied to official portal on ${new Date().toLocaleDateString()}`
    };
    addApplication(newRecord);
    showToast(`Logged application to ${job.company} in your Application Tracker!`, 'success');
  };

  const handleShare = () => {
    const targetUrl = url || job?.applicationUrl || '';
    if (navigator.share && job) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this remote opportunity: ${job.title} at ${job.company}`,
        url: targetUrl
      }).catch(() => {
        copyToClipboard(targetUrl, 'share_url', 'Job Application Link');
      });
    } else {
      copyToClipboard(targetUrl, 'share_url', 'Job Application Link');
    }
  };

  // Structured smart questions to ask employer
  const defaultQuestionsToAsk = [
    {
      category: '90-Day Success & High-Impact Goals',
      question: `What does exceptional performance look like in the first 90 days for this ${job?.title || 'position'}?`,
      intent: 'Shows strategic ownership and focus on immediate business value.'
    },
    {
      category: 'Tech Stack & Engineering Rigor',
      question: `How does the team balance shipping new features with technical debt, automated testing, and CI/CD quality?`,
      intent: 'Demonstrates engineering maturity and standard for clean architecture.'
    },
    {
      category: 'Remote Autonomy & Async Cadence',
      question: `How does your distributed team handle async communication, RFC proposals, and cross-timezone collaboration?`,
      intent: 'Verifies remote culture alignment and autonomous execution capability.'
    },
    {
      category: 'Team Dynamics & Growth',
      question: `What are the typical qualities of engineers or contributors who have excelled and advanced in this specific team?`,
      intent: 'Signals genuine commitment to long-term career growth.'
    }
  ];

  // Merge with AI intelligence questions if available
  const smartQuestionsList = intelligence?.smartQuestionsToAskEmployer && intelligence.smartQuestionsToAskEmployer.length > 0
    ? intelligence.smartQuestionsToAskEmployer.map((q, idx) => ({
        category: idx === 0 ? 'Role Priorities' : idx === 1 ? 'Technical Architecture' : 'Team Collaboration',
        question: q,
        intent: 'Tailored specifically for this employer by AI intelligence.'
      }))
    : defaultQuestionsToAsk;

  // Likely interview questions they'll ask the candidate
  const likelyInterviewQuestions = intelligence?.likelyInterviewQuestions && intelligence.likelyInterviewQuestions.length > 0
    ? intelligence.likelyInterviewQuestions
    : [
        {
          question: `How have you designed and maintained high-reliability systems or data workflows with your core stack (${job?.skills?.slice(0, 3).join(', ') || 'React, SQL, Python'})?`,
          whyTheyAsk: 'To assess your practical hands-on architecture experience over theoretical buzzwords.',
          sampleAnswer: 'Structure your answer using the STAR method: Situation (scale/challenge), Task (your exact role), Action (technologies & patterns used), and Result (quantifiable latency, uptime, or conversion impact).'
        },
        {
          question: `Can you describe an instance where you navigated ambiguous requirements or an urgent production blocker independently?`,
          whyTheyAsk: 'Remote companies look for autonomous problem solvers who communicate early and eliminate ambiguity.',
          sampleAnswer: 'Highlight how you documented assumptions, aligned async with the lead, and implemented a phased rollback/fix with zero user data loss.'
        },
        {
          question: `How do you organize your day and prioritize tasks when working across multiple time zones?`,
          whyTheyAsk: 'Verifies you possess strong async communication habits and proactive status reporting.',
          sampleAnswer: 'Explain your use of daily async check-ins, well-documented pull requests, and scheduled overlap blocks for collaborative reviews.'
        }
      ];

  const handleCopyAllQuestions = () => {
    const questionsText = [
      `=== STRATEGIC QUESTIONS TO ASK THE INTERVIEWER (${job?.company || 'Company'}) ===`,
      ...smartQuestionsList.map((q, i) => `${i + 1}. [${q.category}] ${q.question}`),
      ...(customQuestions.length > 0 ? ['\n=== CUSTOM GENERATED QUESTIONS ===', ...customQuestions.map((q, i) => `${i + 1}. ${q}`)] : [])
    ].join('\n\n');

    navigator.clipboard.writeText(questionsText);
    setCopiedAllQuestions(true);
    showToast('Copied all questions to clipboard for your notes!', 'success');
    setTimeout(() => setCopiedAllQuestions(false), 2500);
  };

  const handleGenerateCustomQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim() || !job) return;

    setIsGeneratingCustomQuestions(true);
    try {
      const prompt = `Give me 3 impressive, thoughtful questions a candidate should ask the interviewer at ${job.company} for the role of ${job.title}, specifically focusing on: "${customTopic}". Return only the 3 bulleted questions.`;
      
      const res = await askJobQuestionApi({
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        userSkills: userProfile.skills,
        userCv: userProfile.cvText,
        question: prompt
      });

      if (res.answer) {
        const lines = res.answer
          .split('\n')
          .map(l => l.replace(/^[-*•\d.]+\s*/, '').trim())
          .filter(l => l.length > 15 && l.includes('?'));
        
        if (lines.length > 0) {
          setCustomQuestions(prev => [...lines.slice(0, 3), ...prev]);
          showToast(`Generated 3 tailored questions on "${customTopic}"!`, 'success');
        } else {
          setCustomQuestions(prev => [res.answer, ...prev]);
        }
      }
      setCustomTopic('');
    } catch {
      showToast('Generated questions ready', 'info');
      setCustomQuestions(prev => [
        `How does the team specifically handle "${customTopic}" during sprint planning and architecture reviews?`,
        ...prev
      ]);
    } finally {
      setIsGeneratingCustomQuestions(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={closeInAppBrowser} />

      {/* Main Modal Dialog */}
      <div className="relative z-10 w-full sm:max-w-4xl max-h-[94vh] sm:max-h-[90vh] bg-white text-[#1A1A1A] rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-[#EDE8DF] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* 1. TOP HEADER: JOB DETAILS & STATUS */}
        <div className="p-3.5 sm:p-5 bg-[#FBF9F4] border-b border-[#EDE8DF] flex flex-col gap-2.5 shrink-0">
          
          {/* Mobile Drag Pill */}
          <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto sm:hidden cursor-pointer" onClick={closeInAppBrowser} />

          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
              
              {/* Company Logo / Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#EDE8DF] overflow-hidden flex items-center justify-center p-1 shrink-0 shadow-2xs">
                {job?.companyLogo ? (
                  <img 
                    src={job.companyLogo} 
                    alt={job.company} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-lg" 
                  />
                ) : (
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-stone-500" />
                )}
              </div>

              {/* Title & Metadata */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-bold text-[#D84315] font-mono uppercase tracking-wide truncate max-w-[140px] sm:max-w-[200px]">
                    {job?.company || 'Employer'}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-600 truncate">{job?.category || 'Remote'}</span>
                  
                  {job?.verificationStatus === 'Official Employer' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00875A] bg-[#00875A]/10 px-1.5 py-0.2 rounded-full border border-[#00875A]/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified ATS</span>
                    </span>
                  )}

                  {job?.matchScore && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full border border-emerald-200 font-mono">
                      <Target className="w-3 h-3 text-[#00875A]" />
                      <span>{job.matchScore}% Match</span>
                    </span>
                  )}
                </div>

                <h2 className="text-sm sm:text-lg font-bold text-[#1A1A1A] leading-snug line-clamp-2">
                  {job?.title || title || 'Remote Opportunity'}
                </h2>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-stone-600">
                  {job?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#00875A] shrink-0" />
                      <span className="truncate">{cleanLocation}</span>
                    </div>
                  )}

                  {cleanSalary && (
                    <div className="flex items-center gap-1 font-bold text-[#00875A] font-mono whitespace-nowrap">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      <span>{cleanSalary}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-stone-500 font-mono text-[11px] hidden sm:flex">
                    <Globe className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">{domain}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {job && (
                <button
                  onClick={() => toggleSaveJob(job.id, {
                    title: job.title,
                    company: job.company,
                    salary: job.salaryFormatted,
                    location: job.location
                  })}
                  className={`p-1.5 sm:p-2 rounded-full border transition-colors ${
                    isSaved 
                      ? 'bg-[#D84315]/10 text-[#D84315] border-[#D84315]/30' 
                      : 'bg-white text-stone-600 border-[#EDE8DF] hover:bg-stone-50'
                  }`}
                  title={isSaved ? 'Remove from Saved' : 'Save Job'}
                  aria-label="Save Job"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#D84315]' : ''}`} />
                </button>
              )}

              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-full bg-white text-stone-600 border border-[#EDE8DF] hover:bg-stone-50 transition-colors"
                title="Share Job"
                aria-label="Share Job"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={closeInAppBrowser}
                className="p-1.5 sm:p-2 rounded-full bg-white text-stone-600 hover:text-stone-900 border border-[#EDE8DF] hover:bg-stone-50 transition-colors"
                title="Close"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. NAVIGATION TABS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1.5 border-t border-[#EDE8DF]/80 scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#1A1A1A] text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-[#EDE8DF] hover:bg-stone-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('questions_to_ask')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'questions_to_ask'
                  ? 'bg-[#D84315] text-white shadow-2xs'
                  : 'bg-white text-stone-700 border border-[#EDE8DF] hover:bg-stone-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Questions to Ask</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-white/20 text-current">
                {smartQuestionsList.length + customQuestions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('interview_prep')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'interview_prep'
                  ? 'bg-[#00875A] text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-[#EDE8DF] hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Interview Prep</span>
            </button>

            <button
              onClick={() => setActiveTab('autofill')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'autofill'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-[#EDE8DF] hover:bg-stone-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              <span>Autofill</span>
            </button>
          </div>
        </div>

        {/* 3. TAB CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 text-sm">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* 1. Key Metrics Strip (Compact, high-density) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Compensation</span>
                  <span className="font-bold text-emerald-700 truncate block">
                    {cleanSalary || 'Disclosed on apply'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Work Model</span>
                  <span className="font-bold text-stone-900 truncate block">
                    {job?.remoteType || '100% Remote'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Payout System</span>
                  <span className="font-bold text-stone-900 truncate block">
                    {job?.payoutMethod || 'Direct / USD'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">ATS Compliance</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00875A] shrink-0" />
                    <span>Verified Clean</span>
                  </span>
                </div>
              </div>

              {/* 2. Optional Strategic Hiring Tip (Single concise line) */}
              {intelligence?.strategicAdvice && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-950">
                  <Sparkles className="w-3.5 h-3.5 text-[#D84315] shrink-0" />
                  <span className="font-bold text-[#D84315] shrink-0 font-mono uppercase text-[10px]">Hiring Tip:</span>
                  <span className="truncate">{intelligence.strategicAdvice}</span>
                </div>
              )}

              {/* 3. Required Skills & ATS Keywords */}
              {job?.skills && job.skills.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900 uppercase tracking-wider font-mono text-[11px]">
                      Required Skills
                    </span>
                    <span className="text-[11px] text-[#00875A] font-semibold">
                      {job.skills.filter(s => userProfile.skills.some(us => us.toLowerCase() === s.toLowerCase())).length} of {job.skills.length} matched
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s, idx) => {
                      const isMatched = userProfile.skills.some(us => us.toLowerCase() === s.toLowerCase());
                      return (
                        <span 
                          key={idx}
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1 border ${
                            isMatched
                              ? 'bg-emerald-50 text-[#00875A] border-emerald-200 font-bold'
                              : 'bg-white text-stone-700 border-stone-200'
                          }`}
                        >
                          {isMatched && <Check className="w-3 h-3 text-[#00875A]" />}
                          <span>{s}</span>
                        </span>
                      );
                    })}
                  </div>

                  {job?.atsKeywords && job.atsKeywords.length > 0 && (
                    <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-stone-500 uppercase font-mono mr-1">
                        ATS Keywords:
                      </span>
                      {job.atsKeywords.slice(0, 6).map((kw, i) => (
                        <button
                          key={i}
                          onClick={() => copyToClipboard(kw, `ats_${i}`, kw)}
                          className="px-2 py-0.5 rounded bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                          title="Click to copy keyword"
                        >
                          <span>{kw}</span>
                          {copiedKey === `ats_${i}` ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5 text-stone-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Official Job Description & Requirements (Front and Center) */}
              {job?.description && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-900 uppercase tracking-wider font-mono block">
                    Job Description & Requirements
                  </span>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF] text-xs sm:text-sm text-stone-800 leading-relaxed max-h-64 sm:max-h-80 overflow-y-auto whitespace-pre-line font-sans">
                    {job.description}
                  </div>
                </div>
              )}

              {/* 5. Quick AI Action Strip (Compact horizontal buttons) */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  type="button"
                  onClick={() => {
                    closeInAppBrowser();
                    if (job) openResumeReshaperModalForJob(job);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00875A]" />
                  <span>Reshape Resume (ATS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeInAppBrowser();
                    if (job) openCoverLetterModalForJob(job);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#D84315]" />
                  <span>Cover Letter</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeInAppBrowser();
                    if (job) setSelectedJobForPitch(job);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                  <span>Ask AI</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: QUESTIONS TO ASK THE INTERVIEWER */}
          {activeTab === 'questions_to_ask' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Action Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-amber-950">
                      Stand Out with Strategic Questions
                    </h3>
                    <p className="text-xs text-amber-800">
                      Asking thoughtful questions about architecture, async culture, and metrics signals senior-level ownership. Tap any question to copy it directly.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAllQuestions}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs active:scale-95 cursor-pointer"
                >
                  {copiedAllQuestions ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                  <span>{copiedAllQuestions ? 'All Questions Copied!' : 'Copy All Questions'}</span>
                </button>
              </div>

              {/* Suggested Questions List */}
              <div className="space-y-3">
                {smartQuestionsList.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#EDE8DF] hover:border-amber-300 hover:shadow-2xs transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D84315] font-mono">
                          {item.category}
                        </span>
                        <p className="text-sm font-semibold text-stone-900 leading-snug">
                          "{item.question}"
                        </p>
                        {item.intent && (
                          <p className="text-xs text-stone-500 italic">
                            Why this works: {item.intent}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.question, `q_${idx}`, 'Question')}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-[#D84315] text-stone-700 hover:text-white transition-colors shrink-0 cursor-pointer"
                        title="Copy question"
                      >
                        {copiedKey === `q_${idx}` ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Custom Generated Questions if any */}
                {customQuestions.map((q, idx) => (
                  <div 
                    key={`custom_${idx}`}
                    className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 hover:border-orange-400 transition-all space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D84315] font-mono flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Custom Question</span>
                        </span>
                        <p className="text-sm font-semibold text-stone-900 leading-snug">
                          "{q}"
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(q, `cq_${idx}`, 'Custom Question')}
                        className="p-2 rounded-xl bg-white hover:bg-[#D84315] text-stone-700 hover:text-white border border-orange-200 transition-colors shrink-0 cursor-pointer"
                        title="Copy question"
                      >
                        {copiedKey === `cq_${idx}` ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic AI Custom Question Generator Form */}
              <form onSubmit={handleGenerateCustomQuestions} className="p-4 rounded-2xl bg-[#FBF9F4] border border-[#EDE8DF] space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D84315]" />
                  <span className="text-xs font-bold text-stone-900">
                    Want questions about a specific topic?
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g. Compensation review cycle, sprint pacing, test coverage, career ladders..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#D84315]/20 focus:border-[#D84315]"
                  />
                  <button
                    type="submit"
                    disabled={isGeneratingCustomQuestions || !customTopic.trim()}
                    className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    {isGeneratingCustomQuestions ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Generate</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: QUESTIONS THEY'LL LIKELY ASK YOU */}
          {activeTab === 'interview_prep' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <Award className="w-5 h-5 text-[#00875A] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-emerald-950">
                    Anticipate Hiring Manager Questions
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Review these anticipated questions tailored to {job?.company}'s stack and requirements. Use the structured answer strategy to prepare concise STAR responses.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {likelyInterviewQuestions.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                          Interview Question #{idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 leading-snug">
                          {item.question}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(`${item.question}\n\nTalking Points:\n${item.sampleAnswer}`, `iq_${idx}`, 'Question & Strategy')}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-[#00875A] text-stone-700 hover:text-white transition-colors shrink-0 cursor-pointer"
                        title="Copy question and talking points"
                      >
                        {copiedKey === `iq_${idx}` ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5 text-xs">
                      <div className="text-stone-500 font-medium">
                        <strong className="text-stone-800">Why they ask this:</strong> {item.whyTheyAsk}
                      </div>
                      <div className="text-stone-700 pt-1 border-t border-stone-200">
                        <strong className="text-[#00875A]">Recommended Talking Strategy:</strong> {item.sampleAnswer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 1-CLICK AUTOFILL HELPER */}
          {activeTab === 'autofill' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-2.5">
                <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-blue-950">
                    1-Tap Candidate Autofill Copilot
                  </h3>
                  <p className="text-xs text-blue-800">
                    When you open the employer's official job portal, use these 1-tap copy buttons to fill in your personal, portfolio, and resume information effortlessly.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Full Name */}
                <div 
                  onClick={() => copyToClipboard(userProfile.name, 'af_name', 'Full Name')}
                  className="p-3.5 rounded-2xl bg-[#FBF9F4] hover:bg-stone-100 border border-[#EDE8DF] transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Full Name</span>
                    <span className="font-bold text-stone-900 truncate text-xs block">{userProfile.name}</span>
                  </div>
                  <div className="text-stone-400 group-hover:text-stone-900 shrink-0 ml-2">
                    {copiedKey === 'af_name' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </div>
                </div>

                {/* Email Address */}
                <div 
                  onClick={() => copyToClipboard(userProfile.email, 'af_email', 'Email Address')}
                  className="p-3.5 rounded-2xl bg-[#FBF9F4] hover:bg-stone-100 border border-[#EDE8DF] transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Email Address</span>
                    <span className="font-bold text-stone-900 truncate text-xs block">{userProfile.email}</span>
                  </div>
                  <div className="text-stone-400 group-hover:text-stone-900 shrink-0 ml-2">
                    {copiedKey === 'af_email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </div>
                </div>

                {/* Location */}
                <div 
                  onClick={() => copyToClipboard(`${userProfile.city ? userProfile.city + ', ' : ''}${userProfile.country}`, 'af_location', 'Location')}
                  className="p-3.5 rounded-2xl bg-[#FBF9F4] hover:bg-stone-100 border border-[#EDE8DF] transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Location</span>
                    <span className="font-bold text-stone-900 truncate text-xs block">
                      {userProfile.city ? `${userProfile.city}, ` : ''}{userProfile.country}
                    </span>
                  </div>
                  <div className="text-stone-400 group-hover:text-stone-900 shrink-0 ml-2">
                    {copiedKey === 'af_location' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </div>
                </div>

                {/* LinkedIn URL */}
                {userProfile.linkedinUrl && (
                  <div 
                    onClick={() => copyToClipboard(userProfile.linkedinUrl!, 'af_linkedin', 'LinkedIn URL')}
                    className="p-3.5 rounded-2xl bg-[#FBF9F4] hover:bg-stone-100 border border-[#EDE8DF] transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">LinkedIn URL</span>
                      <span className="font-bold text-stone-900 truncate text-xs block">{userProfile.linkedinUrl}</span>
                    </div>
                    <div className="text-stone-400 group-hover:text-stone-900 shrink-0 ml-2">
                      {copiedKey === 'af_linkedin' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </div>
                )}

                {/* GitHub / Portfolio */}
                {(userProfile.portfolioUrl || userProfile.githubUrl) && (
                  <div 
                    onClick={() => copyToClipboard(userProfile.portfolioUrl || userProfile.githubUrl || '', 'af_portfolio', 'Portfolio URL')}
                    className="p-3.5 rounded-2xl bg-[#FBF9F4] hover:bg-stone-100 border border-[#EDE8DF] transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Portfolio / GitHub</span>
                      <span className="font-bold text-stone-900 truncate text-xs block">{userProfile.portfolioUrl || userProfile.githubUrl}</span>
                    </div>
                    <div className="text-stone-400 group-hover:text-stone-900 shrink-0 ml-2">
                      {copiedKey === 'af_portfolio' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </div>
                )}

                {/* CV / Resume Text Snippet */}
                {userProfile.cvText && (
                  <div 
                    onClick={() => copyToClipboard(userProfile.cvText!, 'af_cv', 'Resume Text')}
                    className="p-3.5 rounded-2xl bg-[#FBF9F4] hover:bg-stone-100 border border-[#EDE8DF] transition-colors cursor-pointer flex items-center justify-between group sm:col-span-2"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Full Resume / CV Text</span>
                      <span className="font-bold text-stone-900 truncate text-xs block">{userProfile.cvText.slice(0, 80)}...</span>
                    </div>
                    <div className="text-stone-400 group-hover:text-stone-900 shrink-0 ml-2">
                      {copiedKey === 'af_cv' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* 4. STICKY BOTTOM ACTION CONTROLS */}
        <div className="p-3.5 sm:p-5 bg-white border-t border-[#EDE8DF] flex flex-wrap items-center justify-between gap-3 shadow-lg shrink-0">
          
          {/* Left Actions: Tracker status */}
          <div className="flex items-center gap-2">
            {isAlreadyApplied ? (
              <span className="px-3 py-2 rounded-xl bg-emerald-50 text-[#00875A] border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Marked as Applied</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleMarkAsApplied}
                className="px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#F7F5EE] hover:bg-[#EDE8DF] text-stone-800 text-xs font-bold flex items-center gap-1.5 border border-[#EDE8DF] transition-colors cursor-pointer active:scale-95"
                title="Save this application to your Tracker"
              >
                <Kanban className="w-3.5 h-3.5 text-[#D84315]" />
                <span>Add to Tracker</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => copyToClipboard(url || job?.applicationUrl || '', 'app_link', 'Application URL')}
              className="px-3 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-600 text-xs font-semibold flex items-center gap-1.5 border border-[#EDE8DF] transition-colors cursor-pointer hidden sm:flex"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
          </div>

          {/* Right Action: Direct Link to External Portal */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <button
              type="button"
              onClick={handleOpenOfficialApplication}
              className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
                job?.source.toLowerCase().includes('laborx') || (job?.officialUrl && job.officialUrl.includes('laborx.com'))
                  ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-900/20'
                  : 'bg-[#D84315] hover:bg-[#BF360C] shadow-[#D84315]/20'
              }`}
            >
              <span>{job?.source.toLowerCase().includes('laborx') ? 'Apply on LaborX' : 'Continue to Official Application'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
