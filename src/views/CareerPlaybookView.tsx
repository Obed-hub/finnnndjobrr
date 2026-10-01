import React, { useState } from 'react';
import { 
  BookOpen, 
  CreditCard, 
  ShieldAlert, 
  FileCheck, 
  Laptop, 
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const CareerPlaybookView: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>('payouts');

  const guides = [
    {
      id: 'payouts',
      title: '1. Payout Rails (Receiving USD/EUR in Africa)',
      icon: CreditCard,
      badge: 'Payouts',
      items: [
        { title: 'Deel / Remote.com', desc: 'Direct deposit into Nigerian USD Domiciliary Bank Accounts (GTB, Zenith, Access) or Wise.' },
        { title: 'Geegpay & Grey.co', desc: 'Personal US ACH & European IBAN accounts with instant Naira conversion at competitive parallel rates.' },
        { title: 'Payoneer & Wise', desc: 'Global payout standard for AI evaluation boards (Outlier, Appen, Clickworker).' },
        { title: 'USDC / USDT Stablecoins', desc: 'Instant 2-second on-chain crypto settlement for Web3 bounties and modern remote protocols.' }
      ]
    },
    {
      id: 'scam_shield',
      title: '2. Scam Shield (Identifying Fake Postings)',
      icon: ShieldAlert,
      badge: 'Security',
      items: [
        { title: 'Telegram/WhatsApp Only', desc: 'Legitimate companies never hire solely via messaging apps without a video call or ATS portal.' },
        { title: 'Equipment / Screening Fees', desc: 'Never pay upfront fees for tests, equipment checks, or background screening kits.' },
        { title: 'Domain Spoofing', desc: 'Verify email sender addresses. Look out for @gmail.com or misspelled company URLs.' },
        { title: 'Fake Check Schemes', desc: 'Never accept checks asking you to send back a portion to a third-party vendor.' }
      ]
    },
    {
      id: 'proof_of_work',
      title: '3. Proof of Work (Getting Noticed by Recruiters)',
      icon: Laptop,
      badge: 'Portfolio',
      items: [
        { title: 'Real Industry Datasets', desc: 'Build local analytics models (e.g. Fintech transaction success rates, logistics latency).' },
        { title: 'Interactive Web Demos', desc: 'Deploy clickable demos on Vercel, Power BI Web, or GitHub Pages. Recruiters do not download ZIP files.' },
        { title: '3-Sentence Executive Summary', desc: 'State the business challenge, tech stack, and measurable performance improvement in your README.' }
      ]
    },
    {
      id: 'contractor_tax',
      title: '4. W-8BEN & Contractor Basics',
      icon: FileCheck,
      badge: 'Legal',
      items: [
        { title: 'IRS Form W-8BEN', desc: 'Exempts non-US remote contractors from US tax withholding. Simple 1-page digital form.' },
        { title: 'Independent Contractor Agreement', desc: 'Standard contract for international talent. Allows flexible hours and multiple clients.' },
        { title: 'Professional Invoicing', desc: 'Issue clean invoices with invoice numbers, routing details, and Net 15/30 terms.' }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white border border-[#EDE8DF] p-5 sm:p-6 space-y-1 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0B5CFF]/10 text-[#0B5CFF] font-mono flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cheat Sheets</span>
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
          Remote Contractor Playbook
        </h1>
        <p className="text-xs text-stone-600">
          Essential guidelines on foreign payouts, W-8BEN compliance, portfolio setup, and scam prevention.
        </p>
      </div>

      {/* Clean Accordion Guides */}
      <div className="space-y-3">
        {guides.map(guide => {
          const isOpen = openSection === guide.id;
          const Icon = guide.icon;
          return (
            <div key={guide.id} className="rounded-2xl bg-white border border-[#EDE8DF] overflow-hidden shadow-2xs">
              <button
                onClick={() => setOpenSection(isOpen ? '' : guide.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between hover:bg-[#FAF9F5] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0B5CFF]/10 text-[#0B5CFF] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">{guide.title}</h3>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>

              {isOpen && (
                <div className="p-4 sm:p-5 border-t border-[#EDE8DF] bg-[#FAF9F5] grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guide.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#EDE8DF] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A] shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs text-stone-600 pl-5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
