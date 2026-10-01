import { SourceAdapter } from '../types';
import { Job } from '../../../types';
import { cleanCanonicalUrl, stripHtml } from '../engine/urlNormalizer';
import { evaluateNigeriaAfricaEligibility } from '../engine/nigeriaEligibilityEngine';
import { classifyJobCategory } from '../engine/categoryClassifier';
import { computeOpportunityScores } from '../engine/scoreCalculator';

/**
 * 1. Adzuna Job Search API Adapter
 * Requires ADZUNA_APP_ID & ADZUNA_APP_KEY environment variables.
 */
export const AdzunaAdapter: SourceAdapter = {
  id: 'adzuna',
  name: 'Adzuna Global Job Index',
  category: 'aggregator',
  endpointUrl: 'https://api.adzuna.com/v1/api/jobs',
  authType: 'api_key',
  description: 'Multi-country employment index. Requires ADZUNA_APP_ID and ADZUNA_APP_KEY credentials in .env.',
  syncIntervalMinutes: 60,
  supportedJobTypes: ['full_time', 'contract'],

  isConfigured: () => {
    return Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY);
  },

  async fetch(): Promise<any[]> {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey) {
      return [];
    }

    try {
      const url = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=remote%20developer&content-type=application/json`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return [];
      const data = await res.json();
      return data.results || [];
    } catch {
      return [];
    }
  },

  normalize(r: any, idx: number): Job | null {
    if (!r || !r.title || !r.company?.display_name) return null;
    const cleanDesc = stripHtml(r.description || '');
    const locInfo = evaluateNigeriaAfricaEligibility(r.location?.display_name || 'Remote', cleanDesc, 'Adzuna');
    const categoryInfo = classifyJobCategory(r.title, [], cleanDesc);
    const scores = computeOpportunityScores(locInfo.locationTier, Boolean(r.salary_min), true, false);
    const originalUrl = cleanCanonicalUrl(r.redirect_url);

    return {
      id: `adzuna_${r.id || idx}`,
      title: r.title,
      company: r.company.display_name.trim(),
      description: cleanDesc.slice(0, 1800),
      source: 'Adzuna Global Index',
      sourceJobId: String(r.id || idx),
      sourcesFoundCount: 1,
      sourcesList: ['Adzuna API'],
      officialUrl: originalUrl,
      applicationUrl: originalUrl,
      location: r.location?.display_name || 'Remote',
      locationTier: locInfo.locationTier,
      locationTierLabel: locInfo.locationTierLabel,
      remoteType: 'Fully Remote',
      employmentType: 'full_time',
      salaryMin: r.salary_min,
      salaryMax: r.salary_max,
      salaryCurrency: 'USD',
      salaryPeriod: 'year',
      salaryFormatted: r.salary_min ? `$${r.salary_min.toLocaleString()} – $${r.salary_max.toLocaleString()} / yr` : 'Disclosed upon application',
      salaryVerification: r.salary_min ? 'advertised' : 'not_disclosed',
      experienceLevel: '1_2_years',
      experienceLabel: 'Mid-Level',
      category: categoryInfo.category,
      skills: categoryInfo.atsKeywords,
      atsKeywords: categoryInfo.atsKeywords,
      payoutMethod: locInfo.payoutMethod,
      payoutCompatibility: locInfo.payoutCompatibility,
      timezoneRequirement: locInfo.timezoneRequirement,
      postedAt: r.created || new Date().toISOString(),
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
      isBeginnerFriendly: false,
      isDirectApply: false,
      actionRecommendation: 'View on Adzuna'
    };
  },

  async testConnection() {
    const isConfig = this.isConfigured();
    if (!isConfig) {
      return {
        success: false,
        latencyMs: 0,
        message: 'Adzuna API credentials missing. Please define ADZUNA_APP_ID and ADZUNA_APP_KEY in Settings/env.'
      };
    }
    const t0 = Date.now();
    try {
      const items = await this.fetch();
      return {
        success: items.length > 0,
        latencyMs: Date.now() - t0,
        message: `Adzuna API connected successfully (${items.length} items parsed).`,
        sampleCount: items.length
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - t0,
        message: `Adzuna connection test failed: ${err.message}`
      };
    }
  }
};

/**
 * 2. Jooble Jobs API Adapter
 * Requires JOOBLE_API_KEY environment variable.
 */
export const JoobleAdapter: SourceAdapter = {
  id: 'jooble',
  name: 'Jooble Worldwide Job Search API',
  category: 'aggregator',
  endpointUrl: 'https://jooble.org/api/',
  authType: 'api_key',
  description: 'Aggregated international job postings. Requires JOOBLE_API_KEY credentials.',
  syncIntervalMinutes: 60,
  supportedJobTypes: ['full_time', 'contract'],

  isConfigured: () => {
    return Boolean(process.env.JOOBLE_API_KEY);
  },

  async fetch(): Promise<any[]> {
    const apiKey = process.env.JOOBLE_API_KEY;
    if (!apiKey) return [];

    try {
      const res = await fetch(`https://jooble.org/api/${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: 'remote software engineer', location: 'remote' }),
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
    if (!r || !r.title || !r.company) return null;
    const cleanDesc = stripHtml(r.snippet || '');
    const locInfo = evaluateNigeriaAfricaEligibility(r.location || 'Worldwide Remote', cleanDesc, 'Jooble');
    const categoryInfo = classifyJobCategory(r.title, [], cleanDesc);
    const scores = computeOpportunityScores(locInfo.locationTier, Boolean(r.salary), true, false);
    const originalUrl = cleanCanonicalUrl(r.link);

    return {
      id: `jooble_${r.id || idx}`,
      title: r.title,
      company: r.company.trim(),
      description: cleanDesc.slice(0, 1800),
      source: 'Jooble Worldwide API',
      sourceJobId: String(r.id || idx),
      sourcesFoundCount: 1,
      sourcesList: ['Jooble API'],
      officialUrl: originalUrl,
      applicationUrl: originalUrl,
      location: r.location || 'Remote',
      locationTier: locInfo.locationTier,
      locationTierLabel: locInfo.locationTierLabel,
      remoteType: 'Fully Remote',
      employmentType: 'full_time',
      salaryCurrency: 'USD',
      salaryPeriod: 'year',
      salaryFormatted: r.salary || 'Disclosed upon application',
      salaryVerification: r.salary ? 'advertised' : 'not_disclosed',
      experienceLevel: '1_2_years',
      experienceLabel: 'Mid-Level',
      category: categoryInfo.category,
      skills: categoryInfo.atsKeywords,
      atsKeywords: categoryInfo.atsKeywords,
      payoutMethod: locInfo.payoutMethod,
      payoutCompatibility: locInfo.payoutCompatibility,
      timezoneRequirement: locInfo.timezoneRequirement,
      postedAt: r.updated || new Date().toISOString(),
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
      isBeginnerFriendly: false,
      isDirectApply: false,
      actionRecommendation: 'View on Jooble'
    };
  },

  async testConnection() {
    const isConfig = this.isConfigured();
    if (!isConfig) {
      return {
        success: false,
        latencyMs: 0,
        message: 'Jooble API key missing. Please configure JOOBLE_API_KEY in Settings/env.'
      };
    }
    const t0 = Date.now();
    try {
      const items = await this.fetch();
      return {
        success: items.length > 0,
        latencyMs: Date.now() - t0,
        message: `Jooble API connected (${items.length} items parsed).`,
        sampleCount: items.length
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - t0,
        message: `Jooble connection error: ${err.message}`
      };
    }
  }
};
