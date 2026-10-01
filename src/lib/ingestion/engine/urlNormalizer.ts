/**
 * Canonical URL and String Normalization
 * Removes tracking parameters (utm_*, ref, etc.) and ensures consistent job identity.
 */

export function stripHtml(html: string): string {
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

export function cleanCanonicalUrl(urlStr?: string): string {
  if (!urlStr || typeof urlStr !== 'string') return '';
  try {
    const parsed = new URL(urlStr.trim());
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'ref', 'reference', 'fbclid', 'gclid', 'msclkid', 'trk', 'sc_src', 'sc_lid',
      'source', 'gh_src'
    ];
    
    trackingParams.forEach(param => parsed.searchParams.delete(param));
    
    // Remove trailing slash if present
    let clean = parsed.toString();
    if (clean.endsWith('/') && parsed.pathname !== '/') {
      clean = clean.slice(0, -1);
    }
    return clean;
  } catch {
    return urlStr.trim();
  }
}

export function generateJobFingerprint(company: string, title: string, location?: string): string {
  const normCompany = (company || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
  const normTitle = (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
  const normLoc = (location || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim()
    .slice(0, 20);

  return `${normCompany}_${normTitle}_${normLoc}`;
}
