import { Job, AfricaCompany, AIWorkJob, BountyItem, ConnectorHealth, UserCareerProfile } from '../types';

export async function fetchJobs(params: Record<string, any> = {}): Promise<{ jobs: Job[]; count: number; meta: any }> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'all') {
      query.append(k, String(v));
    }
  });

  const res = await fetch(`/api/jobs?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function refreshJobsApi(): Promise<{ success: boolean; message: string; count: number; liveSync: any }> {
  const res = await fetch('/api/jobs/refresh', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to refresh real-time jobs feed');
  return res.json();
}

export async function fetchJobsLiveStatusApi(): Promise<{ success: boolean; count: number; bountiesCount: number; liveSync: any }> {
  const res = await fetch('/api/jobs/live-status');
  if (!res.ok) throw new Error('Failed to fetch live jobs status');
  return res.json();
}

export async function fetchJobById(id: string): Promise<Job> {
  const res = await fetch(`/api/jobs/${id}`);
  if (!res.ok) throw new Error('Job not found');
  const data = await res.json();
  return data.job;
}

export async function fetchCompanies(): Promise<AfricaCompany[]> {
  const res = await fetch('/api/companies');
  if (!res.ok) throw new Error('Failed to fetch companies');
  const data = await res.json();
  return data.companies;
}

export async function toggleWatchCompany(id: string): Promise<boolean> {
  const res = await fetch(`/api/companies/${id}/watch`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to toggle watch');
  const data = await res.json();
  return data.isWatched;
}

export async function fetchAIWork(): Promise<AIWorkJob[]> {
  const res = await fetch('/api/ai-work');
  if (!res.ok) throw new Error('Failed to fetch AI work');
  const data = await res.json();
  return data.aiJobs;
}

export async function fetchBounties(): Promise<BountyItem[]> {
  const res = await fetch('/api/bounties');
  if (!res.ok) throw new Error('Failed to fetch bounties');
  const data = await res.json();
  return data.bounties;
}

export async function fetchConnectors(): Promise<ConnectorHealth[]> {
  const res = await fetch('/api/connectors');
  if (!res.ok) throw new Error('Failed to fetch connectors');
  const data = await res.json();
  return data.connectors;
}

export async function refreshConnectorsApi(): Promise<ConnectorHealth[]> {
  const res = await fetch('/api/connectors/refresh', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to refresh connectors');
  const data = await res.json();
  return data.connectors;
}

export async function generateTailoredPitchApi(payload: {
  jobTitle: string;
  company: string;
  jobDescription: string;
  userSkills: string[];
  userCv?: string;
  targetRole?: string;
}): Promise<{ pitch: string; coverLetter: string; recruiterMessage: string; interviewPoints: string[] }> {
  const res = await fetch('/api/gemini/tailor-pitch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to generate tailored pitch');
  return res.json();
}

export async function getJobIntelligenceApi(payload: {
  jobTitle: string;
  company: string;
  jobDescription: string;
  userSkills: string[];
  userCv?: string;
  targetRole?: string;
}): Promise<{ success: boolean; intelligence: import('../types').JobIntelligence }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch('/api/gemini/job-intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('Failed to fetch job intelligence');
    return res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function askJobQuestionApi(payload: {
  jobTitle: string;
  company: string;
  jobDescription: string;
  userSkills: string[];
  userCv?: string;
  question: string;
  chatHistory?: Array<{ sender: 'user' | 'ai'; text: string }>;
}): Promise<{ success: boolean; answer: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('/api/gemini/job-qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('Failed to submit question to AI');
    return res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function generateCoverLetterApi(payload: {
  jobTitle: string;
  company: string;
  jobDescription: string;
  candidateProfile?: Partial<UserCareerProfile>;
  tone?: string;
  customFocusPoints?: string;
}): Promise<{
  coverLetter: string;
  subjectLine?: string;
  keyStrengthsHighlighted: string[];
  atsKeywordsMatched: string[];
  persuasionHighlights: string[];
}> {
  const res = await fetch('/api/gemini/generate-cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to generate tailored cover letter');
  return res.json();
}

export async function analyzeResumeApi(payload: {
  cvText: string;
  targetJobTitle?: string;
  targetJobSkills?: string[];
  targetJobDescription?: string;
}): Promise<{
  atsScore: number;
  overallVerdict: string;
  strongMatches: string[];
  missingKeywords: string[];
  quantifiableAchievementsScore: number;
  formattingScore: number;
  roleAlignmentScore: number;
  bulletPointImprovements: Array<{ original: string; improved: string }>;
  actionableRecommendations: string[];
}> {
  const res = await fetch('/api/gemini/resume-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to analyze resume');
  return res.json();
}

export async function parseNaturalLanguageSearchApi(query: string): Promise<any> {
  const res = await fetch('/api/gemini/nl-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('Failed to parse search');
  const data = await res.json();
  return data.structuredFilters;
}

export async function generateCareerRoadmapApi(payload: {
  targetRole: string;
  experienceLevel: string;
  skills: string[];
}): Promise<{ targetRole: string; phases: Array<{ phaseName: string; goals: string[] }> }> {
  const res = await fetch('/api/gemini/career-coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to generate career plan');
  return res.json();
}

export async function reshapeResumeApi(payload: {
  jobTitle: string;
  company: string;
  jobDescription?: string;
  jobSkills?: string[];
  jobAtsKeywords?: string[];
  candidateProfile?: any;
  customFocus?: string;
  mode?: 'full' | 'bullets' | 'summary';
  uploadedResumeBase64?: string;
  uploadedResumeMimeType?: string;
  uploadedResumeName?: string;
  uploadedResumeText?: string;
}): Promise<import('../types').ResumeReshapeResponse> {
  const res = await fetch('/api/gemini/reshape-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to reshape resume');
  return res.json();
}

export async function fetchMicro1ResearchApi(): Promise<{
  success: boolean;
  research: import('../types').Micro1DeepResearchResult;
  liveJobsCount: number;
  liveJobs: Job[];
}> {
  const res = await fetch('/api/fetcher/micro1/research');
  if (!res.ok) throw new Error('Failed to fetch Micro1 research');
  return res.json();
}

export async function syncMicro1FetcherApi(): Promise<{
  success: boolean;
  message: string;
  connector: ConnectorHealth;
  jobsCount: number;
  jobs: Job[];
}> {
  const res = await fetch('/api/fetcher/micro1/sync', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sync Micro1 pipeline');
  return res.json();
}

export async function fetchOpenTrainResearchApi(): Promise<{
  success: boolean;
  research: import('../types').OpenTrainDeepResearchResult;
  liveJobsCount: number;
  liveJobs: Job[];
}> {
  const res = await fetch('/api/fetcher/opentrain/research');
  if (!res.ok) throw new Error('Failed to fetch OpenTrain AI research');
  return res.json();
}

export async function syncOpenTrainFetcherApi(): Promise<{
  success: boolean;
  message: string;
  connector: ConnectorHealth;
  jobsCount: number;
  jobs: Job[];
}> {
  const res = await fetch('/api/fetcher/opentrain/sync', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sync OpenTrain pipeline');
  return res.json();
}

export async function exploreMatchResumeApi(payload: {
  cvText: string;
  uploadedFileName?: string;
  targetRolePreference?: string;
}): Promise<import('../types').ResumeExploreMatchResponse> {
  const res = await fetch('/api/gemini/explore-match-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to match resume with live jobs');
  return res.json();
}

export async function fetchTaskPlatformIntelligenceApi(payload: {
  platform: string;
  roleTitle?: string;
  category?: string;
  advertisedRate?: string;
  verifiedRate?: string;
  payoutMethods?: string[];
  onboardingRequirements?: string[];
  officialUrl?: string;
  difficulty?: string;
}): Promise<import('../types').TaskPlatformResearchResponse> {
  const res = await fetch('/api/gemini/task-platform-intelligence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to fetch task platform intelligence');
  return res.json();
}

export async function askTaskPlatformQAApi(payload: {
  platform: string;
  roleTitle?: string;
  category?: string;
  question: string;
  chatHistory?: { sender: 'user' | 'ai'; text: string }[];
}): Promise<{ success: boolean; answer: string }> {
  const res = await fetch('/api/gemini/task-platform-qa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to query task platform AI advisor');
  return res.json();
}

export async function analyzeTaskApi(payload: {
  taskTitle: string;
  platform?: string;
  category?: string;
  description?: string;
  instructions?: string;
  rewardOrRate?: string;
  userSkills?: string[];
}): Promise<{ success: boolean; analysis: import('../types').TaskAnalysisResult }> {
  const res = await fetch('/api/gemini/analyze-task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to analyze task');
  return res.json();
}

export async function completeTaskApi(payload: {
  taskTitle: string;
  platform?: string;
  category?: string;
  instructions?: string;
  userDraft?: string;
  actionRequested?: 'draft' | 'refine' | 'validate' | 'code' | 'review';
}): Promise<{ success: boolean; result: import('../types').TaskCompletionResult }> {
  const res = await fetch('/api/gemini/complete-task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to complete task draft');
  return res.json();
}

export async function askTaskQAApi(payload: {
  taskTitle: string;
  platform?: string;
  category?: string;
  instructions?: string;
  question: string;
  chatHistory?: Array<{ sender: 'user' | 'ai'; text: string }>;
}): Promise<{ success: boolean; answer: string }> {
  const res = await fetch('/api/gemini/task-qa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to query Task AI');
  return res.json();
}

export async function syncSkillsFromResumeApi(payload: {
  cvText?: string;
  uploadedResumeBase64?: string;
  uploadedResumeMimeType?: string;
  uploadedResumeName?: string;
  candidateProfile?: Partial<UserCareerProfile>;
  priorityLevel?: 'standard' | 'aggressive' | 'strict';
  customTechnologiesToAdd?: string[];
}): Promise<import('../types').SkillsSyncResponse> {
  const res = await fetch('/api/gemini/skills-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to sync skills from resume');
  return res.json();
}

export async function fetchLaborXStatsApi(): Promise<{
  success: boolean;
  stats: import('./laborxAdapter').LaborXSyncMetrics;
  jobsCount: number;
  sampleJobs: Job[];
}> {
  const res = await fetch('/api/laborx/stats');
  if (!res.ok) throw new Error('Failed to fetch LaborX stats');
  return res.json();
}

export async function syncLaborXApi(): Promise<{
  success: boolean;
  message: string;
  connector: ConnectorHealth;
  stats: import('./laborxAdapter').LaborXSyncMetrics;
  jobsCount: number;
  jobs: Job[];
}> {
  const res = await fetch('/api/laborx/sync', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to synchronize LaborX data');
  return res.json();
}

export async function fetchLaborXJobsApi(): Promise<{
  success: boolean;
  count: number;
  jobs: Job[];
}> {
  const res = await fetch('/api/laborx/jobs');
  if (!res.ok) throw new Error('Failed to fetch LaborX jobs');
  return res.json();
}

// Ingestion Engine API Functions
export async function fetchIngestionSourcesApi(): Promise<{
  success: boolean;
  sources: import('./ingestion/types').SourceTelemetry[];
  count: number;
}> {
  const res = await fetch('/api/ingestion/sources');
  if (!res.ok) throw new Error('Failed to fetch ingestion sources');
  return res.json();
}

export async function fetchIngestionMetricsApi(): Promise<{
  success: boolean;
  metrics: import('./ingestion/types').GlobalIngestionMetrics;
}> {
  const res = await fetch('/api/ingestion/metrics');
  if (!res.ok) throw new Error('Failed to fetch ingestion metrics');
  return res.json();
}

export async function fetchIngestionLogsApi(limit = 100): Promise<{
  success: boolean;
  logs: import('./ingestion/types').IngestionLogEntry[];
  count: number;
}> {
  const res = await fetch(`/api/ingestion/logs?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch ingestion logs');
  return res.json();
}

