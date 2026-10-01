import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Layers, Sparkles } from 'lucide-react';
import { Job } from '../types';

interface ScoreBreakdownModalProps {
  job: Job;
  onClose: () => void;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({ job, onClose }) => {
  const sb = job.scoreBreakdown;

  const scoreItems = [
    {
      name: 'Location & Work Authorization Eligibility',
      score: sb.eligibility,
      max: 25,
      desc: 'Evaluates whether Nigerian and African remote candidates are explicitly permitted or contractor-friendly.',
      status: sb.eligibility >= 20 ? 'pass' : sb.eligibility >= 10 ? 'caution' : 'fail'
    },
    {
      name: 'Role & Responsibilities Alignment',
      score: sb.roleMatch,
      max: 20,
      desc: 'Degree of overlap between target position responsibilities and your profile trajectory.',
      status: sb.roleMatch >= 16 ? 'pass' : 'caution'
    },
    {
      name: 'Core Skills & Tech Stack Overlap',
      score: sb.skillMatch,
      max: 15,
      desc: 'Matches direct programming languages, frameworks, BI tools, and databases with verified requirements.',
      status: sb.skillMatch >= 12 ? 'pass' : 'caution'
    },
    {
      name: 'Compensation & Disclosed Pay Transparency',
      score: sb.compensation,
      max: 10,
      desc: 'Rewards publicly verifiable USD/hard-currency rate ranges and competitive pay bands.',
      status: sb.compensation >= 8 ? 'pass' : 'caution'
    },
    {
      name: 'Employer Verification & Official ATS Source',
      score: sb.employerVerification,
      max: 10,
      desc: 'Points awarded for official company career portals (Lever, Ashby, Greenhouse, BambooHR) over aggregators.',
      status: sb.employerVerification >= 8 ? 'pass' : 'caution'
    },
    {
      name: 'Application Accessibility & Simplicity',
      score: sb.applicationAccessibility,
      max: 5,
      desc: 'Measures low barrier application (direct forms, no 50-field Workday loops).',
      status: 'pass'
    },
    {
      name: 'Timezone Compatibility (WAT / EMEA / Async)',
      score: sb.timezoneCompatibility,
      max: 5,
      desc: 'Evaluates required synchronous working hours overlap with West Africa Time (WAT / UTC+1).',
      status: 'pass'
    },
    {
      name: 'Experience Seniority Calibration',
      score: sb.experienceMatch,
      max: 5,
      desc: 'Calibrates whether 0–2 years junior/entry requirements match your current level.',
      status: 'pass'
    },
    {
      name: 'Listing Freshness & Hiring Velocity',
      score: sb.freshness,
      max: 5,
      desc: 'Scores opportunities indexed in the last 24–48 hours to maximize first-mover applicant advantage.',
      status: 'pass'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-xl max-h-[90vh] bg-white border border-[#EDE8DF] rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EDE8DF] flex items-center justify-between bg-[#FBF9F4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D84315]/10 border border-[#D84315]/20 flex items-center justify-center text-[#D84315]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A1A1A]">Opportunity Score Breakdown</h3>
              <p className="text-xs text-[#767676]">{job.title} • {job.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#767676] hover:text-[#1A1A1A] hover:bg-[#EDE8DF] border border-[#EDE8DF] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Score Summary Card */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] font-mono">{sb.total}</span>
              <span className="text-xs sm:text-sm text-[#767676] font-mono">/ 100</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                sb.total >= 85 ? 'bg-[#00875A]/10 text-[#00875A] border border-[#00875A]/30' :
                sb.total >= 70 ? 'bg-[#D84315]/10 text-[#D84315] border border-[#D84315]/30' :
                'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {sb.total >= 85 ? 'High Priority' : sb.total >= 70 ? 'Strong Candidate' : 'Moderate Match'}
              </span>
            </div>
            <p className="text-xs text-[#767676] mt-1">
              Calculated across 9 objective verification factors.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#767676] block uppercase font-mono">Personal Match</span>
            <span className="text-lg sm:text-xl font-bold text-[#00875A] font-mono">{job.matchScore}%</span>
          </div>
        </div>

        {/* 9 Factors List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 touch-scroll">
          {scoreItems.map((item, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[#FBF9F4] border border-[#EDE8DF]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {item.status === 'pass' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0" />
                  ) : item.status === 'caution' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-[#1A1A1A] truncate">{item.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-white border border-[#EDE8DF] px-2 py-0.5 rounded-full ml-2 shrink-0">
                  {item.score} / {item.max}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#EDE8DF] rounded-full overflow-hidden mb-1.5">
                <div 
                  className={`h-full rounded-full ${
                    item.score / item.max >= 0.8 ? 'bg-[#00875A]' :
                    item.score / item.max >= 0.5 ? 'bg-[#D84315]' :
                    'bg-amber-500'
                  }`}
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>

              <p className="text-[11px] text-[#767676]">{item.desc}</p>
            </div>
          ))}

          {/* Notes list */}
          {sb.notes && sb.notes.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-[#FBF9F4] border border-[#EDE8DF]">
              <h4 className="text-xs font-bold text-[#1A1A1A] mb-2 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-[#00875A]" />
                <span>Verification Notes & Signals</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-[#767676]">
                {sb.notes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#00875A] font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#EDE8DF] flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};

