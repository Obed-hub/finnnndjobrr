export type LocationTier = 
  | 'tier1_nigeria'     // Nigeria Explicit (Lagos, Abuja, Remote Nigeria)
  | 'tier2_africa'      // Africa Eligible (Sub-Saharan Africa, African countries)
  | 'tier3_worldwide'   // Worldwide / Global Remote
  | 'tier4_contractor'  // Contractor Friendly (Deel, Remote, Wise, Payoneer)
  | 'tier5_emea_wat'    // EMEA / WAT Friendly (GMT, GMT+1, GMT+2)
  | 'restricted';       // US Only, UK Only, EU Auth Required

export type ScamRiskLevel = 'verified' | 'caution' | 'high_risk';

export type SalaryVerificationType = 'verified' | 'advertised' | 'estimated' | 'not_disclosed';

export type FreshnessCategory = 'fresh' | 'recent' | 'aging' | 'stale';

export type EmploymentType = 
  | 'full_time' 
  | 'contract' 
  | 'freelance' 
  | 'bounty' 
  | 'ai_task' 
  | 'part_time' 
  | 'internship' 
  | 'micro_task' 
  | 'grant';

export type PayoutCompatibility = 'high' | 'medium' | 'unknown' | 'unsupported';

export interface ScoreBreakdown {
  eligibility: number;       // max 25
  roleMatch: number;         // max 20
  skillMatch: number;        // max 15
  compensation: number;      // max 10
  employerVerification: number; // max 10
  applicationAccessibility: number; // max 5
  timezoneCompatibility: number; // max 5
  experienceMatch: number;   // max 5
  freshness: number;         // max 5
  total: number;             // max 100
  notes: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  source: string;
  sourceJobId?: string;
  sourcesFoundCount?: number;
  sourcesList?: string[];
  officialUrl: string;
  applicationUrl: string;
  location: string;
  locationTier: LocationTier;
  locationTierLabel: string;
  countriesAllowed?: string[];
  countriesExcluded?: string[];
  remoteType: 'Fully Remote' | 'Hybrid' | 'Contractor Remote';
  employmentType: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: 'year' | 'month' | 'hour' | 'project';
  salaryFormatted?: string;
  salaryVerification: SalaryVerificationType;
  experienceLevel: 'no_experience' | '0_1_years' | '1_2_years' | '2_plus_years' | 'senior';
  experienceLabel: string;
  category: string;
  skills: string[];
  atsKeywords: string[];
  payoutMethod: string;
  payoutCompatibility: PayoutCompatibility;
  timezoneRequirement?: string;
  postedAt: string;
  discoveredAt: string;
  lastVerifiedAt: string;
  verificationStatus: 'Official Employer' | 'Official ATS' | 'Trusted Job Board' | 'Verified Platform' | 'External / Unverified';
  scamRisk: ScamRiskLevel;
  scamRiskReason?: string;
  opportunityScore: number;
  scoreBreakdown: ScoreBreakdown;
  matchScore: number;
  matchingSkills?: string[];
  matchingReasons?: string[];
  matchedFrameworks?: string[];
  frameworkMatchScore?: number;
  freshness: FreshnessCategory;
  isNigeriaEligible: boolean;
  isAfricaEligible: boolean;
  isBeginnerFriendly: boolean;
  isDirectApply: boolean;
  actionRecommendation?: 'Apply Now' | 'Consider' | 'Skill Gap' | 'Avoid' | string;
  isLinkVerified?: boolean;
  verifiedPortalUrl?: string;
  searchFallbackUrl?: string;
  isFeatured?: boolean;
  featuredUntil?: string;
  isSponsored?: boolean;
}

export interface UserCareerProfile {
  id: string;
  name: string;
  email: string;
  country: string;
  city?: string;
  timezone: string;
  targetRoles: string[];
  experienceLevel: string;
  yearsOfExperience: number;
  skills: string[];
  tools: string[];
  programmingLanguages: string[];
  certifications: string[];
  education: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  cvText?: string;
  uploadedResumeName?: string;
  uploadedResumeBase64?: string;
  uploadedResumeMimeType?: string;
  uploadedResumeDate?: string;
  preferredSalaryMin: number;
  preferredCurrency: string;
  availability: string;
  preferredContractType: string;
  preferredPayoutMethods: string[];
  careerReadinessScore: number;
  readinessImprovements: string[];
  subscriptionPlan: 'free' | 'pro';
  aiAssistsRemaining: number;
  aiAssistsLimit: number;
  hasCompletedOnboarding?: boolean;
  careerTrack?: string;
  careerTracks?: string[];
  preferredWorkTypes?: string[];
  hasCompletedResumeJobMatch?: boolean;
  matchedJobsCount?: number;
  lastAnalyzedResumeName?: string;
  frameworks?: string[];
  skillsSync?: SkillsSyncData;
}

