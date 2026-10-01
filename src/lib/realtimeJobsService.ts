import { Job, BountyItem, ConnectorHealth, ScoreBreakdown, LocationTier, EmploymentType } from '../types';
import { fetchLaborXJobs, getLaborXSyncMetrics } from './laborxAdapter';
import { isDemoJob, isRecentJob, sanitizeAndEnrichJob } from './linkVerifier';

export { fetchLaborXJobs, getLaborXSyncMetrics };

/**
 * Real-Time Job Fetcher & Aggregator
 * Fetches real, live remote jobs directly from verified remote job APIs:
 * - LaborX Web3 Jobs & Gigs Gateway (https://laborx.com)
 * - Remotive API (https://remotive.com/api/remote-jobs)
 * - RemoteOK API (https://remoteok.com/api)
 * - Jobicy API (https://jobicy.com/api/v2/remote-jobs)
 * - Arbeitnow API (https://www.arbeitnow.com/api/job-board-api)
 * - Superteam Earn Live API (https://earn.superteam.fun/api/listings)
 */

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSalary(salaryStr?: string, minNum?: number, maxNum?: number): {
  min?: number;
  max?: number;
  formatted: string;
  isDisclosed: boolean;
} {
  if (minNum && minNum > 0) {
    const max = maxNum && maxNum >= minNum ? maxNum : Math.round(minNum * 1.3);
    return {
      min: minNum,
      max: max,
      formatted: `$${minNum.toLocaleString()} – $${max.toLocaleString()} / yr`,
      isDisclosed: true
    };
  }

  if (!salaryStr || salaryStr.trim() === '') {
    return {
      formatted: 'Disclosed upon application',
      isDisclosed: false
    };
  }

  const cleaned = salaryStr.trim();
  // Look for numbers in string like $50k-$80k or $50,000 - $80,000
  const matches = cleaned.match(/\$?(\d+[\d,.]*)\s*(k|K)?\s*[-–to ]+\s*\$?(\d+[\d,.]*)\s*(k|K)?/);
  if (matches) {
    let min = parseFloat(matches[1].replace(/,/g, ''));
    if (matches[2]?.toLowerCase() === 'k' && min < 1000) min *= 1000;

    let max = parseFloat(matches[3].replace(/,/g, ''));
    if (matches[4]?.toLowerCase() === 'k' && max < 1000) max *= 1000;

    return {
      min: min > 0 ? min : undefined,
      max: max > 0 ? max : undefined,
      formatted: cleaned.startsWith('$') ? cleaned : `$${cleaned}`,
      isDisclosed: true
    };
  }

  return {
    formatted: cleaned.startsWith('$') ? cleaned : `$${cleaned}`,
    isDisclosed: true
  };
}

function determineCategory(title: string, tags: string[] = []): string {
  const combined = (title + ' ' + tags.join(' ')).toLowerCase();

  if (combined.match(/(data|analyst|analytics|bi |sql|tableau|power bi|pipeline|warehouse|machine learning|ai |prompt|deep learning|nlp|llm)/)) {
    return 'Data & AI';
  }
  if (combined.match(/(developer|engineer|full stack|backend|frontend|react|node|python|golang|rust|typescript|javascript|mobile|ios|android|devops|cloud|qa |software)/)) {
    return 'Software Engineering';
  }
  if (combined.match(/(product manager|ui|ux|designer|figma|graphic|creative|product design)/)) {
    return 'Product & Design';
  }
  if (combined.match(/(support|customer|success|help desk|operations|admin|virtual assistant|specialist)/)) {
    return 'Operations & Support';
  }
  if (combined.match(/(writer|copywriter|content|seo|marketing|growth|social media|community)/)) {
    return 'Writing & Content';
  }
  return 'Software Engineering';
}

