import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  ShieldCheck, 
  ExternalLink, 
  Building2, 
  Briefcase, 
  FileText,
  Share2,
  Flame,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { Job } from '../types';
import { useApp } from '../context/AppContext';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { 
    savedJobIds, 
    toggleSaveJob, 
    setSelectedJobForDetails, 
    setSelectedJobForPitch, 
    openResumeReshaperModalForJob,
    openTaskAssistant,
    openInAppApply,
    showToast
  } = useApp();

  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isSaved = savedJobIds.includes(job.id);
  const isTaskOrBounty = job.employmentType === 'bounty' || job.employmentType === 'ai_task' || job.employmentType === 'freelance';

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    setSelectedJobForDetails(job);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openInAppApply(job);
  };

  const jobShareUrl = job.officialUrl || job.applicationUrl || window.location.href;
  const shareText = `Check out this remote opportunity: ${job.title} at ${job.company} (${job.salaryFormatted || 'Competitive USD'})`;

  const copyJobLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(jobShareUrl);
    setCopied(true);
    showToast('Job application link copied to clipboard!', 'info');
    setTimeout(() => {
      setCopied(false);
      setIsShareMenuOpen(false);
    }, 1500);
  };

  const shareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${jobShareUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsShareMenuOpen(false);
  };

  const shareTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(jobShareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsShareMenuOpen(false);
  };

  const shareTelegram = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://t.me/share/url?url=${encodeURIComponent(jobShareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsShareMenuOpen(false);
  };

  const isLaborX = job.source.toLowerCase().includes('laborx') || (job.officialUrl && job.officialUrl.includes('laborx.com'));

  // Format clean source name (e.g. "LaborX", "Greenhouse", "Remotive")
  const cleanSource = isLaborX 
    ? 'LaborX'
    : job.source.includes('/') 
      ? job.source.split('/')[0].trim() 
      : job.source;

  // Format employment type label
  const formatEmploymentType = (type: string) => {
    switch (type) {
      case 'bounty': return 'Bounty';
      case 'freelance': return 'Freelance';
      case 'contract': return 'Contract';
      case 'full_time': return 'Full-Time';
      case 'ai_task': return 'AI Trainer';
      case 'part_time': return 'Part-Time';
      case 'internship': return 'Internship';
      default: return 'Contract / Remote';
    }
  };

  // Clean description snippet without markdown or loud headers
  const descriptionSnippet = job.description 
    ? job.description
        .replace(/Key Responsibilities:|Why |Requirements:|Overview:|About the role:|About us:/gi, '')
        .replace(/[\r\n]+/g, ' ')
        .trim()
        .slice(0, 160) + '...'
    : 'Verified remote opportunity with direct application access and confirmed compensation.';

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative rounded-2xl transition-all duration-150 p-5 sm:p-6 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between touch-manipulation gap-4 ${
        job.isFeatured
          ? 'bg-gradient-to-b from-amber-50/40 via-white to-white border-2 border-amber-400 hover:border-amber-500 ring-1 ring-amber-400/20'
          : 'bg-white hover:bg-[#FAFAFA] border border-[#E5E0D8] hover:border-[#1A1A1A]'
      }`}
    >
      {/* 1. TOP ROW: COMPANY LOGO, INFO, & BOOKMARK / SHARE */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          {/* Company Brand */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#F5F2EB] border border-[#E5E0D8] overflow-hidden flex items-center justify-center p-1 shrink-0 group-hover:border-stone-400 transition-colors">
              {job.companyLogo ? (
                <img 
                  src={job.companyLogo} 
                  alt={job.company} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Building2 className="w-6 h-6 text-stone-500" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-black text-stone-900 group-hover:text-[#0B5CFF] transition-colors truncate">
                  {job.company}
                </span>
                {job.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-black text-[10px] uppercase shadow-2xs">
                    <Flame className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
                {(job.verificationStatus === 'Official Employer' || job.verificationStatus === 'Official ATS') && (
                  <span title="Verified Employer" className="inline-flex items-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                <span className="truncate font-bold">{job.location || job.remoteType || 'Worldwide Remote'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Share & Bookmark) */}
          <div className="flex items-center gap-1.5 shrink-0 relative">
            {/* Share Button & Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareMenuOpen(prev => !prev);
                }}
                className="p-2 rounded-xl border border-[#EDE8DF] bg-[#F7F5EE] text-stone-700 hover:text-black hover:bg-[#EDE8DF] transition-all cursor-pointer"
                title="Share this job with friends or tech communities"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {isShareMenuOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95 space-y-1"
                >
                  <button
                    type="button"
                    onClick={copyJobLink}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-stone-800 hover:bg-stone-100 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                    <span>{copied ? 'Copied!' : 'Copy Direct Link'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={shareWhatsApp}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={shareTwitter}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-stone-800 hover:bg-stone-100 transition-colors"
                  >
                    <span className="font-mono text-xs">𝕏</span>
                    <span>X (Twitter)</span>
                  </button>
                  <button
                    type="button"
                    onClick={shareTelegram}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <span>Telegram</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bookmark Action */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveJob(job.id);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 font-bold ${
                isSaved 
                  ? 'bg-[#D84315]/10 border-[#D84315]/30 text-[#D84315]' 
                  : 'bg-[#F7F5EE] border-[#EDE8DF] text-stone-700 hover:text-black hover:bg-[#EDE8DF]'
              }`}
              aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2. JOB TITLE */}
        <div>
          <h3 className="text-lg sm:text-xl font-black text-stone-950 group-hover:text-[#0B5CFF] transition-colors leading-snug">
            {job.title}
          </h3>
        </div>

        {/* 3. KEY METRICS: SALARY, TYPE, MATCH */}
        <div className="flex flex-wrap items-center gap-2">
          {job.salaryFormatted && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 font-black text-xs sm:text-sm shadow-2xs">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{job.salaryFormatted}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-900 font-extrabold text-xs border border-stone-300">
            <Briefcase className="w-3.5 h-3.5 text-stone-700 shrink-0" />
            <span>{formatEmploymentType(job.employmentType)}</span>
          </span>

          {job.matchScore >= 80 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-950 font-black text-xs border border-indigo-300 shadow-2xs">
              <Sparkles className="w-3 h-3 text-indigo-700 shrink-0" />
              <span>{job.matchScore}% Match</span>
            </span>
          )}
        </div>

        {/* 4. SHORT DESCRIPTION SNIPPET */}
        <p className="text-xs sm:text-sm text-stone-800 font-bold leading-relaxed line-clamp-2">
          {descriptionSnippet}
        </p>

        {/* 5. TOP SKILLS TAGS */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-0.5 rounded-md bg-[#FAF9F5] text-stone-900 font-extrabold text-xs border border-stone-300"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-stone-700 font-black text-xs">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* 6. BOTTOM ACTION FOOTER */}
      <div className="pt-3.5 border-t border-[#E5E0D8] flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        {/* Reshape My CV AI Button (100% Free) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (isTaskOrBounty) {
              openTaskAssistant({
                taskTitle: job.title,
                platform: job.company || job.source,
                category: job.category,
                rewardOrRate: job.salaryFormatted || 'Verified Rate',
                description: job.description,
                officialUrl: job.officialUrl || job.applicationUrl
              }, 'analyze');
            } else {
              openResumeReshaperModalForJob(job);
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300 transition-all cursor-pointer shadow-2xs active:scale-95"
          title="Reshape and optimize your CV for this job using AI (100% Free)"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-black tracking-tight">{isTaskOrBounty ? 'Task AI' : 'Reshape My CV AI'}</span>
        </button>

        {/* Quick Actions (Right side) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedJobForPitch(job);
            }}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            title="Ask AI About This Job"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-600" />
            <span>Ask AI</span>
          </button>

          <button
            type="button"
            onClick={handleApplyClick}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-white font-black text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isLaborX 
                ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-900/20' 
                : 'bg-[#1A1A1A] hover:bg-black'
            }`}
            title={isLaborX ? "Apply on LaborX" : "Apply directly to official site (100% Free)"}
          >
            <span>{isLaborX ? 'Apply on LaborX' : 'Free Direct Apply'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