export interface SyncedTechnologyItem {
  name: string;
  category: 'framework' | 'language' | 'database' | 'tool' | 'cloud' | 'architecture' | 'ai_ml';
  confidence: number; // 0 - 100
  yearsOrProficiency?: string;
  sourceContext?: string;
  isPriority?: boolean;
  priorityMultiplier?: number;
}

export interface SkillsSyncData {
  lastSyncedAt: string;
  scannedResumeName?: string;
  detectedSeniority?: string;
  detectedCoreRole?: string;
  extractedTechnologies: SyncedTechnologyItem[];
  primaryStack: string[];
  frameworksList: string[];
  languagesList: string[];
  databasesList: string[];
  toolsList: string[];
  cloudList?: string[];
  syncedJobsMatchCount: number;
  matchPriorityLevel: 'standard' | 'aggressive' | 'strict';
  syncSummary?: string;
}

export interface SkillsSyncResponse {
  success: boolean;
  syncData: SkillsSyncData;
  updatedProfile: Partial<UserCareerProfile>;
  matchingJobsCount: number;
  sampleMatchedJobs?: Job[];
  message: string;
}

export interface MatchedJobItem extends Job {
  resumeMatchScore: number;
  matchReason: string;
}

export interface InAppBrowserState {
  isOpen: boolean;
  url: string;
  job?: Job | null;
  title?: string;
  source?: string;
}

export interface ResumeExploreMatchResponse {
  success: boolean;
  candidateProfile: {
    candidateName: string;
    detectedRole: string;
    experienceLevel: string;
    coreSkills: string[];
    atsReadinessScore: number;
    careerSummary: string;
  };
  matchedJobs: MatchedJobItem[];
  totalMatchedCount: number;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  salary?: string;
  status: 'saved' | 'planning' | 'applied' | 'assessment' | 'interview' | 'final_interview' | 'offer' | 'rejected' | 'withdrawn';
  appliedAt?: string;
  interviewDate?: string;
  followUpDate?: string;
  notes?: string;
  coverLetter?: string;
  pitch?: string;
  resumeVersion?: string;
  recruiterContact?: string;
  matchScore?: number;
  officialUrl?: string;
}

export interface AfricaCompany {
  id: string;
  name: string;
  logo: string;
  country: string;
  headquarters: string;
  industry: string;
  stage: string;
  website: string;
  careerUrl: string;
  atsProvider: string;
  remotePolicy: string;
  techStack: string[];
  currentVacanciesCount: number;
  lastChecked: string;
  isWatched?: boolean;
  description: string;
  funding?: string;
  verifiedHiring: boolean;
  alertEnabled?: boolean;
}

export interface CompanyJobNotification {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  jobId: string;
  jobTitle: string;
  salaryFormatted?: string;
  locationTierLabel?: string;
  timestamp: string;
  isRead: boolean;
  employmentType?: string;
}

export type CoverLetterTone = 'professional_persuasive' | 'technical_metrics' | 'startup_proactive' | 'career_transition';

export interface CoverLetterResponse {
  coverLetter: string;
  subjectLine?: string;
  keyStrengthsHighlighted: string[];
  atsKeywordsMatched: string[];
  persuasionHighlights: string[];
}

export interface JobIntelligence {
  executiveSummary: string;
  roleReality: string;
  whatTheyReallyWant: string[];
  candidateStrengths: string[];
  candidateSkillGaps: string[];
  strategicAdvice: string;
  likelyInterviewQuestions: Array<{
    question: string;
    whyTheyAsk: string;
    sampleAnswer: string;
  }>;
  smartQuestionsToAskEmployer: string[];
  redFlagsOrScamCheck: {
    status: 'verified_safe' | 'caution';
    details: string;
  };
}

