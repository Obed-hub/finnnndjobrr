import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Building2, 
  DollarSign, 
  MapPin, 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Flame,
  ArrowRight,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PostJobModal: React.FC = () => {
  const { isPostJobModalOpen, setIsPostJobModalOpen, submitNewJobPosting, showToast } = useApp();
  
  const [tier, setTier] = useState<'standard' | 'featured'>('featured');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLogo: '',
    category: 'Engineering & Tech',
    employmentType: 'full_time',
    location: 'Worldwide Remote',
    locationTier: 'tier3_worldwide',
    salaryMin: '60000',
    salaryMax: '110000',
    salaryFormatted: '$60,000 – $110,000 / yr',
    applicationUrl: '',
    description: '',
    skills: 'TypeScript, React, Node.js',
    contactEmail: ''
  });

  if (!isPostJobModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSalaryPreset = (min: string, max: string, formatted: string) => {
    setFormData(prev => ({
      ...prev,
      salaryMin: min,
      salaryMax: max,
      salaryFormatted: formatted
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.company.trim() || !formData.applicationUrl.trim()) {
      showToast('Please fill in Job Title, Company Name, and Application URL', 'error');
      return;
    }

    // Ensure valid URL
    let appUrl = formData.applicationUrl.trim();
    if (!appUrl.startsWith('http://') && !appUrl.startsWith('https://') && !appUrl.startsWith('mailto:')) {
      appUrl = 'https://' + appUrl;
    }

    setIsSubmitting(true);
    const success = await submitNewJobPosting({
      ...formData,
      applicationUrl: appUrl,
      tier,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setIsSubmitting(false);

    if (success) {
      setIsPostJobModalOpen(false);
      // Reset form
      setFormData({
        title: '',
        company: '',
        companyLogo: '',
        category: 'Engineering & Tech',
        employmentType: 'full_time',
        location: 'Worldwide Remote',
        locationTier: 'tier3_worldwide',
        salaryMin: '60000',
        salaryMax: '110000',
        salaryFormatted: '$60,000 – $110,000 / yr',
        applicationUrl: '',
        description: '',
        skills: 'TypeScript, React, Node.js',
        contactEmail: ''
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => !isSubmitting && setIsPostJobModalOpen(false)} 
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] bg-white border border-[#EDE8DF] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EDE8DF] bg-[#FBF9F4] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-stone-950">Post a Remote Job</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  Reach 25,000+ Talent
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                Publish verified openings to global & African candidates. Zero candidate paywalls.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPostJobModalOpen(false)}
            className="p-2 rounded-xl text-stone-500 hover:text-black hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          
          {/* Tier Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-stone-900 uppercase tracking-wider">
              Choose Listing Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Featured Option */}
              <div 
                onClick={() => setTier('featured')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                  tier === 'featured' 
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm' 
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[11px]">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    Featured & Pinned
                  </span>
                  <span className="text-sm font-black text-stone-900">$99 <span className="text-xs font-normal text-stone-500">/ 30 days</span></span>
                </div>
                <p className="text-xs text-stone-700 font-medium mt-2 leading-relaxed">
                  Pinned to the top of search, distinctive amber badge, and featured in weekly email blast to 15,000+ engineers.
                </p>
              </div>

              {/* Standard Option */}
              <div 
                onClick={() => setTier('standard')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  tier === 'standard' 
                    ? 'border-stone-900 bg-stone-50 shadow-sm' 
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 font-black text-[11px]">
                    Standard Listing
                  </span>
                  <span className="text-sm font-black text-emerald-700">Free</span>
                </div>
                <p className="text-xs text-stone-700 font-medium mt-2 leading-relaxed">
                  Live on the remote job board for 30 days. Full search indexing and direct applicant redirection.
                </p>
              </div>
            </div>
          </div>

          {/* Company & Role Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-2">
              Role & Company Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Job Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Backend Engineer (Go/Remote)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Company Name *</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Cloud Corp"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-semibold bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Job Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="Engineering & Tech">Engineering & Tech</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Operations & Support">Operations & Support</option>
                  <option value="Marketing & Content">Marketing & Content</option>
                  <option value="Web3 & Crypto">Web3 & Crypto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Employment Type</label>
                <select 
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="full_time">Full-time Remote</option>
                  <option value="contract">Contract (Deel / Direct)</option>
                  <option value="freelance">Freelance / Hourly</option>
                  <option value="bounty">Web3 Bounty / Project</option>
                  <option value="ai_task">AI Model Training / Evaluator</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Location Scope</label>
                <select 
                  name="locationTier"
                  value={formData.locationTier}
                  onChange={(e) => {
                    const val = e.target.value;
                    let loc = 'Worldwide Remote';
                    if (val === 'tier1_nigeria') loc = 'Nigeria Explicit (WAT)';
                    else if (val === 'tier2_africa') loc = 'Africa Remote';
                    setFormData(prev => ({ ...prev, locationTier: val, location: loc }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="tier3_worldwide">Worldwide / Global Remote</option>
                  <option value="tier1_nigeria">Nigeria Explicit (WAT)</option>
                  <option value="tier2_africa">Africa Regional Remote</option>
                  <option value="tier4_contractor">Contractor Friendly (Deel / Wise)</option>
                  <option value="tier5_emea_wat">EMEA / WAT Friendly Timezone</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Salary Range / Formatted *</label>
                <input 
                  type="text" 
                  name="salaryFormatted"
                  value={formData.salaryFormatted}
                  onChange={handleChange}
                  placeholder="e.g. $70,000 – $120,000 / yr or $40 / hr"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-semibold bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Direct Application URL or Email *
              </label>
              <input 
                type="text" 
                name="applicationUrl"
                value={formData.applicationUrl}
                onChange={handleChange}
                placeholder="https://company.greenhouse.io/jobs/12345 or mailto:careers@company.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-semibold bg-white"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Candidates click directly to your Greenhouse, Lever, Workable, or direct portal.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Company Logo URL (Optional)
              </label>
              <input 
                type="url" 
                name="companyLogo"
                value={formData.companyLogo}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or https://company.com/logo.png"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-semibold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Required Skills & Tech Stack (Comma separated)
              </label>
              <input 
                type="text" 
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Python, FastAPI, Docker, PostgreSQL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-semibold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Job Overview & Key Requirements
              </label>
              <textarea 
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief summary of the role, core responsibilities, and qualifications..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-medium bg-white"
              />
            </div>
          </div>

          {/* Trust Banner */}
          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EDE8DF] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs text-stone-700 font-medium leading-relaxed">
              Every job posting is audited for spam prevention, confirmed payout rails, and salary disclosures before syndication.
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPostJobModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl font-black text-xs text-white transition-all flex items-center gap-2 shadow-sm ${
                tier === 'featured'
                  ? 'bg-amber-600 hover:bg-amber-700 active:scale-95'
                  : 'bg-stone-900 hover:bg-black active:scale-95'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : tier === 'featured' ? 'Publish Featured Post ($99)' : 'Publish Free Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
