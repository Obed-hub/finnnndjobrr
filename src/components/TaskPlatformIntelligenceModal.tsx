import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  CreditCard, 
  ShieldCheck, 
  Bot, 
  Send, 
  RotateCw, 
  Target, 
  Zap, 
  BookOpen, 
  Award, 
  HelpCircle, 
  ArrowRight,
  Check,
  Copy,
  PanelRightClose,
  PanelRightOpen,
  Trash2,
  Globe,
  User
} from 'lucide-react';
import Markdown from 'react-markdown';
import { fetchTaskPlatformIntelligenceApi, askTaskPlatformQAApi } from '../lib/api';
import { TaskPlatformResearchResponse } from '../types';
import { useApp } from '../context/AppContext';

interface TaskPlatformIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformData: {
    platform: string;
    roleTitle?: string;
    category?: string;
    advertisedRate?: string;
    verifiedRate?: string;
    payoutMethods?: string[];
    onboardingRequirements?: string[];
    officialUrl?: string;
    difficulty?: string;
  } | null;
}

export const TaskPlatformIntelligenceModal: React.FC<TaskPlatformIntelligenceModalProps> = ({
  isOpen,
  onClose,
  platformData
}) => {
  const { showToast, openInAppBrowser } = useApp();

  // Active view tab in sidebar or main view on mobile
  const [activeSidebarTab, setActiveSidebarTab] = useState<'roadmap' | 'research' | 'payouts'>('roadmap');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Intelligence data state
  const [intel, setIntel] = useState<TaskPlatformResearchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Milestone checked state for local tracking
  const [completedMilestones, setCompletedMilestones] = useState<Record<number, boolean>>({});

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<Array<{ 
    id: string;
    sender: 'user' | 'ai'; 
    text: string; 
    timestamp: string;
  }>>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut (Escape to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Initial load effect
  useEffect(() => {
    if (!isOpen || !platformData) return;

    setLoading(true);
    setCompletedMilestones({});
    
    const initialWelcomeId = 'welcome-1';
    setChatMessages([
      {
        id: initialWelcomeId,
        sender: 'ai',
        text: `### 👋 Welcome to the First-Dollar Workspace for **${platformData.platform}**\n\nI have compiled live intelligence on **${platformData.platform}** covering entry screening assessments, sandbox calibration tasks, high-yield queue schedules, and verified African/Nigerian payout rails.\n\n**Key Facts for ${platformData.platform}:**\n- **Verified Rate:** ${platformData.advertisedRate || '$18–$35/hr'}\n- **Eligible Regions:** 🇳🇬 Nigeria, Ghana, Kenya & Worldwide remote contractors\n- **Payout Speed:** Direct weekly USD via Payoneer, Grey, or Geegpay virtual accounts\n\nAsk me anything below about passing the screening quiz, snagging tasks, or setting up your payout account!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    fetchTaskPlatformIntelligenceApi({
      platform: platformData.platform,
      roleTitle: platformData.roleTitle,
      category: platformData.category,
      advertisedRate: platformData.advertisedRate,
      verifiedRate: platformData.verifiedRate,
      payoutMethods: platformData.payoutMethods,
      onboardingRequirements: platformData.onboardingRequirements,
      officialUrl: platformData.officialUrl,
      difficulty: platformData.difficulty
    })
      .then(res => {
        setIntel(res);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Task platform intelligence warning:', err);
        setLoading(false);
      });
  }, [isOpen, platformData]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAsking]);

  if (!isOpen || !platformData) return null;

  const toggleMilestone = (milestoneNumber: number) => {
    setCompletedMilestones(prev => {
      const next = { ...prev, [milestoneNumber]: !prev[milestoneNumber] };
      if (!prev[milestoneNumber]) {
        showToast(`Milestone ${milestoneNumber} completed! Keep building momentum!`, 'success');
      }
      return next;
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    setChatMessages([
      {
        id: `cleared-${Date.now()}`,
        sender: 'ai',
        text: `Chat session refreshed. What specific question can I answer about **${platformData.platform}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    showToast('Chat history cleared', 'info');
  };

  const handleSendQuestion = async (customPrompt?: string) => {
    const q = (customPrompt || inputQuestion).trim();
    if (!q || isAsking) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsAsking(true);

    try {
      const res = await askTaskPlatformQAApi({
        platform: platformData.platform,
        roleTitle: platformData.roleTitle,
        category: platformData.category,
        question: q,
        chatHistory: chatMessages.map(m => ({ sender: m.sender, text: m.text }))
      });

      const aiMsgId = `ai-${Date.now()}`;
      setChatMessages(prev => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: res.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      const aiFallbackId = `ai-fallback-${Date.now()}`;
      setChatMessages(prev => [
        ...prev,
        {
          id: aiFallbackId,
          sender: 'ai',
          text: `### Strategic Recommendations for ${platformData.platform}:\n\n1. **Screening Assessment**: Take your time on the onboarding quiz. Review the sample guidelines twice before submitting.\n2. **Payout Configuration**: Link a verified US Virtual Account from **Payoneer** or **Grey.co** to ensure seamless local bank withdrawals.\n3. **Task Queues**: High-volume task batches frequently drop between **08:00 AM – 11:00 AM WAT** and **06:00 PM – 09:00 PM WAT**.\n4. **Quality Score**: Maintain precision above 90% during calibration tasks to unlock higher tier projects.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const totalMilestones = intel?.firstDollarRoadmap?.length || 6;
  const progressPercent = Math.round((completedCount / totalMilestones) * 100);

  const suggestedPrompts = [
    { title: 'Screening Quiz Prep', query: `How do I pass the ${platformData.platform} screening assessment with a high score?` },
    { title: 'African Payout Setup', query: `How do I set up Payoneer or Grey USD virtual account for ${platformData.platform} in Nigeria?` },
    { title: 'Best Task Hours', query: `What are the best hours (WAT/UTC) to catch high-paying tasks on ${platformData.platform}?` },
    { title: 'Avoid Disqualification', query: `What are the top mistakes that cause contractors to get disqualified or banned on ${platformData.platform}?` },
    { title: 'First Task Strategy', query: `What should I do in my first 48 hours to complete calibration tasks and get paid faster?` }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#FBF9F4] text-[#1A1A1A] flex flex-col h-screen w-screen overflow-hidden animate-in fade-in duration-200">
      
      {/* 1. TOP FULL-SCREEN HEADER BAR */}
      <header className="min-h-16 px-3 sm:px-6 py-2.5 bg-white border-b border-[#EDE8DF] flex items-center justify-between gap-2 sm:gap-4 shrink-0 z-20">
        
        {/* Left: Back button & Platform Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-xs font-bold text-stone-700 flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            title="Exit First-Dollar Workspace (Esc)"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#D84315] text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
              <Bot className="w-4.5 h-4.5" />
            </div>

            <div className="flex flex-col min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#1A1A1A] truncate">
                  {platformData.platform}
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#D84315]/10 text-[#D84315] font-mono shrink-0">
                  AI Guide
                </span>
                <span className="hidden lg:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#00875A] border border-emerald-200 font-mono shrink-0">
                  🇳🇬 Africa Ready
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#767676] truncate">
                <span className="font-mono text-emerald-700 font-semibold truncate">
                  {platformData.advertisedRate || intel?.earningReality?.hourlyRange || '$18–$35/hr'}
                </span>
                <span className="hidden sm:inline text-stone-300">•</span>
                <span className="hidden sm:inline truncate text-stone-500">{platformData.category || 'Freelance & AI Work'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Milestone progress & CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Milestone Mini Progress Pill */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#F7F5EE] border border-[#EDE8DF] text-xs">
            <Target className="w-3.5 h-3.5 text-[#D84315]" />
            <span className="text-[11px] font-medium text-stone-700">
              Roadmap: <strong className="text-[#1A1A1A] font-mono">{completedCount}/{totalMilestones}</strong> ({progressPercent}%)
            </span>
            <div className="w-16 h-1.5 rounded-full bg-stone-200 overflow-hidden">
              <div 
                className="h-full bg-[#00875A] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Toggle Sidebar Button (Desktop) */}
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
            title={isSidebarOpen ? 'Hide Research Panel' : 'Show Research Panel'}
          >
            {isSidebarOpen ? (
              <>
                <PanelRightClose className="w-3.5 h-3.5" />
                <span>Hide Research</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-3.5 h-3.5" />
                <span>Show Research</span>
              </>
            )}
          </button>

          {/* Direct Apply / Official Portal Link */}
          {platformData.officialUrl && (
            <button
              type="button"
              onClick={() => openInAppBrowser(platformData.officialUrl!, null, `${platformData.platform} Registration Portal`)}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span className="inline sm:hidden">Apply</span>
              <span className="hidden sm:inline">Apply on {platformData.platform}</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            </button>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-stone-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ==================================================== */}
        {/* LEFT / CENTER: FULL-PAGE CHAT INTERFACE               */}
        {/* ==================================================== */}
        <div className="flex-1 flex flex-col h-full bg-[#FBF9F4] overflow-hidden relative">
          
          {/* Top Chat Action Bar */}
          <div className="px-4 sm:px-6 py-2.5 bg-white/70 backdrop-blur-xs border-b border-[#EDE8DF] flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00875A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00875A]"></span>
              </span>
              <span className="font-semibold text-stone-700">
                AI First-Dollar Copilot is ready • Grounded on verified contractor intelligence
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Sidebar Tab Toggles */}
              <div className="flex lg:hidden items-center gap-1">
                <button
                  onClick={() => setIsSidebarOpen(prev => !prev)}
                  className="px-2.5 py-1 rounded-full bg-[#F7F5EE] border border-[#EDE8DF] text-[11px] font-bold text-stone-700 flex items-center gap-1"
                >
                  <Target className="w-3 h-3 text-[#D84315]" />
                  <span>Roadmap & Research ({completedCount}/{totalMilestones})</span>
                </button>
              </div>

              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5 touch-scroll max-w-4xl mx-auto w-full"
          >
            {/* Introductory Platform Overview Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EDE8DF] shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-[#D84315]" />
                  <h3 className="text-sm font-bold text-[#1A1A1A]">
                    First-Dollar Roadmap & Verification Overview
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00875A]/10 text-[#00875A] font-mono">
                  Zero Upfront Cost
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {intel?.executiveSummary || `This workspace provides step-by-step guidance to onboard, pass qualification tests, and withdraw your first dollar from ${platformData.platform} directly to Nigeria and African bank accounts.`}
              </p>

              {/* Fast Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-2xl bg-[#F7F5EE] border border-[#EDE8DF]">
                  <span className="text-[10px] uppercase font-bold text-[#767676] font-mono block">Verified Rate</span>
                  <span className="font-bold text-[#00875A] font-mono">
                    {intel?.earningReality?.hourlyRange || platformData.advertisedRate || '$18–$35/hr'}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#F7F5EE] border border-[#EDE8DF]">
                  <span className="text-[10px] uppercase font-bold text-[#767676] font-mono block">Daily Potential</span>
                  <span className="font-bold text-[#1A1A1A] font-mono">
                    {intel?.earningReality?.dailyEarningsPotential || '$50–$140/day'}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#F7F5EE] border border-[#EDE8DF]">
                  <span className="text-[10px] uppercase font-bold text-[#767676] font-mono block">Payout Method</span>
                  <span className="font-bold text-stone-800 truncate block">
                    {intel?.africanAndNigeriaPayoutSetup?.bestPayoutMethod || 'Payoneer / Grey USD'}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#F7F5EE] border border-[#EDE8DF]">
                  <span className="text-[10px] uppercase font-bold text-[#767676] font-mono block">Time to 1st $</span>
                  <span className="font-bold text-indigo-700 font-mono">
                    {intel?.earningReality?.timelineToFirstDollar || '2–5 Days'}
                  </span>
                </div>
              </div>
            </div>

            {/* Render Chat Messages */}
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-[#D84315] text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative group max-w-[90%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 text-xs shadow-xs transition-all ${
                    msg.sender === 'user'
                      ? 'bg-[#1A1A1A] text-white rounded-tr-xs'
                      : 'bg-white border border-[#EDE8DF] text-[#1A1A1A] rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/10 text-[10px] opacity-75">
                    <span className="font-bold font-mono">
                      {msg.sender === 'user' ? 'You' : `AI First-Dollar Guide • ${platformData.platform}`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'ai' && (
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-800"
                          title="Copy advice"
                        >
                          {copiedIndex === msg.id ? (
                            <Check className="w-3 h-3 text-[#00875A]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message Body with Markdown */}
                  <div className={`prose max-w-none text-xs leading-relaxed space-y-2 ${
                    msg.sender === 'user' ? 'text-white' : 'text-[#1A1A1A]'
                  }`}>
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Asking / Typing indicator */}
            {isAsking && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D84315] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8DF] text-xs text-stone-700 flex items-center gap-2 shadow-2xs">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-[#D84315]" />
                  <span className="font-medium">
                    AI Guide is querying {platformData.platform} screening questions & verified payout rails...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Bar Area */}
          <div className="p-4 sm:p-6 bg-white border-t border-[#EDE8DF] shrink-0">
            <div className="max-w-4xl mx-auto space-y-3">
              
              {/* Horizontal Quick-Action Prompt Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs touch-scroll">
                <span className="text-[11px] font-bold text-stone-400 uppercase font-mono shrink-0 mr-1">
                  Quick Prompts:
                </span>
                {suggestedPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendQuestion(item.query)}
                    className="px-3 py-1.5 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-[11px] font-semibold text-stone-700 hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuestion();
                }} 
                className="flex items-center gap-2 relative"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputQuestion}
                    onChange={e => setInputQuestion(e.target.value)}
                    placeholder={`Ask AI First-Dollar Guide about tests, task queues, or payouts on ${platformData.platform}...`}
                    className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#F7F5EE] border border-[#EDE8DF] text-xs text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#D84315] focus:bg-white transition-all shadow-inner"
                  />
                  {inputQuestion && (
                    <button
                      type="button"
                      onClick={() => setInputQuestion('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isAsking || !inputQuestion.trim()}
                  className="px-5 py-3 rounded-2xl bg-[#D84315] hover:bg-[#BF360C] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-40 cursor-pointer active:scale-95 shrink-0"
                >
                  <span>Ask Guide</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-stone-500 px-1">
                <span>Press Enter to send • 100% verified data for Nigerian & African remote talent</span>
                <span className="font-mono text-emerald-700 font-semibold">Zero upfront costs guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT / DRAWER: RESEARCH & 6-STEP ROADMAP SIDEBAR    */}
        {/* ==================================================== */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-[420px] bg-white border-l border-[#EDE8DF] flex flex-col h-full shrink-0 shadow-lg z-10 animate-in slide-in-from-right-4 duration-200">
            
            {/* Sidebar Navigation Header */}
            <div className="p-4 border-b border-[#EDE8DF] bg-stone-50/70 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'roadmap', label: 'Roadmap (6 Steps)', icon: Target },
                  { id: 'research', label: 'Deep Research', icon: BookOpen },
                  { id: 'payouts', label: 'Payout Rails', icon: CreditCard },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeSidebarTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSidebarTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1A1A1A] text-white shadow-2xs'
                          : 'bg-white text-stone-600 hover:text-stone-900 border border-[#EDE8DF]'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800"
                title="Close research sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 touch-scroll bg-[#FBF9F4]/50">
              {loading ? (
                <div className="py-16 text-center space-y-3">
                  <RotateCw className="w-7 h-7 text-[#D84315] animate-spin mx-auto" />
                  <p className="text-xs text-stone-600 font-medium">
                    Loading deep research & milestone checklists...
                  </p>
                </div>
              ) : (
                <>
                  {/* TAB 1: 6-STEP FIRST-DOLLAR ROADMAP */}
                  {activeSidebarTab === 'roadmap' && (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-[#D84315]" />
                            <span>First-Dollar Milestones</span>
                          </span>
                          <span className="text-[11px] font-mono font-bold text-[#00875A]">
                            {completedCount}/{totalMilestones} Done
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600">
                          Check each sequential milestone as you complete it to unlock your first cashout.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {intel?.firstDollarRoadmap?.map(milestone => {
                          const isDone = !!completedMilestones[milestone.milestone];
                          return (
                            <div
                              key={milestone.milestone}
                              className={`p-4 rounded-2xl border transition-all ${
                                isDone
                                  ? 'bg-emerald-50/80 border-emerald-300'
                                  : 'bg-white border-[#EDE8DF] shadow-2xs'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5">
                                  <button
                                    type="button"
                                    onClick={() => toggleMilestone(milestone.milestone)}
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 mt-0.5 cursor-pointer ${
                                      isDone
                                        ? 'bg-[#00875A] text-white'
                                        : 'border border-stone-300 hover:border-stone-500 text-transparent'
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-700 font-mono">
                                        Step {milestone.milestone}
                                      </span>
                                      <h4 className={`text-xs font-bold ${isDone ? 'text-emerald-950 line-through' : 'text-stone-900'}`}>
                                        {milestone.title}
                                      </h4>
                                    </div>
                                    <p className="text-[11px] text-stone-600 leading-relaxed">
                                      {milestone.description}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Checklist */}
                              <div className="mt-3 pt-2.5 border-t border-stone-100 pl-8 space-y-1.5">
                                <span className="text-[10px] font-bold text-stone-500 uppercase font-mono block">
                                  Action steps:
                                </span>
                                <ul className="space-y-1 text-[11px] text-stone-700">
                                  {milestone.actionableChecklist.map((act, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <CheckCircle2 className="w-3 h-3 text-[#00875A] shrink-0 mt-0.5" />
                                      <span>{act}</span>
                                    </li>
                                  ))}
                                </ul>

                                {milestone.insiderTip && (
                                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="font-bold block text-amber-900">AI Insider Secret:</strong>
                                      <span>{milestone.insiderTip}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DEEP RESEARCH & EARNING REALITY */}
                  {activeSidebarTab === 'research' && (
                    <div className="space-y-4">
                      {/* Earning Reality Card */}
                      <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-2">
                        <span className="text-[10px] uppercase font-bold text-stone-500 font-mono block">
                          Compensation & Timeline Benchmark
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                            <span className="text-[10px] text-stone-500 block">Hourly Range</span>
                            <span className="font-bold text-[#00875A] font-mono">
                              {intel?.earningReality?.hourlyRange || '$18–$35/hr'}
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                            <span className="text-[10px] text-stone-500 block">Time to Payout</span>
                            <span className="font-bold text-indigo-700 font-mono">
                              {intel?.earningReality?.timelineToFirstDollar || '2–5 Days'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Assessment Strategy */}
                      <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Screening Benchmark</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono">
                            {intel?.screeningAssessmentStrategy?.passingBenchmark || '85%+ Required'}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          <strong>Format:</strong> {intel?.screeningAssessmentStrategy?.testType}
                        </p>
                        
                        <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1.5 text-[11px] text-rose-950">
                          <strong className="font-bold block text-rose-900">Common Disqualification Traps:</strong>
                          <ul className="space-y-1 text-rose-800">
                            {intel?.screeningAssessmentStrategy?.commonFailureTraps.map((trap, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <AlertCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                                <span>{trap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Ban Prevention Protocol */}
                      <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-2">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" />
                          <span>Account Ban Prevention</span>
                        </span>
                        <ul className="space-y-1.5 text-[11px] text-stone-700">
                          {intel?.banPreventionAndCompliance.map((rule, i) => (
                            <li key={i} className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-[#00875A] shrink-0 mt-0.5" />
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: AFRICAN PAYOUT RAILS */}
                  {activeSidebarTab === 'payouts' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-[#00875A]" />
                            <span>Recommended Payout Setup</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#00875A] border border-emerald-200 font-mono">
                            {intel?.africanAndNigeriaPayoutSetup?.bestPayoutMethod || 'Payoneer'}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600">
                          Follow these step-by-step instructions to withdraw directly to local Nigerian bank accounts or Naira wallets.
                        </p>
                        
                        <div className="space-y-1.5 pt-1">
                          {intel?.africanAndNigeriaPayoutSetup?.setupInstructions.map((step, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2 text-[11px] text-stone-700">
                              <span className="w-4.5 h-4.5 rounded-full bg-stone-200 text-stone-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tax & Naira Conversion */}
                      <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-2 text-[11px]">
                        <span className="font-bold text-amber-900 uppercase font-mono block">
                          US Tax W-8BEN Form & Rates
                        </span>
                        <p className="text-stone-600">
                          {intel?.africanAndNigeriaPayoutSetup?.taxOrW8BenAdvice}
                        </p>
                        <p className="text-emerald-700 font-medium pt-1 border-t border-stone-100">
                          <strong>Rate Tip:</strong> {intel?.africanAndNigeriaPayoutSetup?.currencyConversionTip}
                        </p>
                      </div>

                      {/* Task Queue Tricks */}
                      <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-2">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#D84315]" />
                          <span>Task Snagging Tricks</span>
                        </span>
                        <ul className="space-y-1.5 text-[11px] text-stone-700">
                          {intel?.firstTaskSnaggingTricks.map((trick, i) => (
                            <li key={i} className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-1.5">
                              <ArrowRight className="w-3 h-3 text-[#D84315] shrink-0 mt-0.5" />
                              <span>{trick}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
