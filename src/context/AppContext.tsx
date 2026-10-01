import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserCareerProfile, 
  Job, 
  ApplicationRecord, 
  SearchFilterState, 
  CompanyJobNotification, 
  MatchedJobItem, 
  ResumeExploreMatchResponse, 
  InAppBrowserState,
  SkillsSyncData,
  SyncedTechnologyItem,
  SkillsSyncResponse
} from '../types';
import { INITIAL_USER_PROFILE, INITIAL_APPLICATIONS } from '../data/initialData';
import { syncSkillsFromResumeApi, syncUserProfileApi } from '../lib/api';
import { 
  auth, 
  db, 
  loginWithGoogle as fbLogin, 
  signUpWithEmail as fbSignUpWithEmail,
  loginWithEmail as fbLoginWithEmail,
  resetUserPassword as fbResetUserPassword,
  logoutUser as fbLogout,
  saveUserProfileToCloud,
  saveJobToCloud,
  removeSavedJobFromCloud,
  saveApplicationToCloud,
  deleteApplicationFromCloud,
  saveWatchedCompanyToCloud,
  removeWatchedCompanyFromCloud,
  getUserProfileFromCloud,
  handleFirestoreError,
  isFirestorePermissionError,
  OperationType
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  firebaseUser: User | null;
  isAuthLoading: boolean;
  isCloudSyncing: boolean;
  loginWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  userProfile: UserCareerProfile;
  updateUserProfile: (profile: Partial<UserCareerProfile>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string, jobMeta?: { title?: string; company?: string; salary?: string; location?: string }) => void;
  watchedCompanyIds: string[];
  toggleWatchCompany: (companyId: string, companyName?: string) => void;
  isCompanyWatched: (companyId: string) => boolean;
  companyNotifications: CompanyJobNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  simulateNewCompanyJob: (companyId?: string) => void;
  applications: ApplicationRecord[];
  addApplication: (app: ApplicationRecord) => void;
  updateApplicationStatus: (id: string, status: ApplicationRecord['status']) => void;
  deleteApplication: (id: string) => void;
  selectedJobForDetails: Job | null;
  setSelectedJobForDetails: (job: Job | null) => void;
  selectedJobForPitch: Job | null;
  setSelectedJobForPitch: (job: Job | null) => void;
  selectedJobForScoreBreakdown: Job | null;
  setSelectedJobForScoreBreakdown: (job: Job | null) => void;
  selectedJobForCoverLetter: Job | null;
  setSelectedJobForCoverLetter: (job: Job | null) => void;
  isCoverLetterModalOpen: boolean;
  setIsCoverLetterModalOpen: (open: boolean) => void;
  openCoverLetterModalForJob: (job: Job) => void;
  selectedJobForResumeReshape: Job | null;
  setSelectedJobForResumeReshape: (job: Job | null) => void;
  isResumeReshapeModalOpen: boolean;
  setIsResumeReshapeModalOpen: (open: boolean) => void;
  openResumeReshaperModalForJob: (job: Job) => void;
  isMicro1ResearchModalOpen: boolean;
  setIsMicro1ResearchModalOpen: (open: boolean) => void;
  openMicro1ResearchModal: () => void;
  isOpenTrainResearchModalOpen: boolean;
  setIsOpenTrainResearchModalOpen: (open: boolean) => void;
  openOpenTrainResearchModal: () => void;
  isTaskIntelligenceModalOpen: boolean;
  setIsTaskIntelligenceModalOpen: (open: boolean) => void;
  selectedPlatformForIntelligence: any | null;
  setSelectedPlatformForIntelligence: (platform: any | null) => void;
  openTaskPlatformIntelligence: (platformData: any) => void;
  closeTaskPlatformIntelligence: () => void;
  isTaskAssistantModalOpen: boolean;
  setIsTaskAssistantModalOpen: (open: boolean) => void;
  selectedTaskForAssistant: any | null;
  taskAssistantInitialTab: 'analyze' | 'complete' | 'qa';
  openTaskAssistant: (taskData: any, initialTab?: 'analyze' | 'complete' | 'qa') => void;
  closeTaskAssistant: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean, force?: boolean) => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  isExploreResumeModalOpen: boolean;
  setIsExploreResumeModalOpen: (open: boolean) => void;
  openExploreResumeFlow: (targetRole?: string) => void;
  inAppBrowserState: InAppBrowserState;
  openInAppApply: (job: Job) => void;
  openInAppBrowser: (url: string, job?: Job | null, title?: string) => void;
  closeInAppBrowser: () => void;
  matchedResumeJobs: MatchedJobItem[];
  setMatchedResumeJobs: (jobs: MatchedJobItem[]) => void;
  resumeExploreTargetRole: string;
  setResumeExploreTargetRole: (role: string) => void;
  resumeCandidateProfile: ResumeExploreMatchResponse['candidateProfile'] | null;
  setResumeCandidateProfile: (profile: ResumeExploreMatchResponse['candidateProfile'] | null) => void;
  // Skills Sync State & Actions
  isSkillsSyncing: boolean;
  skillsSyncProgress: number;
  skillsSyncStatusText: string;
  runSkillsSync: (options?: {
    resumeText?: string;
    fileName?: string;
    base64?: string;
    mimeType?: string;
    priority?: 'standard' | 'aggressive' | 'strict';
    customTech?: string[];
  }) => Promise<SkillsSyncResponse | null>;
  toggleFrameworkPriority: (techName: string) => void;
  addCustomTechnology: (techName: string, category?: string) => void;
  removeSyncedTechnology: (techName: string) => void;
  updateSyncPriorityLevel: (level: 'standard' | 'aggressive' | 'strict') => void;
  searchFilters: SearchFilterState;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  resetSearchFilters: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  switchPlan: (plan: 'free' | 'pro') => void;
  upgradeToPro: () => void;
  consumeAiAssist: () => boolean;
  isPostJobModalOpen: boolean;
  setIsPostJobModalOpen: (open: boolean) => void;
  openPostJobModal: () => void;
  isEmailAlertModalOpen: boolean;
  setIsEmailAlertModalOpen: (open: boolean) => void;
  openEmailAlertModal: () => void;
  submitNewJobPosting: (jobData: any) => Promise<boolean>;
  subscribeEmailAlerts: (email: string, track?: string) => Promise<boolean>;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const DEFAULT_FILTERS: SearchFilterState = {
  keyword: '',
  targetRole: '',
  locationTier: 'all',
  isNigeriaEligible: false,
  isAfricaEligible: false,
  isWorldwide: false,
  experienceLevel: 'all',
  employmentType: 'all',
  category: 'all',
  minSalary: 0,
  currency: 'USD',
  verifiedEmployerOnly: false,
  directApplyOnly: false,
  salaryDisclosedOnly: false,
  minOpportunityScore: 0,
  minMatchScore: 0,
  resumeMatchedOnly: false,
  freshness: 'all',
  payoutMethod: 'all',
  sortBy: 'recommended'
};

