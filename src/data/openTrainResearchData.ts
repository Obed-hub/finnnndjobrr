import { OpenTrainDeepResearchResult } from '../types';

export const OPENTRAIN_DEEP_RESEARCH: OpenTrainDeepResearchResult = {
  url: 'https://opentrain.ai',
  title: 'OpenTrain AI — Decentralized & Remote-First AI Training Marketplace',
  overview: 'OpenTrain AI is a global, remote-first marketplace that connects frontier AI labs, robotics teams, and enterprise model builders with freelance AI trainers and data labelers worldwide. The platform enables freelancers to build a unified, verifiable AI training portfolio that they own and control, eliminating repetitive onboarding across fragmented platforms while unlocking hourly rates from $50–$90/hr up to $140/hr for domain experts.',
  founded: 'Launched as a next-generation remote-first marketplace with mobile and web platforms to decentralize human data collection for LLMs, robotics, and multimodal intelligence.',
  businessModel: 'AI developers and labs post specialized human feedback tasks (video annotation for robotics, multimodal grounding, prompt auditing, and domain-expert reasoning). OpenTrain AI acts as a transparent clearinghouse with built-in quality verification, handling international payments and escrow so contributors anywhere in the world—including Nigeria and Africa—can work part-time or full-time on flexible terms.',
  whyHighPay: 'Frontier AI models are bottlenecked on high-signal, human-annotated video, physical robotics action sequences, and nuanced domain critique. Unlike low-effort text scraping or generic captcha farms, tasks on OpenTrain AI require keen visual attention, spatial reasoning, and consistent adherence to multi-step logic rubrics. Labs are willing to pay $50–$90/hr because a single clean video trajectory or flawless prompt critique saves thousands of dollars in GPU retraining costs.',
  opportunityTracks: [
    {
      trackTitle: 'Video & Multimodal Annotation for Robotics AI',
      rolesIncluded: [
        'Video Annotation Specialist for Robotics AI',
        'Physical Scene & Spatial Trajectory Labeler',
        'Autonomous Agent Action Sequence Rater',
        'Multimodal Camera Angle & Object Bounder'
      ],
      payRange: '$50 – $90 / hr (Hourly · Part-time Flexible · Entry Level)',
      commitment: 'Part-time to full-time flexible (10 – 35 hrs/wk, asynchronous)',
      keySkills: ['Visual Attention to Detail', 'Basic English Comprehension', 'Bounding Box & Segmentation Tooling', 'Consistency', 'Zero AI-Generation for Annotations'],
      vettingSteps: ['OpenTrain Account Setup', 'Interactive 15-Minute Video Labeling Sandbox', 'Guideline Accuracy Verification', 'Identity Onboarding'],
      demandLevel: 'Very High'
    },
    {
      trackTitle: 'Generalist AI Training & Output Evaluation Specialist',
      rolesIncluded: [
        'Generalist AI Training & Evaluation Specialist',
        'English-Language Model Response Grader',
        'Fact-Checking & Factual Grounding Auditor',
        'Safety, Tone & Instruction-Following Reviewer'
      ],
      payRange: '$50 – $90 / hr (Weekly Payouts)',
      commitment: 'Flexible hours (Self-paced, work anytime from home)',
      keySkills: ['Critical Reading', 'Clear Written English Feedback', 'Instruction Following', 'Factual Verification', 'Analytical Reasoning'],
      vettingSteps: ['Generalist English & Logic Screening', 'Pairwise Response Comparison Exercise', 'ID Verification'],
      demandLevel: 'Very High'
    },
    {
      trackTitle: 'AI Data Generalist & Prompt Auditor',
      rolesIncluded: [
        'AI Data Generalist',
        'Prompt-Response Pair Architect',
        'Adversarial Edge-Case Prompt Creator',
        'Hallucination Detection Evaluator'
      ],
      payRange: '$50 – $90 / hr',
      commitment: 'Part-time / Milestone (15 – 30 hrs/wk)',
      keySkills: ['Creative Prompt Formulation', 'Comparative Analysis', 'Nuance Detection', 'Bias Auditing'],
      vettingSteps: ['Prompt Crafting Sample', 'Evaluation Rubric Test', 'Portfolio Registration'],
      demandLevel: 'High'
    },
    {
      trackTitle: 'Product Management & UX Specialist for AI Training',
      rolesIncluded: [
        'Product Management Specialist for AI Training',
        'AI Workflow & User Journey Benchmark Evaluator',
        'SaaS Interaction Simulation Evaluator',
        'Agentic AI Task Sequence Designer'
      ],
      payRange: '$90 – $140 / hr (High-Specialty Domain Expert)',
      commitment: 'Flexible contractor (10 – 25 hrs/wk)',
      keySkills: ['Product Strategy', 'UX Heuristics', 'User Story Decomposition', 'Technical Architecture Intuition'],
      vettingSteps: ['Resume & Portfolio Review', 'Domain Screening Interview', 'Workflow Rubric Design Task'],
      demandLevel: 'High'
    },
    {
      trackTitle: 'Coding & Engineering Task Creator (Eclipse / VS Code / Python)',
      rolesIncluded: [
        'Computer Science AI Task Creator',
        'Eclipse IDE / VS Code Benchmark Engineer',
        'Python & TypeScript Code Reasoning Auditor',
        'API Integration & Debugging Scenario Generator'
      ],
      payRange: '$60 – $100 / hr',
      commitment: 'Part-time to Full-time (15 – 40 hrs/wk)',
      keySkills: ['Python', 'TypeScript / JavaScript', 'Git', 'Unit Testing', 'Code Debugging & Explanation'],
      vettingSteps: ['Proctored Coding Challenge', 'Code Explanation Test', 'ID Verification'],
      demandLevel: 'Very High'
    },
    {
      trackTitle: 'Digital Art & Creative AI Specialist (Krita / Canvas)',
      rolesIncluded: [
        'Krita Digital Art AI Training Specialist',
        'Image Generation Prompt-Fidelity Evaluator',
        'Composition & Color Theory Annotator',
        'Visual Artifact & Distortion Rater'
      ],
      payRange: '$25 – $50 / hr',
      commitment: 'Flexible (5 – 20 hrs/wk)',
      keySkills: ['Digital Illustration (Krita / Photoshop)', 'Visual Quality Assessment', 'Color & Perspective Analysis'],
      vettingSteps: ['Creative Portfolio Upload', 'Image Pair Evaluation Quiz'],
      demandLevel: 'Moderate'
    }
  ],
  portfolioSystem: {
    description: 'OpenTrain AI pioneers a unified, portable AI training identity. Rather than taking new 4-hour qualification exams on every new platform, your verified ratings, task completion metrics, and domain skill badges live in a portable portfolio profile that AI labs can directly invite to private, high-paying task queues.',
    benefits: [
      'Single unified reputation across multiple AI labs and robotics companies',
      'Direct invitations to private $80–$140/hr enterprise pipelines based on past accuracy',
      'Permanent record of verified hours, accuracy score (e.g. 98.4%), and domain endorsements',
      'Mobile and web app support to claim tasks, track earnings, and request payouts'
    ],
    reputationPortability: 'High — Verified contributors earn higher priority assignment on new batches with zero waiting time.'
  },
  vettingProcess: {
    screening: {
      duration: '15 – 30 minutes (Async, self-paced)',
      format: 'Interactive sandbox: video bounding exercise, pairwise model grading, and rubric adherence quiz.',
      focusAreas: [
        'Attention to physical boundaries in video frames (robots, limbs, tools, objects)',
        'Clear, constructive written English explanations (minimum 2–3 sentences per critique)',
        'Zero tolerance for AI-generated evaluation answers (anti-cheat checks enforced)',
        'Consistency in rating according to the provided system guidelines'
      ],
      prepTips: [
        'Use a desktop or laptop with a mouse for precise video frame bounding.',
        'Read the provided rubric thoroughly; point out specific timestamps or textual hallucinations.',
        'Never paste AI-generated responses (ChatGPT/Claude) into evaluation boxes—they are automatically flagged.',
        'Double-check your English spelling and grammar before submitting assessments.'
      ]
    },
    idVerification: 'Government-issued photo ID (Nigerian International Passport, National Identity Number / NIN slip, or Driver’s License accepted).',
    matchingSpeed: 'Instant qualification feedback; active tasks unlocked within 24–48 hours of verification.'
  },
  payoutAndContractInfo: {
    payoutProvider: 'Direct Global Payout Rails (PayPal, AirTM, Wise, Payoneer, Deel, or direct crypto USDC)',
    paymentFrequency: 'Weekly / Bi-Weekly payout cycles with instant withdrawal options upon task validation.',
    acceptedCurrencies: ['USD', 'USDC (Stablecoin)', 'EUR', 'GBP'],
    contractType: 'Independent Contractor (W-8BEN compliant for international contributors; no US tax withholding).',
    nigeriaSupport: '100% Eligible: Nigerian contributors can withdraw directly to Geegpay (USD/EUR virtual account), Grey, Payoneer, or direct USDC to Solana/Ethereum wallets with zero currency exchange penalties.'
  },
  peerPlatforms: [
    {
      name: 'OpenTrain AI',
      url: 'https://opentrain.ai',
      category: 'Decentralized AI Training & Unified Portfolio',
      payRange: '$50 – $90 / hr (Specialists up to $140/hr)',
      vettingMethod: '15m Video Sandbox & Generalist Rubric Test',
      payoutRail: 'PayPal, AirTM, Payoneer, Deel, USDC',
      africaEligibility: '100% Open Worldwide (No VPN required)',
      keyDifference: 'Allows contributors to build and own a unified, portable AI training portfolio across multiple frontier labs.'
    },
    {
      name: 'Alignerr',
      url: 'https://alignerr.com',
      category: 'Frontier AI Training & Reasoning Network',
      payRange: '$40 – $120 / hr (Tech/Math up to $120/hr)',
      vettingMethod: 'TestGorilla Subject Matter Screening & Deel Onboarding',
      payoutRail: 'Deel (Direct USD Bank Wire, Wise, Payoneer)',
      africaEligibility: '100% Open to Nigeria (WAT Timezone)',
      keyDifference: 'Deep domain expertise in STEM, formal mathematics, legal, and software engineering with seamless Deel contractor payouts.'
    },
    {
      name: 'Mindrift',
      url: 'https://mindrift.ai',
      category: 'AI Language & Writing Training Partner',
      payRange: '$20 – $55 / hr (Coding/Python up to $90/hr)',
      vettingMethod: 'Multi-stage written editorial challenge & factual auditing',
      payoutRail: 'Weekly / Bi-Weekly direct bank transfer & PayPal',
      africaEligibility: 'Worldwide remote contributors welcome',
      keyDifference: 'Strong focus on human writers, fact-checkers, and creative nuances for commercial LLM tuning.'
    },
    {
      name: 'Outlier AI (Scale AI)',
      url: 'https://outlier.ai',
      category: 'Large-Scale Human Feedback (RLHF) Marketplace',
      payRange: '$15 – $45 / hr (Specialized STEM up to $80/hr)',
      vettingMethod: 'English screening test + 2 practice grading tasks',
      payoutRail: 'PayPal & AirTM (Weekly on Tuesdays)',
      africaEligibility: 'Nigeria, Kenya, Ghana, South Africa & Global',
      keyDifference: 'High volume of weekly task batches; works directly for major tech giants training frontier foundation models.'
    },
    {
      name: 'Meridial AI',
      url: 'https://meridial.ai',
      category: 'AI Data Training & Prompt Auditing',
      payRange: '$25 – $65 / hr',
      vettingMethod: 'Prompt evaluation assessment & guideline mastery',
      payoutRail: 'Direct Wire & Stripe / Deel',
      africaEligibility: 'Worldwide remote candidates',
      keyDifference: 'Focus on multi-turn dialogue consistency, enterprise workflow automation, and anti-hallucination datasets.'
    },
    {
      name: 'Micro1 AI Experts',
      url: 'https://www.micro1.ai/experts/opportunities',
      category: 'Autonomous AI Vetting (Voice & Code)',
      payRange: '$35 – $175+ / hr (Median ~$72/hr)',
      vettingMethod: 'Zara AI Voice Interview (20m) + Ava Code Sandbox',
      payoutRail: 'Deel USD Direct Wire, Wise, Payoneer, Crypto',
      africaEligibility: '100% Open to Nigeria (No VPN required)',
      keyDifference: 'Ultra-high compensation with fully autonomous 24/7 AI interviewers and high-trust enterprise contracts.'
    },
    {
      name: 'Invisible Technologies',
      url: 'https://invisible.co',
      category: 'Advanced Workflow AI & Operations Automation',
      payRange: '$20 – $60 / hr',
      vettingMethod: 'Skills assessment, video introduction & Deel background check',
      payoutRail: 'Deel Contractor Platform (Bi-Weekly)',
      africaEligibility: 'Global Remote (WAT friendly)',
      keyDifference: 'Combines human-in-the-loop task execution with agentic process automation workflows for Fortune 500 teams.'
    }
  ],
  applicationPlaybook: [
    'Create your unified profile on opentrain.ai using your primary email address.',
    'Select your primary opportunity track: Video Annotation for Robotics AI or Generalist AI Training ($50–$90/hr).',
    'Review the sample video annotation rubric before launching the assessment sandbox; practice precise bounding box placement on moving subjects.',
    'When writing evaluation feedback, write detailed explanations citing exact reasons (e.g., "The model hallucinated that the battery was 12V when the prompt clearly specified 24V DC").',
    'Connect your preferred Nigerian contractor payout rail: select Geegpay or Grey USD virtual account, Payoneer, or direct USDC wallet for instant gas-free withdrawals.',
    'Build your portfolio: as you complete initial tasks with >95% accuracy, OpenTrain AI automatically promotes your profile to higher-tier enterprise queues paying up to $140/hr.'
  ]
};
