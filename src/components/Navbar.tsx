import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  Compass, 
  Building2, 
  Bot, 
  Zap, 
  GraduationCap, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Bell, 
  Menu, 
  X, 
  Crown,
  ChevronDown,
  User,
  UserCheck,
  Settings,
  HelpCircle,
  LogOut,
  BellRing,
  ExternalLink,
  Check,
  Globe,
  ArrowRight,
  Database,
  Cloud,
  CloudCheck,
  RefreshCw,
  Layers,
  DollarSign,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    firebaseUser,
    isCloudSyncing,
    loginWithGoogle,
    logout,
    activeTab, 
    setActiveTab, 
    userProfile, 
    savedJobIds, 
    applications, 
    watchedCompanyIds,
    companyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    openCoverLetterModalForJob,
    setIsCommandPaletteOpen,
    setIsUpgradeModalOpen,
    setIsOnboardingOpen,
    openPostJobModal,
    openEmailAlertModal,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    toggleSidebar,
    switchPlan,
    showToast
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const isPro = userProfile.subscriptionPlan === 'pro';
  const unreadCount = companyNotifications.filter(n => !n.isRead).length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: string;
    badge?: string;
    isNew?: boolean;
    isProOnly?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'landing', label: 'Explore', icon: Globe },
    { id: 'discover', label: 'Find Jobs', icon: Compass, count: '110+' },
    { id: 'earn', label: 'Earn Platforms', icon: DollarSign, isNew: true },
    { id: 'aiwork', label: 'AI & RLHF', icon: Bot },
    { id: 'resume', label: 'Resume AI', icon: FileText },
    { id: 'trends', label: 'Salaries & Intel', icon: TrendingUp },
  ];

  const secondaryNavItems = [
    { id: 'settings', label: 'Skills Sync & Settings', icon: Zap, badge: 'New' },
    { id: 'roadmap', label: '90-Day Roadmap', icon: TrendingUp },
    { id: 'playbook', label: 'Career Playbook', icon: HelpCircle },
    { id: 'trends', label: 'Market Trends', icon: TrendingUp },
    { id: 'connectors', label: 'Ingestion Health', icon: Activity },
    { id: 'pricing', label: 'Post a Job / Pricing', icon: Crown },
    { id: 'admin', label: 'Admin Matrix', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EDE8DF] bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo & Brand + 3-Bar Sidebar Trigger */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* 3-Bar Hamburger App Sidebar Trigger */}
            <button
              id="app-sidebar-hamburger-trigger"
              onClick={() => setIsSidebarOpen(true)}
              className="flex flex-col justify-center items-center gap-[4px] w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FAF9F5] hover:bg-[#F2EDE2] active:scale-95 border border-[#EDE8DF] text-[#1A1A1A] transition-all cursor-pointer shadow-2xs group shrink-0"
              aria-label="Open App Navigation Sidebar"
              title="Open App Sidebar Menu"
            >
              <span className="w-4.5 h-[2.5px] bg-[#1A1A1A] rounded-full group-hover:bg-[#D84315] group-hover:w-5 transition-all" />
              <span className="w-4.5 h-[2.5px] bg-[#1A1A1A] rounded-full group-hover:bg-[#D84315] group-hover:w-5 transition-all" />
              <span className="w-4.5 h-[2.5px] bg-[#1A1A1A] rounded-full group-hover:bg-[#D84315] group-hover:w-5 transition-all" />
            </button>

            <button 
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2 group text-left focus:outline-none shrink-0"
              aria-label="Go to Landing Page"
            >
              {/* Curved remotejobs.io Brand Icon */}
              <div className="w-8 h-8 rounded-xl bg-[#0B5CFF] flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
                <span className="font-sans font-black tracking-tighter text-base">rj</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#1A1A1A] whitespace-nowrap">
                  remotejobs<span className="text-[#0B5CFF]">.io</span>
                </span>
              </div>
            </button>

            {/* Desktop Primary Nav */}
            <nav className="hidden xl:flex items-center gap-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-bold transition-all relative ${
                      isActive
                        ? 'bg-[#1A1A1A] text-white shadow-sm'
                        : 'text-stone-700 hover:text-black hover:bg-[#F7F5EE]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D84315]' : 'text-stone-600'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full font-mono font-bold ${
                        isActive ? 'bg-[#D84315] text-white' : 'bg-[#00875A]/10 text-[#00875A]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.isNew && (
                      <span className="w-2 h-2 rounded-full bg-[#D84315] animate-pulse" />
                    )}
                    {Boolean(item.count) && (
                      <span className={`px-2 py-0.5 text-xs rounded-full font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#F7F5EE] text-stone-700 border border-[#EDE8DF]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {item.isProOnly && !isPro && (
                      <Crown className="w-3.5 h-3.5 text-[#D84315] ml-0.5" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Command Search Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 sm:px-4 sm:py-2 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-xs sm:text-sm font-semibold text-stone-700 hover:text-black transition-colors flex items-center justify-center gap-2 shrink-0"
              title="Search (⌘K)"
              aria-label="Open search command palette"
            >
              <Search className="w-4 h-4 text-stone-600 shrink-0" />
              <span className="hidden md:inline">Search remote roles, tech, bounties...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs font-mono font-bold bg-white border border-[#EDE8DF] rounded-md text-stone-700">
                ⌘K
              </kbd>
            </button>

            {/* Cloud Database Status Pill */}
            {firebaseUser ? (
              <div 
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00875A]/10 border border-[#00875A]/20 text-[11px] font-semibold text-[#00875A]"
                title={`Cloud Database Sync Active: ${firebaseUser.email}`}
              >
                {isCloudSyncing ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-[#00875A]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00875A] animate-pulse" />
                )}
                <span>Cloud Synced</span>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                disabled={isCloudSyncing}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-[11px] font-semibold text-[#1A1A1A] transition-colors"
                title="Sign in with Google to sync bookmarks, resume & profile to Cloud Database"
              >
                <Database className="w-3 h-3 text-[#D84315]" />
                <span>{isCloudSyncing ? 'Connecting...' : 'Sync to Cloud'}</span>
              </button>
            )}


            {/* Career Onboarding Launch Button */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D84315]/10 hover:bg-[#D84315]/20 border border-[#D84315]/30 text-[#D84315] text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
              title="Career Onboarding & Profile Setup"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D84315]" />
              <span>Career Setup</span>
            </button>

            {/* Sign In / Sign Up Header Button (when not authenticated) */}
            {!firebaseUser && (
              <button
                onClick={() => setActiveTab('auth')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-stone-300" />
                <span>Sign In</span>
              </button>
            )}

            {/* Free Job Alerts Button */}
            <button
              onClick={openEmailAlertModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="Get weekly curated remote jobs sent to your inbox"
            >
              <Bell className="w-3.5 h-3.5 text-amber-700" />
              <span>Job Alerts</span>
            </button>

            {/* Post a Remote Job Button (For Hiring Managers & Employers) */}
            <button
              onClick={openPostJobModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-[#0B5CFF] hover:bg-blue-700 active:scale-95 text-white text-xs font-black transition-all shadow-xs cursor-pointer shrink-0"
              title="Post a verified remote job listing"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post a Job</span>
            </button>

            {/* Notification Bell (Hidden on small mobile landing page to ensure perfect spacing) */}
            <div className={`relative shrink-0 ${activeTab === 'landing' ? 'hidden sm:block' : 'block'}`}>
              <button
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                className="w-8.5 h-8.5 sm:w-auto sm:h-auto p-2 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] text-[#767676] hover:text-[#1A1A1A] border border-[#EDE8DF] relative transition-colors flex items-center justify-center shrink-0"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 ? (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D84315] ring-2 ring-white animate-pulse" />
                ) : (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00875A] ring-2 ring-white" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-84 max-w-sm rounded-3xl bg-white border border-[#EDE8DF] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EDE8DF]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1A1A1A]">Watchlist & Job Alerts</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#D84315]/10 text-[#D84315] text-[10px] font-bold font-mono">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[10px] text-[#767676] hover:text-[#1A1A1A] font-semibold"
                    >
                      Mark all read
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5 touch-scroll">
                    {companyNotifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#767676]">
                        No notifications yet. Watch companies to get instant job alerts!
                      </div>
                    ) : (
                      companyNotifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            setActiveTab('discover');
                            setIsNotificationsOpen(false);
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                            notif.isRead
                              ? 'bg-white border-[#EDE8DF] hover:border-[#1A1A1A]'
                              : 'bg-[#FBF9F4] border-[#D84315]/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#1A1A1A]">{notif.companyName}</span>
                            <span className="text-[10px] text-[#A39E93]">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs font-semibold text-[#D84315] mt-0.5">{notif.jobTitle}</p>
                          <p className="text-[11px] text-[#767676]">{notif.salaryFormatted}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#EDE8DF] flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('earn');
                        setIsNotificationsOpen(false);
                      }}
                      className="text-[#D84315] hover:underline font-bold text-xs"
                    >
                      Explore Earn Platforms & AI Guides →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsProfileMenuOpen(prev => !prev)}
                className="flex items-center gap-1 sm:gap-2 p-1 sm:px-2 sm:py-1 rounded-full bg-[#F7F5EE] hover:bg-[#EDE8DF] border border-[#EDE8DF] transition-colors shrink-0"
                aria-label="User profile menu"
              >
                <div className="w-6.5 h-6.5 sm:w-6 sm:h-6 rounded-full bg-[#D84315] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {((firebaseUser?.displayName || userProfile.name || 'C').charAt(0)).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-[#1A1A1A] hidden md:inline max-w-[100px] truncate">
                  {firebaseUser ? (firebaseUser.displayName || firebaseUser.email?.split('@')[0] || userProfile.name) : userProfile.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#767676] hidden sm:inline" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-64 max-w-xs rounded-2xl bg-white border border-[#EDE8DF] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3 border-b border-[#EDE8DF] mb-1">
                    <p className="text-xs font-bold text-[#1A1A1A] truncate">
                      {firebaseUser ? (firebaseUser.displayName || firebaseUser.email?.split('@')[0] || userProfile.name) : userProfile.name}
                    </p>
                    <p className="text-[11px] text-[#767676] truncate">
                      {firebaseUser ? firebaseUser.email : (userProfile.email || 'Guest Session')}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-[#767676]">Target Role:</span>
                      <span className="text-[10px] font-semibold text-[#1A1A1A] truncate max-w-[120px]">{userProfile.targetRoles[0]}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-[#767676]">Readiness:</span>
                      <span className="text-[10px] font-bold text-[#00875A]">{userProfile.careerReadinessScore}/100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#1A1A1A] hover:bg-[#D84315]/10 rounded-xl text-left font-bold text-[#D84315]"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#D84315]" />
                      <span>Skills Sync & Settings</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#D84315] text-white">
                      Sync 2.0
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsOnboardingOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1A1A1A] hover:bg-[#F7F5EE] rounded-xl text-left font-medium"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#706E6B]" />
                    <span>Onboarding & Career Setup</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('watchlist');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1A1A1A] hover:bg-[#F7F5EE] rounded-xl text-left font-medium"
                  >
                    <BellRing className="w-3.5 h-3.5 text-[#D84315]" />
                    <span>Company Watchlist ({watchedCompanyIds.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('pricing');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#D84315] hover:bg-[#D84315]/10 rounded-xl text-left font-semibold"
                  >
                    <Crown className="w-3.5 h-3.5 text-[#D84315]" />
                    <span>{isPro ? 'Manage PRO Subscription' : 'Upgrade to PRO'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('connectors');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1A1A1A] hover:bg-[#F7F5EE] rounded-xl text-left font-medium"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#767676]" />
                    <span>Ingestion Health</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1A1A1A] hover:bg-[#F7F5EE] rounded-xl text-left font-medium"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#767676]" />
                    <span>Admin Controls</span>
                  </button>

                  <div className="my-1 border-t border-[#EDE8DF]" />

                  {firebaseUser ? (
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl text-left font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>Sign Out ({firebaseUser.email?.split('@')[0]})</span>
                    </button>
                  ) : (
                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setActiveTab('auth');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#D84315] hover:bg-[#D84315]/10 rounded-xl text-left font-bold"
                      >
                        <User className="w-3.5 h-3.5 text-[#D84315]" />
                        <span>Sign In / Sign Up</span>
                      </button>
                      <button
                        onClick={() => {
                          loginWithGoogle();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-[#F7F5EE] rounded-xl text-left font-semibold"
                      >
                        <Database className="w-3.5 h-3.5 text-[#00875A]" />
                        <span>1-Click Google Sign In</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop & Tablet Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-full bg-[#F7F5EE] text-[#767676] hover:text-[#1A1A1A] border border-[#EDE8DF] hidden md:flex xl:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tablet Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="hidden md:block xl:hidden bg-white border-b border-[#EDE8DF] px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[...navItems, ...secondaryNavItems].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-[#D84315] text-white'
                      : 'bg-[#F7F5EE] text-[#1A1A1A] hover:bg-[#EDE8DF]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#767676]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Post a Job on Mobile Drawer */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openPostJobModal();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0B5CFF] text-white font-black text-xs shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Post a Remote Job (Employers)</span>
          </button>
        </div>
      )}
    </header>
  );
};
