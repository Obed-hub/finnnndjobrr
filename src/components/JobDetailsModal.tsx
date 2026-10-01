import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Bookmark, 
  Share2, 
  CreditCard,
  Briefcase,
  Globe2,
  Lock,
  ChevronRight,
  FileText
} from 'lucide-react';
import { Job } from '../types';
import { useApp } from '../context/AppContext';

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
  const { 
    savedJobIds, 
    toggleSaveJob, 
    setSelectedJobForPitch, 
    setSelectedJobForScoreBreakdown,
    openCoverLetterModalForJob,
    openResumeReshaperModalForJob,
    openTaskAssistant,
    openInAppApply,
    addApplication,
    showToast 
  } = useApp();

  const isSaved = savedJobIds.includes(job.id);
  const isLaborX = job.source.toLowerCase().includes('laborx') || (job.officialUrl && job.officialUrl.includes('laborx.com'));
  const isTaskOrBounty = job.employmentType === 'bounty' || job.employmentType === 'ai_task' || job.employmentType === 'freelance' || (job.skills && job.skills.some(t => t.toLowerCase().includes('bounty') || t.toLowerCase().includes('task')));

  const handleApplyClick = () => {
    onClose();
    openInAppApply(job);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[90vh] bg-white border border-[#EDE8DF] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#EDE8DF] bg-[#FBF9F4] flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#EDE8DF] overflow-hidden flex items-center justify-center p-1 shrink-0 shadow-xs">
              {job.companyLogo ? (
                <img 
                  src={job.companyLogo} 
                  alt={job.company} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#767676]" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <span className="text-xs font-black text-[#D84315] font-mono uppercase tracking-wide truncate">
                  {job.company}
                </span>
                <span className="text-stone-400 font-bold">•</span>
                <span className="text-xs font-bold text-stone-700 truncate">{job.category}</span>
                {isLaborX && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-950 font-black border border-purple-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>LaborX Web3</span>
                  </span>
                )}
                {job.sourcesFoundCount && job.sourcesFoundCount > 1 && !isLaborX && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] bg-white text-stone-800 font-mono font-bold border border-[#EDE8DF]">
                    {job.sourcesFoundCount} sources
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-xl font-black text-stone-950 leading-tight line-clamp-2">
                {job.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs font-bold text-stone-700">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 font-bold" />
                  <span className="font-bold text-stone-800">{job.location}</span>
                </div>
                {job.salaryFormatted && (
                  <div className="flex items-center gap-1 font-black text-emerald-800 font-mono">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{job.salaryFormatted}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-stone-600 font-bold">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Recently verified</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-700 hover:text-black hover:bg-[#EDE8DF] border border-stone-300 transition-colors shrink-0 touch-manipulation cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Intelligence Banner */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-[#EDE8DF] flex flex-wrap items-center justify-between gap-2 sm:gap-4 font-bold">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {/* Match Score */}
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-xs text-stone-800 font-extrabold">Match Fit:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-black font-mono">
                {job.matchScore}% Match
              </span>
            </div>

            {/* Opportunity Score */}
            <button
              onClick={() => setSelectedJobForScoreBreakdown(job)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D84315]/10 border border-[#D84315]/30 text-[#D84315] text-xs font-black hover:bg-[#D84315]/20 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D84315]" />
              <span>Score {job.opportunityScore}/100</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Opportunity Type & Location Tier Badges */}
          <div className="flex items-center gap-2 flex-wrap font-black">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
              job.employmentType === 'bounty' ? 'bg-amber-500/10 text-amber-900 border-amber-500/30' :
              job.employmentType === 'freelance' ? 'bg-purple-500/10 text-purple-900 border-purple-500/30' :
              job.employmentType === 'contract' ? 'bg-emerald-500/10 text-emerald-900 border-emerald-500/30' :
              job.employmentType === 'full_time' ? 'bg-blue-500/10 text-blue-900 border-blue-500/30' :
              job.employmentType === 'ai_task' ? 'bg-cyan-500/10 text-cyan-900 border-cyan-500/30' :
              job.employmentType === 'part_time' ? 'bg-rose-500/10 text-rose-900 border-rose-500/30' :
              job.employmentType === 'internship' ? 'bg-teal-500/10 text-teal-900 border-teal-500/30' :
              job.employmentType === 'micro_task' ? 'bg-fuchsia-500/10 text-fuchsia-900 border-fuchsia-500/30' :
              job.employmentType === 'grant' ? 'bg-lime-600/10 text-lime-900 border-lime-600/30' :
              'bg-gray-500/10 text-gray-900 border-gray-500/30'
            }`}>
              {job.employmentType === 'bounty' ? '⚡ Bounty Gig' :
               job.employmentType === 'freelance' ? '💻 Freelance Project' :
               job.employmentType === 'contract' ? '📝 Contract Remote' :
               job.employmentType === 'full_time' ? '🏢 Full-Time Remote' :
               job.employmentType === 'ai_task' ? '🤖 AI Trainer / Task' :
               job.employmentType === 'part_time' ? '⏳ Part-Time Remote' :
               job.employmentType === 'internship' ? '🎓 Internship' :
               job.employmentType === 'micro_task' ? '🎯 Micro-Tasks' :
               job.employmentType === 'grant' ? '🏆 Ecosystem Grant' : 'Remote Job'}
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
              job.isNigeriaEligible 
                ? 'bg-[#00875A]/10 text-emerald-900 border-[#00875A]/30' 
                : 'bg-[#F7F5EE] text-stone-900 border-[#EDE8DF]'
            }`}>
              {job.locationTierLabel}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 touch-scroll font-bold">
          
          {/* Verified Metadata Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
              <span className="text-[10px] text-stone-600 block font-bold uppercase font-mono">Source ATS</span>
              <span className="text-xs font-black text-stone-900 truncate block">{job.source}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
              <span className="text-[10px] text-stone-600 block font-bold uppercase font-mono">Timezone</span>
              <span className="text-xs font-black text-emerald-700 truncate block">{job.timezoneRequirement || 'WAT / GMT+1'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
              <span className="text-[10px] text-stone-600 block font-bold uppercase font-mono">Remote Model</span>
              <span className="text-xs font-black text-stone-900 truncate block">{job.remoteType || '100% Remote'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
              <span className="text-[10px] text-stone-600 block font-bold uppercase font-mono">Scam Shield</span>
              <span className="text-xs font-black text-emerald-700 flex items-center gap-1 truncate">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Verified Clean</span>
              </span>
            </div>
          </div>

          {/* Skills & ATS Keywords */}
          <div>
            <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider mb-2 font-mono">
              Key Skills & ATS Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-[#F7F5EE] text-stone-900 text-xs font-extrabold border border-[#EDE8DF]">
                  {skill}
                </span>
              ))}
              {job.atsKeywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-[#00875A]/10 text-emerald-900 text-xs font-black border border-[#00875A]/30">
                  +{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Rewrite / Reshape Resume Callout Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#00875A]/5 to-transparent border border-emerald-500/20 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00875A]/15 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                  <span>Rewrite My CV for this Job</span>
                  <span className="px-1.5 py-0.2 rounded text-[9.5px] font-mono font-black bg-emerald-700 text-white">ATS 96%</span>
                </h4>
                <p className="text-[11px] text-stone-700 font-bold">
                  Re-engineer your bullet points with Google X-Y-Z metrics & inject {job.company}'s keywords.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                openResumeReshaperModalForJob(job);
              }}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 touch-manipulation active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rewrite My CV</span>
            </button>
          </div>

          {/* If Task or Bounty: 3 Dedicated AI Task Actions */}
          {isTaskOrBounty && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase font-mono tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>AI Task & Bounty Toolkit</span>
                </span>
                <span className="text-[10px] text-amber-800 font-bold">Verified Workflow</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    openTaskAssistant({
                      taskTitle: job.title,
                      platform: job.company || job.source,
                      category: job.category,
                      rewardOrRate: job.salaryFormatted || 'Verified Rate',
                      description: job.description,
                      officialUrl: job.officialUrl || job.applicationUrl
                    }, 'analyze');
                  }}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-amber-300 text-stone-900 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Analyze Task</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    openTaskAssistant({
                      taskTitle: job.title,
                      platform: job.company || job.source,
                      category: job.category,
                      rewardOrRate: job.salaryFormatted || 'Verified Rate',
                      description: job.description,
                      officialUrl: job.officialUrl || job.applicationUrl
                    }, 'complete');
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Help Me Complete This Task</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    openTaskAssistant({
                      taskTitle: job.title,
                      platform: job.company || job.source,
                      category: job.category,
                      rewardOrRate: job.salaryFormatted || 'Verified Rate',
                      description: job.description,
                      officialUrl: job.officialUrl || job.applicationUrl
                    }, 'qa');
                  }}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-amber-300 text-stone-900 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D84315]" />
                  <span>Ask AI About This task</span>
                </button>
              </div>
            </div>
          )}

          {/* Full Job Description */}
          <div>
            <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider mb-2 font-mono">
              Official Position Details
            </h4>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF9F4] border border-[#EDE8DF] text-xs sm:text-sm text-stone-900 font-semibold leading-relaxed whitespace-pre-line font-sans">
              {job.description}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions - Sticky & thumb-friendly */}
        <div className="p-3.5 sm:p-5 border-t border-[#EDE8DF] bg-white flex flex-wrap items-center justify-between gap-2.5 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveJob(job.id)}
              className={`flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-full text-xs font-bold border transition-colors touch-manipulation active:scale-95 ${
                isSaved
                  ? 'bg-[#D84315]/10 text-[#D84315] border-[#D84315]/30'
                  : 'bg-[#F7F5EE] text-[#1A1A1A] border-[#EDE8DF] hover:bg-[#EDE8DF]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                openResumeReshaperModalForJob(job);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-full bg-emerald-50 text-[#00875A] hover:bg-emerald-100 border border-emerald-200 text-xs font-black transition-colors touch-manipulation active:scale-95 cursor-pointer"
              title="Rewrite my CV to fit this specific role"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00875A]" />
              <span>Rewrite My CV</span>
            </button>

            <button
              onClick={() => {
                onClose();
                openCoverLetterModalForJob(job);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-full bg-[#F7F5EE] text-[#1A1A1A] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-xs font-bold transition-colors touch-manipulation active:scale-95 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D84315]" />
              <span>Cover Letter</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setSelectedJobForPitch(job);
              }}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#D84315] hover:bg-[#BF360C] text-white font-black text-xs shadow-sm transition-all touch-manipulation active:scale-95 cursor-pointer"
              title="Ask AI anything about this job"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI About This Job</span>
            </button>

            <button
              type="button"
              onClick={handleApplyClick}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-xs shadow-sm transition-all touch-manipulation active:scale-95 cursor-pointer text-white ${
                isLaborX
                  ? 'bg-purple-700 hover:bg-purple-800'
                  : 'bg-[#1A1A1A] hover:bg-black'
              }`}
              title={isLaborX ? "Apply on LaborX" : "Open application"}
            >
              <span>{isLaborX ? 'Apply on LaborX' : 'Apply Now'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