export interface JobQAMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AIWorkJob {
  id: string;
  platform: string;
  logo: string;
  roleTitle: string;
  category: 'AI Trainer' | 'LLM Evaluator' | 'Data Annotator' | 'Prompt Engineer' | 'Coding Evaluator' | 'Search Quality' | 'Speech & Audio' | 'Customer Support' | 'Website Testing' | 'Online Tutoring' | 'Data Entry' | 'Content Moderation' | 'Transcription & Audio' | 'Freelance & Gigs' | 'Micro-tasks & Surveys' | string;
  advertisedRate: string;
  verifiedRate: string;
  ratePeriod: string;
  paymentFrequency: string;
  payoutMethods: string[];
  countriesAllowed: string[];
  isNigeriaEligible: boolean;
  onboardingRequirements: string[];
  officialUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  scamRisk: ScamRiskLevel;
  lastVerified: string;
  activeOpenings: boolean;
}

export interface BountyItem {
  id: string;
  title: string;
  platform: 'Superteam Earn' | 'Gitcoin' | 'Layer3' | 'Dework' | 'Official Protocol';
  category: 'Coding' | 'Design' | 'Writing' | 'Research' | 'Marketing' | 'Community' | 'Translation' | 'Bug Bounty' | 'Grants';
  reward: string;
  rewardUsdEquivalent: number;
  currency: 'USDC' | 'USDT' | 'SOL' | 'ETH' | 'USD';
  deadline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsRequired: string[];
  walletRequirement: string;
  countryRestrictions: string;
  payoutMechanism: string;
  officialSource: string;
  scamRisk: ScamRiskLevel;
  estimatedHours: number;
  estimatedPerHour: string;
}

export interface ConnectorHealth {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'failed' | 'disabled';
  jobsCount: number;
  lastSync: string;
  latencyMs: number;
  jobsAddedToday: number;
  jobsUpdated: number;
  errorsCount: number;
  lastError?: string;
  targetUrl?: string;
  category?: string;
  description?: string;
  isCustomUrl?: boolean;
}

export interface DeepResearchOpportunityTrack {
  trackTitle: string;
  rolesIncluded: string[];
  payRange: string;
  commitment: string;
  keySkills: string[];
  vettingSteps: string[];
  demandLevel: 'Very High' | 'High' | 'Moderate';
}

export interface RelatedPlatformComparison {
  name: string;
  url: string;
  category: string;
  payRange: string;
  vettingMethod: string;
  payoutRail: string;
  africaEligibility: string;
  keyDifference: string;
}

export interface Micro1DeepResearchResult {
  url: string;
  title: string;
  overview: string;
  founded: string;
  businessModel: string;
  whyHiringExperts: string;
  opportunityTracks: DeepResearchOpportunityTrack[];
  vettingProcess: {
    zaraAiInterview: {
      duration: string;
      format: string;
      focusAreas: string[];
      prepTips: string[];
    };
    avaCodingAssessment?: {
      duration: string;
      format: string;
      focusAreas: string[];
      prepTips: string[];
    };
    idVerification: string;
    matchingSpeed: string;
  };
  payoutAndContractInfo: {
    payoutProvider: string;
    paymentFrequency: string;
    acceptedCurrencies: string[];
    contractType: string;
    taxForms: string;
  };
  relatedPlatforms: RelatedPlatformComparison[];
  applicationPlaybook: string[];
}

export interface OpenTrainDeepResearchResult {
  url: string;
  title: string;
  overview: string;
  founded: string;
  businessModel: string;
  whyHighPay: string;
  opportunityTracks: DeepResearchOpportunityTrack[];
  portfolioSystem: {
    description: string;
    benefits: string[];
    reputationPortability: string;
  };
  vettingProcess: {
    screening: {
      duration: string;
      format: string;
      focusAreas: string[];
      prepTips: string[];
    };
    idVerification: string;
    matchingSpeed: string;
  };
  payoutAndContractInfo: {
    payoutProvider: string;
    paymentFrequency: string;
    acceptedCurrencies: string[];
    contractType: string;
    nigeriaSupport: string;
  };
  peerPlatforms: RelatedPlatformComparison[];
  applicationPlaybook: string[];
}

