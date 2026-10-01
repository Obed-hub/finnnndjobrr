import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Sliders, 
  Star, 
  Trash2, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  Briefcase, 
  DollarSign, 
  Database, 
  ArrowRight, 
  AlertCircle,
  ExternalLink,
  Code2,
  Cpu,
  Server,
  Cloud,
  Check
} from 'lucide-react';
import { SyncedTechnologyItem } from '../types';

export const SettingsView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    setActiveTab, 
    runSkillsSync, 
    isSkillsSyncing, 
    skillsSyncProgress, 
    skillsSyncStatusText,
    toggleFrameworkPriority,
    addCustomTechnology,
    removeSyncedTechnology,
    updateSyncPriorityLevel,
    showToast,
    firebaseUser,
    loginWithGoogle,
    logout,
    isCloudSyncing,
    upgradeToPro
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'skills_sync' | 'career' | 'compensation' | 'cloud'>('skills_sync');
  
  // Custom tech input state
  const [newTechName, setNewTechName] = useState('');
  const [newTechCategory, setNewTechCategory] = useState<'framework' | 'language' | 'database' | 'tool' | 'cloud' | 'ai_ml'>('framework');
  
  // CV text state for direct editing
  const [isEditingCvText, setIsEditingCvText] = useState(false);
  const [cvTextDraft, setCvTextDraft] = useState(userProfile.cvText || '');
  
  // Target role draft state
  const [newRoleInput, setNewRoleInput] = useState('');

  // File upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>(userProfile.uploadedResumeName || userProfile.skillsSync?.scannedResumeName || '');
  const [uploadedBase64, setUploadedBase64] = useState<string | undefined>(userProfile.uploadedResumeBase64);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | undefined>(userProfile.uploadedResumeMimeType);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync draft states when user profile updates across account changes
  React.useEffect(() => {
    setCvTextDraft(userProfile.cvText || '');
    setUploadedFileName(userProfile.uploadedResumeName || userProfile.skillsSync?.scannedResumeName || '');
    setUploadedBase64(userProfile.uploadedResumeBase64);
    setUploadedMimeType(userProfile.uploadedResumeMimeType);
  }, [userProfile]);

  const skillsSync = userProfile.skillsSync;
  const currentPriority = skillsSync?.matchPriorityLevel || 'aggressive';
  const extractedTech = skillsSync?.extractedTechnologies || [];

  // Group extracted technologies by category
  const frameworks = extractedTech.filter(t => t.category === 'framework');
  const languages = extractedTech.filter(t => t.category === 'language');
  const databases = extractedTech.filter(t => t.category === 'database');
  const tools = extractedTech.filter(t => t.category === 'tool');
  const cloud = extractedTech.filter(t => t.category === 'cloud');
  const aiMl = extractedTech.filter(t => t.category === 'ai_ml');

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setUploadedFileName(file.name);

    const reader = new FileReader();
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCvTextDraft(text);
        updateUserProfile({ cvText: text, uploadedResumeName: file.name });
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setUploadedBase64(base64);
        setUploadedMimeType(file.type);
        updateUserProfile({
          uploadedResumeName: file.name,
          uploadedResumeBase64: base64,
          uploadedResumeMimeType: file.type,
          uploadedResumeDate: new Date().toISOString()
        });
      };
      reader.readAsDataURL(file);
    }

    showToast(`Uploaded ${file.name}. Ready to scan!`, 'success');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleTriggerSync = async () => {
    await runSkillsSync({
      resumeText: cvTextDraft || userProfile.cvText,
      fileName: uploadedFileName || userProfile.uploadedResumeName,
      base64: uploadedBase64 || userProfile.uploadedResumeBase64,
      mimeType: uploadedMimeType || userProfile.uploadedResumeMimeType,
      priority: currentPriority
    });
  };

  const handleAddCustomTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim()) return;
    addCustomTechnology(newTechName.trim(), newTechCategory);
    setNewTechName('');
  };

  const handleAddTargetRole = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newRoleInput.trim();
    if (!trimmed) return;
    const currentRoles = userProfile.targetRoles || [];
    if (!currentRoles.includes(trimmed)) {
      updateUserProfile({ targetRoles: [...currentRoles, trimmed] });
      setNewRoleInput('');
    }
  };

  const handleRemoveTargetRole = (roleToRemove: string) => {
    const currentRoles = userProfile.targetRoles || [];
    updateUserProfile({ targetRoles: currentRoles.filter(r => r !== roleToRemove) });
  };

  const handleSaveCvText = () => {
    updateUserProfile({ cvText: cvTextDraft });
    setIsEditingCvText(false);
    showToast('Saved updated CV text. Click "Scan & Sync Resume Skills" to apply changes.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] pb-24 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EDE8DF] text-[#706E6B] border border-[#DDD6C9]">
                  Candidate Control Center
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Skills Sync 2.0
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#1A1A1A]">
                Settings & Skills Intelligence
              </h1>
              <p className="text-sm text-[#706E6B] mt-1 max-w-2xl">
                Calibrate the 'For You' matching algorithm by scanning your resume to prioritize roles requiring your exact technologies, frameworks, and tools.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                id="btn-goto-foryou-feed"
                onClick={() => setActiveTab('for_you')}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#DDD6C9] hover:border-[#D84315] text-[#1A1A1A] text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D84315]" />
                <span>Go to 'For You' Feed</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#706E6B]" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-[#DDD6C9] overflow-x-auto pb-px scrollbar-none">
            <button
              id="tab-btn-skills-sync"
              onClick={() => setActiveSubTab('skills_sync')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeSubTab === 'skills_sync'
                  ? 'border-[#D84315] text-[#D84315] bg-[#D84315]/5'
                  : 'border-transparent text-[#706E6B] hover:text-[#1A1A1A] hover:bg-[#EDE8DF]/40'
              }`}
            >
              <Zap className="w-4 h-4 text-[#D84315]" />
              <span>Skills Sync & Frameworks</span>
              {extractedTech.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D84315] text-white">
                  {extractedTech.length}
                </span>
              )}
            </button>

            <button
              id="tab-btn-career"
              onClick={() => setActiveSubTab('career')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeSubTab === 'career'
                  ? 'border-[#D84315] text-[#D84315] bg-[#D84315]/5'
                  : 'border-transparent text-[#706E6B] hover:text-[#1A1A1A] hover:bg-[#EDE8DF]/40'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Target Roles & Experience</span>
            </button>

            <button
              id="tab-btn-compensation"
              onClick={() => setActiveSubTab('compensation')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeSubTab === 'compensation'
                  ? 'border-[#D84315] text-[#D84315] bg-[#D84315]/5'
                  : 'border-transparent text-[#706E6B] hover:text-[#1A1A1A] hover:bg-[#EDE8DF]/40'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Compensation & Payouts</span>
            </button>

            <button
              id="tab-btn-cloud"
              onClick={() => setActiveSubTab('cloud')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeSubTab === 'cloud'
                  ? 'border-[#D84315] text-[#D84315] bg-[#D84315]/5'
                  : 'border-transparent text-[#706E6B] hover:text-[#1A1A1A] hover:bg-[#EDE8DF]/40'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Cloud DB & Subscription</span>
              {userProfile.subscriptionPlan === 'pro' && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                  PRO
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: SKILLS SYNC & FRAMEWORKS */}
        {activeSubTab === 'skills_sync' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top Scanning Hero Card */}
            <div className="bg-white border border-[#DDD6C9] rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                {/* Left: Status & Current Resume Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Skills Sync Active
                    </span>
                    {skillsSync?.lastSyncedAt && (
                      <span className="text-xs text-[#706E6B]">
                        Last synchronized: {new Date(skillsSync.lastSyncedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D84315]/10 border border-[#D84315]/20 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#D84315]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                        {uploadedFileName || skillsSync?.scannedResumeName || userProfile.uploadedResumeName || 'Obed_Asekhamen_Data_Dev_CV_2026.pdf'}
                      </h3>
                      <p className="text-xs text-[#706E6B] mt-0.5">
                        Detected Core Role: <span className="font-semibold text-[#1A1A1A]">{skillsSync?.detectedCoreRole || 'Junior Data Analyst & AI Prompt Evaluator'}</span> • {skillsSync?.detectedSeniority || 'Junior Level (0-1 Yrs)'}
                      </p>
                    </div>
                  </div>

                  {skillsSync?.syncSummary && (
                    <div className="p-3 bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl text-xs text-[#706E6B] leading-relaxed">
                      <span className="font-semibold text-[#1A1A1A]">AI Scanner Digest: </span>
                      {skillsSync.syncSummary}
                    </div>
                  )}
                </div>

                {/* Right: Scan Action & Live Matching Stats */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[280px]">
                  
                  {/* Live matched count badge */}
                  <div className="p-3.5 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-xl text-white shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-300 font-medium">Synced Job Impact</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D84315] text-white">
                        Live Ingest
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white font-mono">
                        {skillsSync?.syncedJobsMatchCount || 24}
                      </span>
                      <span className="text-xs text-neutral-300">
                        Live Remote Jobs matching your exact stack
                      </span>
                    </div>
                  </div>

                  {/* Primary Trigger Button */}
                  <button
                    id="btn-trigger-skills-sync"
                    onClick={handleTriggerSync}
                    disabled={isSkillsSyncing}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D84315] to-[#BF360C] hover:from-[#BF360C] hover:to-[#A32D08] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSkillsSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Scanning Resume Skills...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>Scan & Sync Resume Skills</span>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Animated Progress Indicator when Syncing */}
              {isSkillsSyncing && (
                <div className="mt-6 pt-4 border-t border-[#DDD6C9] animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1A1A1A] mb-2">
                    <span className="flex items-center gap-2 text-[#D84315]">
                      <span className="w-2 h-2 rounded-full bg-[#D84315] animate-ping"></span>
                      {skillsSyncStatusText || 'Extracting technical tokens & frameworks...'}
                    </span>
                    <span className="font-mono">{skillsSyncProgress}%</span>
                  </div>
                  <div className="w-full bg-[#EDE8DF] h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#D84315] to-[#00875A] h-full rounded-full transition-all duration-300"
                      style={{ width: `${skillsSyncProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Resume Upload & CV Text Source Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Drag & Drop Upload Zone */}
              <div className="lg:col-span-5 bg-white border border-[#DDD6C9] rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-1 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#D84315]" />
                  Upload New Resume (PDF / DOCX / TXT)
                </h3>
                <p className="text-xs text-[#706E6B] mb-4">
                  Upload an updated CV to automatically extract fresh frameworks and update job matching.
                </p>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-[#D84315] bg-[#D84315]/5' 
                      : 'border-[#DDD6C9] hover:border-[#D84315] hover:bg-[#FDFBF7]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-full bg-[#EDE8DF] flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-5 h-5 text-[#706E6B]" />
                  </div>
                  <p className="text-xs font-bold text-[#1A1A1A]">
                    Click to browse or drag & drop resume file
                  </p>
                  <p className="text-[11px] text-[#706E6B] mt-1">
                    Supports PDF, DOCX, TXT up to 10MB
                  </p>
                </div>

                {uploadedFileName && (
                  <div className="mt-3 p-2.5 bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-[#1A1A1A] truncate">{uploadedFileName}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerSync();
                      }}
                      className="px-2.5 py-1 bg-[#D84315] text-white rounded-lg text-[11px] font-bold hover:bg-[#BF360C] shrink-0"
                    >
                      Scan Now
                    </button>
                  </div>
                )}
              </div>

              {/* CV Text Area / Fallback Editor */}
              <div className="lg:col-span-7 bg-white border border-[#DDD6C9] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#D84315]" />
                      Resume Plain Text & Technical Projects
                    </h3>
                    <button
                      onClick={() => setIsEditingCvText(!isEditingCvText)}
                      className="text-xs font-bold text-[#D84315] hover:underline"
                    >
                      {isEditingCvText ? 'Cancel' : 'Edit Text'}
                    </button>
                  </div>
                  <p className="text-xs text-[#706E6B] mb-3">
                    The skills extraction engine reads this raw project text to cross-reference technologies against live job postings.
                  </p>

                  {isEditingCvText ? (
                    <div>
                      <textarea
                        value={cvTextDraft}
                        onChange={(e) => setCvTextDraft(e.target.value)}
                        rows={8}
                        className="w-full text-xs font-mono p-3 bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D84315] text-[#1A1A1A]"
                        placeholder="Paste your CV text, project descriptions, or tech stack here..."
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={handleSaveCvText}
                          className="px-4 py-1.5 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold hover:bg-black"
                        >
                          Save CV Text
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl p-3 max-h-40 overflow-y-auto text-xs text-[#706E6B] font-mono leading-relaxed">
                      {userProfile.cvText || 'No CV text entered yet. Click "Edit Text" or upload a resume to populate.'}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#DDD6C9] flex items-center justify-between text-xs text-[#706E6B]">
                  <span>Candidate: <strong className="text-[#1A1A1A]">{userProfile.name}</strong></span>
                  <span>Target Roles: <strong className="text-[#1A1A1A]">{(userProfile.targetRoles || []).join(', ')}</strong></span>
                </div>
              </div>
            </div>

            {/* Algorithm Matching Strictness Controls */}
            <div className="bg-white border border-[#DDD6C9] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="w-5 h-5 text-[#D84315]" />
                <h3 className="text-base font-bold text-[#1A1A1A]">
                  'For You' Matching Strictness & Priority Multiplier
                </h3>
              </div>
              <p className="text-xs text-[#706E6B] max-w-3xl mb-5">
                Control how aggressively the 'For You' algorithm boosts jobs requiring your scanned frameworks.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Standard */}
                <div
                  id="priority-card-standard"
                  onClick={() => updateSyncPriorityLevel('standard')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    currentPriority === 'standard'
                      ? 'border-[#D84315] bg-[#D84315]/5 shadow-sm'
                      : 'border-[#DDD6C9] hover:border-[#DDD6C9]/80 bg-[#FDFBF7]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A]">Standard Fit</span>
                    {currentPriority === 'standard' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D84315]"></span>
                    )}
                  </div>
                  <p className="text-xs text-[#706E6B] leading-relaxed">
                    Balances framework matches (+9 pts) with general role title and timezone eligibility. Best for broad exploration.
                  </p>
                  <div className="mt-3 text-[11px] font-semibold text-[#706E6B]">
                    Multiplier: 1.2x weight
                  </div>
                </div>

                {/* Aggressive (Recommended) */}
                <div
                  id="priority-card-aggressive"
                  onClick={() => updateSyncPriorityLevel('aggressive')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                    currentPriority === 'aggressive'
                      ? 'border-[#D84315] bg-[#D84315]/5 shadow-sm ring-2 ring-[#D84315]/20'
                      : 'border-[#DDD6C9] hover:border-[#DDD6C9]/80 bg-[#FDFBF7]'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D84315] text-white">
                    Recommended
                  </span>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#D84315]" />
                      Aggressive Framework Boost
                    </span>
                    {currentPriority === 'aggressive' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D84315]"></span>
                    )}
                  </div>
                  <p className="text-xs text-[#706E6B] leading-relaxed">
                    Strongly boosts positions (+14 to +18 pts) requiring your exact frameworks (e.g. React, SQL, Python).
                  </p>
                  <div className="mt-3 text-[11px] font-semibold text-[#D84315]">
                    Multiplier: 1.8x – 2.0x weight
                  </div>
                </div>

                {/* Strict */}
                <div
                  id="priority-card-strict"
                  onClick={() => updateSyncPriorityLevel('strict')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    currentPriority === 'strict'
                      ? 'border-[#D84315] bg-[#D84315]/5 shadow-sm'
                      : 'border-[#DDD6C9] hover:border-[#DDD6C9]/80 bg-[#FDFBF7]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A]">Strict Stack Match</span>
                    {currentPriority === 'strict' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D84315]"></span>
                    )}
                  </div>
                  <p className="text-xs text-[#706E6B] leading-relaxed">
                    Exclusively prioritizes jobs requiring your core stack (+22 pts). Slightly penalizes jobs with 0 framework overlap.
                  </p>
                  <div className="mt-3 text-[11px] font-semibold text-[#706E6B]">
                    Multiplier: 2.5x weight
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Technologies & Frameworks Matrix */}
            <div className="bg-white border border-[#DDD6C9] rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#D84315]" />
                    <h3 className="text-base font-bold text-[#1A1A1A]">
                      Synced Technology & Framework Matrix
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE8DF] text-[#1A1A1A]">
                      {extractedTech.length} Active
                    </span>
                  </div>
                  <p className="text-xs text-[#706E6B] mt-1">
                    Click the <Star className="w-3 h-3 inline text-amber-500 fill-amber-500" /> star icon on any technology to apply a 2x Priority Multiplier in your 'For You' feed.
                  </p>
                </div>

                {/* Add Custom Tech Bar */}
                <form onSubmit={handleAddCustomTech} className="flex items-center gap-2">
                  <select
                    value={newTechCategory}
                    onChange={(e: any) => setNewTechCategory(e.target.value)}
                    className="text-xs bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl px-2.5 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-[#D84315]"
                  >
                    <option value="framework">Framework</option>
                    <option value="language">Language</option>
                    <option value="database">Database</option>
                    <option value="tool">Tool / BI</option>
                    <option value="cloud">Cloud / DevOps</option>
                    <option value="ai_ml">AI / ML</option>
                  </select>
                  <input
                    type="text"
                    value={newTechName}
                    onChange={(e) => setNewTechName(e.target.value)}
                    placeholder="e.g. Next.js, FastAPI, Power BI"
                    className="text-xs bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl px-3 py-2 w-44 focus:outline-none focus:ring-1 focus:ring-[#D84315]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Technologies Grid by Category */}
              <div className="space-y-6">
                
                {/* 1. Frameworks & UI Libraries */}
                {frameworks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-[#706E6B]">
                      <Code2 className="w-3.5 h-3.5 text-[#D84315]" />
                      <span>Frameworks & Software Libraries ({frameworks.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {frameworks.map((item) => (
                        <TechChip
                          key={item.name}
                          item={item}
                          onTogglePriority={() => toggleFrameworkPriority(item.name)}
                          onRemove={() => removeSyncedTechnology(item.name)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Languages */}
                {languages.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-[#706E6B]">
                      <Cpu className="w-3.5 h-3.5 text-blue-600" />
                      <span>Programming Languages ({languages.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((item) => (
                        <TechChip
                          key={item.name}
                          item={item}
                          onTogglePriority={() => toggleFrameworkPriority(item.name)}
                          onRemove={() => removeSyncedTechnology(item.name)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Databases */}
                {databases.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-[#706E6B]">
                      <Database className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Databases & Data Warehousing ({databases.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {databases.map((item) => (
                        <TechChip
                          key={item.name}
                          item={item}
                          onTogglePriority={() => toggleFrameworkPriority(item.name)}
                          onRemove={() => removeSyncedTechnology(item.name)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Tools & BI */}
                {tools.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-[#706E6B]">
                      <Sliders className="w-3.5 h-3.5 text-purple-600" />
                      <span>Developer Tools, BI & Analytics ({tools.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tools.map((item) => (
                        <TechChip
                          key={item.name}
                          item={item}
                          onTogglePriority={() => toggleFrameworkPriority(item.name)}
                          onRemove={() => removeSyncedTechnology(item.name)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Cloud & DevOps */}
                {cloud.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-[#706E6B]">
                      <Cloud className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Cloud & DevOps ({cloud.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cloud.map((item) => (
                        <TechChip
                          key={item.name}
                          item={item}
                          onTogglePriority={() => toggleFrameworkPriority(item.name)}
                          onRemove={() => removeSyncedTechnology(item.name)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. AI & Prompt */}
                {aiMl.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-[#706E6B]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>AI Training, RLHF & Prompt Engineering ({aiMl.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {aiMl.map((item) => (
                        <TechChip
                          key={item.name}
                          item={item}
                          onTogglePriority={() => toggleFrameworkPriority(item.name)}
                          onRemove={() => removeSyncedTechnology(item.name)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Callout Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Ready to see your customized remote job matches?
                </h4>
                <p className="text-xs text-neutral-300 max-w-xl">
                  Your synced frameworks and technologies are actively ranking {skillsSync?.syncedJobsMatchCount || 24} live remote listings.
                </p>
              </div>

              <button
                id="btn-view-foryou-bottom"
                onClick={() => setActiveTab('for_you')}
                className="px-6 py-3 rounded-xl bg-[#D84315] hover:bg-[#BF360C] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <span>View My Personalized 'For You' Feed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: CAREER & TARGET ROLES */}
        {activeSubTab === 'career' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-[#DDD6C9] rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#1A1A1A] mb-1">
                Target Roles & Job Titles
              </h3>
              <p className="text-xs text-[#706E6B] mb-5">
                The job recommendation engine indexes these titles to match with employer openings and ATS keyword profiles.
              </p>

              {/* Target Roles Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(userProfile.targetRoles || []).map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDE8DF] text-xs font-bold text-[#1A1A1A] border border-[#DDD6C9]"
                  >
                    <span>{role}</span>
                    <button
                      onClick={() => handleRemoveTargetRole(role)}
                      className="text-[#706E6B] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Target Role */}
              <form onSubmit={handleAddTargetRole} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={newRoleInput}
                  onChange={(e) => setNewRoleInput(e.target.value)}
                  placeholder="e.g. Junior Data Engineer, Prompt Specialist"
                  className="flex-1 text-xs bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#D84315]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D84315] hover:bg-[#BF360C] text-white rounded-xl text-xs font-bold"
                >
                  Add Role
                </button>
              </form>
            </div>

            {/* Experience & Career Track */}
            <div className="bg-white border border-[#DDD6C9] rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#1A1A1A] mb-4">
                Experience Level & Primary Career Track
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-2">
                    Experience Level
                  </label>
                  <select
                    value={userProfile.experienceLevel}
                    onChange={(e) => updateUserProfile({ experienceLevel: e.target.value as any })}
                    className="w-full text-xs bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl p-3 font-medium focus:outline-none focus:ring-1 focus:ring-[#D84315]"
                  >
                    <option value="no_experience">No Formal Experience / Student</option>
                    <option value="0_1_years">0 – 1 Years (Junior / Entry-Level)</option>
                    <option value="1_2_years">1 – 2 Years (Associate / Mid-Junior)</option>
                    <option value="2_plus_years">2+ Years (Mid-Level Developer / Analyst)</option>
                    <option value="senior">3+ Years (Senior Specialist / Lead)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-2">
                    Primary Career Track
                  </label>
                  <select
                    value={userProfile.careerTrack || 'Data & Analytics'}
                    onChange={(e) => updateUserProfile({ careerTrack: e.target.value })}
                    className="w-full text-xs bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl p-3 font-medium focus:outline-none focus:ring-1 focus:ring-[#D84315]"
                  >
                    <option value="Data & Analytics">Data & Analytics (SQL, Python, BI)</option>
                    <option value="Software Engineering">Software Engineering (React, Node, Full-Stack)</option>
                    <option value="AI Training & RLHF">AI Training & RLHF (Prompting, Benchmarking)</option>
                    <option value="Product & Design">Product & UI/UX Design (Figma)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPENSATION & PAYOUTS */}
        {activeSubTab === 'compensation' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-[#DDD6C9] rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#1A1A1A] mb-1">
                Target Compensation & Currency
              </h3>
              <p className="text-xs text-[#706E6B] mb-5">
                Findjobber prioritizes roles meeting or exceeding your target monthly contractor rate.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-2">
                    Minimum Preferred Monthly Salary (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs font-bold text-[#706E6B]">$</span>
                    <input
                      type="number"
                      value={userProfile.preferredSalaryMin}
                      onChange={(e) => updateUserProfile({ preferredSalaryMin: parseInt(e.target.value, 10) || 0 })}
                      className="w-full text-xs bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl pl-7 pr-3 py-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-[#D84315]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-2">
                    Currency Preference
                  </label>
                  <select
                    value={userProfile.preferredCurrency}
                    onChange={(e) => updateUserProfile({ preferredCurrency: e.target.value })}
                    className="w-full text-xs bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl p-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-[#D84315]"
                  >
                    <option value="USD">USD ($ - US Dollars)</option>
                    <option value="EUR">EUR (€ - Euros)</option>
                    <option value="GBP">GBP (£ - British Pounds)</option>
                    <option value="NGN">NGN (₦ - Nigerian Naira)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payout Compatibility */}
            <div className="bg-white border border-[#DDD6C9] rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#1A1A1A] mb-1">
                Supported Payout Rails (Direct to Africa / Nigeria)
              </h3>
              <p className="text-xs text-[#706E6B] mb-4">
                We verify employers support these contractor payout methods without foreign tax friction:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {['Deel', 'Payoneer', 'Wise', 'Direct USD Wire', 'Grey / Geegpay'].map((rail) => (
                  <div key={rail} className="p-3 bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl text-center">
                    <span className="text-xs font-bold text-[#1A1A1A]">{rail}</span>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Verified Ready</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CLOUD DB & SUBSCRIPTION */}
        {activeSubTab === 'cloud' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Cloud Firestore Status Card */}
            <div className="bg-white border border-[#DDD6C9] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    Cloud Database Sync & Persistence
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Google Cloud Firestore
                </span>
              </div>

              <p className="text-xs text-[#706E6B] mb-4 leading-relaxed">
                Your profile, synced frameworks, applications, and saved bookmarks are persisted in Google Cloud Firestore:
                <br />
                <code className="text-[11px] font-mono bg-[#EDE8DF] px-2 py-0.5 rounded text-[#1A1A1A]">
                  ai-studio-findjobberprorem-8126c945-6428-4c7e-b06c-3421703a3872
                </code>
              </p>

              <div className="p-4 bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A]">
                    {firebaseUser ? `Signed in as ${firebaseUser.email}` : 'Guest Session (Local Storage)'}
                  </p>
                  <p className="text-[11px] text-[#706E6B]">
                    Automatic bidirectional sync with Firestore real-time collections.
                  </p>
                </div>

                {!firebaseUser ? (
                  <button
                    onClick={loginWithGoogle}
                    disabled={isCloudSyncing}
                    className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-xs font-bold shrink-0"
                  >
                    Connect Google Account
                  </button>
                ) : (
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-white border border-[#DDD6C9] hover:bg-rose-50 hover:text-rose-600 text-xs font-bold rounded-xl shrink-0"
                  >
                    Disconnect Account
                  </button>
                )}
              </div>
            </div>

            {/* Plan Card */}
            <div className="bg-white border border-[#DDD6C9] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#1A1A1A]">
                  Findjobber Plan Status
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  userProfile.subscriptionPlan === 'pro' 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : 'bg-[#EDE8DF] text-[#1A1A1A]'
                }`}>
                  {userProfile.subscriptionPlan === 'pro' ? '★ PRO ACTIVE' : 'FREE PLAN'}
                </span>
              </div>

              <div className="p-4 bg-[#FDFBF7] border border-[#DDD6C9] rounded-xl mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1A1A1A] mb-1">
                  <span>AI Assists Remaining this Month:</span>
                  <span className="font-mono font-bold">
                    {userProfile.subscriptionPlan === 'pro' ? 'Unlimited' : `${userProfile.aiAssistsRemaining} / ${userProfile.aiAssistsLimit}`}
                  </span>
                </div>
                <div className="w-full bg-[#EDE8DF] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#D84315] h-full rounded-full"
                    style={{ width: `${userProfile.subscriptionPlan === 'pro' ? 100 : (userProfile.aiAssistsRemaining / userProfile.aiAssistsLimit) * 100}%` }}
                  ></div>
                </div>
              </div>

              {userProfile.subscriptionPlan !== 'pro' && (
                <button
                  onClick={upgradeToPro}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Upgrade to Findjobber PRO (Unlimited Assists & Ingest)</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Sub-component for individual Technology Chips in the Matrix
const TechChip: React.FC<{
  item: SyncedTechnologyItem;
  onTogglePriority: () => void;
  onRemove: () => void;
}> = ({ item, onTogglePriority, onRemove }) => {
  const isPriority = item.isPriority;

  return (
    <div
      className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
        isPriority
          ? 'bg-[#1A1A1A] text-white border-black shadow-sm'
          : 'bg-[#FDFBF7] text-[#1A1A1A] border-[#DDD6C9] hover:border-[#D84315]'
      }`}
    >
      {/* Priority Star Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePriority();
        }}
        title={isPriority ? 'Priority 2x multiplier active. Click to unboost.' : 'Click to apply 2x Priority Multiplier in For You feed.'}
        className="text-[#706E6B] hover:text-amber-400 transition-colors"
      >
        <Star
          className={`w-3.5 h-3.5 ${
            isPriority 
              ? 'text-amber-400 fill-amber-400' 
              : 'text-[#706E6B] hover:text-amber-500'
          }`}
        />
      </button>

      <span className="font-bold">{item.name}</span>

      {isPriority && (
        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#D84315] text-white">
          2x Boost
        </span>
      )}

      {item.yearsOrProficiency && !isPriority && (
        <span className="text-[10px] text-[#706E6B] hidden sm:inline">
          {item.yearsOrProficiency}
        </span>
      )}

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        title="Remove technology from matching matrix"
        className="opacity-40 group-hover:opacity-100 hover:text-rose-500 transition-opacity ml-0.5"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
};
