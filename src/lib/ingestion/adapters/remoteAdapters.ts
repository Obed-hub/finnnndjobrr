import { SourceAdapter } from '../types';
import { Job, EmploymentType } from '../../../types';
import { stripHtml, cleanCanonicalUrl } from '../engine/urlNormalizer';
import { classifyJobCategory } from '../engine/categoryClassifier';
import { evaluateNigeriaAfricaEligibility } from '../engine/nigeriaEligibilityEngine';
import { parseSalaryNumbers, determineExperienceLevel, computeOpportunityScores } from '../engine/scoreCalculator';

/**
 * 1. Himalayas Remote Jobs Adapter (https://himalayas.app)
 */
export const HimalayasAdapter: SourceAdapter = {
  id: 'himalayas',
  name: 'Himalayas Remote API',
  category: 'remote',
  endpointUrl: 'https://himalayas.app/jobs/api?limit=30',
  authType: 'none',
  description: 'Public API providing high-quality remote software engineering, product, and AI roles.',
  syncIntervalMinutes: 15,
  supportedJobTypes: ['full_time', 'contract'],

  isConfigured: () => true,

  async fetch(): Promise<any[]> {
    try {
      const res = await fetch('https://himalayas.app/jobs/api?limit=30', {
        headers: { 'User-Agent': 'Findjobber-Ingest/1.0' },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.jobs || [];
    } catch {
      return [];
    }
  },

  normalize(r: any, idx: number): Job | null {
    if (!r || !r.title || !r.companyName) return null;
    const cleanDesc = stripHtml(r.description || r.excerpt || '');
    const salaryInfo = parseSalaryNumbers(
      r.salary ? `${r.salary}` : undefined, 
      r.minSalary || r.salaryMin, 
      r.maxSalary || r.salaryMax,
      r.currency || 'USD'
    );
    const locInfo = evaluateNigeriaAfricaEligibility(r.location || r.locationRestriction || 'Worldwide Remote', cleanDesc, 'Himalayas');
    const expInfo = determineExperienceLevel(r.title, cleanDesc);
    const categoryInfo = classifyJobCategory(r.title, r.categories || r.tags || [], cleanDesc);
    const scores = computeOpportunityScores(locInfo.locationTier, salaryInfo.isDisclosed, true, true);

    const skills = Array.isArray(r.tags) && r.tags.length > 0 
      ? r.tags.slice(0, 8) 
      : categoryInfo.atsKeywords;

    const originalUrl = cleanCanonicalUrl(r.applicationUrl || r.url || `https://himalayas.app/companies/${r.companySlug}/jobs/${r.slug}`);

    return {
      id: `himalayas_${r.id || r.slug || idx}`,
      title: r.title,
      company: r.companyName.trim(),
      companyLogo: r.companyLogo || undefined,
      description: cleanDesc.slice(0, 1800),
      source: 'Himalayas Remote API',
      sourceJobId: String(r.id || r.slug || idx),
      sourcesFoundCount: 1,
      sourcesList: ['Himalayas Remote API'],
      officialUrl: originalUrl,
      applicationUrl: originalUrl,
      location: r.location || 'Worldwide Remote',
      locationTier: locInfo.locationTier,
      locationTierLabel: locInfo.locationTierLabel,
      remoteType: 'Fully Remote',
      employmentType: (r.employmentType === 'contract' ? 'contract' : 'full_time') as EmploymentType,
      salaryMin: salaryInfo.min,
      salaryMax: salaryInfo.max,
      salaryCurrency: r.currency || 'USD',
      salaryPeriod: 'year',
      salaryFormatted: salaryInfo.formatted,
      salaryVerification: salaryInfo.isDisclosed ? 'advertised' : 'not_disclosed',
      experienceLevel: expInfo.level,
      experienceLabel: expInfo.label,
      category: categoryInfo.category,
      skills,
      atsKeywords: Array.from(new Set([...skills, ...categoryInfo.atsKeywords])),
      payoutMethod: locInfo.payoutMethod,
      payoutCompatibility: locInfo.payoutCompatibility,
      timezoneRequirement: locInfo.timezoneRequirement,
      postedAt: r.pubDate || r.publishedAt || new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      verificationStatus: 'Official Employer',
      scamRisk: 'verified',
      opportunityScore: scores.opportunityScore,
      scoreBreakdown: scores.scoreBreakdown,
      matchScore: scores.matchScore,
      freshness: 'fresh',
      isNigeriaEligible: locInfo.isNigeriaEligible,
      isAfricaEligible: locInfo.isAfricaEligible,
      isBeginnerFriendly: expInfo.isBeginner,
      isDirectApply: true,
      actionRecommendation: 'Apply on Himalayas'
    };
  },

  async testConnection() {
    const t0 = Date.now();
    try {
      const items = await this.fetch();
      const latency = Date.now() - t0;
      return {
        success: items.length > 0,
        latencyMs: latency,
        message: `Himalayas API responded successfully in ${latency}ms with ${items.length} live jobs.`,
        sampleCount: items.length
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - t0,
        message: `Himalayas API error: ${err.message}`
      };
    }
  }
};

/**
 * 2. Jobicy Remote Jobs Adapter (https://jobicy.com)
 */
export const JobicyAdapter: SourceAdapter = {
  id: 'jobicy',
  name: 'Jobicy Global Remote Gateway',
  category: 'remote',
  endpointUrl: 'https://jobicy.com/api/v2/remote-jobs?count=30',
  authType: 'none',
  description: 'Global remote job feed with structured salary and geo filtering.',
  syncIntervalMinutes: 20,
  supportedJobTypes: ['full_time', 'contract', 'freelance'],

  isConfigured: () => true,

  async fetch(): Promise<any[]> {
    try {
      const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=30', {
        headers: { 'User-Agent': 'Findjobber-Ingest/1.0' },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.jobs || [];
    } catch {
      return [];
    }
  },

  normalize(r: any, idx: number): Job | null {
    if (!r || !r.jobTitle || !r.companyName) return null;
    const cleanDesc = stripHtml(r.jobDescription || r.jobExcerpt || '');
    const salaryInfo = parseSalaryNumbers(
      r.annualSalaryMin ? `$${r.annualSalaryMin} - $${r.annualSalaryMax}` : undefined,
      r.annualSalaryMin,
      r.annualSalaryMax,
      r.salaryCurrency || 'USD'
    );
    const locInfo = evaluateNigeriaAfricaEligibility(r.jobGeo || 'Global Remote', cleanDesc, 'Jobicy');
    const expInfo = determineExperienceLevel(r.jobTitle, cleanDesc);
    const categoryInfo = classifyJobCategory(r.jobTitle, r.jobIndustry || [], cleanDesc);
    const scores = computeOpportunityScores(locInfo.locationTier, salaryInfo.isDisclosed, true, true);

    const skills = Array.isArray(r.jobIndustry) && r.jobIndustry.length > 0
      ? r.jobIndustry
      : categoryInfo.atsKeywords;

    const originalUrl = cleanCanonicalUrl(r.url);

    return {
      id: `jobicy_${r.id || idx}`,
      title: r.jobTitle,
      company: r.companyName.trim(),
      companyLogo: r.companyLogo || undefined,
      description: cleanDesc.slice(0, 1800),
      source: 'Jobicy Global Remote Gateway',
      sourceJobId: String(r.id || idx),
      sourcesFoundCount: 1,
      sourcesList: ['Jobicy API'],
      officialUrl: originalUrl,
      applicationUrl: originalUrl,
      location: r.jobGeo || 'Anywhere (Global Remote)',
      locationTier: locInfo.locationTier,
      locationTierLabel: locInfo.locationTierLabel,
      remoteType: 'Fully Remote',
      employmentType: (r.jobType === 'contract' ? 'contract' : 'full_time') as EmploymentType,
      salaryMin: salaryInfo.min,
      salaryMax: salaryInfo.max,
      salaryCurrency: r.salaryCurrency || 'USD',
      salaryPeriod: 'year',
      salaryFormatted: salaryInfo.formatted,
      salaryVerification: salaryInfo.isDisclosed ? 'verified' : 'not_disclosed',
      experienceLevel: expInfo.level,
      experienceLabel: expInfo.label,
      category: categoryInfo.category,
      skills,
      atsKeywords: Array.from(new Set([...skills, ...categoryInfo.atsKeywords])),
      payoutMethod: locInfo.payoutMethod,
      payoutCompatibility: locInfo.payoutCompatibility,
      timezoneRequirement: locInfo.timezoneRequirement,
      postedAt: r.pubDate || new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      verificationStatus: 'Trusted Job Board',
      scamRisk: 'verified',
      opportunityScore: scores.opportunityScore,
      scoreBreakdown: scores.scoreBreakdown,
      matchScore: scores.matchScore,
      freshness: 'fresh',
      isNigeriaEligible: locInfo.isNigeriaEligible,
      isAfricaEligible: locInfo.isAfricaEligible,
      isBeginnerFriendly: expInfo.isBeginner,
      isDirectApply: true,
      actionRecommendation: 'Apply on Jobicy'
    };
  },

  async testConnection() {
    const t0 = Date.now();
    try {
      const items = await this.fetch();
      const latency = Date.now() - t0;
      return {
        success: items.length > 0,
        latencyMs: latency,
        message: `Jobicy API connected in ${latency}ms, ${items.length} items parsed.`,
        sampleCount: items.length
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - t0,
        message: `Jobicy API error: ${err.message}`
      };
    }
  }
};

/**
 * 3. RemoteOK API Adapter (https://remoteok.com)
 */
export const RemoteOKAdapter: SourceAdapter = {
  id: 'remoteok',
  name: 'RemoteOK Live Gateway',
  category: 'remote',
  endpointUrl: 'https://remoteok.com/api',
  authType: 'none',
  description: 'Global remote job board aggregator with live tech listings and tags.',
  syncIntervalMinutes: 20,
  supportedJobTypes: ['full_time', 'contract'],

  isConfigured: () => true,

  async fetch(): Promise<any[]> {
    try {
      const res = await fetch('https://remoteok.com/api', {
        headers: { 'User-Agent': 'Findjobber-Ingest/1.0' },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return data.filter((j: any) => j && j.position && j.company).slice(0, 50);
    } catch {
      return [];
    }
  },

  normalize(r: any, idx: number): Job | null {
    if (!r || !r.position || !r.company) return null;
    const cleanDesc = stripHtml(r.description || '');
    const salaryInfo = parseSalaryNumbers(undefined, r.salary_min, r.salary_max);
    const locInfo = evaluateNigeriaAfricaEligibility(r.location || 'Worldwide Remote', cleanDesc, 'RemoteOK');
    const expInfo = determineExperienceLevel(r.position, cleanDesc);
    const tags = Array.isArray(r.tags) ? r.tags : [];
    const categoryInfo = classifyJobCategory(r.position, tags, cleanDesc);
    const scores = computeOpportunityScores(locInfo.locationTier, salaryInfo.isDisclosed, true, true);

    const skills = tags.length > 0 ? tags.slice(0, 8) : categoryInfo.atsKeywords;
    const originalUrl = cleanCanonicalUrl(r.apply_url || r.url || `https://remoteok.com/remote-jobs/${r.id}`);

    return {
      id: `remoteok_${r.id || idx}`,
      title: r.position,
      company: r.company.trim(),
      companyLogo: r.company_logo || r.logo || undefined,
      description: cleanDesc.slice(0, 1800),
      source: 'RemoteOK Live Gateway',
      sourceJobId: String(r.id || idx),
      sourcesFoundCount: 1,
      sourcesList: ['RemoteOK API'],
      officialUrl: originalUrl,
      applicationUrl: originalUrl,
      location: r.location || 'Worldwide Remote',
      locationTier: locInfo.locationTier,
      locationTierLabel: locInfo.locationTierLabel,
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
      category: categoryInfo.category,
      skills,
      atsKeywords: Array.from(new Set([...skills, ...categoryInfo.atsKeywords])),
      payoutMethod: locInfo.payoutMethod,
      payoutCompatibility: locInfo.payoutCompatibility,
      timezoneRequirement: locInfo.timezoneRequirement,
      postedAt: r.date || new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      verificationStatus: 'Trusted Job Board',
      scamRisk: 'verified',
      opportunityScore: scores.opportunityScore,
      scoreBreakdown: scores.scoreBreakdown,
      matchScore: scores.matchScore,
      freshness: 'fresh',
      isNigeriaEligible: locInfo.isNigeriaEligible,
      isAfricaEligible: locInfo.isAfricaEligible,
      isBeginnerFriendly: expInfo.isBeginner,
      isDirectApply: true,
      actionRecommendation: 'Apply on RemoteOK'
    };
  },

  async testConnection() {
    const t0 = Date.now();
    try {
      const items = await this.fetch();
      const latency = Date.now() - t0;
      return {
        success: items.length > 0,
        latencyMs: latency,
        message: `RemoteOK API connected in ${latency}ms, ${items.length} items parsed.`,
        sampleCount: items.length
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - t0,
        message: `RemoteOK API error: ${err.message}`
      };
    }
  }
};

/**
 * 4. Remotive Verified Adapter (https://remotive.com)
 */
export const RemotiveAdapter: SourceAdapter = {
  id: 'remotive',
  name: 'Remotive Verified Gateway',
  category: 'remote',
  endpointUrl: 'https://remotive.com/api/remote-jobs?limit=40',
  authType: 'none',
  description: 'Verified remote listings with candidate location tags and salary data.',
  syncIntervalMinutes: 15,
  supportedJobTypes: ['full_time', 'contract', 'freelance'],

  isConfigured: () => true,

  async fetch(): Promise<any[]> {
    try {
      const res = await fetch('https://remotive.com/api/remote-jobs?limit=40', {
        headers: { 'User-Agent': 'Findjobber-Ingest/1.0' },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.jobs || [];
    } catch {
      return [];
    }
  },

  normalize(r: any, idx: number): Job | null {
    if (!r || !r.title || !r.company_name) return null;
    const cleanDesc = stripHtml(r.description || '');
    const salaryInfo = parseSalaryNumbers(r.salary);
    const locInfo = evaluateNigeriaAfricaEligibility(r.candidate_required_location || 'Worldwide Remote', cleanDesc, 'Remotive');
    const expInfo = determineExperienceLevel(r.title, cleanDesc);
    const tags = Array.isArray(r.tags) ? r.tags : [];
    const categoryInfo = classifyJobCategory(r.title, tags, cleanDesc);
    const scores = computeOpportunityScores(locInfo.locationTier, salaryInfo.isDisclosed, true, true);

    const skills = tags.length > 0 ? tags.slice(0, 8) : categoryInfo.atsKeywords;
    const originalUrl = cleanCanonicalUrl(r.url);

    return {
      id: `remotive_${r.id || idx}`,
      title: r.title,
      company: r.company_name.trim(),
      companyLogo: r.company_logo || undefined,
      description: cleanDesc.slice(0, 1800),
      source: 'Remotive Verified Gateway',
      sourceJobId: String(r.id || idx),
      sourcesFoundCount: 1,
      sourcesList: ['Remotive Remote API'],
      officialUrl: originalUrl,
      applicationUrl: originalUrl,
      location: r.candidate_required_location || 'Worldwide Remote',
      locationTier: locInfo.locationTier,
      locationTierLabel: locInfo.locationTierLabel,
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
      category: categoryInfo.category,
      skills,
      atsKeywords: Array.from(new Set([...skills, ...categoryInfo.atsKeywords])),
      payoutMethod: locInfo.payoutMethod,
      payoutCompatibility: locInfo.payoutCompatibility,
      timezoneRequirement: locInfo.timezoneRequirement,
      postedAt: r.publication_date || new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      verificationStatus: 'Official Employer',
      scamRisk: 'verified',
      opportunityScore: scores.opportunityScore,
      scoreBreakdown: scores.scoreBreakdown,
      matchScore: scores.matchScore,
      freshness: 'fresh',
      isNigeriaEligible: locInfo.isNigeriaEligible,
      isAfricaEligible: locInfo.isAfricaEligible,
      isBeginnerFriendly: expInfo.isBeginner,
      isDirectApply: true,
      actionRecommendation: 'Apply on Remotive'
    };
  },

  async testConnection() {
    const t0 = Date.now();
    try {
      const items = await this.fetch();
      const latency = Date.now() - t0;
      return {
        success: items.length > 0,
        latencyMs: latency,
        message: `Remotive API connected in ${latency}ms, ${items.length} items parsed.`,
        sampleCount: items.length
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - t0,
        message: `Remotive API error: ${err.message}`
      };
    }
  }
};

/**
 * 5. Arbeitnow Remote Jobs Adapter (https://arbeitnow.com)
 */
export const ArbeitnowAdapter: SourceAdapter = {
  id: 'arbeitnow',
  name: 'Arbeitnow Remote API',
  category: 'remote',
  endpointUrl: 'https://www.arbeitnow.com/api/job-board-api',
  authType: 'none',
  description: 'European and global remote job board with English-speaking tech openings.',
  syncIntervalMinutes: 25,
  supportedJobTypes: ['full_time', 'contract'],

  isConfigured: () => true,

  async fetch(): Promise<any[]> {
    try {
      const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
        headers: { 'User-Agent': 'Findjobber-Ingest/1.0' },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.data || []).filter((j: any) => j.remote === true || (j.title && j.title.toLowerCase().includes('remote'))).slice(0, 30);
    } catch {
      return [];
    }
  },

  normalize(r: any, idx: number): Job | null {
    if (!r || !r.title || !r.company_name) return null;
    const cleanDesc = stripHtml(r.description || '');
    const salaryInfo = parseSalaryNumbers();
    const locInfo = evaluateNigeriaAfricaEligibility(r.location ? `${r.location} (Remote)` : 'Worldwide Remote', cleanDesc, 'Arbeitnow');
    const expInfo = determineExperienceLevel(r.title, cleanDesc);
    const tags = Array.isArray(r.tags) ? r.tags : [];
    const categoryInfo = classifyJobCategory(r.title, tags, cleanDesc);
    const scores = computeOpportunityScores(locInfo.locationTier, salaryInfo.isDisclosed, true, true);

    const skills = tags.length > 0 ? tags.slice(0, 8) : categoryInfo.atsKeywords;
    const originalUrl = cleanCanonicalUrl(r.url);

    return {
      id: `arbeitnow_${r.slug || idx}`,
      title: r.title,
      company: r.company_name.trim(),
      description: cleanDesc.slice(0, 1800),
      source: 'Arbeitnow Remote API',
      sourceJobId: String(r.slug || idx),
      sourcesFoundCount: 1,
      sourcesList: ['Arbeitnow API'],
      officialUrl: originalUrl,
      applicationUrl: originalUrl,
      location: r.location ? `${r.location} (Remote)` : 'Worldwide Remote',
      locationTier: locInfo.locationTier,
      locationTierLabel: locInfo.locationTierLabel,
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
      category: categoryInfo.category,
      skills,
      atsKeywords: Array.from(new Set([...skills, ...categoryInfo.atsKeywords])),
      payoutMethod: locInfo.payoutMethod,
      payoutCompatibility: locInfo.payoutCompatibility,
      timezoneRequirement: locInfo.timezoneRequirement,
      postedAt: r.created_at ? new Date(r.created_at * 1000).toISOString() : new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      verificationStatus: 'Trusted Job Board',
      scamRisk: 'verified',
      opportunityScore: scores.opportunityScore,
      scoreBreakdown: scores.scoreBreakdown,
      matchScore: scores.matchScore,
      freshness: 'fresh',
      isNigeriaEligible: locInfo.isNigeriaEligible,
      isAfricaEligible: locInfo.isAfricaEligible,
      isBeginnerFriendly: expInfo.isBeginner,
      isDirectApply: true,
      actionRecommendation: 'Apply on Arbeitnow'
    };
  },

  async testConnection() {
    const t0 = Date.now();
    try {
      const items = await this.fetch();
      const latency = Date.now() - t0;
      return {
        success: items.length > 0,
        latencyMs: latency,
        message: `Arbeitnow API connected in ${latency}ms, ${items.length} items parsed.`,
        sampleCount: items.length
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - t0,
        message: `Arbeitnow API error: ${err.message}`
      };
    }
  }
};

/**
 * 6. We Work Remotely Adapter (https://weworkremotely.com)
 */
export const WeWorkRemotelyAdapter: SourceAdapter = {
  id: 'weworkremotely',
  name: 'We Work Remotely RSS/API',
  category: 'remote',
  endpointUrl: 'https://weworkremotely.com/categories/remote-programming-jobs.rss',
  authType: 'none',
  description: 'Premier remote work community with curated programming, DevOps, and design roles.',
  syncIntervalMinutes: 20,
  supportedJobTypes: ['full_time', 'contract'],

  isConfigured: () => true,

  async fetch(): Promise<any[]> {
    try {
      const res = await fetch('https://weworkremotely.com/categories/remote-programming-jobs.rss', {
        headers: { 'User-Agent': 'Findjobber-Ingest/1.0' },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) return [];
      const xmlText = await res.text();
      
      // Simple resilient RSS item extraction
      const items: any[] = [];
      const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/gi) || [];
      
      for (const itemXml of itemMatches.slice(0, 25)) {
        const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || itemXml.match(/<title>(.*?)<\/title>/i);
        const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i);
        const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || itemXml.match(/<description>([\s\S]*?)<\/description>/i);
        const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);

        if (titleMatch && linkMatch) {
          const rawTitle = titleMatch[1];
          // Title usually in form "Company: Job Title"
          let company = 'Tech Company';
          let title = rawTitle;
          if (rawTitle.includes(':')) {
            const parts = rawTitle.split(':');
            company = parts[0].trim();
            title = parts.slice(1).join(':').trim();
          }

          items.push({
            title,
            company,
            link: linkMatch[1],
            description: descMatch ? descMatch[1] : '',
            pubDate: pubDateMatch ? pubDateMatch[1] : new Date().toISOString()
          });
        }
      }

      return items;
    } catch {
      return [];
    }
  },

  normalize(r: any, idx: number): Job | null {
    if (!r || !r.title || !r.company) return null;
    const cleanDesc = stripHtml(r.description || '');
    const salaryInfo = parseSalaryNumbers(undefined, undefined, undefined);
    const locInfo = evaluateNigeriaAfricaEligibility('Worldwide Remote', cleanDesc, 'We Work Remotely');
    const expInfo = determineExperienceLevel(r.title, cleanDesc);
    const categoryInfo = classifyJobCategory(r.title, [], cleanDesc);
    const scores = computeOpportunityScores(locInfo.locationTier, false, true, true);
    const originalUrl = cleanCanonicalUrl(r.link);

    return {
      id: `wwr_${idx}_${r.title.slice(0, 15).replace(/[^a-z0-9]/gi, '')}`,
      title: r.title,
      company: r.company.trim(),
      description: cleanDesc.slice(0, 1800),
      source: 'We Work Remotely',
      sourceJobId: String(idx),
      sourcesFoundCount: 1,
      sourcesList: ['We Work Remotely Feed'],
      officialUrl: originalUrl,
      applicationUrl: originalUrl,
      location: 'Anywhere in the World (Remote)',
      locationTier: locInfo.locationTier,
      locationTierLabel: locInfo.locationTierLabel,
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
      category: categoryInfo.category,
      skills: categoryInfo.atsKeywords,
      atsKeywords: categoryInfo.atsKeywords,
      payoutMethod: locInfo.payoutMethod,
      payoutCompatibility: locInfo.payoutCompatibility,
      timezoneRequirement: locInfo.timezoneRequirement,
      postedAt: r.pubDate ? new Date(r.pubDate).toISOString() : new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      verificationStatus: 'Trusted Job Board',
      scamRisk: 'verified',
      opportunityScore: scores.opportunityScore,
      scoreBreakdown: scores.scoreBreakdown,
      matchScore: scores.matchScore,
      freshness: 'fresh',
      isNigeriaEligible: locInfo.isNigeriaEligible,
      isAfricaEligible: locInfo.isAfricaEligible,
      isBeginnerFriendly: expInfo.isBeginner,
      isDirectApply: true,
      actionRecommendation: 'Apply on WWR'
    };
  },

  async testConnection() {
    const t0 = Date.now();
    try {
      const items = await this.fetch();
      const latency = Date.now() - t0;
      return {
        success: items.length > 0,
        latencyMs: latency,
        message: `We Work Remotely RSS connected in ${latency}ms with ${items.length} items.`,
        sampleCount: items.length
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - t0,
        message: `We Work Remotely RSS error: ${err.message}`
      };
    }
  }
};

/**
 * 7. Working Nomads Adapter (https://workingnomads.com)
 */
export const WorkingNomadsAdapter: SourceAdapter = {
  id: 'workingnomads',
  name: 'Working Nomads Remote API',
  category: 'remote',
  endpointUrl: 'https://www.workingnomads.com/api/exposed_jobs/',
  authType: 'none',
  description: 'Curated digital nomad and 100% remote positions for global professionals.',
  syncIntervalMinutes: 30,
  supportedJobTypes: ['full_time', 'contract'],

  isConfigured: () => true,

  async fetch(): Promise<any[]> {
    try {
      const res = await fetch('https://www.workingnomads.com/api/exposed_jobs/', {
        headers: { 'User-Agent': 'Findjobber-Ingest/1.0' },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return data.slice(0, 30);
    } catch {
      return [];
    }
  },

  normalize(r: any, idx: number): Job | null {
    if (!r || !r.title || !r.company_name) return null;
    const cleanDesc = stripHtml(r.description || '');
    const salaryInfo = parseSalaryNumbers(r.salary);
    const locInfo = evaluateNigeriaAfricaEligibility(r.location || 'Anywhere (100% Remote)', cleanDesc, 'Working Nomads');
    const expInfo = determineExperienceLevel(r.title, cleanDesc);
    const tags = Array.isArray(r.tags) ? r.tags : [];
    const categoryInfo = classifyJobCategory(r.title, tags, cleanDesc);
    const scores = computeOpportunityScores(locInfo.locationTier, salaryInfo.isDisclosed, true, true);
    const originalUrl = cleanCanonicalUrl(r.url || r.apply_url);

    return {
      id: `wn_${r.id || idx}`,
      title: r.title,
      company: r.company_name.trim(),
      description: cleanDesc.slice(0, 1800),
      source: 'Working Nomads API',
      sourceJobId: String(r.id || idx),
      sourcesFoundCount: 1,
      sourcesList: ['Working Nomads API'],
      officialUrl: originalUrl,
      applicationUrl: originalUrl,
      location: r.location || 'Worldwide Remote',
      locationTier: locInfo.locationTier,
      locationTierLabel: locInfo.locationTierLabel,
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
      category: categoryInfo.category,
      skills: tags.length > 0 ? tags.slice(0, 8) : categoryInfo.atsKeywords,
      atsKeywords: categoryInfo.atsKeywords,
      payoutMethod: locInfo.payoutMethod,
      payoutCompatibility: locInfo.payoutCompatibility,
      timezoneRequirement: locInfo.timezoneRequirement,
      postedAt: r.pub_date || new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      verificationStatus: 'Trusted Job Board',
      scamRisk: 'verified',
      opportunityScore: scores.opportunityScore,
      scoreBreakdown: scores.scoreBreakdown,
      matchScore: scores.matchScore,
      freshness: 'fresh',
      isNigeriaEligible: locInfo.isNigeriaEligible,
      isAfricaEligible: locInfo.isAfricaEligible,
      isBeginnerFriendly: expInfo.isBeginner,
      isDirectApply: true,
      actionRecommendation: 'Apply on Working Nomads'
    };
  },

  async testConnection() {
    const t0 = Date.now();
    try {
      const items = await this.fetch();
      const latency = Date.now() - t0;
      return {
        success: items.length > 0,
        latencyMs: latency,
        message: `Working Nomads API connected in ${latency}ms with ${items.length} items.`,
        sampleCount: items.length
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - t0,
        message: `Working Nomads API error: ${err.message}`
      };
    }
  }
};
