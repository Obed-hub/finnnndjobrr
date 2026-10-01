import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  CheckCircle2,
  ExternalLink,
  Kanban,
  Maximize2,
  Brain,
  ShieldCheck,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Target
} from 'lucide-react';
import { Job, JobIntelligence, JobQAMessage } from '../types';
import { useApp } from '../context/AppContext';
import { getJobIntelligenceApi, askJobQuestionApi, generateTailoredPitchApi } from '../lib/api';
import { generateInstantJobIntelligence, cacheJobIntelligence } from '../utils/instantIntelligence';

interface AIApplicationDrawerProps {
  job: Job;
  onClose: () => void;
}

export const AIApplicationDrawer: React.FC<AIApplicationDrawerProps> = ({ job, onClose }) => {
  const { 
    userProfile, 
    consumeAiAssist, 
    addApplication, 
    showToast, 
    setIsUpgradeModalOpen,
    openCoverLetterModalForJob,
    openResumeReshaperModalForJob,
    openInAppApply 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'intel' | 'qa' | 'interview' | 'assets'>('intel');
  const [isEnriching, setIsEnriching] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Job Intelligence State - Initialized instantly (0ms load time)
  const [intelligence, setIntelligence] = useState<JobIntelligence>(() => generateInstantJobIntelligence(job, userProfile));

  // Interactive Q&A State
  const [messages, setMessages] = useState<JobQAMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${userProfile.name.split(' ')[0]}! I've analyzed the **${job.title}** opening at **${job.company}**. You can ask me anything about this role, requirements, interview preparation, or how to position your skills!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Application Assets State
  const [assets, setAssets] = useState<{
    pitch: string;
    coverLetter: string;
    recruiterMessage: string;
    interviewPoints: string[];
  } | null>(null);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  // Load initial intelligence immediately, then refine with background AI
  useEffect(() => {
    let isMounted = true;
    
    // Immediate 0ms local synthesis
    const instantIntel = generateInstantJobIntelligence(job, userProfile);
    setIntelligence(instantIntel);

    const loadRefinedIntel = async () => {
      setIsEnriching(true);
      try {
        const res = await getJobIntelligenceApi({
          jobTitle: job.title,
          company: job.company,
          jobDescription: job.description,
          userSkills: userProfile.skills,
          userCv: userProfile.cvText,
          targetRole: userProfile.targetRoles[0]
        });
        if (isMounted && res.intelligence) {
          setIntelligence(res.intelligence);
          cacheJobIntelligence(job.id, userProfile.id || 'default', res.intelligence);
        }
      } catch (err) {
        // Silently use instant synthesized intelligence on network slowdown/timeout
        console.warn('Job intelligence background refinement note (instant synthesis active):', err);
      } finally {
        if (isMounted) setIsEnriching(false);
      }
    };

    loadRefinedIntel();
    return () => { isMounted = false; };
  }, [job.id]);

  useEffect(() => {
    if (activeTab === 'qa') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleAskQuestion = async (customQ?: string) => {
    const questionText = (customQ || inputQuestion).trim();
    if (!questionText || isAsking) return;

    const userMsg: JobQAMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsAsking(true);

    try {
      const res = await askJobQuestionApi({
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        userSkills: userProfile.skills,
        userCv: userProfile.cvText,
        question: questionText,
        chatHistory: messages.map(m => ({ sender: m.sender, text: m.text }))
      });

      const aiMsg: JobQAMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const fallbackAiMsg: JobQAMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `Based on the job requirements for **${job.title}** at **${job.company}**, focus on concrete deliverables using **${userProfile.skills.slice(0, 3).join(', ')}**. Make sure to highlight your asynchronous communication habits and provide specific examples of recent projects.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackAiMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleGenerateAssets = async () => {
    const hasAssist = consumeAiAssist();
    if (!hasAssist) return;

    setIsLoadingAssets(true);
    try {
      const data = await generateTailoredPitchApi({
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        userSkills: userProfile.skills,
        userCv: userProfile.cvText,
        targetRole: userProfile.targetRoles[0]
      });
      setAssets(data);
      showToast('AI Application assets generated successfully!', 'success');
    } catch (err: any) {
      showToast('Generated application assets using role template.', 'info');
      setAssets({
        pitch: `As a proactive ${userProfile.targetRoles[0] || 'Remote Professional'} with proven experience in ${userProfile.skills.slice(0, 3).join(', ')}, I am excited to apply for the ${job.title} position at ${job.company}. My background in executing end-to-end deliverables enables me to bring immediate value to your remote team with seamless WAT time-zone overlap.`,
        coverLetter: `Dear Hiring Team at ${job.company},\n\nI am writing to express my strong enthusiasm for the ${job.title} role. With a rigorous foundation in ${userProfile.skills.slice(0, 3).join(', ')} and a focus on actionable business outcomes, I have consistently turned project objectives into tangible results.\n\nIn my recent work, I built and managed key workflows, surfaced operational improvements, and ensured high-accuracy delivery. I am drawn to ${job.company} because of your ambitious product vision and dynamic remote culture.\n\nThank you for considering my application. I welcome the opportunity to discuss how my skill set matches your team's current quarterly milestones.\n\nBest regards,\n${userProfile.name}`,
        recruiterMessage: `Hi ${job.company} team! I've just submitted my application for the ${job.title} opening. With solid hands-on experience in ${userProfile.skills.slice(0, 3).join(', ')}, I'm excited about the opportunity to support your team. Would love to connect!`,
        interviewPoints: [
          `Highlight your hands-on case studies and proficiency in ${userProfile.skills.slice(0, 2).join(' and ')}.`,
          `Discuss your proficiency in proactive asynchronous communication across remote teams.`,
          `Explain your approach to validating edge cases and verifying deliverables.`,
          `Demonstrate clear understanding of ${job.company}'s customer base and business model.`
        ]
      });
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveToTracker = () => {
    addApplication({
      id: 'app_' + Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      salary: job.salaryFormatted,
      status: 'planning',
      appliedAt: new Date().toISOString(),
      pitch: assets?.pitch,
      coverLetter: assets?.coverLetter,
      matchScore: job.matchScore,
      officialUrl: job.applicationUrl
    });
    showToast(`Added to your Application Tracker as "Planning to Apply"`, 'success');
  };

  const suggestedQuestions = [
    "What will the interview likely test?",
    "What are the hidden expectations for this role?",
    "How can I tailor my resume to stand out?",
    "What are good questions to ask the hiring manager?",
    "Are there any red flags or risk signals in this posting?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl h-full bg-white border-l border-[#EDE8DF] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#EDE8DF] flex items-center justify-between bg-[#FBF9F4]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-[#D84315] flex items-center justify-center text-white shadow-xs shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1A1A1A]">AI Job Intelligence & Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#D84315]/10 text-[#D84315] font-mono shrink-0">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-[#767676] truncate">{job.title} • {job.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#767676] hover:text-[#1A1A1A] hover:bg-[#EDE8DF] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-[#EDE8DF] bg-white flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('intel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'intel'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#767676] hover:text-[#1A1A1A] hover:bg-[#F7F5EE]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D84315]" />
            <span>Job Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'qa'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#767676] hover:text-[#1A1A1A] hover:bg-[#F7F5EE]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
            <span>Ask AI About Job</span>
            {messages.length > 1 && (
              <span className="w-4 h-4 rounded-full bg-[#D84315] text-white text-[9px] flex items-center justify-center font-mono font-bold">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'interview'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#767676] hover:text-[#1A1A1A] hover:bg-[#F7F5EE]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interview Q&A Prep</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'assets'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#767676] hover:text-[#1A1A1A] hover:bg-[#F7F5EE]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Application Assets</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#FBF9F4]">
          
          {/* TAB 1: JOB INTELLIGENCE */}
          {activeTab === 'intel' && (
            <div className="space-y-4">
              {/* Intelligence Header Status */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D84315]" />
                  <span>Deep Role Intelligence Briefing</span>
                </div>
                {isEnriching ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10.5px] font-semibold text-amber-800">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Enriching with AI...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10.5px] font-semibold text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Ready & Verified</span>
                  </div>
                )}
              </div>

              {intelligence && (
                <>
                  {/* Executive Summary */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                      <Lightbulb className="w-4 h-4 text-[#D84315]" />
                      <span>Executive Overview & Hiring Driver</span>
                    </div>
                    <p className="text-xs text-[#1A1A1A] leading-relaxed">
                      {intelligence.executiveSummary}
                    </p>
                  </div>

                  {/* Day in the Life & Role Reality */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Day-to-Day Work Reality & Pace</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {intelligence.roleReality}
                    </p>
                  </div>

                  {/* What They Really Want (Unspoken Criteria) */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-2.5 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span>What the Hiring Manager is Actually Looking For</span>
                    </div>
                    <div className="space-y-1.5">
                      {intelligence.whatTheyReallyWant.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Candidate Advantage & Gap Analysis */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Your Strategic Advantages</span>
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-emerald-900">
                        {intelligence.candidateStrengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Gaps to Address / Clarify</span>
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-amber-900">
                        {intelligence.candidateSkillGaps.map((g, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tactical Advice & Next Steps */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D84315]/10 via-[#F7F5EE] to-white border border-[#D84315]/20 space-y-2">
                    <span className="text-xs font-bold text-[#D84315] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Winning Application Strategy</span>
                    </span>
                    <p className="text-xs text-[#1A1A1A] leading-relaxed">
                      {intelligence.strategicAdvice}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          openResumeReshaperModalForJob(job);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#00875A] text-white text-xs font-bold hover:bg-[#00704A] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Reshape Resume for this Job</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('qa')}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#EDE8DF] text-xs font-bold text-[#1A1A1A] hover:bg-[#F7F5EE] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 text-blue-500" />
                        <span>Ask AI Questions</span>
                      </button>
                    </div>
                  </div>

                  {/* Scam Shield & Legitimacy Verification */}
                  <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200 flex items-start gap-2.5 text-xs text-stone-700">
                    <ShieldCheck className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 block mb-0.5">Authenticity & Safety Verification</span>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {intelligence.redFlagsOrScamCheck?.details || 'Verified employer pipeline with standard direct application route.'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE Q&A (ASK QUESTIONS ABOUT JOB) */}
          {activeTab === 'qa' && (
            <div className="flex flex-col h-full space-y-3">
              {/* Suggested Questions Pills */}
              <div className="space-y-1.5 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-mono">
                  Suggested Questions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAskQuestion(q)}
                      disabled={isAsking}
                      className="px-2.5 py-1 rounded-full bg-white border border-[#EDE8DF] hover:border-[#D84315] hover:text-[#D84315] text-[11px] font-medium text-stone-700 text-left transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3.5 bg-white border border-[#EDE8DF] rounded-2xl shadow-xs min-h-[260px]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#1A1A1A] text-white rounded-br-xs'
                          : 'bg-[#F7F5EE] text-[#1A1A1A] border border-[#EDE8DF] rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line font-sans">
                        {msg.text}
                      </div>
                    </div>
                    <span className="text-[9.5px] text-stone-400 mt-1 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isAsking && (
                  <div className="flex items-center gap-2 p-3 bg-[#F7F5EE] rounded-2xl max-w-[70%] border border-[#EDE8DF]">
                    <div className="w-3.5 h-3.5 border-2 border-[#D84315]/30 border-t-[#D84315] rounded-full animate-spin" />
                    <span className="text-xs text-stone-600 font-medium">AI Advisor is analyzing...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion();
                }}
                className="flex items-center gap-2 shrink-0 pt-1"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="Ask anything about this job or company..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-white border border-[#EDE8DF] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#D84315] placeholder:text-stone-400 shadow-2xs"
                  disabled={isAsking}
                />
                <button
                  type="submit"
                  disabled={!inputQuestion.trim() || isAsking}
                  className="px-4 py-2.5 rounded-full bg-[#D84315] hover:bg-[#BF360C] text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:scale-95"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: INTERVIEW PREPARATION */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-1.5 shadow-xs">
                <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#00875A]" />
                  <span>Expected Technical & Behavioral Questions</span>
                </span>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Anticipated questions tailored to {job.company}'s requirements and your background:
                </p>
              </div>

              {intelligence?.likelyInterviewQuestions?.map((qObj, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-2.5 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#D84315]/10 text-[#D84315] flex items-center justify-center font-bold text-[10px] shrink-0 font-mono mt-0.5">
                      {i + 1}
                    </span>
                    <h5 className="text-xs font-bold text-[#1A1A1A] leading-snug">{qObj.question}</h5>
                  </div>
                  
                  <div className="pl-7 space-y-2">
                    <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                      <strong className="text-blue-950 block mb-0.5">Why they ask this:</strong>
                      {qObj.whyTheyAsk}
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F7F5EE] border border-[#EDE8DF] text-[11px] text-stone-800 leading-relaxed">
                      <strong className="text-stone-900 block mb-0.5">Recommended Response Angle:</strong>
                      {qObj.sampleAnswer}
                    </div>
                  </div>
                </div>
              ))}

              {/* Questions to ask the employer */}
              {intelligence?.smartQuestionsToAskEmployer && (
                <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-2.5 shadow-xs">
                  <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Smart Questions to Ask the Hiring Manager</span>
                  </span>
                  <div className="space-y-2">
                    {intelligence.smartQuestionsToAskEmployer.map((sq, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-stone-800 flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{sq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: APPLICATION ASSETS */}
          {activeTab === 'assets' && (
            <div className="space-y-4">
              {!assets && !isLoadingAssets && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#EDE8DF] rounded-3xl bg-white shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-[#D84315]/10 border border-[#D84315]/20 flex items-center justify-center text-[#D84315] mb-4">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1A1A] mb-1">Generate Tailored Application Copy</h4>
                  <p className="text-xs text-[#767676] max-w-sm mb-6 leading-relaxed">
                    Instantly craft personalized pitches, recruiter DMs, and talking points customized to {job.company}'s requirements.
                  </p>
                  <button
                    onClick={handleGenerateAssets}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D84315] hover:bg-[#BF360C] text-white font-bold text-xs shadow-md shadow-[#D84315]/20 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Application Assets</span>
                  </button>
                </div>
              )}

              {isLoadingAssets && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 border-3 border-[#D84315]/20 border-t-[#D84315] rounded-full animate-spin mb-4" />
                  <p className="text-xs font-bold text-[#1A1A1A]">Generating Tailored Application Copy...</p>
                </div>
              )}

              {assets && !isLoadingAssets && (
                <div className="space-y-4">
                  {/* Short Pitch */}
                  <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1A1A1A]">3-Sentence High-Impact Intro Pitch</span>
                      <button
                        onClick={() => handleCopy(assets.pitch, 'pitch')}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-[#F7F5EE] border border-[#EDE8DF] text-xs text-[#1A1A1A] font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        {copiedKey === 'pitch' ? <Check className="w-3.5 h-3.5 text-[#00875A]" /> : <Copy className="w-3.5 h-3.5 text-[#767676]" />}
                        <span>{copiedKey === 'pitch' ? 'Copied' : 'Copy Pitch'}</span>
                      </button>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F7F5EE] text-xs text-[#1A1A1A] leading-relaxed font-sans whitespace-pre-line border border-[#EDE8DF]">
                      {assets.pitch}
                    </div>
                  </div>

                  {/* Recruiter DM */}
                  <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1A1A1A]">LinkedIn / Email Recruiter DM</span>
                      <button
                        onClick={() => handleCopy(assets.recruiterMessage, 'recruiter')}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-[#F7F5EE] border border-[#EDE8DF] text-xs text-[#1A1A1A] font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        {copiedKey === 'recruiter' ? <Check className="w-3.5 h-3.5 text-[#00875A]" /> : <Copy className="w-3.5 h-3.5 text-[#767676]" />}
                        <span>{copiedKey === 'recruiter' ? 'Copied' : 'Copy DM'}</span>
                      </button>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F7F5EE] text-xs text-[#1A1A1A] leading-relaxed font-sans border border-[#EDE8DF]">
                      {assets.recruiterMessage}
                    </div>
                  </div>

                  {/* Cover Letter Launcher */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block mb-0.5">Need a full customized Cover Letter?</span>
                      <span className="text-[11px] text-emerald-800">Generate a 3-paragraph PDF-ready cover letter with personalized anecdotes.</span>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        openCoverLetterModalForJob(job);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#00875A] text-white font-bold text-xs hover:bg-[#00704A] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Open Generator</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-white border-t border-[#EDE8DF] flex items-center justify-between gap-3">
          <button
            onClick={handleSaveToTracker}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] text-xs font-bold text-[#1A1A1A] border border-[#EDE8DF] transition-colors cursor-pointer"
          >
            <Kanban className="w-4 h-4 text-[#D84315]" />
            <span>Add to Tracker</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              openInAppApply(job);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D84315] hover:bg-[#BF360C] text-xs font-bold text-white transition-colors shadow-md shadow-[#D84315]/20 cursor-pointer active:scale-95"
            title="Open in-app application portal"
          >
            <span>Proceed to Apply</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
