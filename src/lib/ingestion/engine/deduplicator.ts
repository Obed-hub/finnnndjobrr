import { Job } from '../../../types';
import { generateJobFingerprint, cleanCanonicalUrl } from './urlNormalizer';
import { isDemoJob, isRecentJob, sanitizeAndEnrichJob } from '../../linkVerifier';

/**
 * Deduplicator & Cross-Source Canonical Linker
 * Merges identical job postings discovered across different feeds (e.g. RemoteOK + Remotive + Jobicy),
 * keeping the most complete metadata, tracking all sources where found, and counting duplicates prevented.
 */

export function deduplicateAndMergeJobs(incomingJobs: Job[], existingJobs: Job[] = []): {
  mergedJobs: Job[];
  duplicatesPrevented: number;
} {
  const jobMap = new Map<string, Job>();
  let duplicatesPrevented = 0;

  // First seed existing jobs (filter demo/stale)
  for (const rawJob of existingJobs) {
    if (isDemoJob(rawJob) || !isRecentJob(rawJob, 35)) continue;
    const job = sanitizeAndEnrichJob(rawJob);
    if (!job) continue;
    const fingerprint = generateJobFingerprint(job.company, job.title, job.location);
    jobMap.set(fingerprint, { ...job });
  }

  for (const rawJob of incomingJobs) {
    if (isDemoJob(rawJob) || !isRecentJob(rawJob, 35)) continue;
    const job = sanitizeAndEnrichJob(rawJob);
    if (!job) continue;

    const fingerprint = generateJobFingerprint(job.company, job.title, job.location);
    const existing = jobMap.get(fingerprint);

    if (existing) {
      duplicatesPrevented++;
      // Merge sources list
      const existingSources = existing.sourcesList || [existing.source];
      const newSource = job.source;
      const combinedSources = Array.from(new Set([...existingSources, newSource, ...(job.sourcesList || [])]));
      
      // Keep highest quality fields
      const bestDescription = (job.description?.length || 0) > (existing.description?.length || 0)
        ? job.description
        : existing.description;
      
      const bestLogo = existing.companyLogo || job.companyLogo;
      const bestSalary = existing.salaryMin ? existing.salaryFormatted : (job.salaryMin ? job.salaryFormatted : existing.salaryFormatted);
      const higherScore = Math.max(existing.opportunityScore, job.opportunityScore);

      jobMap.set(fingerprint, {
        ...existing,
        companyLogo: bestLogo,
        description: bestDescription,
        sourcesFoundCount: combinedSources.length,
        sourcesList: combinedSources,
        salaryFormatted: bestSalary || existing.salaryFormatted,
        opportunityScore: higherScore,
        lastVerifiedAt: new Date().toISOString()
      });
    } else {
      jobMap.set(fingerprint, {
        ...job,
        sourcesFoundCount: 1,
        sourcesList: [job.source]
      });
    }
  }

  const merged = Array.from(jobMap.values());

  // Sort by freshness and opportunity score
  merged.sort((a, b) => {
    const timeA = new Date(a.postedAt || a.discoveredAt).getTime();
    const timeB = new Date(b.postedAt || b.discoveredAt).getTime();
    if (isNaN(timeA) || isNaN(timeB) || timeA === timeB) {
      return (b.opportunityScore || 0) - (a.opportunityScore || 0);
    }
    return timeB - timeA;
  });

  return {
    mergedJobs: merged,
    duplicatesPrevented
  };
}
