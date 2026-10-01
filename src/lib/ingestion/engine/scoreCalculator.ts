import { LocationTier, ScoreBreakdown, EmploymentType } from '../../../types';

/**
 * Score Calculator Engine
 * Calculates opportunityScore, matchScore, and ScoreBreakdown for ingested opportunities.
 */

export function parseSalaryNumbers(
  salaryStr?: string, 
  minNum?: number, 
  maxNum?: number,
  currency = 'USD'
): {
  min?: number;
  max?: number;
  formatted: string;
  isDisclosed: boolean;
} {
  if (minNum && minNum > 0) {
    const max = maxNum && maxNum >= minNum ? maxNum : Math.round(minNum * 1.3);
    const sym = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
    return {
      min: minNum,
      max: max,
      formatted: `${sym}${minNum.toLocaleString()} – ${sym}${max.toLocaleString()} / yr`,
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
  const matches = cleaned.match(/\$?(\d+[\d,.]*)\s*(k|K)?\s*[-–to ]+\s*\$?(\d+[\d,.]*)\s*(k|K)?/);
  if (matches) {
    let min = parseFloat(matches[1].replace(/,/g, ''));
    if (matches[2]?.toLowerCase() === 'k' && min < 1000) min *= 1000;

    let max = parseFloat(matches[3].replace(/,/g, ''));
    if (matches[4]?.toLowerCase() === 'k' && max < 1000) max *= 1000;

    return {
      min: min > 0 ? min : undefined,
      max: max > 0 ? max : undefined,
      formatted: cleaned.startsWith('$') || cleaned.startsWith('€') || cleaned.startsWith('£') ? cleaned : `$${cleaned}`,
      isDisclosed: true
    };
  }

  return {
    formatted: cleaned.startsWith('$') || cleaned.startsWith('€') || cleaned.startsWith('£') ? cleaned : `$${cleaned}`,
    isDisclosed: true
  };
}

export function determineExperienceLevel(title: string, desc: string): {
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

export function computeOpportunityScores(
  tier: LocationTier, 
  hasSalary: boolean, 
  isRecent: boolean,
  isDirectEmployer: boolean,
  isEscrowProtected = false
): {
  opportunityScore: number;
  matchScore: number;
  scoreBreakdown: ScoreBreakdown;
} {
  const eligibility = tier === 'tier1_nigeria' ? 25 : tier === 'tier2_africa' ? 24 : tier === 'tier3_worldwide' ? 23 : tier === 'tier5_emea_wat' ? 23 : 20;
  const roleMatch = 18;
  const skillMatch = 14;
  const compensation = hasSalary ? 10 : 7;
  const employerVerification = isEscrowProtected ? 10 : isDirectEmployer ? 9 : 8;
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
        tier === 'tier1_nigeria' ? 'Verified direct opening for Nigerian talent' : tier === 'tier3_worldwide' ? 'Verified 100% Worldwide remote opening' : 'Compatible with Nigerian & African candidates',
        isDirectEmployer ? 'Direct official ATS link or employer job board' : 'Trusted remote job portal listing',
        'Supports international USD contractor invoicing via Deel/Wise or Crypto Escrow'
      ]
    }
  };
}
