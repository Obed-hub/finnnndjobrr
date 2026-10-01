import { LocationTier } from '../../../types';

/**
 * Nigeria & Africa Eligibility Engine
 * Performs deep evaluation of location text, restriction keywords, timezone overlaps,
 * and contractor compensation mechanisms to classify eligibility.
 */

export interface EligibilityResult {
  locationTier: LocationTier;
  locationTierLabel: string;
  isNigeriaEligible: boolean;
  isAfricaEligible: boolean;
  isWorldwide: boolean;
  payoutMethod: string;
  payoutCompatibility: 'high' | 'medium' | 'unknown' | 'unsupported';
  timezoneRequirement: string;
  countriesAllowed?: string[];
  countriesExcluded?: string[];
}

export function evaluateNigeriaAfricaEligibility(locationStr = '', description = '', sourceName = ''): EligibilityResult {
  const loc = (locationStr || '').toLowerCase();
  const desc = (description || '').slice(0, 1500).toLowerCase();
  const full = loc + ' ' + desc;

  // Check hard exclusions (e.g., US only, UK citizen only, EU tax residency required)
  const isStrictUsOnly = (
    loc.includes('us only') || 
    loc.includes('usa only') || 
    loc.includes('united states only') ||
    desc.includes('must reside in the us') ||
    desc.includes('must be located in the us') ||
    desc.includes('us citizenship required') ||
    desc.includes('authorized to work in the us without sponsorship')
  );

  const isStrictUkEuOnly = (
    loc.includes('uk only') || 
    loc.includes('eu only') || 
    loc.includes('european union only') ||
    desc.includes('must be based in the uk') ||
    desc.includes('must reside in the eu') ||
    desc.includes('right to work in the uk required')
  );

  if (isStrictUsOnly || isStrictUkEuOnly) {
    return {
      locationTier: 'restricted',
      locationTierLabel: isStrictUsOnly ? 'US Resident Only' : 'UK / EU Resident Only',
      isNigeriaEligible: false,
      isAfricaEligible: false,
      isWorldwide: false,
      payoutMethod: 'Local Domestic Payroll',
      payoutCompatibility: 'unsupported',
      timezoneRequirement: isStrictUsOnly ? 'US Eastern / Pacific' : 'GMT / CET',
      countriesExcluded: ['Nigeria', 'African Countries', 'Worldwide Non-US/EU']
    };
  }

  // 1. Tier 1: Nigeria Explicit
  if (
    loc.includes('nigeria') || loc.includes('lagos') || loc.includes('abuja') || loc.includes('port harcourt') ||
    desc.includes('remote nigeria') || desc.includes('based in nigeria') || desc.includes('nigerian talent')
  ) {
    return {
      locationTier: 'tier1_nigeria',
      locationTierLabel: 'Nigeria Explicit',
      isNigeriaEligible: true,
      isAfricaEligible: true,
      isWorldwide: false,
      payoutMethod: 'Direct USD / NGN (Paystack, Flutterwave, Deel, Bank Transfer)',
      payoutCompatibility: 'high',
      timezoneRequirement: 'WAT (UTC+1) Native Timezone',
      countriesAllowed: ['Nigeria', 'West Africa']
    };
  }

  // 2. Tier 2: Africa Regional
  if (
    loc.includes('africa') || loc.includes('kenya') || loc.includes('ghana') || loc.includes('rwanda') || 
    loc.includes('south africa') || loc.includes('nairobi') || loc.includes('accra') || loc.includes('kigali') ||
    desc.includes('sub-saharan africa') || desc.includes('africa remote')
  ) {
    return {
      locationTier: 'tier2_africa',
      locationTierLabel: 'Africa Remote',
      isNigeriaEligible: true,
      isAfricaEligible: true,
      isWorldwide: false,
      payoutMethod: 'Direct USD / Contractor (Deel, Remote.com, Wise, Payoneer)',
      payoutCompatibility: 'high',
      timezoneRequirement: 'WAT / CAT / EAT (UTC to UTC+3)',
      countriesAllowed: ['Nigeria', 'Ghana', 'Kenya', 'Rwanda', 'South Africa', 'All Africa']
    };
  }

  // 3. Tier 5: EMEA / WAT Friendly
  if (
    loc.includes('emea') || loc.includes('wat') || loc.includes('gmt') || loc.includes('utc+1') || 
    loc.includes('utc+2') || loc.includes('europe/africa') || loc.includes('london/lagos') ||
    desc.includes('emea timezone') || desc.includes('+/- 3 hours of gmt') || desc.includes('wat overlap')
  ) {
    return {
      locationTier: 'tier5_emea_wat',
      locationTierLabel: 'EMEA / WAT Overlap',
      isNigeriaEligible: true,
      isAfricaEligible: true,
      isWorldwide: false,
      payoutMethod: 'Direct USD / EUR Contractor (Deel, Wise, Payoneer)',
      payoutCompatibility: 'high',
      timezoneRequirement: 'WAT / GMT / CET (UTC+0 to UTC+2 Overlap)',
      countriesAllowed: ['Nigeria', 'Africa', 'Europe', 'Middle East']
    };
  }

  // 4. Tier 3: Worldwide / Anywhere Remote
  if (
    loc.includes('worldwide') || loc.includes('anywhere') || loc.includes('global') || 
    loc.includes('work from anywhere') || loc === '' || loc === 'remote' ||
    sourceName.toLowerCase().includes('laborx') || sourceName.toLowerCase().includes('superteam')
  ) {
    const isWeb3 = sourceName.toLowerCase().includes('laborx') || sourceName.toLowerCase().includes('superteam') || loc.includes('crypto');
    return {
      locationTier: 'tier3_worldwide',
      locationTierLabel: 'Worldwide Remote',
      isNigeriaEligible: true,
      isAfricaEligible: true,
      isWorldwide: true,
      payoutMethod: isWeb3 
        ? 'Direct Non-Custodial Crypto (USDT, USDC, ETH, SOL) / Escrow'
        : 'Direct USD Contractor (Deel, Wise, Payoneer, Wire)',
      payoutCompatibility: 'high',
      timezoneRequirement: 'Flexible Global Async / WAT Friendly',
      countriesAllowed: ['Nigeria', 'Africa', 'Worldwide']
    };
  }

  // 5. Tier 4: Global Contractor
  return {
    locationTier: 'tier4_contractor',
    locationTierLabel: 'Global Contractor',
    isNigeriaEligible: true,
    isAfricaEligible: true,
    isWorldwide: true,
    payoutMethod: 'Direct USD Contractor Invoicing (Deel / Wise)',
    payoutCompatibility: 'high',
    timezoneRequirement: 'Flexible Global Timezone',
    countriesAllowed: ['Worldwide Contractors', 'Nigeria Eligible']
  };
}