export async function syncAllIngestionSourcesApi(): Promise<{
  success: boolean;
  message: string;
  resultsCount: number;
  metrics: import('./ingestion/types').GlobalIngestionMetrics;
  totalJobs: number;
}> {
  const res = await fetch('/api/ingestion/sync-all', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to run full ingestion sweep');
  return res.json();
}

export async function syncSingleSourceApi(sourceId: string): Promise<{
  success: boolean;
  result: import('./ingestion/types').IngestionResult;
  totalJobs: number;
}> {
  const res = await fetch(`/api/ingestion/sources/${sourceId}/sync`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to sync source ${sourceId}`);
  return res.json();
}

export async function testSourceConnectionApi(sourceId: string): Promise<{
  success: boolean;
  latencyMs: number;
  message: string;
  sampleCount?: number;
}> {
  const res = await fetch(`/api/ingestion/sources/${sourceId}/test`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to test connection for source ${sourceId}`);
  return res.json();
}

export async function toggleSourceEnabledApi(sourceId: string, enabled: boolean): Promise<{
  success: boolean;
  source: import('./ingestion/types').SourceTelemetry;
}> {
  const res = await fetch(`/api/ingestion/sources/${sourceId}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled })
  });
  if (!res.ok) throw new Error(`Failed to toggle source ${sourceId}`);
  return res.json();
}

export async function syncUserProfileApi(profile: Partial<UserCareerProfile>): Promise<{ success: boolean; profile: UserCareerProfile }> {
  try {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Failed to sync profile to server');
    return res.json();
  } catch (err) {
    console.warn('[API] syncUserProfile notice:', err);
    return { success: false, profile: profile as UserCareerProfile };
  }
}