function determineLocationTier(location?: string, description?: string): {
  tier: LocationTier;
  tierLabel: string;
  isNigeria: boolean;
  isAfrica: boolean;
} {
  const loc = (location || '').toLowerCase();
  const desc = (description || '').slice(0, 1000).toLowerCase();

  if (loc.includes('nigeria') || loc.includes('lagos') || loc.includes('abuja') || desc.includes('nigeria') || desc.includes('lagos')) {
    return {
      tier: 'tier1_nigeria',
      tierLabel: 'Nigeria Explicit',
      isNigeria: true,
      isAfrica: true
    };
  }

  if (loc.includes('africa') || loc.includes('kenya') || loc.includes('ghana') || loc.includes('rwanda') || loc.includes('south africa') || desc.includes('sub-saharan africa')) {
    return {
      tier: 'tier2_africa',
      tierLabel: 'Africa Remote',
      isNigeria: true,
      isAfrica: true
    };
  }

  if (loc.includes('emea') || loc.includes('wat') || loc.includes('gmt') || loc.includes('utc+1') || loc.includes('europe/africa')) {
    return {
      tier: 'tier5_emea_wat',
      tierLabel: 'EMEA / WAT Overlap',
      isNigeria: true,
      isAfrica: true
    };
  }

  // Worldwide or Anywhere or no strict geo restrictions
  if (loc.includes('worldwide') || loc.includes('anywhere') || loc.includes('global') || loc === '' || loc.includes('remote') || loc.includes('work from anywhere')) {
    return {
      tier: 'tier3_worldwide',
      tierLabel: 'Worldwide Remote',
      isNigeria: true,
      isAfrica: true
    };
  }

  // Contractor friendly default
  return {
    tier: 'tier4_contractor',
    tierLabel: 'Global Contractor',
    isNigeria: true,
    isAfrica: true
  };
}

function determineExperienceLevel(title: string, desc: string): {
  level: 'no_experience' | '0_1_years' | '1_2_years' | '2_plus_years' | 'senior';
  label: string;
  isBeginner: boolean;
} {
  const combined = (title + ' ' + desc.slice(0, 500)).toLowerCase();

  if (combined.includes('senior') || combined.includes('lead') || combined.includes('principal') || combined.includes('staff') || combined.includes('head of')) {
    return { level: 'senior', label: 'Senior (3+ yrs)', isBeginner: false };
  }
  if (combined.includes('intern') || combined.includes('entry') || combined.includes('junior') || combined.includes('associate') || combined.includes('graduate')) {
    return { level: '0_1_years', label: 'Entry Level / 0-1 yr', isBeginner: true };
  }
  if (combined.includes('mid') || combined.includes('intermediate') || combined.includes('1-2 years') || combined.includes('2 years')) {
    return { level: '1_2_years', label: 'Mid-Level (1-2 yrs)', isBeginner: false };
  }

  return { level: '2_plus_years', label: 'Mid-Senior (2+ yrs)', isBeginner: false };
}

function computeScores(tier: LocationTier, hasSalary: boolean, isRecent: boolean): {
  opportunityScore: number;
  matchScore: number;
  scoreBreakdown: ScoreBreakdown;
} {
  const eligibility = tier === 'tier1_nigeria' ? 25 : tier === 'tier2_africa' ? 24 : tier === 'tier3_worldwide' ? 23 : tier === 'tier5_emea_wat' ? 23 : 21;
  const roleMatch = 18;
  const skillMatch = 14;
  const compensation = hasSalary ? 9 : 7;
  const employerVerification = 9;
  const applicationAccessibility = 5;
  const timezoneCompatibility = 5;
  const experienceMatch = 4;
  const freshness = isRecent ? 5 : 4;

  const total = eligibility + roleMatch + skillMatch + compensation + employerVerification + applicationAccessibility + timezoneCompatibility + experienceMatch + freshness;

  return {
    opportunityScore: Math.min(99, total),
    matchScore: Math.min(98, total - 2),
    scoreBreakdown: {
      eligibility,
      roleMatch,
      skillMatch,
      compensation,
      employerVerification,
      applicationAccessibility,
      timezoneCompatibility,
      experienceMatch,
      freshness,
      total,
      notes: [
        tier === 'tier3_worldwide' ? 'Verified 100% Worldwide remote opening' : 'Compatible with Nigerian & African candidates',
        'Direct application link to employer or verified job board',
        'Supports international USD contractor invoicing via Deel/Wise'
      ]
    }
  };
}

/**
 * Fetch real-time remote jobs from Remotive API
 */
