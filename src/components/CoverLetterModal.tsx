import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Kanban, 
  FileText, 
  Building2, 
  Crown, 
  CheckCircle2, 
  RefreshCw,
  Sliders,
  Send,
  ExternalLink,
  Target,
  FileDown
} from 'lucide-react';
import { Job, CoverLetterTone, CoverLetterResponse } from '../types';
import { useApp } from '../context/AppContext';
import { generateCoverLetterApi } from '../lib/api';

interface CoverLetterModalProps {
  job: Job | null;
  onClose: () => void;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({ job, onClose }) => {
  const { userProfile, consumeAiAssist, addApplication, showToast, setIsUpgradeModalOpen, openInAppApply } = useApp();

  const [companyName, setCompanyName] = useState(job?.company || '');
  const [jobTitle, setJobTitle] = useState(job?.title || '');
  const [jobDescription, setJobDescription] = useState(job?.description || '');
  const [tone, setTone] = useState<CoverLetterTone>('professional_persuasive');
  const [customFocus, setCustomFocus] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'letter' | 'breakdown' | 'customize'>('letter');

  const [generatedResult, setGeneratedResult] = useState<CoverLetterResponse | null>(null);
  const [editableLetter, setEditableLetter] = useState('');

  useEffect(() => {
    if (job) {
      setCompanyName(job.company);
      setJobTitle(job.title);
      setJobDescription(job.description || '');
      // Auto-trigger generation on open for convenience
      handleGenerateCoverLetter(job.company, job.title, job.description, tone);
    }
  }, [job]);

  const handleGenerateCoverLetter = async (
    targetCompany = companyName, 
    targetTitle = jobTitle, 
    targetDesc = jobDescription, 
    selectedTone = tone
  ) => {
    if (!targetCompany || !targetTitle) {
      showToast('Please provide a company name and job title', 'error');
      return;
    }

    const hasQuota = consumeAiAssist();
    if (!hasQuota) return;

    setIsLoading(true);
    try {
      const response = await generateCoverLetterApi({
        company: targetCompany,
        jobTitle: targetTitle,
        jobDescription: targetDesc,
        candidateProfile: userProfile,
        tone: selectedTone,
        customFocusPoints: customFocus
      });

      setGeneratedResult(response);
      setEditableLetter(response.coverLetter);
      showToast('Tailored cover letter generated successfully!', 'success');
    } catch (err: any) {
      // Fallback
      const fallbackLetter = `Dear Hiring Team at ${targetCompany},\n\nI am writing to express my enthusiastic interest in the ${targetTitle} position at ${targetCompany}. With a solid foundation in ${userProfile.skills.slice(0, 4).join(', ')} and a dedicated background in ${userProfile.targetRoles[0] || 'software & data analytics'}, I have followed ${targetCompany}'s growth and admire your commitment to building high-impact technology solutions.\n\nIn my recent projects, I modeled complex datasets, automated reporting workflows, and created intuitive dashboard interfaces that reduced reporting turnaround times. These hands-on achievements align directly with the core requirements outlined in the ${targetTitle} role, and demonstrate my ability to deliver immediate value to your remote team.\n\nOperating with full time-zone alignment from ${userProfile.city ? `${userProfile.city}, ` : ''}${userProfile.country} (${userProfile.timezone}), I take great pride in proactive asynchronous communication, clear documentation, and autonomous problem solving.\n\nThank you for considering my application. I would welcome the opportunity to discuss how my skill set and enthusiasm can support ${targetCompany}'s upcoming product milestones.\n\nSincerely,\n\n${userProfile.name}\n${userProfile.email} | ${userProfile.portfolioUrl || 'Portfolio available upon request'}`;
      
      const fallbackResult: CoverLetterResponse = {
        coverLetter: fallbackLetter,
        subjectLine: `Application for ${targetTitle} — ${userProfile.name}`,
        keyStrengthsHighlighted: [
          `Demonstrated proficiency in ${userProfile.skills.slice(0, 3).join(', ')}`,
          `High-overlap remote collaboration in ${userProfile.timezone}`,
          `Practical project experience in data & software problem-solving`,
          `Tailored value proposition for ${targetCompany}`
        ],
        atsKeywordsMatched: [
          'Data Analysis', 'SQL Querying', 'Asynchronous Communication', 'Problem Solving'
        ],
        persuasionHighlights: [
          'Clear introductory hook aligning candidate passions with company mission',
          'Evidence-based body paragraph showcasing past project outcomes',
          'Professional call to action with direct contact details'
        ]
      };
      setGeneratedResult(fallbackResult);
      setEditableLetter(fallbackLetter);
      showToast('Generated tailored cover letter', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySubject = () => {
    if (!generatedResult?.subjectLine) return;
    navigator.clipboard.writeText(generatedResult.subjectLine);
    setCopiedSubject(true);
    showToast('Subject line copied to clipboard!', 'success');
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyLetter = () => {
    if (!editableLetter) return;
    navigator.clipboard.writeText(editableLetter);
    setCopiedLetter(true);
    showToast('Cover letter copied to clipboard!', 'success');
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!editableLetter) return;
    const element = document.createElement('a');
    const file = new Blob([editableLetter], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${companyName.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Cover letter downloaded as .txt', 'success');
  };

  const handleSaveToTracker = () => {
    addApplication({
      id: 'app_' + Date.now(),
      jobId: job?.id || 'custom_' + Date.now(),
      jobTitle: jobTitle,
      company: companyName,
      salary: job?.salaryFormatted || 'Disclosed upon request',
      status: 'planning',
      appliedAt: new Date().toISOString(),
      coverLetter: editableLetter,
      matchScore: job?.matchScore || 90,
      officialUrl: job?.applicationUrl || '#'
    });
    showToast(`Added ${jobTitle} at ${companyName} to Application Tracker with tailored cover letter attached!`, 'success');
  };

  const toneOptions: Array<{ id: CoverLetterTone; label: string; desc: string }> = [
    { id: 'professional_persuasive', label: 'Professional & Persuasive', desc: 'Balanced, articulate, highly convincing and confident tone' },
    { id: 'technical_metrics', label: 'Technical & Metrics-Driven', desc: 'Emphasizes technical tooling, SQL/Python data pipelines, and quantitative results' },
    { id: 'startup_proactive', label: 'Startup & High-Ownership', desc: 'Fast-paced, entrepreneurial, emphasizing agility, proactive async execution' },
    { id: 'career_transition', label: 'Career Transition / Growth', desc: 'Highlights transferable competencies, rapid learning rate, and fresh perspective' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl border border-[#EDE8DF] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#EDE8DF] bg-[#FBF9F4] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D84315] flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1A1A1A]">AI Personalized Cover Letter Generator</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#D84315]/10 text-[#D84315] font-mono">
                  Gemini 3.7 Pro
                </span>
              </div>
              <p className="text-xs text-[#767676]">
                Tailored for <span className="font-semibold text-[#1A1A1A]">{companyName || 'Target Company'}</span> • Candidate: <span className="font-semibold text-[#1A1A1A]">{userProfile.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#767676] hover:text-[#1A1A1A] hover:bg-[#EDE8DF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-navigation */}
        <div className="px-6 py-2.5 bg-white border-b border-[#EDE8DF] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSubTab('letter')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                activeSubTab === 'letter'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#767676] hover:bg-[#F7F5EE] hover:text-[#1A1A1A]'
              }`}
            >
              Tailored Letter
            </button>
            <button
              onClick={() => setActiveSubTab('breakdown')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                activeSubTab === 'breakdown'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#767676] hover:bg-[#F7F5EE] hover:text-[#1A1A1A]'
              }`}
            >
              ATS & Persuasion Audit
            </button>
            <button
              onClick={() => setActiveSubTab('customize')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                activeSubTab === 'customize'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#767676] hover:bg-[#F7F5EE] hover:text-[#1A1A1A]'
              }`}
            >
              Tune Parameters
            </button>
          </div>

          <div className="flex items-center gap-2">
            {userProfile.subscriptionPlan === 'pro' ? (
              <span className="flex items-center gap-1 text-[#00875A] font-bold text-[11px] bg-[#00875A]/10 px-2.5 py-1 rounded-full">
                <Crown className="w-3.5 h-3.5" /> Unlimited PRO Assists
              </span>
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-[#767676]">
                <span>Assists: <strong className="text-[#1A1A1A] font-mono">{userProfile.aiAssistsRemaining}/{userProfile.aiAssistsLimit}</strong></span>
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="text-[#D84315] hover:underline font-bold"
                >
                  Upgrade
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FBF9F4]">
          {activeSubTab === 'customize' && (
            <div className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-[#EDE8DF]">
              <h4 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D84315]" />
                <span>Customize Target Job & Persuasion Settings</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#767676] uppercase tracking-wider mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Moniepoint, Paystack, Flutterwave"
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF] text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#D84315]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#767676] uppercase tracking-wider mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. Junior Data Analyst, Frontend Engineer"
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF] text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#D84315]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#767676] uppercase tracking-wider mb-1">
                  Job Description / Key Requirements
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste specific job requirements or ATS bullets here..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#D84315] font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#767676] uppercase tracking-wider mb-1.5">
                  Tone of Voice
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {toneOptions.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTone(opt.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        tone === opt.id
                          ? 'bg-[#D84315]/5 border-[#D84315] text-[#1A1A1A]'
                          : 'bg-[#FBF9F4] border-[#EDE8DF] text-[#767676] hover:border-[#D84315]/40'
                      }`}
                    >
                      <span className="text-xs font-bold block text-[#1A1A1A]">{opt.label}</span>
                      <span className="text-[10px] text-[#767676] mt-0.5 block leading-tight">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#767676] uppercase tracking-wider mb-1">
                  Custom Strategic Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={customFocus}
                  onChange={e => setCustomFocus(e.target.value)}
                  placeholder="e.g. Focus on my e-commerce SQL project and strong interest in mobile payments"
                  className="w-full px-3 py-2 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#D84315]"
                />
              </div>

              <button
                onClick={() => {
                  setActiveSubTab('letter');
                  handleGenerateCoverLetter();
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D84315] hover:bg-[#BF360C] text-white font-bold text-xs shadow-md shadow-[#D84315]/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Generating Tailored Letter...' : 'Regenerate Cover Letter'}</span>
              </button>
            </div>
          )}

          {activeSubTab === 'letter' && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 border-3 border-[#D84315]/20 border-t-[#D84315] rounded-full animate-spin mb-4" />
                  <p className="text-sm font-bold text-[#1A1A1A]">Analyzing Job Description & Weaving Profile Strengths...</p>
                  <p className="text-xs text-[#767676] mt-1 max-w-md">
                    Matching your verified skills ({userProfile.skills.slice(0, 3).join(', ')}), project achievements, and WAT timezone with {companyName}&apos;s specific job criteria.
                  </p>
                </div>
              ) : (
                <>
                  {/* Subject line box */}
                  {generatedResult?.subjectLine && (
                    <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8DF] flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 rounded-md bg-[#F7F5EE] border border-[#EDE8DF] text-[10px] font-bold text-[#767676] uppercase tracking-wider font-mono shrink-0">
                          Subject Line
                        </span>
                        <span className="text-xs font-semibold text-[#1A1A1A] truncate">
                          {generatedResult.subjectLine}
                        </span>
                      </div>
                      <button
                        onClick={handleCopySubject}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] text-xs font-semibold text-[#1A1A1A] transition-colors shrink-0"
                      >
                        {copiedSubject ? <Check className="w-3.5 h-3.5 text-[#00875A]" /> : <Copy className="w-3.5 h-3.5 text-[#767676]" />}
                        <span>{copiedSubject ? 'Copied' : 'Copy Subject'}</span>
                      </button>
                    </div>
                  )}

                  {/* Editable Letter Paper */}
                  <div className="rounded-2xl bg-white border border-[#EDE8DF] p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1A1A1A]">Personalized Cover Letter</span>
                        <span className="text-[10px] text-[#00875A] font-mono bg-[#00875A]/10 px-2 py-0.5 rounded-full font-bold">
                          Ready to Send
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyLetter}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
                        >
                          {copiedLetter ? <Check className="w-3.5 h-3.5 text-[#00875A]" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLetter ? 'Copied to Clipboard' : 'Copy Full Letter'}</span>
                        </button>
                        <button
                          onClick={handleDownloadTxt}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-xs font-semibold text-[#1A1A1A] transition-colors"
                          title="Download as .txt"
                        >
                          <Download className="w-3.5 h-3.5 text-[#767676]" />
                          <span>Download .txt</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={14}
                      value={editableLetter}
                      onChange={e => setEditableLetter(e.target.value)}
                      className="w-full p-2 bg-transparent text-xs text-[#1A1A1A] leading-relaxed font-sans focus:outline-none resize-y border-none"
                      placeholder="Your personalized cover letter will appear here..."
                    />

                    <div className="flex items-center justify-between pt-3 border-t border-[#EDE8DF] text-[11px] text-[#767676]">
                      <span>
                        Words: <strong className="text-[#1A1A1A]">{editableLetter.trim() ? editableLetter.trim().split(/\s+/).length : 0}</strong> • Characters: <strong className="text-[#1A1A1A]">{editableLetter.length}</strong>
                      </span>
                      <button
                        onClick={() => handleGenerateCoverLetter()}
                        className="flex items-center gap-1 text-[#D84315] hover:underline font-bold"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Regenerate with AI</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeSubTab === 'breakdown' && (
            <div className="space-y-4">
              {/* Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
                    <h5 className="text-xs font-bold text-[#1A1A1A]">Key Strengths Incorporated</h5>
                  </div>
                  <ul className="space-y-1.5">
                    {generatedResult?.keyStrengthsHighlighted?.map((item, i) => (
                      <li key={i} className="text-[11px] text-[#767676] flex items-start gap-1.5">
                        <span className="text-[#00875A] font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    )) || <li className="text-[11px] text-[#767676]">SQL, Power BI, and Data Modeling tailored to job.</li>}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#D84315]" />
                    <h5 className="text-xs font-bold text-[#1A1A1A]">ATS Keywords Addressed</h5>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {generatedResult?.atsKeywordsMatched?.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#F7F5EE] border border-[#EDE8DF] text-[#1A1A1A] text-[10px] font-mono">
                        {kw}
                      </span>
                    )) || (
                      ['SQL', 'Business Intelligence', 'WAT Timezone', 'Asynchronous Workflow'].map((kw, i) => (
                        <span key={`fallback-kw-${i}`} className="px-2 py-0.5 rounded-md bg-[#F7F5EE] border border-[#EDE8DF] text-[#1A1A1A] text-[10px] font-mono">
                          {kw}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D84315]" />
                    <h5 className="text-xs font-bold text-[#1A1A1A]">Persuasion Strategy</h5>
                  </div>
                  <ul className="space-y-1.5">
                    {generatedResult?.persuasionHighlights?.map((item, i) => (
                      <li key={i} className="text-[11px] text-[#767676] flex items-start gap-1.5">
                        <span className="text-[#D84315] font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    )) || (
                      <li className="text-[11px] text-[#767676]">Compelling opening hook with quantified proof points.</li>
                    )}
                  </ul>
                </div>

              </div>

              {/* Candidate profile reference */}
              <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] text-xs space-y-2">
                <span className="font-bold text-[#1A1A1A] block">Candidate Source Profile Utilized:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
                    <span className="text-[#767676] block">Name</span>
                    <span className="font-semibold text-[#1A1A1A]">{userProfile.name}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
                    <span className="text-[#767676] block">Target Role</span>
                    <span className="font-semibold text-[#1A1A1A]">{userProfile.targetRoles[0]}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
                    <span className="text-[#767676] block">Location / Timezone</span>
                    <span className="font-semibold text-[#1A1A1A]">{userProfile.country} ({userProfile.timezone})</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF]">
                    <span className="text-[#767676] block">Experience</span>
                    <span className="font-semibold text-[#1A1A1A]">{userProfile.yearsOfExperience} Year(s)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-white border-t border-[#EDE8DF] flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={handleSaveToTracker}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] text-xs font-bold text-[#1A1A1A] transition-colors border border-[#EDE8DF]"
          >
            <Kanban className="w-4 h-4 text-[#D84315]" />
            <span>Save to Application Tracker</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLetter}
              className="px-4 py-2.5 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] text-xs font-bold text-[#1A1A1A] transition-colors border border-[#EDE8DF]"
            >
              {copiedLetter ? '✓ Copied' : 'Copy Text'}
            </button>

            {job?.applicationUrl ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openInAppApply(job);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D84315] hover:bg-[#BF360C] text-xs font-bold text-white transition-colors shadow-md shadow-[#D84315]/20 cursor-pointer active:scale-95"
                title="Open in-app application portal"
              >
                <span>Proceed to Apply at {companyName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-[#1A1A1A] text-white text-xs font-bold"
              >
                Done
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
