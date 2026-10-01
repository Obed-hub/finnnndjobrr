import { DeepResearchOpportunityTrack, RelatedPlatformComparison, Micro1DeepResearchResult } from '../types';

export const MICRO1_DEEP_RESEARCH: Micro1DeepResearchResult = {
  url: 'https://www.micro1.ai/experts/opportunities',
  title: 'Micro1 AI Domain Experts & Opportunities Network',
  overview: 'Micro1 is an AI-powered global talent platform and human-in-the-loop (HITL) infrastructure provider that connects specialized domain experts with leading frontier AI labs (including OpenAI, Anthropic, Google, and enterprise AI builders). Experts train, evaluate, critique, and align LLMs via RLHF (Reinforcement Learning from Human Feedback), SFT (Supervised Fine-Tuning), adversarial red-teaming, and domain verification.',
  founded: 'Founded in 2021 by Ali Ansari (Y Combinator alumnus). Headquartered in San Francisco, CA, operating a 100% remote global network.',
  businessModel: 'Micro1 provides enterprise AI labs with vetted domain specialists on demand. Rather than relying on non-specialized crowd-workers, Micro1 uses autonomous AI recruiters ("Zara" for voice interviews and "Ava" for proctored coding) to screen the top 1% of global experts across engineering, finance, legal, medicine, and data science.',
  whyHiringExperts: 'Frontier AI models have surpassed general web text training. Model developers now require high-signal human reasoning: PhD-level mathematical reasoning, complex software system debugging, financial model auditing, legal interpretation, and edge-case prompt adversarial grading. This has created an unprecedented boom for remote domain experts globally.',
  opportunityTracks: [
    {
      trackTitle: 'Full-Stack & Systems Engineering AI Trainer',
      rolesIncluded: [
        'Senior Full Stack AI Evaluator',
        'Python / Backend Code Reasoning Specialist',
        'TypeScript / React Logic Auditor',
        'Distributed Systems & Cloud Benchmark Evaluator'
      ],
      payRange: '$50 – $175 / hr (Median ~$75/hr; Full-Time Eq. $8,000 – $22,000/mo)',
      commitment: 'Ultra-flexible (10 – 40 hrs/wk, fully asynchronous, zero mandatory meetings)',
      keySkills: ['Python', 'TypeScript', 'Data Structures & Algorithms', 'Code Explanation', 'RLHF Code Ranking'],
      vettingSteps: ['Resume AI Screening', 'Zara Voice Interview (20m)', 'Ava Proctored Coding Sandbox (30m)', 'ID Verification'],
      demandLevel: 'Very High'
    },
    {
      trackTitle: 'Data Analytics & Quantitative Reasoning Specialist',
      rolesIncluded: [
        'SQL & Database Schema Benchmark Evaluator',
        'Statistical Modeling & Python/Pandas Auditor',
        'BI & Metric Calculation Validator',
        'Data Pipeline & ETL Logic Trainer'
      ],
      payRange: '$35 – $95 / hr (Median ~$60/hr; Full-Time Eq. $5,600 – $15,200/mo)',
      commitment: 'Self-paced, project-based (Flexible hours with weekly milestones)',
      keySkills: ['Advanced SQL', 'Python (Pandas/NumPy)', 'Metric Modeling', 'Data Validation', 'Factual Verification'],
      vettingSteps: ['Resume Screening', 'Zara Voice Technical Interview (20m)', 'Domain Reasoning Test', 'ID Verification'],
      demandLevel: 'Very High'
    },
    {
      trackTitle: 'Finance, Tax & Legal AI Translator & Validator',
      rolesIncluded: [
        'Remote CPA & AI Tax Logic Translator',
        'Financial Valuation & DCF Model Auditor',
        'Corporate Legal Contract AI Reviewer',
        'Regulatory Compliance & Risk Evaluator'
      ],
      payRange: '$40 – $135+ / hr (High-Specialty Investment/Legal up to $210/hr)',
      commitment: 'Part-time / Flexible contractor engagement (5 – 30 hrs/wk)',
      keySkills: ['Financial Accounting', 'Corporate Law / Contracts', 'Tax Codes', 'Risk Auditing', 'Analytical Writing'],
      vettingSteps: ['Credential Verification (CPA/LL.B/J.D/CFA)', 'Zara Voice Domain Interview', 'Sample Case Study Review'],
      demandLevel: 'High'
    },
    {
      trackTitle: 'AI Workflow & Prompt Evaluation Specialist (Generalist)',
      rolesIncluded: [
        'AI Prompt Designer & Red-Teaming Specialist',
        'Hallucination & Fact-Checking Auditor',
        'Multi-Turn Conversational Reasoning Evaluator',
        'Creative & Technical Nuance Trainer'
      ],
      payRange: '$30 – $65 / hr (Median ~$45/hr; Full-Time Eq. $4,800 – $10,400/mo)',
      commitment: 'Fully flexible, on-demand task batches',
      keySkills: ['Flawless Written English', 'Critical Reasoning', 'Prompt Engineering', 'Logical Fallacy Detection'],
      vettingSteps: ['Profile Application', 'Zara Voice Reasoning Assessment', 'Sample Response Ranking Task', 'ID Check'],
      demandLevel: 'High'
    },
    {
      trackTitle: 'Medical, Clinical & Bio-Science Domain Expert',
      rolesIncluded: [
        'Clinical Decision Pathway Validator',
        'Biomedical Literature & Pharmacology Auditor',
        'Medical Diagnosis & Case Reasoning Reviewer'
      ],
      payRange: '$60 – $150+ / hr',
      commitment: 'Flexible advisory contractor hours (5 – 20 hrs/wk)',
      keySkills: ['Medical Degree (MBBS/MD/PharmD)', 'Clinical Protocols', 'Medical Literature Synthesis'],
      vettingSteps: ['Medical License Verification', 'Zara Clinical Voice Interview', 'ID Verification'],
      demandLevel: 'Moderate'
    }
  ],
  vettingProcess: {
    zaraAiInterview: {
      duration: '20–22 Minutes (Asynchronous Voice)',
      format: 'Conversational voice interview conducted directly in the browser by "Zara", Micro1\'s proprietary adaptive AI interviewer. Zara listens to verbal answers in real time, probes deeper with contextual follow-up questions, and evaluates both domain depth and communication clarity.',
      focusAreas: [
        'Verbal articulation of complex domain concepts without relying on scripted notes',
        'Problem-solving methodology and thought process breakdown',
        'Real-world project scenario handling and trade-off analysis',
        'Confidence, fluency, and English linguistic coherence'
      ],
      prepTips: [
        'Use a high-quality external microphone and ensure a quiet background environment.',
        'Structure verbal answers using the STAR format (Situation, Task, Action, Result) with measurable metrics.',
        'Speak naturally and deliberately; Zara adapts its follow-up questions based on the technical keywords you mention.',
        'Expect Zara to ask "Why did you choose that approach instead of alternative X?" — explain trade-offs clearly.'
      ]
    },
    avaCodingAssessment: {
      duration: '25–30 Minutes (Live Proctored Sandbox)',
      format: 'Technical assessment monitored by "Ava", Micro1\'s automated proctoring agent. Focuses on writing modular, bug-free algorithms and explaining algorithmic time/space complexity.',
      focusAreas: [
        'Core algorithmic problem-solving (arrays, trees, hashing, dynamic programming, strings)',
        'Code readability, modular function decomposition, and edge-case handling',
        'Time and space complexity analysis (Big-O notation)',
        'Strict anti-plagiarism and non-copy-paste proctoring'
      ],
      prepTips: [
        'Review standard LeetCode Medium data structures (HashMaps, Two Pointers, DFS/BFS).',
        'Write descriptive variable names and comment your algorithmic invariants.',
        'Test your code against empty inputs, boundary values, and high scale limits before submitting.'
      ]
    },
    idVerification: 'Automated government-issued passport, national ID (NIN/Voters card for Nigeria), or driver\'s license biometric scan to issue the Certified Micro1 Expert badge.',
    matchingSpeed: 'Once verified by Zara & Ava, your profile enters the active talent pool. Project invitations are dispatched within 48 to 96 hours based on client pipeline matches.'
  },
  payoutAndContractInfo: {
    payoutProvider: 'Deel (Direct integration)',
    paymentFrequency: 'Bi-Weekly or Monthly (direct deposit / on-demand withdrawal)',
    acceptedCurrencies: ['USD ($)', 'EUR (€)', 'GBP (£)', 'USDC / USDT (Crypto Stablecoin)'],
    contractType: 'Independent International Contractor Agreement',
    taxForms: 'Electronic W-8BEN (Certificate of Foreign Status for US Tax Withholding, 0% US tax withheld for non-US residents)'
  },
  relatedPlatforms: [
    {
      name: 'Mercor Experts',
      url: 'https://mercor.com/experts',
      category: 'AI Talent Network & Contract Placement',
      payRange: '$60 – $250 / hr',
      vettingMethod: 'Proprietary AI Video Interview (Grounded on resume & GitHub repos)',
      payoutRail: 'Deel / Direct USD Wire',
      africaEligibility: 'Fully open to Nigeria, Ghana, Kenya & global talent with strong portfolios',
      keyDifference: 'Places experts directly into dedicated long-term US venture-backed startup teams, as well as AI research contracts.'
    },
    {
      name: 'Handshake AI Fellowship',
      url: 'https://joinhandshake.com',
      category: 'Academic & PhD AI Evaluation',
      payRange: '$50 – $100 / hr',
      vettingMethod: 'Academic credentials review & technical prompt evaluation test',
      payoutRail: 'Direct Bank Deposit',
      africaEligibility: 'Primarily requires accredited Masters/PhD or strong university affiliation',
      keyDifference: 'Tailored heavily towards graduate researchers and subject-matter fellows evaluating STEM AI models.'
    },
    {
      name: 'Alignerr',
      url: 'https://alignerr.com',
      category: 'Domain-Specific LLM Fine-Tuning',
      payRange: '$20 – $50 / hr (Average $25–$35/hr)',
      vettingMethod: 'TestGorilla standardized domain exam + short video statement',
      payoutRail: 'Deel Platform (Direct Bank, Wise, Crypto)',
      africaEligibility: 'Strong acceptance for Nigeria and African contractors across STEM & writing',
      keyDifference: 'Structured test via TestGorilla; once passed, projects are claimed directly on their web dashboard.'
    },
    {
      name: 'Outlier AI / Scale AI',
      url: 'https://outlier.ai',
      category: 'Crowd & Expert RLHF Infrastructure',
      payRange: '$15 – $45 / hr',
      vettingMethod: 'Multi-stage written onboarding assessment and rubric grading exam',
      payoutRail: 'PayPal / AirTM / Direct Bank',
      africaEligibility: 'High volume in Nigeria & Kenya, but strict VPN detection and queue fluctuations',
      keyDifference: 'Massive project variety (coding, STEM, languages) with weekly payout cycles, but project queues fluctuate.'
    },
    {
      name: 'DataAnnotation.tech',
      url: 'https://dataannotation.tech',
      category: 'Coding & Generalist AI Training',
      payRange: '$20 – $40 / hr',
      vettingMethod: 'Initial starter assessment (free-form creative & logic questions)',
      payoutRail: 'PayPal (Verified accounts only)',
      africaEligibility: 'Restricted country list; requires careful verification of resident status',
      keyDifference: 'Payouts every 3 days; requires verified PayPal (which is more restrictive in Nigeria than Deel).'
    },
    {
      name: 'Invisible Technologies',
      url: 'https://invisible.co',
      category: 'Enterprise AI Operations & Workflows',
      payRange: '$15 – $30 / hr',
      vettingMethod: 'Skill assessment, asynchronous interview, operational test',
      payoutRail: 'Deel Platform',
      africaEligibility: 'Fully open to worldwide contractors with strong English proficiency',
      keyDifference: 'Blends automated workflow agent supervision with human-in-the-loop task execution.'
    }
  ],
  applicationPlaybook: [
    '1. Resume Optimization: Tailor your CV specifically to highlight quantitative projects, code quality, and analytical problem solving. Use Findjobber PRO\'s Resume Reshaper to align with Micro1\'s ATS parser.',
    '2. Profile Creation: Visit https://www.micro1.ai/experts/opportunities and select your target domain (Engineering, Data & Analytics, Finance/Legal, or Generalist).',
    '3. Prepare for Zara AI Voice Interview: Review your core tech stack. Find a quiet room, test your microphone, and speak clearly. Zara evaluates conceptual depth and communication tone.',
    '4. Complete Ava Coding Challenge (if applying to Engineering/Data): Write clean, modular functions with comments and handle edge cases.',
    '5. ID Verification: Have your international passport or government ID ready for instant biometric verification.',
    '6. Set up Deel Contractor Account: Complete your W-8BEN form electronically and configure your withdrawal method (USD Domiciliary account, Wise, Payoneer, or USDC Crypto).',
    '7. Receive First Project Invitation: Start with small task batches to maintain a 5-star quality rating, which unlocks higher hourly rates ($75–$135+/hr).'
  ]
};