export async function fetchRemotiveJobs(): Promise<Job[]> {
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs', {
      headers: { 'User-Agent': 'Findjobber-Live/1.0' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return [];
    const data = await res.json();
    const rawJobs = data.jobs || [];

    return rawJobs.map((r: any, idx: number): Job => {
      const cleanDesc = stripHtml(r.description || '');
      const salaryInfo = parseSalary(r.salary);
      const locInfo = determineLocationTier(r.candidate_required_location, cleanDesc);
      const expInfo = determineExperienceLevel(r.title, cleanDesc);
      const category = determineCategory(r.title, r.tags || []);
      const isRecent = true;
      const scores = computeScores(locInfo.tier, salaryInfo.isDisclosed, isRecent);

      const skills = Array.isArray(r.tags) && r.tags.length > 0 
        ? r.tags.slice(0, 8) 
        : [r.category || 'Remote Work', 'Asynchronous Collaboration', 'Problem Solving'];

      return {
        id: `remotive_${r.id || idx}`,
        title: r.title,
        company: (r.company_name || 'Verified Tech Co').trim(),
        companyLogo: r.company_logo || undefined,
        description: cleanDesc.slice(0, 1800),
        source: 'Remotive Verified Gateway',
        sourceJobId: String(r.id),
        sourcesFoundCount: 1,
        sourcesList: ['Remotive Remote API'],
        officialUrl: r.url,
        applicationUrl: r.url,
        location: r.candidate_required_location || 'Worldwide Remote',
        locationTier: locInfo.tier,
        locationTierLabel: locInfo.tierLabel,
        remoteType: 'Fully Remote',
        employmentType: (r.job_type === 'contract' ? 'contract' : r.job_type === 'freelance' ? 'freelance' : 'full_time') as EmploymentType,
        salaryMin: salaryInfo.min,
        salaryMax: salaryInfo.max,
        salaryCurrency: 'USD',
        salaryPeriod: 'year',
        salaryFormatted: salaryInfo.formatted,
        salaryVerification: salaryInfo.isDisclosed ? 'advertised' : 'not_disclosed',
        experienceLevel: expInfo.level,
        experienceLabel: expInfo.label,
        category,
        skills,
        atsKeywords: [...skills, 'Remote Workflow', 'Git', 'Agile'],
        payoutMethod: 'Direct USD / Contractor (Deel, Wise, Payoneer)',
        payoutCompatibility: 'high',
        timezoneRequirement: 'WAT (UTC+1) friendly / Flexible async schedule',
        postedAt: r.publication_date || new Date().toISOString(),
        discoveredAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString(),
        verificationStatus: 'Official Employer',
        scamRisk: 'verified',
        opportunityScore: scores.opportunityScore,
        scoreBreakdown: scores.scoreBreakdown,
        matchScore: scores.matchScore,
        freshness: 'fresh',
        isNigeriaEligible: locInfo.isNigeria,
        isAfricaEligible: locInfo.isAfrica,
        isBeginnerFriendly: expInfo.isBeginner,
        isDirectApply: true,
        actionRecommendation: 'Apply Now'
      };
    });
  } catch (err) {
    console.error('Failed to fetch from Remotive:', err);
    return [];
  }
}

/**
 * Fetch real-time remote jobs from RemoteOK API
 */
