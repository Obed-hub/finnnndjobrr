import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Building2, 
  DollarSign, 
  MapPin, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JobCard } from '../components/JobCard';
import { fetchJobs } from '../lib/api';
import { Job } from '../types';

export const SavedJobsView: React.FC = () => {
  const { savedJobIds, setActiveTab } = useApp();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs({})
      .then(res => {
        const filtered = res.jobs.filter(j => savedJobIds.includes(j.id));
        setSavedJobs(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [savedJobIds]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-[#EDE8DF] p-6 sm:p-8 flex items-center justify-between shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#D84315]/10 text-[#D84315] font-mono flex items-center gap-1 border border-[#D84315]/20">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarked Opportunities</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
            Saved Job Listings
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Keep track of shortlisted positions, analyze AI job intelligence, and ask questions before applying.
          </p>
        </div>

        <span className="text-sm font-extrabold text-[#D84315] font-mono px-3.5 py-1.5 rounded-xl bg-stone-100 border border-stone-200">
          {savedJobs.length} Saved
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-64 rounded-[28px] bg-white border border-[#EDE8DF] animate-pulse" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center p-12 rounded-[28px] bg-white border border-[#EDE8DF] space-y-3 shadow-2xs">
          <Bookmark className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-[#1A1A1A]">No saved jobs yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click the bookmark icon on any job in Discover or For You to keep it saved in your personal shortlist.
          </p>
          <button
            onClick={() => setActiveTab('discover')}
            className="px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs cursor-pointer shadow-sm"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};