const INITIAL_NOTIFICATIONS: CompanyJobNotification[] = [
  {
    id: 'notif_001',
    companyId: 'comp_001',
    companyName: 'Moniepoint Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
    jobId: 'job_001',
    jobTitle: 'Junior Data Analyst (Remote)',
    salaryFormatted: '$1,800 – $2,600 / mo',
    locationTierLabel: 'Nigeria Explicit',
    timestamp: '15 mins ago',
    isRead: false,
    employmentType: 'Full-time Remote'
  },
  {
    id: 'notif_002',
    companyId: 'comp_002',
    companyName: 'Paystack (Stripe)',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
    jobId: 'job_003',
    jobTitle: 'Associate Software Engineer (Backend / Go)',
    salaryFormatted: '$3,200 – $4,500 / mo',
    locationTierLabel: 'Africa Remote',
    timestamp: '2 hours ago',
    isRead: false,
    employmentType: 'Full-time Remote'
  },
  {
    id: 'notif_003',
    companyId: 'comp_003',
    companyName: 'Flutterwave',
    companyLogo: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=128&auto=format&fit=crop&q=80',
    jobId: 'job_006',
    jobTitle: 'Technical Support & API Integrations Analyst',
    salaryFormatted: '$1,500 – $2,200 / mo',
    locationTierLabel: 'Nigeria / Kenya Remote',
    timestamp: 'Yesterday',
    isRead: true,
    employmentType: 'Full-time Remote'
  }
];

export const GUEST_USER_PROFILE: UserCareerProfile = {
  id: 'usr_guest',
  name: 'Guest Candidate',
  email: '',
  country: 'Nigeria',
  city: 'Lagos',
  timezone: 'WAT (UTC+1)',
  targetRoles: [],
  experienceLevel: '0_1_years',
  yearsOfExperience: 0,
  skills: [],
  tools: ['VS Code', 'Git & GitHub', 'Excel'],
  programmingLanguages: [],
  certifications: [],
  education: '',
  portfolioUrl: '',
  linkedinUrl: '',
  githubUrl: '',
  cvText: '',
  preferredSalaryMin: 1200,
  preferredCurrency: 'USD',
  availability: 'Immediately (Full-time Remote)',
  preferredContractType: 'Remote Contractor / Direct Employment',
  preferredPayoutMethods: ['Deel', 'Payoneer', 'Wise'],
  careerReadinessScore: 70,
  readinessImprovements: [
    'Upload your CV to automatically calculate ATS match scores across all listings',
    'Select preferred contract types to filter instant direct apply roles'
  ],
  subscriptionPlan: 'pro',
  aiAssistsRemaining: 9999,
  aiAssistsLimit: 9999,
  hasCompletedOnboarding: true,
  careerTrack: '',
  careerTracks: [],
  preferredWorkTypes: []
};