export interface JobAlertConfig {
  id: string;
  title: string;
  roleKeyword: string;
  location: string;
  minSalary?: number;
  isNigeriaOnly: boolean;
  channel: 'email' | 'telegram' | 'in_app' | 'whatsapp';
  frequency: 'instant' | 'daily' | 'weekly';
  active: boolean;
  createdAt: string;
  matchesCount: number;
}

export interface SearchFilterState {
  keyword: string;
  targetRole: string;
  locationTier: string;
  isNigeriaEligible: boolean;
  isAfricaEligible: boolean;
  isWorldwide: boolean;
  experienceLevel: string;
  employmentType: string;
  category: string;
  minSalary: number;
  currency: string;
  verifiedEmployerOnly: boolean;
  directApplyOnly: boolean;
  salaryDisclosedOnly: boolean;
  minOpportunityScore: number;
  minMatchScore: number;
  resumeMatchedOnly?: boolean;
  freshness: string;
  payoutMethod: string;
  sortBy: 'recommended' | 'match' | 'opportunity' | 'freshness' | 'salary';
}

export interface BulletPointRewrite {
  original: string;
  reshaped: string;
  impactMetric: string;
  matchingSkill: string;
}

export interface ResumeMatchInsights {
  initialAtsScore: number;
  projectedAtsScore: number;
  matchGrade: string;
  alignmentVerdict: string;
  topMatchingStrengths: string[];
  criticalGapsAddressed: string[];
  remoteTimezoneFit: string;
  recommendationNote: string;
}

export interface ResumeReshapeResponse {
  reshapedSummary: string;
  targetJobTitle: string;
  targetCompany: string;
  atsMatchScoreProjected: number;
  atsMatchScoreBefore: number;
  injectedKeywords: string[];
  bulletPointRewrites: BulletPointRewrite[];
  tailoredSkillsList: string[];
  fullReshapedResume: string;
  keyChangesSummary: string[];
  interviewTalkingPoints: string[];
  matchInsights?: ResumeMatchInsights;
  uploadedFileName?: string;
  strongMatches?: string[];
  missingKeywords?: string[];
  quantifiableAchievementsScore?: number;
  formattingScore?: number;
  roleAlignmentScore?: number;
  actionableRecommendations?: string[];
}

export interface TaskPlatformMilestone {
  milestone: number;
  title: string;
  description: string;
  actionableChecklist: string[];
  insiderTip: string;
}

export interface TaskAnalysisResult {
  taskTitle: string;
  platform: string;
  category: string;
  rewardOrRate: string;
  executiveSummary: string;
  deliverablesList: string[];
  timeEstimateMinutes: number | string;
  hourlyRoiEstimate: string;
  difficultyRating: 'Beginner' | 'Intermediate' | 'Expert';
  feasibilityScore: number;
  acceptanceCriteria: string[];
  rejectionTraps: string[];
  requiredTools: string[];
  proTips: string[];
}

export interface TaskCompletionResult {
  taskTitle: string;
  platform: string;
  deliverableDraft: string;
  stepByStepWorkflow: Array<{
    stepNumber: number;
    title: string;
    detail: string;
    status?: boolean;
  }>;
  qualityRubricChecks: Array<{
    criterion: string;
    tip: string;
    passed?: boolean;
  }>;
  edgeCasesToTest: string[];
  submissionNotes: string;
}

export interface TaskQAMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface TaskPlatformResearchResponse {
  success: boolean;
  platform: string;
  roleTitle: string;
  category: string;
  verifiedRate: string;
  executiveSummary: string;
  earningReality: {
    hourlyRange: string;
    dailyEarningsPotential: string;
    monthlyEarningsPotential: string;
    payoutSpeed: string;
    payoutRails: string[];
    timelineToFirstDollar: string;
  };
  firstDollarRoadmap: TaskPlatformMilestone[];
  screeningAssessmentStrategy: {
    testType: string;
    passingBenchmark: string;
    commonFailureTraps: string[];
    cheatSheetOrPrepAdvice: string;
  };
  africanAndNigeriaPayoutSetup: {
    bestPayoutMethod: string;
    setupInstructions: string[];
    taxOrW8BenAdvice: string;
    currencyConversionTip: string;
  };
  firstTaskSnaggingTricks: string[];
  banPreventionAndCompliance: string[];
  aiGuidanceMessage: string;
}

