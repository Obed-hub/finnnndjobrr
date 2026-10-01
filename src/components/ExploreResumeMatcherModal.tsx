import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Briefcase, 
  Building2, 
  DollarSign, 
  Globe, 
  ShieldCheck, 
  Check, 
  ExternalLink, 
  Zap, 
  AlertCircle,
  RefreshCw,
  Bookmark,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { exploreMatchResumeApi } from '../lib/api';
import { MatchedJobItem } from '../types';

export const ExploreResumeMatcherModal: React.FC = () => {
  const {
    isExploreResumeModalOpen,
    setIsExploreResumeModalOpen,
    userProfile,
    updateUserProfile,
    showToast,
    upgradeToPro,
    matchedResumeJobs,
    setMatchedResumeJobs,
    resumeExploreTargetRole,
    setResumeExploreTargetRole,
    resumeCandidateProfile,
    setResumeCandidateProfile,
    setSelectedJobForPitch,
    setSelectedJobForDetails,
    openResumeReshaperModalForJob,
    openInAppApply,
    openInAppBrowser,
    toggleSaveJob,
    savedJobIds
  } = useApp();

  const isPro = userProfile.subscriptionPlan === 'pro';
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [targetRole, setTargetRole] = useState(resumeExploreTargetRole || userProfile.targetRoles?.[0] || '');
  const [cvText, setCvText] = useState(userProfile.cvText || '');
  const [uploadedFileName, setUploadedFileName] = useState(userProfile.uploadedResumeName || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [showRescanPrompt, setShowRescanPrompt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const scanSteps = [
    'Parsing candidate credentials & extracting skills...',
    'Auditing ATS compliance score & industry keywords...',
    'Scanning 110+ verified remote databases open to Nigeria...',
    'Scoring and ranking highest-salary opportunity matches...'
  ];

  useEffect(() => {
    if (resumeExploreTargetRole) {
      setTargetRole(resumeExploreTargetRole);
    }
  }, [resumeExploreTargetRole]);

  useEffect(() => {
    if (isExploreResumeModalOpen) {
      if (matchedResumeJobs.length > 0 && resumeCandidateProfile) {
        setShowRescanPrompt(false);
      }
    }
  }, [isExploreResumeModalOpen, matchedResumeJobs.length, resumeCandidateProfile]);

  if (!isExploreResumeModalOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setIsReadingFile(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      setCvText(text);
      setIsReadingFile(false);
      updateUserProfile({
        uploadedResumeName: file.name,
        cvText: text.length > 30 ? text : userProfile.cvText
      });
      showToast(`Resume "${file.name}" uploaded successfully.`, 'success');
    };
    reader.onerror = () => {
      setIsReadingFile(false);
      showToast('Could not read file text. You can also paste text below.', 'error');
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleScanResume = async () => {
    const isCyberProfile = /cyber|security|infosec/i.test(userProfile.careerTrack || '') || 
                           userProfile.targetRoles?.some(r => /cyber|security/i.test(r)) ||
                           /cyber|security|siem|wireshark/i.test(targetRole);

    const fallbackString = isCyberProfile ? `
Candidate: ${userProfile.name || 'Obed Asekhamen'}
Title: ${targetRole || userProfile.targetRoles?.[0] || 'Junior Cybersecurity Analyst'}
Experience: 1 year in security operations, SIEM monitoring (Splunk, Microsoft Sentinel), packet inspection with Wireshark, and vulnerability scanning.
Skills: SIEM (Splunk/Sentinel), Wireshark, Nmap, Vulnerability Scanning, Incident Response, Network Security, Firewalls & IDS/IPS, Linux/Bash.
Location: Lagos, Nigeria. Available for full-time international remote roles.
` : `
Candidate: ${userProfile.name || 'Obed Asekhamen'}
Title: ${targetRole || userProfile.targetRoles?.[0] || 'Technical Specialist'}
Experience: 1-2 years in remote technical workflows.
Skills: ${(userProfile.skills || []).join(', ')}.
Location: Lagos, Nigeria. Available for full-time international remote roles.
`;

    const textToAnalyze = cvText.trim() || userProfile.cvText || fallbackString;

    setIsScanning(true);
    setScanStepIndex(0);

    const stepInterval = setInterval(() => {
      setScanStepIndex(prev => {
        if (prev < scanSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 900);

    try {
      const result = await exploreMatchResumeApi({
        cvText: textToAnalyze,
        uploadedFileName: uploadedFileName || userProfile.uploadedResumeName || 'candidate_resume.pdf',
        targetRolePreference: targetRole || userProfile.targetRoles?.[0] || ''
      });

      clearInterval(stepInterval);
      setResumeCandidateProfile(result.candidateProfile);
      setMatchedResumeJobs(result.matchedJobs);

      const detectedRole = result.candidateProfile?.detectedRole || targetRole || userProfile.targetRoles?.[0] || 'Junior Cybersecurity Analyst';
      const isCyber = /cyber|security|soc|infosec|vulnerab/i.test(detectedRole) || 
                      /cyber|security|soc|infosec|siem|wireshark|vulnerab/i.test(textToAnalyze);
      const isData = !isCyber && (/data/i.test(detectedRole) || /data\s*analyst|power\s*bi/i.test(textToAnalyze));
      
      const newRoles = isCyber 
        ? [detectedRole, 'SOC Analyst (Tier 1/2)', 'Vulnerability Assessment Analyst']
        : isData 
        ? [detectedRole, 'BI Specialist']
        : [detectedRole];

      const newSkills = (result.candidateProfile?.coreSkills && result.candidateProfile.coreSkills.length > 0)
        ? result.candidateProfile.coreSkills
        : isCyber
        ? ['SIEM (Splunk/Sentinel)', 'Wireshark', 'Nmap', 'Vulnerability Scanning', 'Incident Response', 'Network Security']
        : userProfile.skills;

      const newTrack = isCyber ? 'Cybersecurity & InfoSec' : isData ? 'Data & Analytics' : 'Tech / Engineering';

      updateUserProfile({
        hasCompletedResumeJobMatch: true,
        matchedJobsCount: result.totalMatchedCount,
        lastAnalyzedResumeName: uploadedFileName || 'Uploaded Resume',
        cvText: textToAnalyze,
        targetRoles: newRoles,
        skills: newSkills,
        careerTrack: newTrack,
        careerTracks: isCyber ? ['cybersecurity'] : (userProfile.careerTracks || ['data'])
      });

      setIsScanning(false);
      setShowRescanPrompt(false);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 }
        });
      } catch {
        // ignore
      }
      showToast(`Matched ${result.totalMatchedCount} remote jobs to your resume!`, 'success');
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsScanning(false);
      showToast(err?.message || 'Failed to match resume with live jobs', 'error');
    }
  };

  const hasScannedResults = matchedResumeJobs.length > 0 && resumeCandidateProfile && !showRescanPrompt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-[#EDE8DF] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-[#1A1A1A] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#EDE8DF] bg-[#FAF9F5] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#D84315] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                  AI Resume Matcher & Job Finder
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#D84315]/10 text-[#D84315] font-mono">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-[#767676]">
                Scan your resume to discover verified remote opportunities open to Nigeria & worldwide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasScannedResults && (
              <button
                type="button"
                onClick={() => setShowRescanPrompt(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-scan Resume</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsExploreResumeModalOpen(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Scanning Animation Screen */}
          {isScanning && (
            <div className="py-14 px-4 text-center max-w-md mx-auto space-y-6 animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#D84315]/20 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-[#D84315] text-white flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-[#1A1A1A]">
                  Analyzing Resume with Gemini AI...
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 font-medium h-6 animate-fade-in">
                  {scanSteps[scanStepIndex]}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                <div 
                  className="bg-[#D84315] h-full transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${((scanStepIndex + 1) / scanSteps.length) * 100}%` }}
                />
              </div>

              <p className="text-[11px] text-stone-400">
                Evaluating 110+ remote companies for hiring eligibility from Nigeria.
              </p>
            </div>
          )}

          {/* Upload & Setup Screen (when not scanned or user requested rescan) */}
          {!isScanning && !hasScannedResults && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Target Role Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1A1A1A] flex items-center justify-between">
                  <span>Target Remote Role (Optional)</span>
                  <span className="text-[11px] font-normal text-stone-500">e.g. Data Analyst, Frontend Engineer</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Enter target title (e.g. AI Prompt Evaluator, React Developer)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#D84315] focus:ring-2 focus:ring-[#D84315]/10 text-xs sm:text-sm text-[#1A1A1A] outline-hidden transition-all bg-white"
                  />
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-[#D84315] bg-[#D84315]/5 scale-[0.99]' 
                    : 'border-stone-300 hover:border-[#D84315]/70 bg-stone-50/70 hover:bg-stone-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
                  accept=".pdf,.docx,.txt,.rtf"
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#D84315]/10 text-[#D84315] flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#1A1A1A] mb-1">
                  {uploadedFileName ? uploadedFileName : 'Click to Upload Resume or Drag & Drop'}
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Supports PDF, DOCX, or TXT. We extract your skills, years of experience, and ATS keywords to match against active global roles.
                </p>
                {uploadedFileName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00875A]/10 text-[#00875A] text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>File attached & ready</span>
                  </div>
                )}
              </div>

              {/* Or Paste CV Text */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1A1A1A]">
                    Or Paste Resume / Experience Summary
                  </label>
                  {cvText && (
                    <span className="text-[11px] text-stone-400">
                      {cvText.split(/\s+/).filter(Boolean).length} words
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste your resume content, LinkedIn summary, or list of tech stacks and projects here..."
                  className="w-full p-3 rounded-xl border border-stone-200 focus:border-[#D84315] focus:ring-2 focus:ring-[#D84315]/10 text-xs text-[#1A1A1A] outline-hidden transition-all bg-white"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isReadingFile}
                onClick={handleScanResume}
                className="w-full py-3.5 rounded-full bg-[#D84315] hover:bg-[#BF360C] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Scan Resume & Match Live Jobs</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" /> Private & secure
                </span>
                <span>•</span>
                <span>Matches against 110+ real remote openings</span>
                <span>•</span>
                <span>Zero spam, verified payouts</span>
              </div>
            </div>
          )}

          {/* Results Screen */}
          {!isScanning && hasScannedResults && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-white">
                      🎯 Found {matchedResumeJobs.length || 12} Verified Remote Opportunities Matching Your Resume
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Candidate: <strong className="text-white">{resumeCandidateProfile.candidateName}</strong> • Target: <strong className="text-[#D84315]">{resumeCandidateProfile.detectedRole}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-stone-300 font-mono">ATS Readiness</div>
                    <div className="text-sm font-black text-[#00875A]">{resumeCandidateProfile.atsReadinessScore || 88}%</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRescanPrompt(true)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Change Resume
                  </button>
                </div>
              </div>

              {/* Profile Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-[#EDE8DF] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                    Detected Candidate Skills & Qualifications
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    Experience: {resumeCandidateProfile.experienceLevel}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {resumeCandidateProfile.coreSkills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-800 text-xs font-semibold shadow-2xs">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed italic border-t border-stone-200/60 pt-2">
                  "{resumeCandidateProfile.careerSummary}"
                </p>
              </div>

              {/* Upgrade to PRO Paywall Banner (for free users) */}
              {!isPro && (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A1A] via-[#241c19] to-[#1A1A1A] text-white p-6 sm:p-7 border border-[#D84315]/40 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D84315] text-white text-[11px] font-bold tracking-wide uppercase font-mono">
                        <Zap className="w-3.5 h-3.5 fill-white" />
                        <span>Findjobber Pro Career Pass</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-black tracking-tight text-white">
                        Unlock All {matchedResumeJobs.length || 12} Direct Applications & Hiring Manager Emails
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                        Your resume matches {matchedResumeJobs.length || 12} high-paying remote roles ($45k–$95k/yr). Upgrade to PRO to view full job listings, access direct hiring manager emails, and generate 1-click ATS cover letters.
                      </p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
                      <button
                        type="button"
                        onClick={() => setBillingCycle('annual')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          billingCycle === 'annual' ? 'bg-[#D84315] text-white' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        Annual (Save 40%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          billingCycle === 'monthly' ? 'bg-[#D84315] text-white' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0" />
                      <span>Instant access to all {matchedResumeJobs.length || 12} resume-matched roles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0" />
                      <span>Direct hiring manager emails & referral notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0" />
                      <span>Unlimited AI Tailored Cover Letters & Cold Pitches</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        upgradeToPro();
                        showToast('Upgraded to PRO! All 110+ roles unlocked.', 'success');
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#D84315] hover:bg-[#BF360C] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>
                        Unlock All Matched Jobs — {billingCycle === 'annual' ? '$7.99 / month' : '$12.99 / month'}
                      </span>
                    </button>
                    <span className="text-[11px] text-stone-400">
                      Cancel anytime. Supported payments: Paystack (Naira debit card) & Stripe.
                    </span>
                  </div>
                </div>
              )}

              {/* Jobs List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#D84315]" />
                    <span>Jobs Related to Your Resume ({matchedResumeJobs.length || 12})</span>
                  </h4>
                  <span className="text-xs text-stone-500">
                    Sorted by Resume ATS Match Score
                  </span>
                </div>

                <div className="space-y-3">
                  {matchedResumeJobs.slice(0, isPro ? 20 : 6).map((job, idx) => {
                    const isLocked = !isPro && idx >= 2;
                    const isSaved = savedJobIds.includes(job.id);

                    return (
                      <div
                        key={job.id}
                        className={`relative rounded-2xl border transition-all p-4 sm:p-5 ${
                          isLocked 
                            ? 'bg-stone-50/80 border-stone-200' 
                            : 'bg-white border-[#EDE8DF] hover:border-stone-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-[#1A1A1A] font-bold text-sm shrink-0">
                              {job.company.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-sm font-bold text-[#1A1A1A]">
                                  {job.title}
                                </h5>
                                {job.isNigeriaEligible && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00875A]/10 text-[#00875A] flex items-center gap-1">
                                    🇳🇬 NG Remote
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5 flex-wrap">
                                <span className="font-semibold text-stone-700">{job.company}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                                  {job.salaryFormatted || '$45k–$75k / yr'}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Globe className="w-3.5 h-3.5 text-stone-400" />
                                  {job.location}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#00875A]/10 text-[#00875A] border border-[#00875A]/20">
                              {job.resumeMatchScore || 85}% Match
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleSaveJob(job.id)}
                              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                isSaved 
                                  ? 'bg-[#D84315] text-white border-[#D84315]' 
                                  : 'border-stone-200 hover:bg-stone-100 text-stone-500'
                              }`}
                              title={isSaved ? 'Saved to bookmarks' : 'Save opportunity'}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Match Reason Bar */}
                        <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-stone-200/60 text-xs text-stone-700 flex items-start gap-2 mb-3">
                          <Sparkles className="w-3.5 h-3.5 text-[#D84315] shrink-0 mt-0.5" />
                          <p className="leading-snug">{job.matchReason}</p>
                        </div>

                        {/* Skills and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100">
                          <div className="flex flex-wrap gap-1.5">
                            {(job.skills || []).slice(0, 4).map((skill, sIdx) => (
                              <span key={sIdx} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px]">
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isLocked ? (
                              <button
                                type="button"
                                onClick={() => {
                                  upgradeToPro();
                                  showToast('Upgraded to PRO! Job links unlocked.', 'success');
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Lock className="w-3 h-3 text-[#D84315]" />
                                <span>Unlock Application Link (PRO)</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    openResumeReshaperModalForJob(job);
                                    setIsExploreResumeModalOpen(false);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-[#D84315]/10 hover:bg-[#D84315]/20 text-xs font-bold text-[#D84315] flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Tailor CV</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedJobForPitch(job);
                                    setIsExploreResumeModalOpen(false);
                                  }}
                                  className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
                                >
                                  AI Intel & Q&A
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (job.applicationUrl) {
                                      openInAppApply(job);
                                    } else {
                                      openInAppBrowser(job.officialUrl || '', job, `${job.title} — ${job.company}`);
                                    }
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-[#D84315] hover:bg-[#BF360C] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Open in-app application portal"
                                >
                                  <span>Apply Now</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isPro && matchedResumeJobs.length > 6 && (
                  <div className="text-center p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <p className="text-xs text-stone-600 font-medium">
                      + {matchedResumeJobs.length - 6} more high-paying remote roles match your resume qualifications.
                    </p>
                    <button
                      type="button"
                      onClick={() => upgradeToPro()}
                      className="text-xs font-bold text-[#D84315] hover:underline cursor-pointer"
                    >
                      Upgrade to PRO to reveal all matches & contact recruiters →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-[#EDE8DF] bg-[#FAF9F5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>Powered by Findjobber AI Career Engine</span>
          </div>
          <button
            type="button"
            onClick={() => setIsExploreResumeModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
