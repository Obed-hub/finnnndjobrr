import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Globe2, 
  Layers, 
  BarChart3, 
  ShieldCheck,
  Zap,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MarketIntelligenceView: React.FC = () => {
  const { setActiveTab, setSearchFilters } = useApp();
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  const salaryBenchmarks = [
    {
      role: 'Junior Data Analyst',
      track: 'data',
      experience: '0–2 Years',
      globalRange: '$2,000 – $3,500 / mo',
      africanRemoteRange: '$1,200 – $2,200 / mo',
      demand: 'High Demand',
      topSkills: ['SQL', 'Power BI', 'Python', 'ETL pipelines']
    },
    {
      role: 'Frontend Engineer (React/Next)',
      track: 'engineering',
      experience: '1–3 Years',
      globalRange: '$3,000 – $5,500 / mo',
      africanRemoteRange: '$1,800 – $3,500 / mo',
      demand: 'Very High',
      topSkills: ['React', 'TypeScript', 'Tailwind', 'Next.js']
    },
    {
      role: 'Backend Systems Engineer (Go/Node)',
      track: 'engineering',
      experience: '2–4 Years',
      globalRange: '$4,000 – $7,000 / mo',
      africanRemoteRange: '$2,500 – $4,500 / mo',
      demand: 'Surging',
      topSkills: ['Go', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
    },
    {
      role: 'AI / LLM Data Annotator & Evaluator',
      track: 'ai',
      experience: 'Any (Starter)',
      globalRange: '$15 – $35 / hr',
      africanRemoteRange: '$15 – $25 / hr',
      demand: 'Extremely High',
      topSkills: ['English Proficiency', 'Critical Reasoning', 'Prompting', 'RLHF']
    },
    {
      role: 'Product Designer (UI/UX & Design Systems)',
      track: 'design',
      experience: '1–3 Years',
      globalRange: '$2,800 – $5,000 / mo',
      africanRemoteRange: '$1,600 – $3,200 / mo',
      demand: 'High Demand',
      topSkills: ['Figma', 'Design Tokens', 'User Research', 'Prototyping']
    },
    {
      role: 'Customer Support & Operations Specialist',
      track: 'ops',
      experience: '1–3 Years',
      globalRange: '$1,800 – $3,000 / mo',
      africanRemoteRange: '$1,000 – $1,800 / mo',
      demand: 'Moderate',
      topSkills: ['Zendesk', 'Intercom', 'WAT/GMT Timezone alignment']
    },
    {
      role: 'Technical Writer / Documentation Lead',
      track: 'content',
      experience: '1–3 Years',
      globalRange: '$2,500 – $4,500 / mo',
      africanRemoteRange: '$1,500 – $2,800 / mo',
      demand: 'High Demand',
      topSkills: ['Markdown', 'API Docs', 'Developer Guides', 'Postman']
    },
  ];

  const filteredBenchmarks = selectedTrack === 'all' 
    ? salaryBenchmarks 
    : salaryBenchmarks.filter(b => b.track === selectedTrack);

  const handleRoleExplore = (roleName: string) => {
    setSearchFilters(prev => ({ ...prev, keyword: roleName, category: 'all' }));
    setActiveTab('discover');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-[24px] sm:rounded-[32px] bg-white border border-[#EDE8DF] p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#0B5CFF]/10 text-[#0B5CFF] font-mono flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Market Intelligence & Compensation</span>
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00875A]/10 text-[#00875A] font-mono">
            Updated Weekly • Q1 2026
          </span>
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
          Remote Compensation & African Tech Market Intel
        </h1>
        <p className="text-xs sm:text-sm text-[#767676] max-w-3xl leading-relaxed">
          Verified compensation benchmarks, timezone parity advantages, and skill premiums across African scale-ups and international remote contractors.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-xs text-[#767676] font-semibold mr-1">Filter Domain:</span>
          {[
            { id: 'all', label: 'All Roles' },
            { id: 'ai', label: 'AI & Data Annotation' },
            { id: 'engineering', label: 'Engineering' },
            { id: 'data', label: 'Data & Analytics' },
            { id: 'design', label: 'Design' },
            { id: 'ops', label: 'Operations' },
            { id: 'content', label: 'Technical Writing' },
          ].map(track => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTrack === track.id
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-[#F7F5EE] hover:bg-[#EDE8DF] text-[#767676] border border-[#EDE8DF]'
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>
      </div>

      {/* Salary Benchmark Table */}
      <div className="rounded-[24px] sm:rounded-[32px] bg-white border border-[#EDE8DF] overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-[#EDE8DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#FAF9F5]">
          <div>
            <h2 className="text-base font-bold text-[#1A1A1A]">2026 Remote Tech Salary Benchmarks</h2>
            <p className="text-xs text-[#767676]">Ranges represent gross USD earnings for verified remote contractors in WAT timezone</p>
          </div>
          <span className="text-xs text-[#767676] font-mono bg-white px-2.5 py-1 rounded-full border border-[#EDE8DF]">
            {filteredBenchmarks.length} Roles Cataloged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] text-[#767676] uppercase font-mono text-[10px] border-b border-[#EDE8DF]">
              <tr>
                <th className="p-4 sm:p-5 font-bold">Target Role</th>
                <th className="p-4 sm:p-5 font-bold">Experience</th>
                <th className="p-4 sm:p-5 font-bold">Africa Remote Pay</th>
                <th className="p-4 sm:p-5 font-bold">Global Contractor Pay</th>
                <th className="p-4 sm:p-5 font-bold">Demand</th>
                <th className="p-4 sm:p-5 font-bold">Essential Tech Stack</th>
                <th className="p-4 sm:p-5 text-right font-bold">Explore</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8DF]">
              {filteredBenchmarks.map((b, i) => (
                <tr key={i} className="hover:bg-[#FAF9F5] transition-colors group">
                  <td className="p-4 sm:p-5 font-bold text-[#1A1A1A] text-sm">
                    {b.role}
                  </td>
                  <td className="p-4 sm:p-5 text-[#767676] font-medium">{b.experience}</td>
                  <td className="p-4 sm:p-5 font-bold text-[#00875A] font-mono text-sm">{b.africanRemoteRange}</td>
                  <td className="p-4 sm:p-5 text-[#1A1A1A] font-mono font-semibold">{b.globalRange}</td>
                  <td className="p-4 sm:p-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold font-mono border border-emerald-200">
                      {b.demand}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {b.topSkills.map((s, si) => (
                        <span key={si} className="px-2 py-0.5 rounded-lg bg-[#F7F5EE] border border-[#EDE8DF] text-[#1A1A1A] text-[10px] font-mono font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-right">
                    <button
                      onClick={() => handleRoleExplore(b.role)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F7F5EE] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>Jobs</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-[28px] bg-white border border-[#EDE8DF] space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#0B5CFF]">
            <div className="w-8 h-8 rounded-xl bg-[#0B5CFF]/10 flex items-center justify-center">
              <Globe2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A]">Timezone Parity Premium (WAT / GMT+1)</h3>
          </div>
          <p className="text-xs text-[#767676] leading-relaxed">
            West Africa Time (WAT) shares identical working hours with London (GMT+0/BST) and Central European Time (CET). Nigerian and Ghanaian talent have a massive operational advantage over APAC candidates for European employers.
          </p>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-[#EDE8DF] space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#00875A]">
            <div className="w-8 h-8 rounded-xl bg-[#00875A]/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A]">Tax & Domiciliary USD FX Strategy</h3>
          </div>
          <p className="text-xs text-[#767676] leading-relaxed">
            Structuring contracts as an independent international consultant through Deel, Grey, or Geegpay allows full legal settlement in USD with direct transfer to local domiciliary bank accounts without forced currency devaluations.
          </p>
        </div>
      </div>
    </div>
  );
};