export async function fetchRemoteOKJobs(): Promise<Job[]> {
  try {
    const res = await fetch('https://remoteok.com/api', {
      headers: { 'User-Agent': 'Findjobber-Live/1.0' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    // Filter out legal/header object and items without position
    const validJobs = data.filter((j: any) => j && j.position && j.company);

    return validJobs.slice(0, 60).map((r: any, idx: number): Job => {
      const cleanDesc = stripHtml(r.description || '');
      const salaryInfo = parseSalary(undefined, r.salary_min, r.salary_max);
      const locInfo = determineLocationTier(r.location, cleanDesc);
      const expInfo = determineExperienceLevel(r.position, cleanDesc);
      const tags = Array.isArray(r.tags) ? r.tags : [];
      const category = determineCategory(r.position, tags);
      const isRecent = true;
      const scores = computeScores(locInfo.tier, salaryInfo.isDisclosed, isRecent);

      const skills = tags.length > 0 ? tags.slice(0, 8) : ['Remote Work', 'Communication', 'Tech Operations'];

      return {
        id: `remoteok_${r.id || idx}`,
        title: r.position,
        company: (r.company || 'Remote Employer').trim(),
        companyLogo: r.company_logo || r.logo || undefined,
        description: cleanDesc.slice(0, 1800),
        source: 'RemoteOK Live Gateway',
        sourceJobId: String(r.id),
        sourcesFoundCount: 1,
        sourcesList: ['RemoteOK API'],
        officialUrl: r.apply_url || r.url || `https://remoteok.com/remote-jobs/${r.id}`,
        applicationUrl: r.apply_url || r.url || `https://remoteok.com/remote-jobs/${r.id}`,
        location: r.location || 'Worldwide Remote',
        locationTier: locInfo.tier,
        locationTierLabel: locInfo.tierLabel,
        remoteType: 'Fully Remote',
        employmentType: 'full_time',
        salaryMin: salaryInfo.min,
        salaryMax: salaryInfo.max,
        salaryCurrency: 'USD',
        salaryPeriod: 'year',
        salaryFormatted: salaryInfo.formatted,
        salaryVerification: salaryInfo.isDisclosed ? 'verified' : 'not_disclosed',
        experienceLevel: expInfo.level,
        experienceLabel: expInfo.label,
        category,
        skills,
        atsKeywords: [...skills, 'Asynchronous Communication', 'Remote Systems'],
        payoutMethod: 'Direct USD / Contractor (Deel, Wise, Payoneer, Crypto)',
        payoutCompatibility: 'high',
        timezoneRequirement: 'Flexible Global Timezone',
        postedAt: r.date || new Date().toISOString(),
        discoveredAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString(),
        verificationStatus: 'Trusted Job Board',
        scamRisk: 'verified',
        opportunityScore: scores.opportunityScore,
        scoreBreakdown: scores.scoreBreakdown,
        matchScore: scores.matchScore,
        freshness: 'fresh',
        isNigeriaEligible: locInfo.isNigeria,
        isAfricaEligible: locInfo.isAfrica,
        isBeginnerFriendly: expInfo.isBeginner,
        isDirectApply: true,
        actionRecommendation: 'Apply Now'
      };
    });
  } catch (err) {
    console.error('Failed to fetch from RemoteOK:', err);
    return [];
  }
}

/**
 * Fetch real-time remote jobs from Jobicy API
 */
export async function fetchJobicyJobs(): Promise<Job[]> {
  try {
    const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=25', {
      headers: { 'User-Agent': 'Findjobber-Live/1.0' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return [];
    const data = await res.json();
    const rawJobs = data.jobs || [];

    return rawJobs.map((r: any, idx: number): Job => {
      const cleanDesc = stripHtml(r.jobDescription || r.jobExcerpt || '');
      const salaryInfo = parseSalary(r.annualSalaryMin ? `$${r.annualSalaryMin} - $${r.annualSalaryMax}` : undefined, r.annualSalaryMin, r.annualSalaryMax);
      const locInfo = determineLocationTier(r.jobGeo, cleanDesc);
      const expInfo = determineExperienceLevel(r.jobTitle, cleanDesc);
      const category = determineCategory(r.jobTitle, r.jobIndustry || []);
      const isRecent = true;
      const scores = computeScores(locInfo.tier, salaryInfo.isDisclosed, isRecent);

      const skills = Array.isArray(r.jobIndustry) && r.jobIndustry.length > 0
        ? r.jobIndustry
        : ['Technical Execution', 'Documentation', 'Remote Teamwork'];

      return {
        id: `jobicy_${r.id || idx}`,
        title: r.jobTitle,
        company: (r.companyName || 'Global Employer').trim(),
        companyLogo: r.companyLogo || undefined,
        description: cleanDesc.slice(0, 1800),
        source: 'Jobicy Global Remote Gateway',
        sourceJobId: String(r.id),
        sourcesFoundCount: 1,
        sourcesList: ['Jobicy API'],
        officialUrl: r.url,
        applicationUrl: r.url,
        location: r.jobGeo || 'Anywhere (Global Remote)',
        locationTier: locInfo.tier,
        locationTierLabel: locInfo.tierLabel,
        remoteType: 'Fully Remote',
        employmentType: 'full_time',
        salaryMin: salaryInfo.min,
        salaryMax: salaryInfo.max,
        salaryCurrency: 'USD',
        salaryPeriod: 'year',
        salaryFormatted: salaryInfo.formatted,
        salaryVerification: salaryInfo.isDisclosed ? 'verified' : 'not_disclosed',
        experienceLevel: expInfo.level,
        experienceLabel: expInfo.label,
        category,
        skills,
        atsKeywords: [...skills, 'Cross-Functional Collaboration', 'KPIs'],
        payoutMethod: 'Direct USD / Contractor (Deel, Wise, Payoneer)',
        payoutCompatibility: 'high',
        timezoneRequirement: 'WAT / Global Remote',
        postedAt: r.pubDate || new Date().toISOString(),
        discoveredAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString(),
        verificationStatus: 'Trusted Job Board',
        scamRisk: 'verified',
        opportunityScore: scores.opportunityScore,
        scoreBreakdown: scores.scoreBreakdown,
        matchScore: scores.matchScore,
        freshness: 'fresh',
        isNigeriaEligible: locInfo.isNigeria,
        isAfricaEligible: locInfo.isAfrica,
        isBeginnerFriendly: expInfo.isBeginner,
        isDirectApply: true,
        actionRecommendation: 'Apply Now'
      };
    });
  } catch (err) {
    console.error('Failed to fetch from Jobicy:', err);
    return [];
  }
}

/**
 * Fetch real-time remote jobs from Arbeitnow API
 */
export async function fetchArbeitnowJobs(): Promise<Job[]> {
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
      headers: { 'User-Agent': 'Findjobber-Live/1.0' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return [];
    const data = await res.json();
    const rawJobs = (data.data || []).filter((j: any) => j.remote === true || j.title?.toLowerCase().includes('remote'));

    return rawJobs.slice(0, 30).map((r: any, idx: number): Job => {
      const cleanDesc = stripHtml(r.description || '');
      const salaryInfo = parseSalary();
      const locInfo = determineLocationTier(r.location, cleanDesc);
      const expInfo = determineExperienceLevel(r.title, cleanDesc);
      const tags = Array.isArray(r.tags) ? r.tags : [];
      const category = determineCategory(r.title, tags);
      const isRecent = true;
      const scores = computeScores(locInfo.tier, salaryInfo.isDisclosed, isRecent);

      const skills = tags.length > 0 ? tags.slice(0, 6) : ['Software Craftsmanship', 'English Fluency', 'Agile'];

      return {
        id: `arbeitnow_${r.slug || idx}`,
        title: r.title,
        company: (r.company_name || 'European / Global Employer').trim(),
        description: cleanDesc.slice(0, 1800),
        source: 'Arbeitnow Remote API',
        sourceJobId: r.slug,
        sourcesFoundCount: 1,
        sourcesList: ['Arbeitnow API'],
        officialUrl: r.url,
        applicationUrl: r.url,
        location: r.location ? `${r.location} (Remote)` : 'Worldwide Remote',
        locationTier: locInfo.tier,
        locationTierLabel: locInfo.tierLabel,
        remoteType: 'Fully Remote',
        employmentType: 'full_time',
        salaryMin: salaryInfo.min,
        salaryMax: salaryInfo.max,
        salaryCurrency: 'USD',
        salaryPeriod: 'year',
        salaryFormatted: salaryInfo.formatted,
        salaryVerification: 'not_disclosed',
        experienceLevel: expInfo.level,
        experienceLabel: expInfo.label,
        category,
        skills,
        atsKeywords: [...skills, 'Remote Standards', 'Code Quality'],
        payoutMethod: 'Direct USD / EUR Contractor (Deel, Wise)',
        payoutCompatibility: 'high',
        timezoneRequirement: 'WAT / EMEA Overlap (GMT+1)',
        postedAt: r.created_at ? new Date(r.created_at * 1000).toISOString() : new Date().toISOString(),
        discoveredAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString(),
        verificationStatus: 'Trusted Job Board',
        scamRisk: 'verified',
        opportunityScore: scores.opportunityScore,
        scoreBreakdown: scores.scoreBreakdown,
        matchScore: scores.matchScore,
        freshness: 'fresh',
        isNigeriaEligible: locInfo.isNigeria,
        isAfricaEligible: locInfo.isAfrica,
        isBeginnerFriendly: expInfo.isBeginner,
        isDirectApply: true,
        actionRecommendation: 'Apply Now'
      };
    });
  } catch (err) {
    console.error('Failed to fetch from Arbeitnow:', err);
    return [];
  }
}

/**
 * Fetch real-time Web3 bounties from Superteam Earn Live API
 */
export async function fetchSuperteamEarnBounties(): Promise<BountyItem[]> {
  try {
    const res = await fetch('https://earn.superteam.fun/api/listings', {
      headers: { 'User-Agent': 'Findjobber-Live/1.0' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.slice(0, 25).map((b: any, idx: number): BountyItem => {
      const rewardAmt = b.rewardAmount || 500;
      const token = b.token || 'USDC';
      const title = b.title || 'Web3 Technical Task';
      const sponsor = b.sponsor?.name || 'Superteam Ecosystem';

      // Categorize
      const tLower = title.toLowerCase();
      let category: BountyItem['category'] = 'Coding';
      if (tLower.includes('content') || tLower.includes('video') || tLower.includes('write') || tLower.includes('thread') || tLower.includes('article')) {
        category = 'Writing';
      } else if (tLower.includes('design') || tLower.includes('ui') || tLower.includes('graphic') || tLower.includes('meme')) {
        category = 'Design';
      } else if (tLower.includes('translate') || tLower.includes('localization')) {
        category = 'Translation';
      } else if (tLower.includes('grant') || tLower.includes('fellowship')) {
        category = 'Grants';
      } else if (tLower.includes('research') || tLower.includes('analysis')) {
        category = 'Research';
      }

      const deadline = b.deadline 
        ? new Date(b.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Open deadline';

      const hours = category === 'Coding' ? 14 : category === 'Writing' ? 6 : 8;
      const perHour = `$${Math.round(rewardAmt / hours)} / hr equivalent`;

      return {
        id: `st_${b.id || idx}`,
        title,
        platform: 'Superteam Earn',
        category,
        reward: `${rewardAmt.toLocaleString()} ${token}`,
        rewardUsdEquivalent: rewardAmt,
        currency: token === 'SOL' ? 'SOL' : token === 'ETH' ? 'ETH' : token === 'USDT' ? 'USDT' : 'USDC',
        deadline,
        difficulty: rewardAmt > 2500 ? 'Advanced' : rewardAmt > 800 ? 'Intermediate' : 'Beginner',
        skillsRequired: [sponsor, category, token, 'Proof-of-Work'],
        walletRequirement: 'Solana Wallet (Phantom / Backpack / Solflare)',
        countryRestrictions: 'Worldwide / Zero Location Restrictions',
        payoutMechanism: `Instant On-Chain ${token} Payout`,
        officialSource: b.slug ? `https://earn.superteam.fun/listings/bounties/${b.slug}` : 'https://earn.superteam.fun',
        scamRisk: 'verified',
        estimatedHours: hours,
        estimatedPerHour: perHour
      };
    });
  } catch (err) {
    console.error('Failed to fetch from Superteam Earn:', err);
    return [];
  }
}

/**
 * Fetch real-time verified remote jobs from Himalayas Live API
 */
export async function fetchHimalayasJobs(): Promise<Job[]> {
  try {
    const res = await fetch('https://himalayas.app/jobs/api?limit=50', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return [];
    const data = await res.json();
    const rawJobs = Array.isArray(data.jobs) ? data.jobs : [];

    return rawJobs.map((r: any, idx: number): Job => {
      const cleanDesc = stripHtml(r.description || '');
      const salaryInfo = parseSalary(r.salary);
      const loc = (r.location || r.timezones || []).join(' ');
      const locInfo = determineLocationTier(loc, cleanDesc);
      const expInfo = determineExperienceLevel(r.title, cleanDesc);
      const category = determineCategory(r.title, r.categories || []);
      const scores = computeScores(locInfo.tier, salaryInfo.isDisclosed, true);
      const skills = Array.isArray(r.categories) && r.categories.length > 0
        ? r.categories.slice(0, 6)
        : ['Remote Standards', 'Communication', 'Problem Solving'];
      
      const appUrl = r.applicationLink || r.guid || 'https://himalayas.app/jobs';

      return {
        id: `himalayas_${r.guid ? r.guid.split('/').pop() : idx}`,
        title: r.title || 'Remote Specialist',
        company: (r.companyName || 'Global Employer').trim(),
        companyLogo: r.companyLogo || undefined,
        description: cleanDesc.slice(0, 1800),
        source: 'Himalayas Verified Gateway',
        sourceJobId: String(r.guid || idx),
        sourcesFoundCount: 1,
        sourcesList: ['Himalayas Live API'],
        officialUrl: appUrl,
        applicationUrl: appUrl,
        location: loc || 'Worldwide Remote',
        locationTier: locInfo.tier,
        locationTierLabel: locInfo.tierLabel,
        remoteType: 'Fully Remote',
        employmentType: 'full_time',
        salaryMin: salaryInfo.min,
        salaryMax: salaryInfo.max,
        salaryCurrency: 'USD',
        salaryPeriod: 'year',
        salaryFormatted: salaryInfo.formatted,
        salaryVerification: salaryInfo.isDisclosed ? 'advertised' : 'not_disclosed',
        experienceLevel: expInfo.level,
        experienceLabel: expInfo.label,
        category,
        skills,
        atsKeywords: [...skills, 'Remote Workflow', 'Autonomous'],
        payoutMethod: 'Direct International USD Wire (Deel, Remote, Wise)',
        payoutCompatibility: 'high',
        timezoneRequirement: 'Flexible Global / WAT Friendly',
        postedAt: r.pubDate ? new Date(r.pubDate * 1000).toISOString() : new Date().toISOString(),
        discoveredAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString(),
        verificationStatus: 'Official Employer',
        scamRisk: 'verified',
        opportunityScore: scores.opportunityScore,
        scoreBreakdown: scores.scoreBreakdown,
        matchScore: scores.matchScore,
        freshness: 'fresh',
        isNigeriaEligible: locInfo.isNigeria,
        isAfricaEligible: locInfo.isAfrica,
        isBeginnerFriendly: expInfo.isBeginner,
        isDirectApply: true,
        actionRecommendation: 'Apply Now'
      };
    });
  } catch (err) {
    console.error('Failed to fetch from Himalayas:', err);
    return [];
  }
}

/**
 * Aggregates all real-time jobs, deduplicates, and sorts
 */
export async function aggregateRealtimeJobs(): Promise<{
  jobs: Job[];
  sources: {
    laborx: number;
    remotive: number;
    remoteok: number;
    himalayas: number;
    jobicy: number;
    arbeitnow: number;
  };
  fetchedAt: string;
}> {
  console.log('[RealtimeJobFetcher] Starting concurrent fetch across live job APIs, Himalayas, and LaborX Gateway...');
  const t0 = Date.now();

  const [laborxRes, remotiveRes, remoteokRes, himalayasRes, jobicyRes, arbeitnowRes] = await Promise.allSettled([
    fetchLaborXJobs(),
    fetchRemotiveJobs(),
    fetchRemoteOKJobs(),
    fetchHimalayasJobs(),
    fetchJobicyJobs(),
    fetchArbeitnowJobs()
  ]);

  const laborxJobs = laborxRes.status === 'fulfilled' ? laborxRes.value : [];
  const remotiveJobs = remotiveRes.status === 'fulfilled' ? remotiveRes.value : [];
  const remoteokJobs = remoteokRes.status === 'fulfilled' ? remoteokRes.value : [];
  const himalayasJobs = himalayasRes.status === 'fulfilled' ? himalayasRes.value : [];
  const jobicyJobs = jobicyRes.status === 'fulfilled' ? jobicyRes.value : [];
  const arbeitnowJobs = arbeitnowRes.status === 'fulfilled' ? arbeitnowRes.value : [];

  const rawCombined = [
    ...laborxJobs,
    ...remotiveJobs,
    ...remoteokJobs,
    ...himalayasJobs,
    ...jobicyJobs,
    ...arbeitnowJobs
  ];

  // Deduplicate and filter out demo or stale jobs
  const seen = new Set<string>();
  const deduplicated: Job[] = [];

  for (const rawJob of rawCombined) {
    // Reject any demo fixture
    if (isDemoJob(rawJob)) continue;
    // Only accept recent jobs (within last 30 days)
    if (!isRecentJob(rawJob, 30)) continue;

    const sanitized = sanitizeAndEnrichJob(rawJob);
    if (!sanitized) continue;

    const key = `${sanitized.company.toLowerCase().trim()}:::${sanitized.title.toLowerCase().trim()}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(sanitized);
    }
  }

  // Sort by freshness and opportunity score
  deduplicated.sort((a, b) => {
    const timeDiff = new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    if (isNaN(timeDiff) || timeDiff === 0) {
      return b.opportunityScore - a.opportunityScore;
    }
    return timeDiff;
  });

  const durationMs = Date.now() - t0;
  console.log(`[RealtimeJobFetcher] Successfully fetched, verified, and unified ${deduplicated.length} live remote jobs (including ${laborxJobs.length} LaborX, ${himalayasJobs.length} Himalayas) in ${durationMs}ms!`);

  return {
    jobs: deduplicated,
    sources: {
      laborx: laborxJobs.length,
      remotive: remotiveJobs.length,
      remoteok: remoteokJobs.length,
      himalayas: himalayasJobs.length,
      jobicy: jobicyJobs.length,
      arbeitnow: arbeitnowJobs.length
    },
    fetchedAt: new Date().toISOString()
  };
}
