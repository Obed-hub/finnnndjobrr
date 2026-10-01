import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Building2, 
  Bot, 
  Zap, 
  GraduationCap, 
  FileText, 
  TrendingUp, 
  Bookmark, 
  BellRing, 
  Globe, 
  Layers, 
  HelpCircle, 
  Activity, 
  Crown, 
  Settings, 
  X, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  User, 
  UserCheck, 
  Database, 
  LogOut, 
  CheckCircle2, 
  DollarSign, 
  Calculator, 
  ArrowRight,
  ShieldCheck,
  Code2,
  Server,
  Palette,
  Briefcase,
  Plus,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REMOTE_CATEGORIES } from '../data/categories';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    userProfile, 
    firebaseUser, 
    isCloudSyncing,
    loginWithGoogle,
    logout,
    savedJobIds, 
    watchedCompanyIds, 
    companyNotifications,
    setIsCommandPaletteOpen,
    setIsOnboardingOpen,
    setIsUpgradeModalOpen,
    openPostJobModal,
    openEmailAlertModal,
    openOpenTrainResearchModal,
    openMicro1ResearchModal,
    setSearchFilters,
    switchPlan
  } = useApp();

  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');

  const isPro = userProfile.subscriptionPlan === 'pro';
  const unreadNotifs = companyNotifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  const handleCategoryClick = (categoryName: string, query?: string) => {
    setSearchFilters(prev => ({
      ...prev,
      category: categoryName,
      keyword: query || ''
    }));
    setActiveTab('discover');
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sidebarSearch.trim()) {
      setSearchFilters(prev => ({
        ...prev,
        keyword: sidebarSearch.trim(),
        category: 'all'
      }));
      setActiveTab('discover');
      onClose();
    }
  };

  // Main Nav Links
  const primaryLinks = [
    { id: 'landing', label: 'Overview & Landing', icon: Globe, badge: 'Home' },
    { id: 'discover', label: 'Discover Feed', icon: Compass, count: '110+' },
    { id: 'earn', label: 'Earn Platforms & AI Guides', icon: DollarSign, isNew: true, highlight: true },
    { id: 'aiwork', label: 'AI Work & RLHF', icon: Bot },
    { id: 'bounties', label: 'Web3 & Bounties', icon: Zap },
    { id: 'beginner', label: 'Beginner & Junior Hub', icon: GraduationCap },
    { id: 'saved', label: 'Saved Bookmarks', icon: Bookmark, count: savedJobIds.length },
  ];

  // AI & Career Intelligence Tools
  const toolLinks = [
    { id: 'resume', label: 'Resume AI Reshaper', icon: FileText },
    { id: 'roadmap', label: '90-Day Career Roadmap', icon: TrendingUp },
    { id: 'settings', label: 'Skills Sync 2.0 & Settings', icon: Zap, badge: 'Sync' },
    { id: 'trends', label: 'Market Intelligence & Salaries', icon: TrendingUp },
    { id: 'playbook', label: 'Remote Career Playbook', icon: HelpCircle },
    { id: 'connectors', label: 'Ingestion Health & Feeds', icon: Activity },
    { id: 'pricing', label: 'Post a Job / Pricing', icon: Crown },
    { id: 'admin', label: 'Admin Matrix', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Application Navigation Sidebar">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Sidebar Drawer */}
      <aside 
        id="app-navigation-sidebar"
        className="relative w-84 sm:w-96 max-w-[88vw] h-full bg-white border-r border-[#EDE8DF] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250 select-none overflow-hidden"
      >
        
        {/* 1. Header Bar with Brand & Close Button */}
        <div className="p-4 border-b border-[#EDE8DF] bg-[#FBF9F4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {/* remotejobs.io Logo */}
            <div className="w-8 h-8 rounded-xl bg-[#0B5CFF] flex items-center justify-center text-white shadow-xs shrink-0 font-black text-sm">
              rj
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-[#1A1A1A]">
                  remotejobs<span className="text-[#0B5CFF]">.io</span>
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-black uppercase tracking-wider rounded-md bg-emerald-600 text-white font-mono">
                  FREE ACCESS
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium">
                Verified Remote Jobs & Workspaces
              </span>
            </div>
          </div>

          <button
            id="close-sidebar-button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-[#1A1A1A] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close Sidebar"
            title="Close Sidebar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Quick Search & Command Bar */}
        <div className="p-3 border-b border-[#EDE8DF] bg-white shrink-0 space-y-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search remote jobs, skills..."
              className="w-full pl-9 pr-8 py-2 bg-[#FAF9F5] border border-[#EDE8DF] rounded-xl text-xs placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D84315] focus:ring-1 focus:ring-[#D84315] transition-all font-medium"
            />
            {sidebarSearch && (
              <button
                type="button"
                onClick={() => setSidebarSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Quick Command Trigger */}
          <button
            id="sidebar-command-trigger"
            onClick={() => {
              onClose();
              setIsCommandPaletteOpen(true);
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-[#F2EDE2] border border-[#EDE8DF] text-[11px] font-semibold text-stone-600 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D84315]" />
              <span>Command Palette</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white border border-[#EDE8DF] rounded text-stone-500">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* 3. Scrollable Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 touch-scroll">
          
          {/* Main Navigation Workspaces */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-xs font-black uppercase tracking-wider text-stone-500 font-mono">
              Workspaces & Feeds
            </div>

            {primaryLinks.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : item.highlight
                      ? 'bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 border border-indigo-200/60 font-black'
                      : 'text-stone-800 hover:text-black hover:bg-[#FAF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-[#D84315]' : item.highlight ? 'text-indigo-600' : 'text-stone-600'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
                        isActive ? 'bg-[#D84315] text-white' : 'bg-stone-200 text-stone-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {item.isNew && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-black font-mono bg-[#D84315] text-white animate-pulse">
                        $50–$90/HR
                      </span>
                    )}

                    {item.count !== undefined && item.count !== 0 && item.count !== '' && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-800 border border-[#EDE8DF]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Deep Research Spotlight Banners */}
          <div className="space-y-1.5">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 font-mono flex items-center justify-between">
              <span>Deep Research Dossiers</span>
              <span className="text-[9px] text-[#00875A] font-bold">● Active Payouts</span>
            </div>

            <button
              id="sidebar-opentrain-modal-trigger"
              onClick={() => {
                onClose();
                openOpenTrainResearchModal();
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-indigo-950 to-slate-900 hover:to-indigo-900 text-white text-left text-xs font-bold flex items-center justify-between transition-all shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-white text-[11px]">OpenTrain AI ($50–$90/hr)</div>
                  <div className="text-[9px] text-indigo-300 font-normal">Video & Robotics Annotation</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              id="sidebar-micro1-modal-trigger"
              onClick={() => {
                onClose();
                openMicro1ResearchModal();
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-stone-900 to-stone-800 hover:to-stone-700 text-white text-left text-xs font-bold flex items-center justify-between transition-all shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D84315] group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-white text-[11px]">Micro1 AI Network ($35–$95/hr)</div>
                  <div className="text-[9px] text-stone-400 font-normal">Code Quality & Reasoning</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Job Categories Directory Accordion */}
          <div className="space-y-1">
            <button
              id="sidebar-toggle-categories"
              type="button"
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-stone-700 font-mono transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#D84315]" />
                <span>Job Categories Directory ({REMOTE_CATEGORIES.length})</span>
              </span>
              {isCategoriesExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {isCategoriesExpanded && (
              <div className="space-y-1 pl-1 pt-1 animate-in fade-in duration-150">
                {REMOTE_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.title, cat.searchQuery)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-stone-700 hover:text-[#1A1A1A] hover:bg-[#FAF9F5] transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-5 h-5 rounded-md ${cat.iconBg} ${cat.iconColor} flex items-center justify-center shrink-0`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="truncate">{cat.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400 ml-1 shrink-0">
                        {cat.liveCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Career & Intelligence Tools */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
              Career & Intelligence Tools
            </div>

            {toolLinks.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`sidebar-tool-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'text-stone-700 hover:text-[#1A1A1A] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D84315]' : 'text-stone-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold font-mono bg-[#D84315] text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* 4. Footer User Profile & Cloud Session Status */}
        <div className="p-3.5 border-t border-[#EDE8DF] bg-[#FAF9F5] shrink-0 space-y-3">
          
          {/* User Profile Card */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#D84315] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {userProfile.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#1A1A1A] truncate">
                  {userProfile.name}
                </div>
                <div className="text-[10px] text-stone-500 truncate">
                  {userProfile.targetRoles[0] || 'Software Engineer'}
                </div>
              </div>
            </div>

            {/* Post a Job Trigger */}
            <button
              onClick={() => {
                onClose();
                openPostJobModal();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#0B5CFF] text-white text-[11px] font-black flex items-center gap-1 hover:bg-blue-700 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Job</span>
            </button>
          </div>

          {/* Free Email Alerts Banner in Sidebar */}
          <div 
            onClick={() => {
              onClose();
              openEmailAlertModal();
            }}
            className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 cursor-pointer transition-colors flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <p className="text-[11px] font-black text-amber-950">Free Remote Job Alerts</p>
                <p className="text-[9px] text-amber-800 font-medium">New roles delivered straight to inbox</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-amber-800" />
          </div>

          {/* Cloud Database Sync Status */}
          <div className="flex items-center justify-between pt-1 text-[11px]">
            {firebaseUser ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse" />
                <span className="truncate max-w-[160px]">{firebaseUser.email?.split('@')[0]} (Synced)</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  loginWithGoogle();
                }}
                disabled={isCloudSyncing}
                className="flex items-center gap-1.5 text-stone-600 hover:text-[#D84315] font-semibold cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-[#D84315]" />
                <span>Sync with Google</span>
              </button>
            )}

            {firebaseUser ? (
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-rose-600 hover:text-rose-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('auth');
                }}
                className="text-[#D84315] hover:underline font-bold"
              >
                Sign In →
              </button>
            )}
          </div>
        </div>

      </aside>
    </div>
  );
};
