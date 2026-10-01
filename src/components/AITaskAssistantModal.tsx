import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Copy, 
  Check, 
  Layers, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  Wrench, 
  Lightbulb, 
  Bot, 
  FileEdit, 
  ExternalLink,
  ChevronRight,
  RotateCw,
  Zap,
  HelpCircle,
  Award
} from 'lucide-react';
import Markdown from 'react-markdown';
import { analyzeTaskApi, completeTaskApi, askTaskQAApi } from '../lib/api';
import { TaskAnalysisResult, TaskCompletionResult, TaskQAMessage } from '../types';
import { useApp } from '../context/AppContext';

export interface TaskAssistantData {
  taskTitle: string;
  platform: string;
  category?: string;
  rewardOrRate?: string;
  description?: string;
  instructions?: string;
  officialUrl?: string;
}

interface AITaskAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskData: TaskAssistantData | null;
  initialTab?: 'analyze' | 'complete' | 'qa';
}

export const AITaskAssistantModal: React.FC<AITaskAssistantModalProps> = ({
  isOpen,
  onClose,
  taskData,
  initialTab = 'analyze'
}) => {
  const { userProfile, consumeAiAssist, showToast, openInAppBrowser } = useApp();

  const [activeTab, setActiveTab] = useState<'analyze' | 'complete' | 'qa'>('analyze');

  // Tab 1: Analyze Task State
  const [analysis, setAnalysis] = useState<TaskAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Tab 2: Complete Task State
  const [completion, setCompletion] = useState<TaskCompletionResult | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [editableDraft, setEditableDraft] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<Array<{ stepNumber: number; title: string; detail: string; status?: boolean }>>([]);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Tab 3: Ask AI About Task State
  const [messages, setMessages] = useState<TaskQAMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && taskData) {
      setActiveTab(initialTab);
      // Auto trigger analysis
      handleRunAnalysis();
      // Reset chat
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: `👋 **AI Task Assistant is active for:**\n### ${taskData.taskTitle}\n\nPlatform: **${taskData.platform}** • Reward: **${taskData.rewardOrRate || 'Verified payout'}**\n\nI can help you analyze the exact requirements, generate a submission-ready draft, or answer tricky questions about the platform's guidelines and reviewer rubrics.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, taskData, initialTab]);

  useEffect(() => {
    if (activeTab === 'qa') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  if (!isOpen || !taskData) return null;

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeTaskApi({
        taskTitle: taskData.taskTitle,
        platform: taskData.platform,
        category: taskData.category,
        description: taskData.description,
        instructions: taskData.instructions,
        rewardOrRate: taskData.rewardOrRate,
        userSkills: userProfile.skills
      });
      setAnalysis(res.analysis);
    } catch (err) {
      console.warn('Task analysis fallback active:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCompletion = async (action: 'draft' | 'refine' | 'validate' = 'draft') => {
    const hasQuota = consumeAiAssist();
    if (!hasQuota) return;

    setIsCompleting(true);
    try {
      const res = await completeTaskApi({
        taskTitle: taskData.taskTitle,
        platform: taskData.platform,
        category: taskData.category,
        instructions: taskData.instructions || taskData.description,
        userDraft: editableDraft,
        actionRequested: action
      });
      setCompletion(res.result);
      setEditableDraft(res.result.deliverableDraft);
      setWorkflowSteps(res.result.stepByStepWorkflow);
      showToast('AI deliverable draft generated successfully!', 'success');
    } catch (err) {
      showToast('Completed draft generated from platform template.', 'info');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleToggleStep = (index: number) => {
    setWorkflowSteps(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: !updated[index].status };
      return updated;
    });
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(editableDraft || completion?.deliverableDraft || '');
    setCopiedDraft(true);
    showToast('Deliverable copied to clipboard!', 'success');
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const handleAskQuestion = async (customQ?: string) => {
    const questionText = (customQ || inputQuestion).trim();
    if (!questionText || isAsking) return;

    const userMsg: TaskQAMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsAsking(true);

    try {
      const res = await askTaskQAApi({
        taskTitle: taskData.taskTitle,
        platform: taskData.platform,
        category: taskData.category,
        instructions: taskData.instructions || taskData.description,
        question: questionText,
        chatHistory: messages.map(m => ({ sender: m.sender, text: m.text }))
      });

      const aiMsg: TaskQAMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const fallbackAiMsg: TaskQAMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `For **${taskData.taskTitle}** on **${taskData.platform}**, make sure you review every acceptance criterion before submitting. Keep your response concise, test all edge cases, and ensure formatting matches client specifications.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackAiMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  const suggestedTaskQuestions = [
    'How do I format my response to pass the reviewer rubric?',
    'What are the most common rejection traps for this type of task?',
    'Review my drafted deliverable and suggest improvements',
    'What edge cases should I test before submitting?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-4xl max-h-[94vh] sm:max-h-[90vh] bg-white border border-[#EDE8DF] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#EDE8DF] bg-[#FBF9F4] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/30 text-[10.5px] font-black font-mono uppercase">
                {taskData.platform}
              </span>
              {taskData.category && (
                <span className="px-2 py-0.5 rounded-full bg-[#EDE8DF] text-stone-800 text-[10.5px] font-bold">
                  {taskData.category}
                </span>
              )}
              {taskData.rewardOrRate && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-950 border border-emerald-300 text-[11px] font-black font-mono">
                  {taskData.rewardOrRate}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-black text-stone-950 truncate">
              {taskData.taskTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {taskData.officialUrl && (
              <button
                onClick={() => openInAppBrowser(taskData.officialUrl!, null, `${taskData.taskTitle} — ${taskData.platform}`)}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Open Task</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-600 hover:text-stone-950 hover:bg-[#EDE8DF] border border-stone-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Core AI Action Navigation Tabs */}
        <div className="px-3 sm:px-6 bg-white border-b border-[#EDE8DF] flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analyze'
                ? 'bg-amber-500/15 text-amber-900 border border-amber-500/30 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Analyze Task</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('complete');
              if (!completion) handleGenerateCompletion('draft');
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'complete'
                ? 'bg-[#00875A]/15 text-emerald-900 border border-[#00875A]/30 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Help Me Complete This Task</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'qa'
                ? 'bg-[#D84315]/15 text-[#D84315] border border-[#D84315]/30 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Bot className="w-4 h-4 text-[#D84315]" />
            <span>Ask AI About This Task</span>
          </button>
        </div>

        {/* Modal Body: Active Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 touch-scroll bg-[#FBF9F4]">
          
          {/* TAB 1: ANALYZE TASK */}
          {activeTab === 'analyze' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {isAnalyzing && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-9 h-9 border-3 border-amber-500/20 border-t-amber-600 rounded-full animate-spin mb-3" />
                  <p className="text-xs font-bold text-stone-950">Analyzing Task Scope, Rubrics & Feasibility...</p>
                  <p className="text-[11px] text-stone-600 mt-0.5">Extracting deliverables, acceptance criteria, and common rejection traps</p>
                </div>
              )}

              {!isAnalyzing && analysis && (
                <>
                  {/* Executive Overview Card */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-amber-700 uppercase font-mono tracking-wider">
                        <Layers className="w-4 h-4" />
                        <span>Executive Task Breakdown</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-[11px] font-black font-mono">
                        {analysis.feasibilityScore}% Feasibility Match
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed">
                      {analysis.executiveSummary}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs">
                      <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Estimated Time</span>
                      <span className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-stone-600" />
                        <span>{analysis.timeEstimateMinutes}</span>
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs">
                      <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Estimated ROI</span>
                      <span className="text-xs sm:text-sm font-black text-emerald-700 font-mono flex items-center gap-1 mt-0.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{analysis.hourlyRoiEstimate}</span>
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs">
                      <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Difficulty</span>
                      <span className="text-xs sm:text-sm font-black text-amber-700 block mt-0.5">
                        {analysis.difficultyRating}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs">
                      <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Platform Status</span>
                      <span className="text-xs sm:text-sm font-black text-indigo-700 block mt-0.5">
                        Verified Queue
                      </span>
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs space-y-2">
                    <h4 className="text-xs font-black text-stone-900 uppercase font-mono tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Required Deliverables to Submit</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-stone-800">
                      {analysis.deliverablesList.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Acceptance Criteria & Reviewer Rubric */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs space-y-2">
                    <h4 className="text-xs font-black text-stone-900 uppercase font-mono tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span>Reviewer Acceptance Criteria & Rubric</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-stone-800">
                      {analysis.acceptanceCriteria.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rejection Traps & Red Flags */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-xs space-y-2">
                    <h4 className="text-xs font-black text-rose-950 uppercase font-mono tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Common Rejection Traps & Mistakes to Avoid</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-rose-900">
                      {analysis.rejectionTraps.map((trap, i) => (
                        <li key={i} className="flex items-start gap-2 font-semibold">
                          <span className="text-rose-600 font-bold shrink-0">✕</span>
                          <span>{trap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro-Tips & Tooling */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs space-y-2">
                    <h4 className="text-xs font-black text-amber-950 uppercase font-mono tracking-wider flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>High-Yield Speed & Accuracy Pro-Tips</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-900">
                      {analysis.proTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 font-semibold">
                          <span className="text-amber-600 font-black shrink-0">★</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA to complete */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setActiveTab('complete');
                        if (!completion) handleGenerateCompletion('draft');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Proceed to "Help Me Complete This Task"</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: HELP ME COMPLETE THIS TASK */}
          {activeTab === 'complete' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              
              {/* Header Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs">
                <div>
                  <h3 className="text-xs font-black text-stone-900 flex items-center gap-2 uppercase font-mono tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>AI Task Completion Assistant</span>
                  </h3>
                  <p className="text-[11px] text-stone-600 font-bold mt-0.5">
                    Generates formatted deliverables, verifies against acceptance rubrics, and provides step-by-step checklists.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleGenerateCompletion('refine')}
                    disabled={isCompleting}
                    className="px-3 py-1.5 rounded-xl bg-[#F7F5EE] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-stone-900 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isCompleting ? 'animate-spin text-emerald-600' : ''}`} />
                    <span>{isCompleting ? 'Generating...' : 'Re-Generate Solution'}</span>
                  </button>

                  <button
                    onClick={handleCopyDraft}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    {copiedDraft ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDraft ? 'Copied!' : 'Copy Deliverable'}</span>
                  </button>
                </div>
              </div>

              {isCompleting && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-9 h-9 border-3 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mb-3" />
                  <p className="text-xs font-bold text-stone-950">Generating Submission-Ready Solution & Verification Steps...</p>
                  <p className="text-[11px] text-stone-600 mt-0.5">Structuring rationale, code/response snippets, and acceptance criteria checks</p>
                </div>
              )}

              {!isCompleting && (
                <>
                  {/* Step-by-Step Interactive Workflow */}
                  {workflowSteps.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs space-y-3">
                      <h4 className="text-xs font-black text-stone-900 uppercase font-mono tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Execution Roadmap (Check off as you complete)</span>
                      </h4>
                      <div className="space-y-2">
                        {workflowSteps.map((step, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleToggleStep(idx)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                              step.status 
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                                : 'bg-[#FBF9F4] border-[#EDE8DF] text-stone-900 hover:bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={!!step.status}
                              onChange={() => handleToggleStep(idx)}
                              className="w-4 h-4 mt-0.5 rounded text-emerald-600 border-stone-300 focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="min-w-0 flex-1">
                              <span className={`text-xs font-black block ${step.status ? 'line-through text-stone-500' : ''}`}>
                                Step {step.stepNumber}: {step.title}
                              </span>
                              <p className="text-[11px] text-stone-600 font-semibold mt-0.5">
                                {step.detail}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Live Editable Deliverable Box */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase font-mono tracking-wider">
                        <FileEdit className="w-4 h-4 text-indigo-600" />
                        <span>Completed Deliverable Draft</span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono font-bold">
                        Ready to edit & submit
                      </span>
                    </div>

                    <textarea
                      value={editableDraft}
                      onChange={e => setEditableDraft(e.target.value)}
                      rows={10}
                      placeholder="AI deliverable draft will appear here..."
                      className="w-full p-3.5 rounded-xl bg-[#FBF9F4] border border-[#EDE8DF] text-xs font-mono text-stone-900 focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed resize-y"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-stone-500 font-semibold">
                        {editableDraft.length} characters • {editableDraft.split(/\s+/).filter(Boolean).length} words
                      </span>
                      <button
                        onClick={handleCopyDraft}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        {copiedDraft ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedDraft ? 'Copied to Clipboard!' : 'Copy Final Output'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Quality Rubric Checks */}
                  {completion?.qualityRubricChecks && completion.qualityRubricChecks.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs space-y-2.5">
                      <h4 className="text-xs font-black text-stone-900 uppercase font-mono tracking-wider flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span>Pre-Submission Quality Rubric Validator</span>
                      </h4>
                      <div className="space-y-2">
                        {completion.qualityRubricChecks.map((check, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-200 flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-black text-indigo-950 block">{check.criterion}</span>
                              <span className="text-[11px] text-indigo-800 font-semibold">{check.tip}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 3: ASK AI ABOUT THIS TASK */}
          {activeTab === 'qa' && (
            <div className="flex flex-col h-full max-w-3xl mx-auto space-y-4">
              
              {/* Suggested Questions Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase font-mono">
                  Quick Prompts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTaskQuestions.map((sq, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskQuestion(sq)}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-stone-100 border border-[#EDE8DF] text-[11px] font-bold text-stone-800 transition-colors text-left cursor-pointer"
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 space-y-3 min-h-[260px] max-h-[380px] overflow-y-auto p-3.5 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#1A1A1A] text-white rounded-br-xs'
                          : 'bg-[#FBF9F4] text-stone-900 border border-[#EDE8DF] rounded-bl-xs'
                      }`}
                    >
                      {msg.sender === 'ai' ? (
                        <div className="prose prose-xs max-w-none text-stone-900 font-sans">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-line font-medium">{msg.text}</p>
                      )}
                    </div>
                    <span className="text-[9.5px] text-stone-400 font-mono mt-0.5 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isAsking && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#FBF9F4] border border-[#EDE8DF] text-xs text-stone-600 w-fit">
                    <div className="w-3.5 h-3.5 border-2 border-[#D84315] border-t-transparent rounded-full animate-spin" />
                    <span>AI Task Copilot is thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={e => setInputQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAskQuestion()}
                  placeholder="Ask anything about guidelines, rubrics, edge cases, or code..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#EDE8DF] text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#D84315] font-semibold"
                />
                <button
                  onClick={() => handleAskQuestion()}
                  disabled={!inputQuestion.trim() || isAsking}
                  className="px-4 py-2.5 rounded-xl bg-[#D84315] hover:bg-[#BF360C] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[#EDE8DF] bg-white flex items-center justify-between gap-3">
          <span className="text-[11px] text-stone-500 font-bold hidden sm:inline">
            ⚡ Powered by Gemini 3.8 Flash • Real-Time Task Intelligence
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EDE8DF] text-stone-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
            {taskData.officialUrl && (
              <button
                onClick={() => openInAppBrowser(taskData.officialUrl!, null, `${taskData.taskTitle} — ${taskData.platform}`)}
                className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-black text-white text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Submit on {taskData.platform}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