export function createCleanProfileForUser(user: User): UserCareerProfile {
  const emailPrefix = user.email ? user.email.split('@')[0] : 'Candidate';
  const resolvedName = user.displayName?.trim() || emailPrefix;
  return {
    id: user.uid,
    name: resolvedName,
    email: user.email || '',
    country: 'Nigeria',
    city: 'Lagos',
    timezone: 'WAT (UTC+1)',
    targetRoles: [],
    experienceLevel: '0_1_years',
    yearsOfExperience: 0,
    skills: [],
    tools: ['VS Code', 'Git', 'Google Workspace'],
    programmingLanguages: [],
    certifications: [],
    education: '',
    cvText: '',
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    preferredSalaryMin: 1500,
    preferredCurrency: 'USD',
    availability: 'Immediate (Full-time Remote)',
    preferredContractType: 'Remote Contractor / Direct Employment',
    preferredPayoutMethods: ['Deel', 'Wise', 'Payoneer'],
    careerReadinessScore: 70,
    readinessImprovements: [
      'Upload your CV to automatically calculate ATS match scores across all listings',
      'Select preferred contract types to filter instant direct apply roles'
    ],
    subscriptionPlan: 'pro',
    aiAssistsRemaining: 9999,
    aiAssistsLimit: 9999,
    hasCompletedOnboarding: true,
    careerTrack: '',
    careerTracks: [],
    preferredWorkTypes: []
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserCareerProfile>(() => {
    try {
      const saved = localStorage.getItem('findjobber_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'obedasekhamen@gmail.com') {
          return GUEST_USER_PROFILE;
        }
        return parsed;
      }
      return GUEST_USER_PROFILE;
    } catch {
      return GUEST_USER_PROFILE;
    }
  });

  const [activeTab, setActiveTabState] = useState<string>('discover');

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('findjobber_saved_job_ids');
      return saved ? JSON.parse(saved) : ['job_001', 'job_003'];
    } catch {
      return ['job_001', 'job_003'];
    }
  });

  const [watchedCompanyIds, setWatchedCompanyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('findjobber_watched_company_ids');
      return saved ? JSON.parse(saved) : ['comp_001', 'comp_002', 'comp_004'];
    } catch {
      return ['comp_001', 'comp_002', 'comp_004'];
    }
  });

  const [companyNotifications, setCompanyNotifications] = useState<CompanyJobNotification[]>(() => {
    try {
      const saved = localStorage.getItem('findjobber_company_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('findjobber_applications');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [selectedJobForPitch, setSelectedJobForPitch] = useState<Job | null>(null);
  const [selectedJobForScoreBreakdown, setSelectedJobForScoreBreakdown] = useState<Job | null>(null);
  const [selectedJobForCoverLetter, setSelectedJobForCoverLetter] = useState<Job | null>(null);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState<boolean>(false);
  const [selectedJobForResumeReshape, setSelectedJobForResumeReshape] = useState<Job | null>(null);
  const [isResumeReshapeModalOpen, setIsResumeReshapeModalOpen] = useState<boolean>(false);
  const [isMicro1ResearchModalOpen, setIsMicro1ResearchModalOpen] = useState<boolean>(false);
  const [isOpenTrainResearchModalOpen, setIsOpenTrainResearchModalOpen] = useState<boolean>(false);
  const [isTaskIntelligenceModalOpen, setIsTaskIntelligenceModalOpen] = useState<boolean>(false);
  const [selectedPlatformForIntelligence, setSelectedPlatformForIntelligence] = useState<any | null>(null);
  const [isTaskAssistantModalOpen, setIsTaskAssistantModalOpen] = useState<boolean>(false);
  const [selectedTaskForAssistant, setSelectedTaskForAssistant] = useState<any | null>(null);
  const [taskAssistantInitialTab, setTaskAssistantInitialTab] = useState<'analyze' | 'complete' | 'qa'>('analyze');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpenState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('findjobber_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.hasCompletedOnboarding === false && !parsed.skills?.length;
      }
      return false; // Open direct traffic access to job board
    } catch {
      return false;
    }
  });

  const setIsOnboardingOpen = (open: boolean, _force: boolean = false) => {
    setIsOnboardingOpenState(open);
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState<boolean>(false);
  const [isEmailAlertModalOpen, setIsEmailAlertModalOpen] = useState<boolean>(false);
  const [isExploreResumeModalOpen, setIsExploreResumeModalOpen] = useState<boolean>(false);
  const [resumeExploreTargetRole, setResumeExploreTargetRole] = useState<string>('');
  const [matchedResumeJobs, setMatchedResumeJobs] = useState<MatchedJobItem[]>(() => {
    try {
      const saved = localStorage.getItem('findjobber_matched_resume_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [resumeCandidateProfile, setResumeCandidateProfile] = useState<ResumeExploreMatchResponse['candidateProfile'] | null>(() => {
    try {
      const saved = localStorage.getItem('findjobber_resume_candidate_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [searchFilters, setSearchFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('findjobber_sidebar_collapsed');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => {
        const next = !prev;
        try {
          localStorage.setItem('findjobber_sidebar_collapsed', String(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  };

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [inAppBrowserState, setInAppBrowserState] = useState<InAppBrowserState>({
    isOpen: false,
    url: '',
    job: null,
    title: '',
    source: ''
  });

  const [isSkillsSyncing, setIsSkillsSyncing] = useState<boolean>(false);
  const [skillsSyncProgress, setSkillsSyncProgress] = useState<number>(0);
  const [skillsSyncStatusText, setSkillsSyncStatusText] = useState<string>('');

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setIsAuthLoading(false);

      if (user) {
        setIsCloudSyncing(true);
        try {
          const userEmail = (user.email || '').trim().toLowerCase();
          const emailPrefix = userEmail ? userEmail.split('@')[0] : 'Candidate';
          const resolvedDisplayName = user.displayName?.trim() || emailPrefix;

          // Fetch user profile from cloud
          const cloudProfile = await getUserProfileFromCloud(user.uid);

          // Check if cloudProfile contains leaked/stale Obed demo data for a different user
          const isStaleLeakedData = 
            userEmail !== 'obedasekhamen@gmail.com' && (
              cloudProfile?.name === 'Obed Asekhamen' || 
              cloudProfile?.email?.toLowerCase() === 'obedasekhamen@gmail.com' ||
              cloudProfile?.linkedinUrl?.includes('obed-asekhamen') ||
              cloudProfile?.portfolioUrl?.includes('obed-data-projects')
            );

          let resolvedProfile: UserCareerProfile;

          if (cloudProfile && !isStaleLeakedData) {
            // Legitimate existing cloud profile: ensure authenticated email & displayName are respected
            resolvedProfile = {
              ...cloudProfile,
              id: user.uid,
              email: user.email || cloudProfile.email,
              name: (cloudProfile.name && cloudProfile.name !== 'Obed Asekhamen') 
                ? cloudProfile.name 
                : resolvedDisplayName
            };

            // If name or email in cloud doc had stale placeholder or mismatch, heal cloud doc
            if (!cloudProfile.name || cloudProfile.name === 'Obed Asekhamen' || cloudProfile.email !== user.email) {
              await saveUserProfileToCloud(user.uid, resolvedProfile);
            }
          } else {
            // Fresh account or leaked demo data detected:
            // Check if there is an existing valid cache specifically for this user's UID
            const userSpecificCache = localStorage.getItem(`findjobber_user_profile_${user.uid}`);
            if (userSpecificCache) {
              try {
                const parsed = JSON.parse(userSpecificCache);
                if (parsed.email?.toLowerCase() === userEmail && parsed.name !== 'Obed Asekhamen') {
                  resolvedProfile = { ...parsed, id: user.uid, email: user.email || parsed.email };
                } else {
                  resolvedProfile = createCleanProfileForUser(user);
                }
              } catch {
                resolvedProfile = createCleanProfileForUser(user);
              }
            } else {
              resolvedProfile = createCleanProfileForUser(user);
            }

            // Immediately heal Firestore document with the clean profile
            await saveUserProfileToCloud(user.uid, resolvedProfile);
          }

          // Update active React state with this user's profile
          setUserProfile(resolvedProfile);

          // If onboarding has not been completed, automatically enforce onboarding modal
          if (resolvedProfile.hasCompletedOnboarding !== true) {
            setIsOnboardingOpenState(true);
          } else {
            setIsOnboardingOpenState(false);
          }

          // Update namespaced and active localStorage
          localStorage.setItem(`findjobber_user_profile_${user.uid}`, JSON.stringify(resolvedProfile));
          localStorage.setItem('findjobber_user_profile', JSON.stringify(resolvedProfile));

          // Load user-namespaced saved jobs & apps
          const cachedSaved = localStorage.getItem(`findjobber_saved_job_ids_${user.uid}`);
          if (cachedSaved) {
            try {
              setSavedJobIds(JSON.parse(cachedSaved));
            } catch {
              setSavedJobIds([]);
            }
          } else {
            setSavedJobIds([]);
          }

          const cachedApps = localStorage.getItem(`findjobber_applications_${user.uid}`);
          if (cachedApps) {
            try {
              setApplications(JSON.parse(cachedApps));
            } catch {
              setApplications([]);
            }
          } else {
            setApplications([]);
          }

          showToast(`Connected as ${user.displayName || user.email}`, 'success');
        } catch (err) {
          console.warn('[Firestore] Initial profile sync notice:', err);
        } finally {
          setIsCloudSyncing(false);
        }
      } else {
        // User is signed out: clear active state to prevent data bleed
        setUserProfile(GUEST_USER_PROFILE);
        setIsOnboardingOpenState(true);
        setSavedJobIds([]);
        setWatchedCompanyIds([]);
        setApplications([]);
        setMatchedResumeJobs([]);
        setResumeCandidateProfile(null);
        localStorage.removeItem('findjobber_user_profile');
        localStorage.removeItem('findjobber_saved_job_ids');
        localStorage.removeItem('findjobber_watched_company_ids');
        localStorage.removeItem('findjobber_applications');
        localStorage.removeItem('findjobber_matched_resume_jobs');
        localStorage.removeItem('findjobber_resume_candidate_profile');
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time subcollections when signed in
  useEffect(() => {
    if (!firebaseUser) return;

    // 1. Saved Jobs listener
    const savedJobsPath = `users/${firebaseUser.uid}/savedJobs`;
    const savedJobsCol = collection(db, 'users', firebaseUser.uid, 'savedJobs');
    const unsubSaved = onSnapshot(savedJobsCol, (snapshot) => {
      const ids = snapshot.docs.map(d => d.id);
      if (ids.length > 0) {
        setSavedJobIds(prev => Array.from(new Set([...prev, ...ids])));
      }
    }, (err) => {
      if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.GET, savedJobsPath);
      }
      console.warn('[Firestore] Saved jobs listener notice:', err);
    });

    // 2. Applications listener
    const appsPath = `users/${firebaseUser.uid}/applications`;
    const appsCol = collection(db, 'users', firebaseUser.uid, 'applications');
    const unsubApps = onSnapshot(appsCol, (snapshot) => {
      const cloudApps = snapshot.docs.map(d => d.data() as ApplicationRecord);
      if (cloudApps.length > 0) {
        setApplications(prev => {
          const merged = [...cloudApps];
          prev.forEach(localApp => {
            if (!merged.find(a => a.id === localApp.id)) {
              merged.push(localApp);
            }
          });
          return merged;
        });
      }
    }, (err) => {
      if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.GET, appsPath);
      }
      console.warn('[Firestore] Applications listener notice:', err);
    });

    // 3. Watched Companies listener
    const watchedPath = `users/${firebaseUser.uid}/watchedCompanies`;
    const watchedCol = collection(db, 'users', firebaseUser.uid, 'watchedCompanies');
    const unsubWatched = onSnapshot(watchedCol, (snapshot) => {
      const compIds = snapshot.docs.map(d => d.id);
      if (compIds.length > 0) {
        setWatchedCompanyIds(prev => Array.from(new Set([...prev, ...compIds])));
      }
    }, (err) => {
      if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.GET, watchedPath);
      }
      console.warn('[Firestore] Watched companies listener notice:', err);
    });

    return () => {
      unsubSaved();
      unsubApps();
      unsubWatched();
    };
  }, [firebaseUser]);

  // Persist state to local storage (both active and namespaced)
  useEffect(() => {
    if (firebaseUser) {
      localStorage.setItem(`findjobber_user_profile_${firebaseUser.uid}`, JSON.stringify(userProfile));
    }
    localStorage.setItem('findjobber_user_profile', JSON.stringify(userProfile));
  }, [userProfile, firebaseUser]);

  useEffect(() => {
    if (matchedResumeJobs.length > 0) {
      localStorage.setItem('findjobber_matched_resume_jobs', JSON.stringify(matchedResumeJobs));
    }
  }, [matchedResumeJobs]);

  useEffect(() => {
    if (resumeCandidateProfile) {
      localStorage.setItem('findjobber_resume_candidate_profile', JSON.stringify(resumeCandidateProfile));
    }
  }, [resumeCandidateProfile]);

  useEffect(() => {
    if (firebaseUser) {
      localStorage.setItem(`findjobber_saved_job_ids_${firebaseUser.uid}`, JSON.stringify(savedJobIds));
    }
    localStorage.setItem('findjobber_saved_job_ids', JSON.stringify(savedJobIds));
  }, [savedJobIds, firebaseUser]);

  useEffect(() => {
    if (firebaseUser) {
      localStorage.setItem(`findjobber_watched_company_ids_${firebaseUser.uid}`, JSON.stringify(watchedCompanyIds));
    }
    localStorage.setItem('findjobber_watched_company_ids', JSON.stringify(watchedCompanyIds));
  }, [watchedCompanyIds, firebaseUser]);

  useEffect(() => {
    localStorage.setItem('findjobber_company_notifications', JSON.stringify(companyNotifications));
  }, [companyNotifications]);

  useEffect(() => {
    if (firebaseUser) {
      localStorage.setItem(`findjobber_applications_${firebaseUser.uid}`, JSON.stringify(applications));
    }
    localStorage.setItem('findjobber_applications', JSON.stringify(applications));
  }, [applications, firebaseUser]);

  // Global shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsCloudSyncing(true);
      const user = await fbLogin();
      if (user) {
        showToast(`Signed in as ${user.displayName || user.email}`, 'success');
      }
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        showToast(error?.message || 'Failed to sign in with Google', 'error');
      }
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName?: string) => {
    try {
      setIsCloudSyncing(true);
      const user = await fbSignUpWithEmail(email, pass, displayName);
      if (user) {
        showToast(`Account created successfully! Welcome, ${displayName || user.email}!`, 'success');
      }
    } catch (error: any) {
      const msg = error?.code === 'auth/email-already-in-use' 
        ? 'This email address is already registered. Please sign in instead.'
        : error?.message || 'Failed to create account';
      showToast(msg, 'error');
      throw error;
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setIsCloudSyncing(true);
      const user = await fbLoginWithEmail(email, pass);
      if (user) {
        showToast(`Welcome back, ${user.displayName || user.email}!`, 'success');
      }
    } catch (error: any) {
      const msg = error?.code === 'auth/invalid-credential' || error?.code === 'auth/wrong-password' || error?.code === 'auth/user-not-found'
        ? 'Invalid email or password. Please verify and try again.'
        : error?.message || 'Failed to sign in';
      showToast(msg, 'error');
      throw error;
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await fbResetUserPassword(email);
      showToast(`Password reset link sent to ${email}. Please check your inbox.`, 'success');
    } catch (error: any) {
      const msg = error?.code === 'auth/user-not-found'
        ? 'No account found with this email address.'
        : error?.message || 'Failed to send password reset email';
      showToast(msg, 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fbLogout();
      setFirebaseUser(null);
      setUserProfile(GUEST_USER_PROFILE);
      setSavedJobIds([]);
      setWatchedCompanyIds([]);
      setApplications([]);
      setMatchedResumeJobs([]);
      setResumeCandidateProfile(null);
      localStorage.removeItem('findjobber_user_profile');
      localStorage.removeItem('findjobber_saved_job_ids');
      localStorage.removeItem('findjobber_watched_company_ids');
      localStorage.removeItem('findjobber_applications');
      localStorage.removeItem('findjobber_matched_resume_jobs');
      localStorage.removeItem('findjobber_resume_candidate_profile');
      showToast('Signed out successfully', 'info');
    } catch (error: any) {
      showToast(error?.message || 'Failed to sign out', 'error');
    }
  };

  const updateUserProfile = (updated: Partial<UserCareerProfile>) => {
    setUserProfile(prev => {
      const next = { ...prev, ...updated };
      if (firebaseUser) {
        saveUserProfileToCloud(firebaseUser.uid, next).catch(e => console.warn('[Firestore] Profile save notice:', e));
      }
      syncUserProfileApi(next).catch(() => {});
      return next;
    });
    showToast('Profile updated and saved', 'success');
  };

  const toggleSaveJob = (jobId: string, jobMeta?: { title?: string; company?: string; salary?: string; location?: string }) => {
    setSavedJobIds(prev => {
      const isSaved = prev.includes(jobId);
      if (isSaved) {
        showToast('Removed job from bookmarks', 'info');
        if (firebaseUser) {
          removeSavedJobFromCloud(firebaseUser.uid, jobId).catch(e => console.warn('[Firestore] Remove saved job notice:', e));
        }
        return prev.filter(id => id !== jobId);
      } else {
        showToast('Saved job to your bookmarks', 'success');
        if (firebaseUser) {
          saveJobToCloud(firebaseUser.uid, jobId, jobMeta).catch(e => console.warn('[Firestore] Save job notice:', e));
        }
        return [...prev, jobId];
      }
    });
  };

  const toggleWatchCompany = (companyId: string, companyName?: string) => {
    setWatchedCompanyIds(prev => {
      const isWatched = prev.includes(companyId);
      if (isWatched) {
        showToast(`Stopped watching ${companyName || 'company'}`, 'info');
        if (firebaseUser) {
          removeWatchedCompanyFromCloud(firebaseUser.uid, companyId).catch(e => console.warn('[Firestore] Remove watch notice:', e));
        }
        return prev.filter(id => id !== companyId);
      } else {
        showToast(`Now watching ${companyName || 'company'}! You will receive alerts when new jobs are posted.`, 'success');
        if (firebaseUser) {
          saveWatchedCompanyToCloud(firebaseUser.uid, companyId, companyName).catch(e => console.warn('[Firestore] Save watch notice:', e));
        }
        return [...prev, companyId];
      }
    });
  };

  const isCompanyWatched = (companyId: string): boolean => {
    return watchedCompanyIds.includes(companyId);
  };

  const markNotificationAsRead = (id: string) => {
    setCompanyNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setCompanyNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All job notifications marked as read', 'info');
  };

  const clearAllNotifications = () => {
    setCompanyNotifications([]);
    showToast('Cleared all notifications', 'info');
  };

  const simulateNewCompanyJob = (companyId?: string) => {
    const mockCompanies = [
      { id: 'comp_001', name: 'Moniepoint Inc.', title: 'Junior Data Engineer (Remote)', salary: '$2,200 – $3,100 / mo', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80' },
      { id: 'comp_002', name: 'Paystack', title: 'Product Data Analyst (WAT)', salary: '$2,800 – $4,000 / mo', logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80' },
      { id: 'comp_004', name: 'Helicarrier (Send)', title: 'Prompt Engineer & Evaluation Specialist', salary: '$1,600 – $2,400 / mo', logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=80' }
    ];

    const chosen = mockCompanies.find(c => c.id === companyId) || mockCompanies[Math.floor(Math.random() * mockCompanies.length)];
    const newNotif: CompanyJobNotification = {
      id: 'notif_' + Date.now(),
      companyId: chosen.id,
      companyName: chosen.name,
      companyLogo: chosen.logo,
      jobId: 'job_sim_' + Date.now(),
      jobTitle: chosen.title,
      salaryFormatted: chosen.salary,
      locationTierLabel: 'Nigeria / Africa Remote',
      timestamp: 'Just now',
      isRead: false,
      employmentType: 'Full-time'
    };

    setCompanyNotifications(prev => [newNotif, ...prev]);
    showToast(`🔔 Watchlist Alert: ${chosen.name} just posted "${chosen.title}"!`, 'success');
  };

  const openCoverLetterModalForJob = (job: Job) => {
    setSelectedJobForCoverLetter(job);
    setIsCoverLetterModalOpen(true);
  };

  const openResumeReshaperModalForJob = (job: Job) => {
    setSelectedJobForResumeReshape(job);
    setIsResumeReshapeModalOpen(true);
  };

  const openMicro1ResearchModal = () => {
    setIsMicro1ResearchModalOpen(true);
  };

  const openOpenTrainResearchModal = () => {
    setIsOpenTrainResearchModalOpen(true);
  };

  const addApplication = (app: ApplicationRecord) => {
    setApplications(prev => {
      const exists = prev.find(a => a.jobId === app.jobId);
      if (exists) {
        showToast(`Updated application status for ${app.company}`, 'info');
        const updated = prev.map(a => a.jobId === app.jobId ? { ...a, ...app } : a);
        if (firebaseUser) {
          saveApplicationToCloud(firebaseUser.uid, { ...exists, ...app }).catch(e => console.warn('[Firestore] Application save notice:', e));
        }
        return updated;
      }
      showToast(`Added ${app.jobTitle} at ${app.company} to your Tracker!`, 'success');
      if (firebaseUser) {
        saveApplicationToCloud(firebaseUser.uid, app).catch(e => console.warn('[Firestore] Application create notice:', e));
      }
      return [app, ...prev];
    });
  };

  const updateApplicationStatus = (id: string, status: ApplicationRecord['status']) => {
    setApplications(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, status } : a);
      const target = updated.find(a => a.id === id);
      if (target && firebaseUser) {
        saveApplicationToCloud(firebaseUser.uid, target).catch(e => console.warn('[Firestore] Application update notice:', e));
      }
      return updated;
    });
    showToast(`Application moved to ${status.toUpperCase()}`, 'info');
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    if (firebaseUser) {
      deleteApplicationFromCloud(firebaseUser.uid, id).catch(e => console.warn('[Firestore] Application delete notice:', e));
    }
    showToast('Application deleted', 'info');
  };

  const resetSearchFilters = () => {
    setSearchFilters(DEFAULT_FILTERS);
  };

  const switchPlan = (plan: 'free' | 'pro') => {
    setUserProfile(prev => {
      const next = { ...prev, subscriptionPlan: plan };
      if (firebaseUser) {
        saveUserProfileToCloud(firebaseUser.uid, next).catch(e => console.warn('[Firestore] Plan save notice:', e));
      }
      return next;
    });
    showToast(`Switched plan to ${plan.toUpperCase()}`, 'info');
  };

  const upgradeToPro = () => {
    setUserProfile(prev => {
      const next: UserCareerProfile = {
        ...prev,
        subscriptionPlan: 'pro',
        aiAssistsRemaining: 9999,
        aiAssistsLimit: 9999
      };
      if (firebaseUser) {
        saveUserProfileToCloud(firebaseUser.uid, next).catch(e => console.warn('[Firestore] Upgrade save notice:', e));
      }
      return next;
    });
    setIsUpgradeModalOpen(false);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast('Welcome to Findjobber PRO! All career intelligence features unlocked.', 'success');
  };

  const openExploreResumeFlow = (targetRole?: string) => {
    if (targetRole) {
      setResumeExploreTargetRole(targetRole);
    }
    setIsExploreResumeModalOpen(true);
  };

  const openTaskPlatformIntelligence = (platformData: any) => {
    setSelectedPlatformForIntelligence(platformData);
    setIsTaskIntelligenceModalOpen(true);
  };

  const closeTaskPlatformIntelligence = () => {
    setIsTaskIntelligenceModalOpen(false);
  };

  const openTaskAssistant = (taskData: any, initialTab: 'analyze' | 'complete' | 'qa' = 'analyze') => {
    setSelectedTaskForAssistant(taskData);
    setTaskAssistantInitialTab(initialTab);
    setIsTaskAssistantModalOpen(true);
  };

  const closeTaskAssistant = () => {
    setIsTaskAssistantModalOpen(false);
  };

  const openInAppApply = (job: Job) => {
    setInAppBrowserState({
      isOpen: true,
      url: job.applicationUrl,
      job,
      title: `${job.title} — ${job.company}`,
      source: job.source
    });
  };

  const openInAppBrowser = (url: string, job?: Job | null, title?: string) => {
    setInAppBrowserState({
      isOpen: true,
      url,
      job: job || null,
      title: title || (job ? `${job.title} — ${job.company}` : url),
      source: job?.source || 'External Portal'
    });
  };

  const closeInAppBrowser = () => {
    setInAppBrowserState(prev => ({ ...prev, isOpen: false }));
  };

  const openPostJobModal = () => {
    setIsPostJobModalOpen(true);
  };

  const openEmailAlertModal = () => {
    setIsEmailAlertModalOpen(true);
  };

  const submitNewJobPosting = async (jobData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/jobs/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Job published successfully!', 'success');
        return true;
      } else {
        showToast(data.error || 'Failed to post job. Please check fields.', 'error');
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Error submitting job posting', 'error');
      return false;
    }
  };

  const subscribeEmailAlerts = async (email: string, track?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, track })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Subscribed to free remote job alerts!', 'success');
        return true;
      } else {
        showToast(data.error || 'Subscription failed. Please check email.', 'error');
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Error subscribing to alerts', 'error');
      return false;
    }
  };

  const consumeAiAssist = (): boolean => {
    // 100% Free Open Platform: No user paywalls, unlimited career assists
    return true;
  };

  const runSkillsSync = async (options: {
    resumeText?: string;
    fileName?: string;
    base64?: string;
    mimeType?: string;
    priority?: 'standard' | 'aggressive' | 'strict';
    customTech?: string[];
  } = {}): Promise<SkillsSyncResponse | null> => {
    setIsSkillsSyncing(true);
    setSkillsSyncProgress(15);
    setSkillsSyncStatusText('Initializing ATS Tokenizer & Deep Document Parser...');

    try {
      const textToUse = options.resumeText || userProfile.cvText || '';
      const nameToUse = options.fileName || userProfile.uploadedResumeName || 'Obed_Asekhamen_Data_Dev_CV_2026.pdf';
      const base64ToUse = options.base64 || userProfile.uploadedResumeBase64;
      const mimeToUse = options.mimeType || userProfile.uploadedResumeMimeType;
      const priorityToUse = options.priority || userProfile.skillsSync?.matchPriorityLevel || 'aggressive';
      const customTechToUse = options.customTech || [];

      // Step 2 timer simulation for rich UX feedback
      const timer1 = setTimeout(() => {
        setSkillsSyncProgress(45);
        setSkillsSyncStatusText('Scanning 150+ frameworks, UI libraries & runtime stacks...');
      }, 450);

      const timer2 = setTimeout(() => {
        setSkillsSyncProgress(75);
        setSkillsSyncStatusText('Classifying Primary Stack & Calibrating "For You" weights...');
      }, 950);

      const response = await syncSkillsFromResumeApi({
        cvText: textToUse,
        uploadedResumeName: nameToUse,
        uploadedResumeBase64: base64ToUse,
        uploadedResumeMimeType: mimeToUse,
        candidateProfile: userProfile,
        priorityLevel: priorityToUse,
        customTechnologiesToAdd: customTechToUse
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      setSkillsSyncProgress(95);
      setSkillsSyncStatusText('Finalizing live match indexing & cloud persistence...');

      if (response && response.success) {
        setUserProfile(prev => {
          const next: UserCareerProfile = {
            ...prev,
            ...(response.updatedProfile || {}),
            skillsSync: response.syncData
          };
          if (firebaseUser) {
            saveUserProfileToCloud(firebaseUser.uid, next).catch(e => console.warn('[Firestore] Profile sync save notice:', e));
          }
          return next;
        });

        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 }
        });

        showToast(response.message || `Skills Sync complete! ${response.syncData.extractedTechnologies.length} technologies synced to For You algorithm.`, 'success');
        setSkillsSyncProgress(100);
        return response;
      } else {
        showToast('Skills scan completed with local heuristic matching.', 'info');
        return null;
      }
    } catch (err: any) {
      console.error('[AppContext] Skills Sync error:', err);
      showToast(err?.message || 'Failed to sync skills from resume', 'error');
      return null;
    } finally {
      setTimeout(() => {
        setIsSkillsSyncing(false);
        setSkillsSyncProgress(0);
        setSkillsSyncStatusText('');
      }, 500);
    }
  };

  const toggleFrameworkPriority = (techName: string) => {
    setUserProfile(prev => {
      if (!prev.skillsSync) return prev;
      const currentTechs = [...(prev.skillsSync.extractedTechnologies || [])];
      const targetIdx = currentTechs.findIndex(t => t.name.toLowerCase() === techName.toLowerCase());
      
      if (targetIdx >= 0) {
        const currentItem = currentTechs[targetIdx];
        const newPriority = !currentItem.isPriority;
        currentTechs[targetIdx] = {
          ...currentItem,
          isPriority: newPriority,
          priorityMultiplier: newPriority ? 2.2 : 1.2
        };
      }

      const updatedSyncData: SkillsSyncData = {
        ...prev.skillsSync,
        extractedTechnologies: currentTechs,
        lastSyncedAt: new Date().toISOString()
      };

      const next: UserCareerProfile = {
        ...prev,
        skillsSync: updatedSyncData
      };

      if (firebaseUser) {
        saveUserProfileToCloud(firebaseUser.uid, next).catch(e => console.warn('[Firestore] Priority update notice:', e));
      }
      return next;
    });
    showToast(`Updated matching priority for "${techName}"`, 'info');
  };

  const addCustomTechnology = (techName: string, category: string = 'framework') => {
    const trimmed = techName.trim();
    if (!trimmed) return;

    setUserProfile(prev => {
      const sync = prev.skillsSync || {
        lastSyncedAt: new Date().toISOString(),
        extractedTechnologies: [],
        primaryStack: [],
        frameworksList: [],
        languagesList: [],
        databasesList: [],
        toolsList: [],
        syncedJobsMatchCount: 0,
        matchPriorityLevel: 'aggressive'
      };

      if (sync.extractedTechnologies.some(t => t.name.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }

      const isFw = category === 'framework' || /react|next|fastapi|django|pandas|tailwind|vue|flutter/i.test(trimmed);
      const isDb = category === 'database' || /sql|postgres|mongo|redis|snowflake/i.test(trimmed);
      const isLang = category === 'language' || /python|typescript|javascript|go|rust|java/i.test(trimmed);

      const newTech: SyncedTechnologyItem = {
        name: trimmed,
        category: (category as any) || (isFw ? 'framework' : isDb ? 'database' : isLang ? 'language' : 'tool'),
        confidence: 100,
        yearsOrProficiency: 'User Verified',
        sourceContext: 'Added via Settings Matrix',
        isPriority: true,
        priorityMultiplier: 2.2
      };

      const newExtracted = [newTech, ...sync.extractedTechnologies];
      const newFwList = isFw && !sync.frameworksList.includes(trimmed) ? [trimmed, ...sync.frameworksList] : sync.frameworksList;
      const newPrimary = !sync.primaryStack.includes(trimmed) ? [trimmed, ...sync.primaryStack] : sync.primaryStack;

      const updatedSyncData: SkillsSyncData = {
        ...sync,
        extractedTechnologies: newExtracted,
        frameworksList: newFwList,
        primaryStack: newPrimary,
        lastSyncedAt: new Date().toISOString()
      };

      const next: UserCareerProfile = {
        ...prev,
        skills: Array.from(new Set([...(prev.skills || []), trimmed])),
        frameworks: newFwList,
        skillsSync: updatedSyncData
      };

      if (firebaseUser) {
        saveUserProfileToCloud(firebaseUser.uid, next).catch(e => console.warn('[Firestore] Custom tech save notice:', e));
      }
      return next;
    });
    showToast(`Added "${trimmed}" to your Synced Technology Matrix`, 'success');
  };

  const removeSyncedTechnology = (techName: string) => {
    setUserProfile(prev => {
      if (!prev.skillsSync) return prev;
      const filteredTech = prev.skillsSync.extractedTechnologies.filter(t => t.name.toLowerCase() !== techName.toLowerCase());
      const filteredFw = prev.skillsSync.frameworksList.filter(f => f.toLowerCase() !== techName.toLowerCase());
      const filteredPrimary = prev.skillsSync.primaryStack.filter(p => p.toLowerCase() !== techName.toLowerCase());

      const updatedSyncData: SkillsSyncData = {
        ...prev.skillsSync,
        extractedTechnologies: filteredTech,
        frameworksList: filteredFw,
        primaryStack: filteredPrimary,
        lastSyncedAt: new Date().toISOString()
      };

      const next: UserCareerProfile = {
        ...prev,
        skillsSync: updatedSyncData
      };

      if (firebaseUser) {
        saveUserProfileToCloud(firebaseUser.uid, next).catch(e => console.warn('[Firestore] Remove tech notice:', e));
      }
      return next;
    });
    showToast(`Removed "${techName}" from Synced Technologies`, 'info');
  };

  const updateSyncPriorityLevel = (level: 'standard' | 'aggressive' | 'strict') => {
    setUserProfile(prev => {
      if (!prev.skillsSync) return prev;
      const updatedSyncData: SkillsSyncData = {
        ...prev.skillsSync,
        matchPriorityLevel: level,
        lastSyncedAt: new Date().toISOString()
      };
      const next: UserCareerProfile = {
        ...prev,
        skillsSync: updatedSyncData
      };
      if (firebaseUser) {
        saveUserProfileToCloud(firebaseUser.uid, next).catch(e => console.warn('[Firestore] Priority level notice:', e));
      }
      return next;
    });
    showToast(`Updated For You matching strictness to ${level.toUpperCase()}`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        firebaseUser,
        isAuthLoading,
        isCloudSyncing,
        loginWithGoogle,
        signUpWithEmail,
        loginWithEmail,
        resetPassword,
        logout,
        userProfile,
        updateUserProfile,
        activeTab,
        setActiveTab,
        savedJobIds,
        toggleSaveJob,
        watchedCompanyIds,
        toggleWatchCompany,
        isCompanyWatched,
        companyNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        simulateNewCompanyJob,
        applications,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        selectedJobForDetails,
        setSelectedJobForDetails,
        selectedJobForPitch,
        setSelectedJobForPitch,
        selectedJobForScoreBreakdown,
        setSelectedJobForScoreBreakdown,
        selectedJobForCoverLetter,
        setSelectedJobForCoverLetter,
        isCoverLetterModalOpen,
        setIsCoverLetterModalOpen,
        openCoverLetterModalForJob,
        selectedJobForResumeReshape,
        setSelectedJobForResumeReshape,
        isResumeReshapeModalOpen,
        setIsResumeReshapeModalOpen,
        openResumeReshaperModalForJob,
        isMicro1ResearchModalOpen,
        setIsMicro1ResearchModalOpen,
        openMicro1ResearchModal,
        isOpenTrainResearchModalOpen,
        setIsOpenTrainResearchModalOpen,
        openOpenTrainResearchModal,
        isTaskIntelligenceModalOpen,
        setIsTaskIntelligenceModalOpen,
        selectedPlatformForIntelligence,
        setSelectedPlatformForIntelligence,
        openTaskPlatformIntelligence,
        closeTaskPlatformIntelligence,
        isTaskAssistantModalOpen,
        setIsTaskAssistantModalOpen,
        selectedTaskForAssistant,
        taskAssistantInitialTab,
        openTaskAssistant,
        closeTaskAssistant,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        isExploreResumeModalOpen,
        setIsExploreResumeModalOpen,
        openExploreResumeFlow,
        inAppBrowserState,
        openInAppApply,
        openInAppBrowser,
        closeInAppBrowser,
        matchedResumeJobs,
        setMatchedResumeJobs,
        resumeExploreTargetRole,
        setResumeExploreTargetRole,
        resumeCandidateProfile,
        setResumeCandidateProfile,
        isSkillsSyncing,
        skillsSyncProgress,
        skillsSyncStatusText,
        runSkillsSync,
        toggleFrameworkPriority,
        addCustomTechnology,
        removeSyncedTechnology,
        updateSyncPriorityLevel,
        searchFilters,
        setSearchFilters,
        resetSearchFilters,
        isSidebarOpen,
        setIsSidebarOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        switchPlan,
        upgradeToPro,
        consumeAiAssist,
        isPostJobModalOpen,
        setIsPostJobModalOpen,
        openPostJobModal,
        isEmailAlertModalOpen,
        setIsEmailAlertModalOpen,
        openEmailAlertModal,
        submitNewJobPosting,
        subscribeEmailAlerts,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold transition-all transform animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-[#1A1A1A] border-[#00875A]/40 text-white shadow-black/20'
                : toast.type === 'error'
                ? 'bg-[#1A1A1A] border-rose-500/40 text-rose-200 shadow-black/20'
                : 'bg-[#1A1A1A] border-[#EDE8DF]/20 text-white shadow-black/20'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
              toast.type === 'success' ? 'bg-[#00875A] text-white' : toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-[#D84315] text-white'
            }`}>
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <p className="flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#A39E93] hover:text-white text-xs opacity-80 ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

