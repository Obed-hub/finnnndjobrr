export interface EarnPlatformGuideMilestone {
  step: number;
  title: string;
  duration: string;
  description: string;
  deliverable: string;
  proTip: string;
}

export interface EarnPlatformFAQ {
  question: string;
  answer: string;
}

export interface EarnPlatformData {
  id: string;
  name: string;
  slug: string;
  category: 'Frontier AI & RLHF' | 'Code & Tech Experts' | 'Web3 Bounties & Escrow' | 'Microtasks & Annotation' | 'Software & Usability Testing';
  tagline: string;
  logo: string;
  officialUrl: string;
  signupUrl: string;
  verifiedRate: string;
  rateType: 'hourly' | 'bounty' | 'per_task';
  earningPotentialMonthly: string;
  speedToFirstDollar: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  nigeriaEligible: boolean;
  africanEligible: boolean;
  payoutMethods: string[];
  payoutSchedule: string;
  payoutMinimum: string;
  accountRequirements: string[];
  testType: string;
  testBenchmark: string;
  peakHoursWAT: string;
  skillsRequired: string[];
  summary: string;
  
  // Deep AI Knowledge Engine
  aiGuide: {
    screeningExamSecrets: string[];
    sandboxCalibrationTips: string[];
    avoidDisqualificationRules: string[];
    nigeriaPayoutSetupSteps: string[];
    commonTestQuestionsAndRubric: {
      type: string;
      advice: string;
    }[];
    faqs: EarnPlatformFAQ[];
    quickPrompts: string[];
  };
  
  milestones: EarnPlatformGuideMilestone[];
}

export const EARN_PLATFORMS_DATA: EarnPlatformData[] = [
  {
    id: 'outlier_ai',
    name: 'Outlier AI',
    slug: 'outlier',
    category: 'Frontier AI & RLHF',
    tagline: 'Frontier AI Model Training & Code Reasoning Calibration',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://outlier.ai',
    signupUrl: 'https://outlier.ai',
    verifiedRate: '$25 – $45/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$1,800 – $4,200/mo',
    speedToFirstDollar: '2 to 4 days after ID & screening test',
    difficulty: 'Intermediate',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['AirTM', 'PayPal', 'Direct Bank Transfer via Geegpay/Grey'],
    payoutSchedule: 'Weekly (Every Tuesday evening UTC)',
    payoutMinimum: '$5.00',
    accountRequirements: [
      'Account sign-up with personal email',
      'Government ID / Passport verification via Persona',
      'Passing 30-min Domain & English Language screening test',
      'AirTM or PayPal wallet linked for weekly payout'
    ],
    testType: 'Subject Matter Screening & Multi-Turn AI Response Evaluation Quiz',
    testBenchmark: '85%+ Accuracy Score on Factuality & Rubric Adherence',
    peakHoursWAT: '4:00 PM – 11:30 PM WAT (US active morning overlap)',
    skillsRequired: ['Python / TS / SQL or General Reasoning', 'Fact-Checking & Source Citation', 'Strict Rubric Following', 'English Grammar Mastery'],
    summary: 'Outlier AI matches freelance contributors and domain specialists with frontier AI labs (OpenAI, Meta, Anthropic ecosystem) to rate, debug, and write high-quality model training data.',
    
    aiGuide: {
      screeningExamSecrets: [
        'Pay extreme attention to negative constraints (e.g., if the prompt asks for "no code explanations", penalize responses containing explanations immediately).',
        'In coding evaluations, run edge cases mentally: zero values, empty strings, null pointers, and time complexity bounds.',
        'Fact-check every verifiable claim using external search tabs before marking a response as 100% accurate.',
        'Write justification comments that cite specific rubric rules rather than vague subjective opinions.'
      ],
      sandboxCalibrationTips: [
        'Your first 5–10 production tasks determine your permanent queue priority. Spend 1.5x normal time on them to maintain a 5/5 quality score.',
        'Read the project-specific Slack/Discourse announcements for daily rubric changes before beginning a session.',
        'Never submit a task with under 25 words in the justification box.'
      ],
      avoidDisqualificationRules: [
        'Strictly do NOT use commercial VPNs or data center proxies — Outlier flag bots will instantly ban accounts using datacenter IPs.',
        'Do NOT copy-paste AI generated answers from ChatGPT into your justification box (they use internal entropy detectors).',
        'Submit tax form W-8BEN promptly in your account profile to prevent 30% US backup tax withholding.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Create a free AirTM account at airtm.com using your verified Nigerian phone & email.',
        '2. In Outlier Profile -> Payments, select AirTM as primary payout rail.',
        '3. When weekly funds land in AirTM every Tuesday night, withdraw directly to your Nigerian Naira (NGN) bank account or Geegpay/Grey virtual USD account within 5 minutes.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Truthfulness & Hallucination Detection',
          advice: 'Verify names, dates, package import syntax, and library version compatibility. A single fabricated API method makes the model response Major Hallucination.'
        },
        {
          type: 'Instruction Following Assessment',
          advice: 'Count bullet points, word limits, and stylistic constraints. If 5 items were requested and 4 were returned, deduct full instruction adherence points.'
        }
      ],
      faqs: [
        {
          question: 'Why is my Outlier task queue empty ("EQ")?',
          answer: 'Empty Queue (EQ) happens when a project batch finishes or your calibration score dropped below 80%. Complete any pending qualification assessments in your dashboard and keep an eye on Slack project channel drop alerts.'
        },
        {
          question: 'Can I do coding tasks if I only know Python and JavaScript?',
          answer: 'Yes! Python and JavaScript are the highest volume queues on Outlier. You can take the Generalist Coding screening quiz to unlock the $35–$45/hr tier.'
        }
      ],
      quickPrompts: [
        'How do I pass the Outlier screening test on my first try?',
        'How to link AirTM and withdraw to a Nigerian bank account?',
        'What should I write in the justification box to get 5/5 ratings?',
        'How to get out of Empty Queue (EQ)?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Create Account & Identity Verification',
        duration: '15 Minutes',
        description: 'Sign up on outlier.ai with your real name matching your government ID. Complete the Persona identity check.',
        deliverable: 'Verified Outlier Candidate Dashboard',
        proTip: 'Use natural lighting for your ID photo to avoid automated OCR rejection.'
      },
      {
        step: 2,
        title: 'Pass Domain & Language Screening Quiz',
        duration: '45 Minutes',
        description: 'Complete the English comprehension and optional coding/STEM domain assessment with strict adherence to instructions.',
        deliverable: 'Pass score (85%+)',
        proTip: 'Keep a notepad open to track negative constraints in test prompts.'
      },
      {
        step: 3,
        title: 'Complete Project Calibration Sandbox',
        duration: '1 to 2 Hours',
        description: 'Work through 3–5 benchmark calibration tasks with instant automated feedback.',
        deliverable: 'Approved for Live Production Task Queue',
        proTip: 'Review the sample 5/5 annotations before pressing submit.'
      },
      {
        step: 4,
        title: 'Set Up AirTM / Geegpay Payout Rail',
        duration: '10 Minutes',
        description: 'Link your AirTM wallet email address in the Earnings tab and fill out the W-8BEN electronic tax form.',
        deliverable: 'Active Payout Method',
        proTip: 'AirTM provides the lowest transfer fee for Nigerian bank withdrawals.'
      },
      {
        step: 5,
        title: 'Execute Live Tasks & Earn First Dollar',
        duration: '2 to 4 Hours',
        description: 'Start your active hourly timer, complete live model evaluation tasks, and see your balance update in real time.',
        deliverable: 'First $50 – $150 earned',
        proTip: 'Work during peak volume hours (4 PM - 11 PM WAT) when queues have priority bonuses.'
      }
    ]
  },

  {
    id: 'opentrain_ai',
    name: 'OpenTrain AI',
    slug: 'opentrain',
    category: 'Code & Tech Experts',
    tagline: 'Frontier AI Code Review & Multi-File Architecture Calibration',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://opentrain.ai',
    signupUrl: 'https://opentrain.ai',
    verifiedRate: '$50 – $90/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$3,500 – $8,000/mo',
    speedToFirstDollar: '3 to 5 days after benchmark coding review',
    difficulty: 'Expert',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Deel Global Payroll', 'Direct USD Wire', 'Virtual USD (Geegpay / Grey)'],
    payoutSchedule: 'Weekly / Bi-Weekly via Deel',
    payoutMinimum: '$50.00',
    accountRequirements: [
      'Contractor profile with GitHub portfolio',
      'Automated 45-min multi-language coding benchmark (Python/TS/Rust/Go)',
      'Signed Contractor NDA & Data Privacy Agreement',
      'Deel Contractor Account setup'
    ],
    testType: 'Algorithmic Code Debugging, Unit Test Coverage & System Architecture Review',
    testBenchmark: '90%+ Code Correctness & Clean Step-by-Step Proofs',
    peakHoursWAT: 'Flexible 24/7 self-scheduled task queues',
    skillsRequired: ['Python / TypeScript / Rust / C++', 'Data Structures & Algorithms', 'Unit Testing (PyTest/Jest)', 'Clean Code Review Explanations'],
    summary: 'OpenTrain recruits high-caliber software developers and technical architects to evaluate complex AI code generation, write robust test suites, and grade LLM architectural solutions.',
    
    aiGuide: {
      screeningExamSecrets: [
        'Every code review task requires evaluating Big-O time and space complexity.',
        'Always verify boundary and edge cases: empty collections, integer overflows, async race conditions, and memory leaks.',
        'Provide actionable refactoring suggestions with working code snippets rather than abstract critiques.',
        'Ensure all variable names and type annotations strictly follow language idiom (PEP 8 for Python, strict TS types).'
      ],
      sandboxCalibrationTips: [
        'Double-check that your unit test cases test both happy paths and failing assertions.',
        'Write deterministic tests with no reliance on external network calls or random states.'
      ],
      avoidDisqualificationRules: [
        'Never submit unverified AI code from external chatbots without running syntax checks.',
        'Strictly avoid leaking proprietary client prompts or benchmark datasets.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. OpenTrain handles payroll through Deel (letsdeel.com).',
        '2. Create a Deel contractor account and select Nigeria as tax residency.',
        '3. In Deel Withdrawal Methods, add your local Nigerian USD virtual account (Geegpay or Grey) or direct Nigerian Bank account.',
        '4. Withdrawals from Deel process within 1 business day at interbank exchange rates.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Algorithm Optimization',
          advice: 'Refactor O(N^2) brute force loops into O(N log N) or O(N) hash map / two-pointer approaches and explain the exact optimization.'
        },
        {
          type: 'Unit Test Coverage Generation',
          advice: 'Write minimum 4 test cases covering standard input, boundary input, invalid types, and extreme scale.'
        }
      ],
      faqs: [
        {
          question: 'What programming languages are most in-demand on OpenTrain?',
          answer: 'Python, TypeScript/React, Rust, C++, and Go have the highest task allocations and offer rates between $60 and $90/hr.'
        },
        {
          question: 'How many hours can I work per week on OpenTrain?',
          answer: 'Contractors can work anywhere from 10 to 40 hours per week depending on their availability and task queue volume.'
        }
      ],
      quickPrompts: [
        'How do I pass the OpenTrain developer screening exam?',
        'What are the best practices for OpenTrain code review rubrics?',
        'How to withdraw Deel contractor earnings to a Nigerian bank?',
        'What code test questions appear on the benchmark assessment?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Submit Developer Profile & GitHub',
        duration: '15 Minutes',
        description: 'Sign up on opentrain.ai, list your primary languages and frameworks, and connect your GitHub profile.',
        deliverable: 'Candidate Application Submitted',
        proTip: 'Highlight open-source contributions or production repos in your profile.'
      },
      {
        step: 2,
        title: 'Pass 45-Minute Coding Benchmark',
        duration: '45 Minutes',
        description: 'Complete the automated algorithmic coding and bug-finding test in your preferred programming language.',
        deliverable: '90%+ Assessment Score',
        proTip: 'Write comments explaining your time and space complexity choices.'
      },
      {
        step: 3,
        title: 'Sign Contractor NDA & Join Workspace',
        duration: '20 Minutes',
        description: 'Review and sign the digital contractor agreement and accept your Slack/Discourse workspace invitation.',
        deliverable: 'Active Workspace Access',
        proTip: 'Bookmark the reviewer handbook in your browser for quick syntax lookups.'
      },
      {
        step: 4,
        title: 'Setup Deel Global Payroll',
        duration: '15 Minutes',
        description: 'Link your Deel profile to OpenTrain and add your Nigerian bank or virtual USD withdrawal method.',
        deliverable: 'Active Payroll Account',
        proTip: 'Deel virtual debit card is also available for direct online spending.'
      },
      {
        step: 5,
        title: 'Review Production AI Code & Cash Out',
        duration: 'Ongoing',
        description: 'Claim code review batches from the queue, evaluate code correctness, and receive weekly payouts directly to your account.',
        deliverable: 'First $200 – $500 Weekly Earning',
        proTip: 'Consistently maintaining high rubric scores unlocks higher-tier $90/hr architecture tasks.'
      }
    ]
  },

  {
    id: 'micro1_experts',
    name: 'Micro1 Experts',
    slug: 'micro1',
    category: 'Code & Tech Experts',
    tagline: 'Pre-Vetted AI Engineering & Global Tech Contractor Network',
    logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://www.micro1.ai/experts/opportunities',
    signupUrl: 'https://www.micro1.ai/experts/opportunities',
    verifiedRate: '$35 – $70/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$3,000 – $6,500/mo',
    speedToFirstDollar: '5 to 7 days after AI technical interview',
    difficulty: 'Advanced',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Deel', 'Direct Wire', 'Payoneer'],
    payoutSchedule: 'Bi-Weekly USD Payroll',
    payoutMinimum: '$100.00',
    accountRequirements: [
      'Profile setup on micro1.ai',
      'AI-proctored technical video screener (System Design + Coding)',
      'English fluency & communication verification',
      'Deel contractor onboarding'
    ],
    testType: 'AI Video Screener + Live Interactive Coding & Architecture Challenge',
    testBenchmark: 'High Problem Solving & Clear Spoken English Logic',
    peakHoursWAT: 'Async contract milestones + scheduled client syncs',
    skillsRequired: ['Full-Stack Development (React/Node/Python)', 'System Architecture', 'Clear Communication', 'Git & Agile Workflows'],
    summary: 'Micro1 connects vetted global developers and AI engineers with Silicon Valley tech companies and unicorn startups for remote contract engagements.',
    
    aiGuide: {
      screeningExamSecrets: [
        'In the Micro1 AI video screener, speak clearly and articulate your thought process aloud before writing code.',
        'Structure system design answers using: Functional Requirements -> Non-Functional Requirements -> High-Level Architecture -> Deep Dive -> Bottlenecks.',
        'Show practical experience with cloud services (AWS/GCP), CI/CD pipelines, and database optimization.'
      ],
      sandboxCalibrationTips: [
        'Keep your camera and microphone in a quiet, well-lit environment during the AI screener.',
        'Use the built-in sandbox code editor to test edge cases before submitting.'
      ],
      avoidDisqualificationRules: [
        'Do not switch browser tabs during the proctored screener assessment.',
        'Ensure your microphone audio has zero background echo.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Micro1 pays all contractors through Deel.',
        '2. Connect your Geegpay USD account or Nigerian bank account in Deel.',
        '3. Payments are automatically processed every two weeks.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Full-Stack REST & GraphQL API Design',
          advice: 'Explain authentication (JWT/OAuth), rate-limiting, idempotency keys, and database indexing strategies.'
        }
      ],
      faqs: [
        {
          question: 'Are Nigerian software engineers eligible for Micro1?',
          answer: 'Yes! Hundreds of African and Nigerian engineers are actively deployed on Micro1 client contracts earning $35–$70/hr.'
        }
      ],
      quickPrompts: [
        'How do I pass the Micro1 AI technical video interview?',
        'What system design topics are tested on Micro1?',
        'How does Micro1 match developers with client projects?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Create Micro1 Candidate Account',
        duration: '15 Minutes',
        description: 'Register on micro1.ai/experts/opportunities and import your resume and LinkedIn credentials.',
        deliverable: 'Candidate Profile Created',
        proTip: 'Add specific measurable impact bullets to your work history.'
      },
      {
        step: 2,
        title: 'Take AI-Proctored Video Screener',
        duration: '35 Minutes',
        description: 'Complete the automated coding and technical reasoning screener with AI proctoring.',
        deliverable: 'Vetted Talent Badge',
        proTip: 'Speak your thought process out loud to show communication skills.'
      },
      {
        step: 3,
        title: 'Match with Client Contract Opportunity',
        duration: '2 to 4 Days',
        description: 'Micro1 talent managers match your profile with active client projects seeking your exact tech stack.',
        deliverable: 'Contract Offer Letter',
        proTip: 'Respond to talent manager Slack pings within 2 hours.'
      },
      {
        step: 4,
        title: 'Onboard & Start Earning',
        duration: 'Ongoing',
        description: 'Sign Deel contractor contract, receive sprint tickets, and start logging hours.',
        deliverable: 'Bi-Weekly USD Payroll',
        proTip: 'Consistent sprint delivery leads to long-term contract extensions.'
      }
    ]
  },

  {
    id: 'alignerr_ai',
    name: 'Alignerr (Labelbox)',
    slug: 'alignerr',
    category: 'Frontier AI & RLHF',
    tagline: 'High-Accuracy Expert LLM Alignment & Domain Calibration',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://alignerr.com',
    signupUrl: 'https://alignerr.com',
    verifiedRate: '$40 – $120/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$2,500 – $6,000/mo',
    speedToFirstDollar: '3 to 7 days after TestGorilla assessment',
    difficulty: 'Advanced',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Deel', 'Payoneer', 'Virtual USD'],
    payoutSchedule: 'Weekly via Deel',
    payoutMinimum: '$20.00',
    accountRequirements: [
      'Account creation on alignerr.com',
      'Pass TestGorilla domain assessment (70%+ passing score)',
      'Persona identity verification',
      'Deel contractor account linking'
    ],
    testType: 'TestGorilla Domain Assessment (Coding, Writing, STEM, or Legal Reasoning)',
    testBenchmark: '70%+ Score on Domain Aptitude & Instructions Adherence',
    peakHoursWAT: 'Flexible self-paced project allocation',
    skillsRequired: ['Domain Expertise (Coding, Math, Law, or Advanced English)', 'Analytical Fact Checking', 'Labelbox Platform Navigation'],
    summary: 'Alignerr is Labelbox’s elite AI data community, paying verified experts to calibrate world-class frontier models through rigorous multi-turn evaluations and synthetic dataset generation.',
    
    aiGuide: {
      screeningExamSecrets: [
        'TestGorilla tests contain 40-50 questions with strict 1-minute per question timers. Never spend more than 45 seconds on easy questions.',
        'For coding tests, syntax errors disqualify immediately — verify closing brackets and variable scopes carefully.',
        'For writing/linguistics tests, prioritize semantic clarity and tone consistency.'
      ],
      sandboxCalibrationTips: [
        'Complete the Labelbox annotation tutorial thoroughly before entering production queues.',
        'Use keyboard shortcuts (1-9 keys) in Labelbox to accelerate your grading pace.'
      ],
      avoidDisqualificationRules: [
        'Never use external translation or paraphrasing tools during the TestGorilla test.',
        'Ensure your name on Alignerr matches your official ID and Deel account name exactly.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Alignerr sends payments via Deel every Friday.',
        '2. Link your Nigerian Deel profile and withdraw to Geegpay USD, Grey, or local bank account.',
        '3. Zero fees when withdrawing via Deel standard ACH transfer.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'TestGorilla Logical Reasoning',
          advice: 'Practice deductive reasoning puzzles, syllogisms, and pattern matrices beforehand.'
        }
      ],
      faqs: [
        {
          question: 'Can I apply for multiple domain tracks on Alignerr?',
          answer: 'Yes! You can take tests for Generalist, Coding, Mathematics, and Writing. Passing multiple tracks unlocks more task queues.'
        }
      ],
      quickPrompts: [
        'How to prepare for the Alignerr TestGorilla exam?',
        'What are the highest paying domain tracks on Alignerr?',
        'How to setup Deel payout for Alignerr in Nigeria?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Sign Up & Select Domain Tracks',
        duration: '10 Minutes',
        description: 'Create an account on alignerr.com and select your domain specializations.',
        deliverable: 'Test Invitations Generated',
        proTip: 'Select all domains you have practical skills in to maximize task options.'
      },
      {
        step: 2,
        title: 'Pass TestGorilla Domain Assessment',
        duration: '40 Minutes',
        description: 'Complete the timed online test assessing your domain problem solving and analytical thinking.',
        deliverable: '70%+ Passing Score',
        proTip: 'Take the test on a desktop computer with a stable internet connection.'
      },
      {
        step: 3,
        title: 'Complete Identity Check & Labelbox Onboarding',
        duration: '15 Minutes',
        description: 'Verify your ID and join the project workspace on Labelbox.',
        deliverable: 'Active Workspace Access',
        proTip: 'Join the Alignerr contractor Slack for real-time project drop alerts.'
      },
      {
        step: 4,
        title: 'Execute Production Tasks & Receive Payouts',
        duration: 'Ongoing',
        description: 'Work on live LLM alignment tasks and receive weekly payouts via Deel.',
        deliverable: 'Weekly Earnings in USD',
        proTip: 'Maintaining a 95%+ audit score qualifies you for $80–$120/hr senior evaluator queues.'
      }
    ]
  },

  {
    id: 'dataannotation_tech',
    name: 'DataAnnotation Tech',
    slug: 'dataannotation',
    category: 'Frontier AI & RLHF',
    tagline: 'Conversational AI & Coding Model Benchmark Training',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://dataannotation.tech',
    signupUrl: 'https://dataannotation.tech',
    verifiedRate: '$20 – $42/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$1,600 – $3,800/mo',
    speedToFirstDollar: '2 to 5 days after Starter Assessment approval',
    difficulty: 'Intermediate',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['PayPal', 'Payoneer Virtual USD'],
    payoutSchedule: 'Instant Cashout (Every 7 Days per task batch)',
    payoutMinimum: '$10.00',
    accountRequirements: [
      'Account sign-up with active email',
      'Comprehensive 45–60 min Starter Assessment',
      'Optional Coding Qualification Test (Unlocks $40/hr+ tier)',
      'Verified PayPal or Payoneer linked'
    ],
    testType: 'Starter Assessment (Factuality, Creative Writing & Logical Reasoning)',
    testBenchmark: 'High Attention to Formatting & Zero Hallucination Tolerance',
    peakHoursWAT: '24/7 self-scheduled task dashboard',
    skillsRequired: ['Analytical Fact Checking', 'Creative Writing', 'Strict Adherence to Guidelines', 'Python/JS (For Coding Projects)'],
    summary: 'DataAnnotation provides flexible, self-scheduled hourly work training conversational AI models and evaluating code generation with prompt-based tasks.',
    
    aiGuide: {
      screeningExamSecrets: [
        'The Starter Assessment tests your ability to follow complex, multi-part instructions. Read every prompt sentence 3 times.',
        'Never make assumptions — fact-check every single entity, place, or calculation in the test prompts.',
        'In creative writing sections, write original, engaging prose that strictly satisfies all requested constraints.'
      ],
      sandboxCalibrationTips: [
        'Track your time accurately using the built-in project stopwatch.',
        'Take qualification tests inside your dashboard as soon as they appear to unlock higher paying project boards.'
      ],
      avoidDisqualificationRules: [
        'Never use AI tools to generate answers for your Starter Assessment.',
        'Do not report false time — log only actual active working time on tasks.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Link your PayPal account in the profile section.',
        '2. Once a task batch is approved (7 days after submission), click "Transfer Funds".',
        '3. Withdraw from PayPal to your linked Nigerian card or via PayPal to Payoneer/Geegpay.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Fact Verification Assessment',
          advice: 'Look for subtle factual inaccuracies like wrong historical dates or non-existent geographic details.'
        }
      ],
      faqs: [
        {
          question: 'How long does it take to hear back after the Starter Assessment?',
          answer: 'Usually between 2 to 5 business days. If approved, project task boards will appear directly on your dashboard.'
        }
      ],
      quickPrompts: [
        'How to pass the DataAnnotation Starter Assessment?',
        'What is tested on the DataAnnotation coding qualification?',
        'How to withdraw earnings from DataAnnotation in Nigeria?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Sign Up on DataAnnotation.tech',
        duration: '5 Minutes',
        description: 'Create an account and complete your basic profile information.',
        deliverable: 'Starter Assessment Unlocked',
        proTip: 'Ensure you have 1 full uninterrupted hour before starting the assessment.'
      },
      {
        step: 2,
        title: 'Complete Starter Assessment',
        duration: '45 to 60 Minutes',
        description: 'Complete the rigorous generalist evaluation test covering fact checking and logical reasoning.',
        deliverable: 'Assessment Submitted',
        proTip: 'Carefully follow all negative and formatting constraints.'
      },
      {
        step: 3,
        title: 'Take Optional Coding Qualification',
        duration: '30 Minutes',
        description: 'Take the coding test to unlock higher-tier $40–$42/hr coding taskboards.',
        deliverable: 'Coding Queue Access',
        proTip: 'Write clean, well-commented code with complete test assertions.'
      },
      {
        step: 4,
        title: 'Work on Live Tasks & Withdraw',
        duration: 'Ongoing',
        description: 'Pick tasks from your dashboard, start the timer, submit work, and cash out funds.',
        deliverable: 'Weekly Earning Stream',
        proTip: 'Check your dashboard throughout the day as new project batches drop.'
      }
    ]
  },

  {
    id: 'superteam_earn',
    name: 'Superteam Earn',
    slug: 'superteam',
    category: 'Web3 Bounties & Escrow',
    tagline: 'Solana Web3 Development, UI/UX & Technical Bounties',
    logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://earn.superteam.fun',
    signupUrl: 'https://earn.superteam.fun',
    verifiedRate: '$100 – $5,000+ USDC',
    rateType: 'bounty',
    earningPotentialMonthly: '$1,500 – $6,000/mo',
    speedToFirstDollar: 'Instant USDC to wallet upon winning bounty',
    difficulty: 'Intermediate',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Direct USDC to Solana Wallet (Phantom / Solflare)'],
    payoutSchedule: 'Instant on Bounty Award (Zero platform fees)',
    payoutMinimum: '$1.00',
    accountRequirements: [
      'Connect Solana non-custodial wallet (Phantom / Solflare)',
      'Complete builder profile & portfolio',
      'Join Superteam Nigeria / Africa Discord community'
    ],
    testType: 'Proof of Work (Submit working demo, GitHub PR, UI design, or technical article)',
    testBenchmark: 'Production-ready code quality, responsive UI & clean documentation',
    peakHoursWAT: 'Continuous open bounty submission windows (Typically 7–14 day deadlines)',
    skillsRequired: ['Solana / Rust / React / Next.js', 'UI/UX Design (Figma)', 'Technical Writing', 'Smart Contract Auditing'],
    summary: 'Superteam Earn connects builders and developers with grants, bounties, and contract roles funded directly in USDC by top Solana ecosystem protocols.',
    
    aiGuide: {
      screeningExamSecrets: [
        'Superteam has zero screening exams — you are judged purely on the quality of your submitted Proof of Work.',
        'Always include a live deployed demo URL (on Vercel/Netlify) and a clear, clean Loom video walkthrough in your submission.',
        'Review the judging criteria in the bounty description and address every required feature point-by-point.'
      ],
      sandboxCalibrationTips: [
        'Join the Superteam Nigeria community on Discord and Telegram to get feedback from country leads before submitting.',
        'Collaborate with designers or writers on team bounties to submit higher-polish entries.'
      ],
      avoidDisqualificationRules: [
        'Never submit plagiarized code or generic templates — bounty judges run automated code similarity scanners.',
        'Submit at least 24 hours before the deadline to avoid last-minute submission glitches.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Install Phantom wallet on your browser or phone from phantom.app.',
        '2. Connect your Phantom wallet to earn.superteam.fun.',
        '3. When you win a bounty, USDC is deposited directly into your Phantom wallet instantly.',
        '4. Send USDC to your Binance or Bybit wallet to cash out to Naira (NGN) via P2P within 3 minutes.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Bounty Submission Structure',
          advice: 'Always include: 1. Live Demo link, 2. GitHub Repo link, 3. Loom Video walkthrough, 4. Key Architecture Choices.'
        }
      ],
      faqs: [
        {
          question: 'Are bounties available for non-coders on Superteam Earn?',
          answer: 'Yes! There are frequent non-technical bounties for UI/UX Design, Technical Writing, Video Explainers, Community Management, and Marketing.'
        }
      ],
      quickPrompts: [
        'How to win my first development bounty on Superteam Earn?',
        'How to setup Phantom wallet and cash out USDC to Nigerian bank?',
        'What makes a winning bounty submission on Solana?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Setup Phantom Wallet & Profile',
        duration: '10 Minutes',
        description: 'Create a Solana wallet on phantom.app, connect to earn.superteam.fun, and build your builder profile.',
        deliverable: 'Active Builder Profile',
        proTip: 'Link your GitHub and Twitter accounts for enhanced reputation.'
      },
      {
        step: 2,
        title: 'Select Active Bounty Matching Your Skills',
        duration: '30 Minutes',
        description: 'Browse the bounty board, filter by your skill (Frontend, Rust, Writing, Design), and review the judging rubric.',
        deliverable: 'Target Bounty Chosen',
        proTip: 'Look for bounties with fewer submissions to increase your winning odds.'
      },
      {
        step: 3,
        title: 'Build & Deploy Proof of Work',
        duration: '1 to 3 Days',
        description: 'Build the requested application or deliverable, deploy a live demo, and record a 2-minute walkthrough video.',
        deliverable: 'Live Deployed Demo & GitHub Repo',
        proTip: 'A responsive mobile UI gives your submission an instant advantage.'
      },
      {
        step: 4,
        title: 'Submit Entry & Win USDC Prize',
        duration: '15 Minutes',
        description: 'Submit your entry before the deadline and track the review phase on the dashboard.',
        deliverable: '$100 – $2,500 USDC deposited to wallet',
        proTip: 'Winning bounties frequently leads to direct full-time hiring offers from protocol founders.'
      }
    ]
  },

  {
    id: 'laborx_web3',
    name: 'LaborX',
    slug: 'laborx',
    category: 'Web3 Bounties & Escrow',
    tagline: 'Web3 Freelance Marketplace with Smart Contract Escrow',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://laborx.com',
    signupUrl: 'https://laborx.com',
    verifiedRate: '$20 – $100/hr (USDT/USDC/ETH)',
    rateType: 'hourly',
    earningPotentialMonthly: '$1,200 – $4,500/mo',
    speedToFirstDollar: 'Immediate upon milestone escrow approval',
    difficulty: 'Intermediate',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Smart Contract Escrow (USDT / USDC / ETH) to non-custodial wallet'],
    payoutSchedule: 'Instant on client milestone release',
    payoutMinimum: '$10.00',
    accountRequirements: [
      'Account creation via Web3 wallet (MetaMask / Trust Wallet) or email',
      'Freelancer profile & service listings (Gigs)',
      'Wallet address configuration for escrow smart contracts'
    ],
    testType: 'Custom Client Proposal & Verified Portfolio Verification',
    testBenchmark: 'Clear Project Scope, Milestones & Verified Reputation',
    peakHoursWAT: 'Global client marketplace (24/7)',
    skillsRequired: ['Web Development', 'Smart Contract Development', 'Graphic Design', 'Content Creation', 'Digital Marketing'],
    summary: 'LaborX is an international Web3 freelance platform where clients lock funds into decentralized smart contract escrow before work begins, guaranteeing 100% payout security for freelancers.',
    
    aiGuide: {
      screeningExamSecrets: [
        'LaborX does not require an entry exam; getting hired depends on your Gig listings and personalized job proposals.',
        'List 3–5 specialized "Gigs" (pre-packaged service offerings) with clear pricing, turnaround times, and sample deliverables.',
        'In client proposals, focus on solving the client’s exact bottleneck rather than copying generic cover letters.'
      ],
      sandboxCalibrationTips: [
        'Offer a small introductory milestone to new clients to build initial 5-star reviews on your profile.',
        'Always ensure the client has funded the escrow before starting work.'
      ],
      avoidDisqualificationRules: [
        'Never accept off-platform payments — doing so removes smart contract escrow protection and violates terms.',
        'Deliver work through the official LaborX milestone submission portal to preserve escrow rights.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Connect your MetaMask or Trust Wallet to LaborX.',
        '2. Milestone payments in USDT/USDC arrive directly in your wallet upon client approval.',
        '3. Transfer USDT/USDC to Binance, Bybit, or Yellow Card to convert to Naira (NGN) instantly.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Proposal Crafting Structure',
          advice: 'Outline: 1. Understanding of client goal, 2. Proposed solution & tech stack, 3. Step-by-step milestones, 4. Turnaround timeline.'
        }
      ],
      faqs: [
        {
          question: 'How does smart contract escrow protect me on LaborX?',
          answer: 'The client deposits payment into a blockchain smart contract before you start. The client cannot take back the funds arbitrarily, and funds are automatically released upon work approval.'
        }
      ],
      quickPrompts: [
        'How to create high-converting Gigs on LaborX?',
        'How to write winning proposals on LaborX?',
        'How does the LaborX smart contract dispute resolution work?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Connect Web3 Wallet & Create Profile',
        duration: '15 Minutes',
        description: 'Sign up on laborx.com using your Web3 wallet and complete your professional bio and portfolio.',
        deliverable: 'Verified Freelancer Profile',
        proTip: 'Add verified social links and GitHub credentials to boost credibility.'
      },
      {
        step: 2,
        title: 'Publish Specialized Service Gigs',
        duration: '45 Minutes',
        description: 'Create pre-packaged gig packages with clear deliverables, pricing in USDT, and delivery timeframes.',
        deliverable: 'Live Service Gigs Published',
        proTip: 'Price your first gig competitively to attract your first reviews.'
      },
      {
        step: 3,
        title: 'Submit Targeted Proposals to Open Jobs',
        duration: '30 Minutes',
        description: 'Browse the open job board and submit tailored bids with clear milestone breakdowns.',
        deliverable: 'Proposals Submitted',
        proTip: 'Address client requirements in the first two sentences of your proposal.'
      },
      {
        step: 4,
        title: 'Execute Milestones & Receive Escrow Crypto',
        duration: 'Ongoing',
        description: 'Deliver the agreed work, submit for client review, and receive instant release of escrow funds.',
        deliverable: 'Direct Crypto Earnings in Wallet',
        proTip: 'Maintain polite, proactive communication throughout the contract.'
      }
    ]
  },

  {
    id: 'clickworker_uhrs',
    name: 'Clickworker & UHRS',
    slug: 'clickworker',
    category: 'Microtasks & Annotation',
    tagline: 'UHRS Search Engine Evaluation, Micro-Tasks & Text Rating',
    logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://www.clickworker.com',
    signupUrl: 'https://www.clickworker.com',
    verifiedRate: '$8 – $18/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$600 – $1,800/mo',
    speedToFirstDollar: '2 to 3 days after UHRS qualification test',
    difficulty: 'Beginner',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Payoneer', 'SEPA Bank Transfer', 'PayPal'],
    payoutSchedule: 'Weekly (Every Wednesday–Friday)',
    payoutMinimum: '$10.00',
    accountRequirements: [
      'Clickworker account creation with phone verification',
      'Pass English Language Assessment 1 & 2',
      'Pass UHRS Qualification Exam to generate Microsoft LiveID',
      'Link Payoneer account for automated payouts'
    ],
    testType: 'English Grammar Assessment + UHRS Search Relevance Guidelines Exam',
    testBenchmark: '85%+ on English Assessment & 80%+ on HitApp qualification rounds',
    peakHoursWAT: '6:00 AM – 1:00 PM WAT (Early morning fresh HitApp task drops)',
    skillsRequired: ['Attention to Detail', 'Search Relevance Judgment', 'Basic Computer Literacy', 'Fast Reading Speed'],
    summary: 'Clickworker provides gateway access to Microsoft’s UHRS (Universal Human Relevance System) platform, offering thousands of daily micro-tasks including search result rating, image tagging, and text moderation.',
    
    aiGuide: {
      screeningExamSecrets: [
        'The Clickworker English assessment is mandatory to unlock UHRS. Answer slowly and verify spelling before submitting.',
        'Inside UHRS, every task ("HitApp") has a Preview, Training, and Qualification mode. Always complete 10+ training items before taking the qualification test.',
        'Read the HitApp guidelines document (downloadable PDF) side-by-side with your test screen.'
      ],
      sandboxCalibrationTips: [
        'Maintain a Spam Accuracy score above 85% on every HitApp to avoid temporary 24-hour bans.',
        'Do not rush tasks — UHRS has automated speed check timers ("Speeding Disqualification"). Take at least 80% of the recommended time per hit.'
      ],
      avoidDisqualificationRules: [
        'Never use multiple Clickworker accounts in the same household without separate verification.',
        'If you get 2 temporary bans on a single HitApp within 7 days, stop working on it for a week to avoid a permanent ban.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Create a Payoneer account at payoneer.com.',
        '2. In Clickworker Payment Details, link your Payoneer customer ID.',
        '3. Earnings from UHRS transfer to Clickworker balance after 28 days (standard UHRS hold) and are paid out automatically every week to Payoneer.',
        '4. Withdraw from Payoneer to your Nigerian bank account or transfer to Geegpay.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Search Query Relevance (Navigation vs Information)',
          advice: 'Distinguish navigational intent (seeking specific URL) from informational intent (broad questions) using standard search rater rubrics.'
        }
      ],
      faqs: [
        {
          question: 'What are the best hours to find tasks on UHRS?',
          answer: 'Early mornings between 6:00 AM and 11:00 AM WAT usually see the largest batches of fresh HitApps uploaded.'
        }
      ],
      quickPrompts: [
        'How to pass the Clickworker UHRS qualification assessment?',
        'How to keep high spam accuracy score on UHRS HitApps?',
        'How to avoid speeding bans on UHRS tasks?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Sign Up on Clickworker & Complete Profile',
        duration: '15 Minutes',
        description: 'Register at clickworker.com, verify your email and phone number, and complete language skills profile.',
        deliverable: 'Clickworker Account Activated',
        proTip: 'Add English as a native/fluent language in your profile.'
      },
      {
        step: 2,
        title: 'Pass English & UHRS Assessments',
        duration: '45 Minutes',
        description: 'Complete the English language assessment (85%+ required) and the UHRS onboarding test in the Assessments tab.',
        deliverable: 'UHRS Microsoft LiveID Credentials',
        proTip: 'Save your assigned @uhrs.clickworker.com credentials in a password manager.'
      },
      {
        step: 3,
        title: 'Log into UHRS & Qualify for HitApps',
        duration: '1 to 2 Hours',
        description: 'Log into the UHRS marketplace, read guidelines, pass qualification tests for high-volume HitApps.',
        deliverable: 'Qualified for 5+ HitApps',
        proTip: 'Start with simpler text moderation or side-by-side search rating HitApps.'
      },
      {
        step: 4,
        title: 'Link Payoneer & Receive Weekly Payouts',
        duration: '10 Minutes',
        description: 'Connect your verified Payoneer account in Clickworker payment settings for automated weekly transfers.',
        deliverable: 'Continuous Weekly Income Stream',
        proTip: 'Check Clickworker dashboard every morning for fresh bonus tasks.'
      }
    ]
  },

  {
    id: 'mindrift_ai',
    name: 'Mindrift',
    slug: 'mindrift',
    category: 'Frontier AI & RLHF',
    tagline: 'AI Tutoring, Writing Quality & Prompt Reasoning Curation',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://mindrift.ai',
    signupUrl: 'https://mindrift.ai',
    verifiedRate: '$16 – $30/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$1,200 – $2,600/mo',
    speedToFirstDollar: '3 to 6 days after trial writing task',
    difficulty: 'Intermediate',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Direct Bank Transfer', 'Payoneer', 'PayPal'],
    payoutSchedule: 'Weekly / Bi-Weekly direct payments',
    payoutMinimum: '$20.00',
    accountRequirements: [
      'Mindrift freelancer registration',
      'Pass English proficiency and reasoning assessment',
      'Submit trial AI tutoring / editing writing task',
      'Onboarding to Mindrift Writer Platform'
    ],
    testType: 'English Grammar & Logical Reasoning Test + Sample AI Tutoring Essay',
    testBenchmark: 'Flawless Grammar, Natural Phrasing & Pedagogical Clarity',
    peakHoursWAT: 'Flexible self-paced queue',
    skillsRequired: ['AI Tutoring', 'Educational Content Curation', 'Advanced English Editing', 'Logical Reasoning'],
    summary: 'Mindrift recruits AI Tutors and freelance writers to enhance AI models’ linguistic nuance, pedagogical explanations, and domain-specific knowledge across writing, STEM, and humanities.',
    
    aiGuide: {
      screeningExamSecrets: [
        'Focus on teaching the model step-by-step reasoning rather than just providing a short answer.',
        'Use the Socratic method when asked to evaluate educational responses.',
        'Ensure all punctuation, capitalization, and tone guidelines match Mindrift’s editorial handbook.'
      ],
      sandboxCalibrationTips: [
        'Review the feedback provided on your trial task before claiming your first live batch.',
        'Maintain a balanced, objective, and empathetic conversational tone.'
      ],
      avoidDisqualificationRules: [
        'Never submit unedited machine-generated text from external LLMs.',
        'Ensure timely turnaround on claimed writing tasks to keep priority status.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. In Mindrift profile settings, configure your Payoneer or direct bank transfer details.',
        '2. Payments are calculated weekly and disbursed directly.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'AI Tutoring Sample Evaluation',
          advice: 'Break complex technical topics (e.g., photosynthesis, binary search) into intuitive analogies with clear definitions.'
        }
      ],
      faqs: [
        {
          question: 'Do I need a teaching degree to work on Mindrift?',
          answer: 'No formal degree is required. You only need strong English writing, analytical logic, and the ability to explain complex ideas simply.'
        }
      ],
      quickPrompts: [
        'How to pass the Mindrift AI Tutor writing test?',
        'What are the editorial standards on Mindrift?',
        'How to setup payments on Mindrift in Nigeria?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Sign Up on Mindrift.ai',
        duration: '10 Minutes',
        description: 'Register as an AI Tutor / Writer candidate and complete your background profile.',
        deliverable: 'Candidate Profile Created',
        proTip: 'Highlight any writing, research, or tutoring experience.'
      },
      {
        step: 2,
        title: 'Pass English & Logic Screening Test',
        duration: '30 Minutes',
        description: 'Take the online multiple-choice assessment testing grammar and reasoning skills.',
        deliverable: 'Pass Score Achieved',
        proTip: 'Double check punctuation in complex sentences.'
      },
      {
        step: 3,
        title: 'Submit Trial AI Tutoring Task',
        duration: '45 Minutes',
        description: 'Write or review a sample educational AI response following Mindrift guidelines.',
        deliverable: 'Trial Submission Reviewed & Approved',
        proTip: 'Use clear headings and concise bullet points.'
      },
      {
        step: 4,
        title: 'Claim Live Batches & Earn Weekly',
        duration: 'Ongoing',
        description: 'Select live writing and tutoring tasks from the portal and receive weekly disbursements.',
        deliverable: 'Weekly Disbursements',
        proTip: 'Consistently high ratings unlock senior editor and mentor roles.'
      }
    ]
  },

  {
    id: 'toloka_ai',
    name: 'Toloka AI',
    slug: 'toloka',
    category: 'Microtasks & Annotation',
    tagline: 'Visual QA, OCR Review & Instant Micro-Task Earnings',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://toloka.ai',
    signupUrl: 'https://toloka.ai',
    verifiedRate: '$3 – $12/hr',
    rateType: 'per_task',
    earningPotentialMonthly: '$300 – $900/mo',
    speedToFirstDollar: 'Immediate (First dollar within 1 hour)',
    difficulty: 'Beginner',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Payoneer', 'Papara', 'Qiwi'],
    payoutSchedule: 'Instant on-demand cashout',
    payoutMinimum: '$1.00',
    accountRequirements: [
      'Toloka account sign-up (Web or Mobile app)',
      'Phone SMS verification',
      'Passing individual task training simulations'
    ],
    testType: 'Instant In-Task Training Simulations (5–10 practice items per project)',
    testBenchmark: '80%+ on task-specific training sets',
    peakHoursWAT: '24/7 continuous global task availability',
    skillsRequired: ['Attention to Detail', 'Image Classification', 'Basic Mobile / Desktop Usage'],
    summary: 'Toloka AI is a global micro-task platform with low onboarding friction, offering instant cashouts as soon as you reach $1.00 through rapid visual, text, and moderation tasks.',
    
    aiGuide: {
      screeningExamSecrets: [
        'There is no universal entrance exam on Toloka — each individual project has a quick 5-minute training simulation.',
        'Complete the training tasks with 100% accuracy to unlock higher paying live tasks from the same requester.'
      ],
      sandboxCalibrationTips: [
        'Maintain a high general Toloka skill rating by taking your time on test items inserted into task batches.',
        'Requesters give substantial bonus multipliers (up to 2x base pay) to performers with 95%+ accuracy scores.'
      ],
      avoidDisqualificationRules: [
        'Never use automated bot scripts or autoclickers — accounts with non-human click intervals are banned instantly.',
        'Do not click through tasks without reading the content.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Link your Payoneer account in the My Money tab.',
        '2. Withdraw funds instantly once your balance reaches $1.00.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Object Bounding Box & Category Validation',
          advice: 'Draw tight bounding boxes around items with no overlapping excess margins.'
        }
      ],
      faqs: [
        {
          question: 'Can I do Toloka tasks on my mobile phone?',
          answer: 'Yes! Toloka has dedicated iOS and Android mobile apps allowing you to complete micro-tasks on the go.'
        }
      ],
      quickPrompts: [
        'How to maximize hourly earnings on Toloka AI?',
        'What are the highest paying tasks on Toloka?',
        'How to withdraw Toloka earnings to Payoneer?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Sign Up on Toloka Web or Mobile App',
        duration: '5 Minutes',
        description: 'Create an account on toloka.ai and verify your mobile number.',
        deliverable: 'Active Toloka Account',
        proTip: 'Install the mobile app for convenient on-the-go micro-tasks.'
      },
      {
        step: 2,
        title: 'Complete Training for High-Paying Projects',
        duration: '20 Minutes',
        description: 'Complete 3–5 short training tasks to unlock live paid pools.',
        deliverable: 'Live Task Pool Unlocked',
        proTip: 'Pay close attention to requester instructions in the training mode.'
      },
      {
        step: 3,
        title: 'Execute Tasks & Request Instant Cashout',
        duration: '1 Hour',
        description: 'Complete tasks, reach the $1.00 threshold, and request instant withdrawal to Payoneer.',
        deliverable: 'First Dollar Cashed Out',
        proTip: 'Keep your skill rating high to access top-tier requester bonuses.'
      }
    ]
  },

  {
    id: 'appen_crowd',
    name: 'Appen Crowd',
    slug: 'appen',
    category: 'Microtasks & Annotation',
    tagline: 'Search Evaluation, Multilingual AI Data & Long-Term Project Pools',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://appen.com',
    signupUrl: 'https://appen.com',
    verifiedRate: '$6 – $18/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$800 – $2,200/mo',
    speedToFirstDollar: '7 to 14 days (Project qualification exam)',
    difficulty: 'Intermediate',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Payoneer', 'Direct Bank Wire'],
    payoutSchedule: 'Monthly Invoice (Disbursed by 14th of each month)',
    payoutMinimum: '$10.00',
    accountRequirements: [
      'Appen Connect profile registration',
      'Language and device hardware qualification',
      'Passing project-specific qualification exam (e.g. Yukon, Crescent)',
      'Payoneer account linking'
    ],
    testType: 'Project Qualification Guidelines Exam (Open-book multi-part test)',
    testBenchmark: '80%+ on Project Specific Guidelines Exam',
    peakHoursWAT: 'Flexible self-scheduled logging (10–20 hrs/week per project)',
    skillsRequired: ['Search Engine Evaluation', 'Speech & Audio Recording', 'Multilingual Translation', 'Guideline Mastery'],
    summary: 'Appen is one of the world’s largest AI training data providers, offering stable, long-term project contracts for search rating, localization, and multimodal annotation.',
    
    aiGuide: {
      screeningExamSecrets: [
        'Appen project exams are open-book. Always keep the official Project Guidelines PDF open and use Ctrl+F to find exact keyword matches during the test.',
        'Study the sample questions at the end of each guideline chapter before attempting the real exam.'
      ],
      sandboxCalibrationTips: [
        'Log into Appen Connect daily to apply for new project boards as they open up.',
        'Keep your invoice time logged daily rather than batching at the end of the month.'
      ],
      avoidDisqualificationRules: [
        'Do not fail consecutive monthly quality audits (blind quality tests are mixed into production work).',
        'Never share proprietary guideline documents or project exam questions online.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Link your Payoneer account in the Appen Connect Finance tab.',
        '2. On the 1st of each month, review and approve your auto-generated invoice.',
        '3. Payment is transferred directly to your Payoneer account by the 14th of the month.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Search Quality Rating (Needs Met vs Page Quality)',
          advice: 'Differentiate between Highly Meets (HM), Moderately Meets (MM), and Slightly Meets (SM) based on query specificity.'
        }
      ],
      faqs: [
        {
          question: 'Can I work on multiple Appen projects at the same time?',
          answer: 'Yes! As long as the projects do not conflict in their guidelines, you can hold multiple active project contracts simultaneously.'
        }
      ],
      quickPrompts: [
        'How to pass the Appen Search Evaluator exam?',
        'How does Appen monthly invoicing work for Nigerian contractors?',
        'What are the best long-term projects on Appen Connect?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Register on Appen Connect',
        duration: '15 Minutes',
        description: 'Create an account at appen.com, list your language capabilities and primary hardware setup.',
        deliverable: 'Active Contractor Profile',
        proTip: 'List all dialects and second languages you are proficient in.'
      },
      {
        step: 2,
        title: 'Apply to Open Projects & Study Guidelines',
        duration: '1 to 2 Days',
        description: 'Browse the All Projects tab, apply to open projects, and download the project training manual.',
        deliverable: 'Project Qualification Invites',
        proTip: 'Read the entire guideline document before opening the exam.'
      },
      {
        step: 3,
        title: 'Pass Project Qualification Exam',
        duration: '2 to 3 Hours',
        description: 'Complete the open-book multi-part qualification test.',
        deliverable: 'Project Contract Awarded',
        proTip: 'Take your time — exams typically do not have strict per-question countdown timers.'
      },
      {
        step: 4,
        title: 'Log Weekly Hours & Receive Monthly Pay',
        duration: 'Ongoing',
        description: 'Complete weekly project quotas (typically 10–20 hours/week) and receive monthly invoice disbursements via Payoneer.',
        deliverable: 'Monthly USD Payoneer Direct Deposit',
        proTip: 'Maintaining high quality scores makes you eligible for long-term project extensions.'
      }
    ]
  },

  {
    id: 'telus_international_ai',
    name: 'TELUS International AI',
    slug: 'telus',
    category: 'Microtasks & Annotation',
    tagline: 'Search Quality Evaluation, AI Community Rater & Media Moderation',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://telusinternational.ai',
    signupUrl: 'https://telusinternational.ai',
    verifiedRate: '$12 – $25/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$1,000 – $2,500/mo',
    speedToFirstDollar: '10 to 14 days (3-Part comprehensive evaluator exam)',
    difficulty: 'Intermediate',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Hyperwallet', 'Direct Bank Deposit', 'PayPal'],
    payoutSchedule: 'Monthly Direct Deposit',
    payoutMinimum: '$10.00',
    accountRequirements: [
      'Application submission with updated CV',
      'Pass 3-part open-book Search Quality Evaluator Exam',
      'ID verification and electronic contractor agreement',
      'Hyperwallet account setup'
    ],
    testType: '3-Part Search Quality Evaluator Exam (Part 1: Rules, Part 2: Page Quality, Part 3: Needs Met)',
    testBenchmark: 'Passing all 3 exam stages based on the 160-page General Guidelines',
    peakHoursWAT: 'Self-scheduled (up to 20 hours per week)',
    skillsRequired: ['Web Research & Fact Checking', 'Understanding Search Intent', 'Attention to Detail', 'Analytical Reading'],
    summary: 'TELUS International AI hires remote Personalized Search Engine Evaluators and AI Community Raters to assess the relevance and trustworthiness of search results and multimedia content.',
    
    aiGuide: {
      screeningExamSecrets: [
        'Part 1 of the exam is multiple-choice theory testing the General Guidelines. Keep the PDF open and search exact definitions.',
        'Part 2 evaluates Page Quality (PQ). Check the E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) of websites.',
        'Part 3 evaluates Needs Met. Always look at user location and query intent before assigning ratings.'
      ],
      sandboxCalibrationTips: [
        'Take detailed notes while studying the guidelines before opening Part 1.',
        'If you fail Part 3, TELUS often provides a one-time retake link within 48 hours.'
      ],
      avoidDisqualificationRules: [
        'Do not rush through tasks — maintain an average rate matching the estimated task time (ETA).',
        'Ensure you work from your registered country IP address.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. TELUS pays via Hyperwallet (a PayPal company).',
        '2. When your monthly payment arrives in Hyperwallet, transfer directly to your Nigerian USD or NGN bank account.',
        '3. Funds arrive within 1–2 business days.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'E-E-A-T Page Quality Grading',
          advice: 'Assess the reputation of the content creator, about page, and clear contact information for high PQ ratings.'
        }
      ],
      faqs: [
        {
          question: 'How many hours per week can I work on TELUS AI?',
          answer: 'Most rater roles allow between 10 and 20 hours per week with flexible self-scheduling.'
        }
      ],
      quickPrompts: [
        'How to pass Part 1, 2, and 3 of the TELUS Evaluator Exam?',
        'What is the best way to understand E-E-A-T guidelines?',
        'How does Hyperwallet transfer to Nigerian bank accounts?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Submit CV on TELUS AI Portal',
        duration: '15 Minutes',
        description: 'Apply on telusinternational.ai for the Search Quality Rater or AI Community position in your region.',
        deliverable: 'Application Received & Exam Invitation',
        proTip: 'Highlight attention to detail and research skills on your CV.'
      },
      {
        step: 2,
        title: 'Study 160-Page General Guidelines',
        duration: '2 to 3 Days',
        description: 'Read the comprehensive search quality guidelines and familiarize yourself with E-E-A-T and Needs Met criteria.',
        deliverable: 'Prepared for Exam Stages',
        proTip: 'Bookmark key chapters on Page Quality and Needs Met scales.'
      },
      {
        step: 3,
        title: 'Pass 3-Part Evaluator Exam',
        duration: '3 to 5 Hours (Across 7 days)',
        description: 'Complete Part 1 (Theory), Part 2 (Page Quality), and Part 3 (Needs Met).',
        deliverable: 'Official Rater Certification',
        proTip: 'Use all 7 allotted days to take each part when well-rested.'
      },
      {
        step: 4,
        title: 'Onboard & Start Logging Weekly Hours',
        duration: 'Ongoing',
        description: 'Sign the contractor agreement, log into the rating tool, and receive monthly direct payouts via Hyperwallet.',
        deliverable: 'Reliable Monthly Income',
        proTip: 'Maintain consistent weekly hours to remain an active rater.'
      }
    ]
  },

  {
    id: 'remotasks',
    name: 'Remotasks',
    slug: 'remotasks',
    category: 'Microtasks & Annotation',
    tagline: 'Computer Vision, 2D/3D Cuboid Bounding Boxes & LiDAR Labeling',
    logo: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://remotasks.com',
    signupUrl: 'https://remotasks.com',
    verifiedRate: '$5 – $20/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$500 – $1,800/mo',
    speedToFirstDollar: '3 to 5 days after Training Center bootcamps',
    difficulty: 'Intermediate',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['AirTM', 'PayPal'],
    payoutSchedule: 'Weekly (Every Tuesday UTC)',
    payoutMinimum: '$5.00',
    accountRequirements: [
      'Remotasks account sign-up',
      'Completion of Remotasks Training Center courses',
      'Pass calibration bootcamps for target annotation projects',
      'AirTM or PayPal wallet linked'
    ],
    testType: 'Training Center Calibration Bootcamps (Bounding Boxes, Segmentation & 3D LiDAR)',
    testBenchmark: '85%+ Accuracy Score on Project Calibration Tasks',
    peakHoursWAT: '24/7 self-scheduled task queue',
    skillsRequired: ['Spatial Reasoning', 'Computer Vision Labeling', 'Keyboard Shortcut Mastery', 'Patience & Precision'],
    summary: 'Remotasks trains and hires global annotators to label data for self-driving vehicles, robotics, and computer vision models using 2D and 3D annotation tools.',
    
    aiGuide: {
      screeningExamSecrets: [
        'In 2D bounding box tests, do not leave empty padding around objects. Tight boundaries are strictly graded.',
        'For 3D LiDAR cuboids, align the yaw, pitch, and roll axes precisely to vehicle bounding points.',
        'Use keyboard shortcuts to pan, zoom, and adjust vertices quickly.'
      ],
      sandboxCalibrationTips: [
        'Take the specialized 3D LiDAR training courses — LiDAR tasks pay up to 3x higher than standard 2D boxes.',
        'Join the official Remotasks Discord community to get feedback from bootcamp trainers.'
      ],
      avoidDisqualificationRules: [
        'Never submit empty tasks or guess labels — automated quality audits run continuously on live queues.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Link your AirTM account in the Remotasks payment profile.',
        '2. Payments are calculated and sent every Tuesday.',
        '3. Withdraw from AirTM to your Nigerian bank account instantly.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Cuboid Heading Direction',
          advice: 'Ensure the front orientation marker of the 3D cuboid matches the exact heading direction of the vehicle or pedestrian.'
        }
      ],
      faqs: [
        {
          question: 'What computer hardware do I need for 3D LiDAR tasks on Remotasks?',
          answer: '3D LiDAR tasks run best on a laptop or desktop with at least 8GB RAM, a dedicated mouse, and Google Chrome.'
        }
      ],
      quickPrompts: [
        'How to pass the Remotasks 3D LiDAR bootcamp?',
        'How to get higher paying tasks on Remotasks?',
        'How to setup AirTM weekly payout on Remotasks in Nigeria?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Sign Up on Remotasks',
        duration: '10 Minutes',
        description: 'Create an account on remotasks.com and verify your profile details.',
        deliverable: 'Remotasks Dashboard Access',
        proTip: 'Use a desktop browser with a mouse for precise labeling.'
      },
      {
        step: 2,
        title: 'Complete Training Center Courses',
        duration: '1 to 2 Hours',
        description: 'Work through interactive video lessons and calibration tasks in the Training Center.',
        deliverable: 'Course Certifications Unlocked',
        proTip: 'Master keyboard hotkeys to double your task speed.'
      },
      {
        step: 3,
        title: 'Pass Project Bootcamps & Join Production Queue',
        duration: '2 Hours',
        description: 'Complete the qualification tasks for active client queues (2D Boxes, Semantic Segmentation, or LiDAR).',
        deliverable: 'Approved for Live Production Tasks',
        proTip: 'Consistently maintaining 90%+ accuracy qualifies you for Reviewer status with higher hourly rates.'
      },
      {
        step: 4,
        title: 'Annotate Live Data & Receive Weekly AirTM Pay',
        duration: 'Ongoing',
        description: 'Complete live tasks during the week and receive automated disbursements every Tuesday.',
        deliverable: 'Weekly Income Stream',
        proTip: 'Review feedback from project reviewers to continuously sharpen your accuracy.'
      }
    ]
  },

  {
    id: 'oneforma_centific',
    name: 'OneForma by Centific',
    slug: 'oneforma',
    category: 'Microtasks & Annotation',
    tagline: 'LLM Prompt Evaluation, Transcription, Translation & Testing',
    logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://oneforma.com',
    signupUrl: 'https://oneforma.com',
    verifiedRate: '$10 – $25/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$800 – $2,000/mo',
    speedToFirstDollar: '5 to 10 days after project certification',
    difficulty: 'Intermediate',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Payoneer'],
    payoutSchedule: 'Monthly (Disbursed between 10th–20th of each month)',
    payoutMinimum: '$10.00',
    accountRequirements: [
      'OneForma profile creation and language proficiency setup',
      'Passing certifications in the Certifications tab',
      'Applying for active projects (e.g. Milky Way, ISAAC, LightSpeed)',
      'Verified Payoneer account linking'
    ],
    testType: 'Language & Task Certifications in the Certifications Portal',
    testBenchmark: '80%+ on Language and Project Certification Exams',
    peakHoursWAT: 'Flexible project-based schedules',
    skillsRequired: ['Translation & Localization', 'Audio Transcription', 'LLM Prompt Rating', 'Software Bug Testing'],
    summary: 'OneForma is a global digital platform by Centific offering freelance projects in AI prompt rating, transcription, translation, and localized testing.',
    
    aiGuide: {
      screeningExamSecrets: [
        'Before applying for any project, go to the "Certifications" tab and complete general language and transcription certificates.',
        'Review the project guidelines document thoroughly before attempting certification tests.'
      ],
      sandboxCalibrationTips: [
        'Check the "Jobs" tab frequently for newly posted projects in your native language.',
        'Track your completed task counter in the Desk portal to verify correct billing.'
      ],
      avoidDisqualificationRules: [
        'Do not miss project delivery deadlines once assigned to a project team.',
        'Ensure your Payoneer name matches your OneForma profile name exactly.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Link your Payoneer account in the Payment Information section.',
        '2. Invoices are generated at the end of the month and paid directly to Payoneer between the 10th and 20th.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Audio Transcription Formatting',
          advice: 'Follow strict timestamping, speaker labeling, and background noise tag conventions.'
        }
      ],
      faqs: [
        {
          question: 'How do I get approved for high-paying projects on OneForma?',
          answer: 'Pass as many certifications as possible in your profile. Project managers prioritize contractors with multiple verified certificates.'
        }
      ],
      quickPrompts: [
        'How to pass OneForma language and transcription certifications?',
        'What are the best active projects on OneForma?',
        'How to connect Payoneer to OneForma for monthly payouts?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Create Account on OneForma.com',
        duration: '15 Minutes',
        description: 'Register, fill out your native language proficiencies, and verify your email.',
        deliverable: 'Active OneForma Profile',
        proTip: 'Add English and any other spoken languages to your profile.'
      },
      {
        step: 2,
        title: 'Complete Free Skill Certifications',
        duration: '1 to 2 Hours',
        description: 'Take tests in the Certifications tab (Translation, Audio, LLM grading) to qualify for projects.',
        deliverable: 'Verified Badges on Profile',
        proTip: 'Passing certifications immediately increases your project application acceptance rate.'
      },
      {
        step: 3,
        title: 'Apply to Open Global Projects',
        duration: '30 Minutes',
        description: 'Browse the Jobs section and apply to active projects matching your certifications.',
        deliverable: 'Project Assignment Notification',
        proTip: 'Apply as soon as new projects are announced in the newsletter.'
      },
      {
        step: 4,
        title: 'Work on Project Batches & Receive Payoneer Pay',
        duration: 'Ongoing',
        description: 'Execute tasks in the web portal and receive monthly payouts directly to Payoneer.',
        deliverable: 'Monthly USD Earnings',
        proTip: 'Deliver high-quality work to be invited to private long-term project teams.'
      }
    ]
  },

  {
    id: 'usertesting',
    name: 'UserTesting',
    slug: 'usertesting',
    category: 'Software & Usability Testing',
    tagline: 'Website & App Usability Testing with Live Audio Commentary',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://www.usertesting.com/get-paid-to-test',
    signupUrl: 'https://www.usertesting.com/get-paid-to-test',
    verifiedRate: '$10 – $60 per test',
    rateType: 'per_task',
    earningPotentialMonthly: '$400 – $1,500/mo',
    speedToFirstDollar: '2 to 3 days after practice test approval',
    difficulty: 'Beginner',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['PayPal'],
    payoutSchedule: 'Exactly 7 days after completing each test',
    payoutMinimum: '$10.00',
    accountRequirements: [
      'Account creation on usertesting.com/get-paid-to-test',
      'Computer / smartphone with working microphone',
      'Pass short 5-minute practice test with spoken English commentary',
      'Verified PayPal account linked'
    ],
    testType: '5-Minute Practice Screener Test (Record screen and speak thoughts out loud)',
    testBenchmark: 'Clear Spoken English, Continuous Thought Sharing & Action Explanations',
    peakHoursWAT: 'Continuous test drop notifications via browser extension & app',
    skillsRequired: ['Clear Verbal Communication', 'Observational Usability Feedback', 'English Fluency'],
    summary: 'UserTesting pays everyday users to test new websites, mobile apps, and digital products while recording their screen and speaking their thoughts out loud ($10 for standard 20-min tests, up to $60 for live interviews).',
    
    aiGuide: {
      screeningExamSecrets: [
        'The #1 reason practice tests fail is silence. Never stop talking! Describe what you are seeing, what is confusing, and what you expect to happen.',
        'Read each test task out loud before attempting to click anything on the screen.',
        'Ensure your microphone audio is crystal clear with zero background fan or street noise.'
      ],
      sandboxCalibrationTips: [
        'Install the UserTesting browser extension and keep a tab open during your work hours to snag fast screener invitations.',
        'Maintain a 5-star rating on your initial tests by providing honest, constructive, and detailed critique.'
      ],
      avoidDisqualificationRules: [
        'Do not answer screener questions dishonestly just to qualify — clients compare your answers with your actual profile demographics.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Link your verified PayPal account in the Account Settings.',
        '2. Payments are automatically deposited into PayPal exactly 7 days (to the minute) after test completion.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Spoken Commentary Quality',
          advice: 'Explain "why" you took an action, not just "what" you clicked (e.g. "I am clicking this pricing button because I expected to see student discounts here").'
        }
      ],
      faqs: [
        {
          question: 'How long does each usability test take?',
          answer: 'Standard tests take approximately 15 to 20 minutes and pay $10. Live 30–60 minute moderated interviews pay between $30 and $60.'
        }
      ],
      quickPrompts: [
        'How to pass the UserTesting practice test on the first try?',
        'How to qualify for more screeners on UserTesting?',
        'What are the best tips for spoken think-out-loud commentary?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Sign Up & Submit Email',
        duration: '5 Minutes',
        description: 'Go to usertesting.com/get-paid-to-test and enter your email address to begin.',
        deliverable: 'Practice Test Invitation',
        proTip: 'Use an email address linked to your PayPal account.'
      },
      {
        step: 2,
        title: 'Complete 5-Minute Practice Test',
        duration: '10 Minutes',
        description: 'Record your screen, navigate a sample website, and speak your thoughts aloud continuously.',
        deliverable: 'Approved Practice Test',
        proTip: 'Use a quiet room and headphones with a dedicated microphone.'
      },
      {
        step: 3,
        title: 'Install Extension & Answer Screeners',
        duration: 'Ongoing',
        description: 'Install the UserTesting Chrome extension and complete quick 1-minute screener quizzes when tests pop up.',
        deliverable: 'Qualified Tests Accepted',
        proTip: 'Respond to screeners immediately as slots fill up within minutes.'
      },
      {
        step: 4,
        title: 'Complete 20-Min Tests & Auto-Receive $10–$60',
        duration: '15 to 20 Minutes per test',
        description: 'Follow on-screen tasks, provide rich verbal commentary, and receive automatic PayPal deposits 7 days later.',
        deliverable: '$10 – $60 Automatic PayPal Deposit',
        proTip: 'Maintaining a 5-star rater score sends more private test invitations to your dashboard.'
      }
    ]
  },

  {
    id: 'testlio_qa',
    name: 'Testlio',
    slug: 'testlio',
    category: 'Software & Usability Testing',
    tagline: 'Freelance Mobile & Web QA Testing with Guaranteed Hourly Rates',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=128&auto=format&fit=crop&q=80',
    officialUrl: 'https://testlio.com/for-testers/',
    signupUrl: 'https://testlio.com/for-testers/',
    verifiedRate: '$18 – $35/hr',
    rateType: 'hourly',
    earningPotentialMonthly: '$800 – $2,400/mo',
    speedToFirstDollar: '5 to 7 days after functional test certification',
    difficulty: 'Intermediate',
    nigeriaEligible: true,
    africanEligible: true,
    payoutMethods: ['Payoneer', 'PayPal'],
    payoutSchedule: 'Weekly (Every Friday for logged test hours)',
    payoutMinimum: '$10.00',
    accountRequirements: [
      'Tester profile creation on testlio.com',
      'List verified devices (Smartphones, Tablets, Mac/Windows PCs)',
      'Pass functional testing certification quiz',
      'Payoneer or PayPal account linking'
    ],
    testType: 'Functional Testing Certification & Bug Report Formatting Simulation',
    testBenchmark: 'Flawless Bug Reporting (Clear Steps to Reproduce, Expected vs Actual & Logs)',
    peakHoursWAT: 'Scheduled test run invitations (Evenings & weekends WAT)',
    skillsRequired: ['Manual QA Testing', 'Bug Report Writing', 'Mobile App Diagnostics', 'Device Testing'],
    summary: 'Testlio is a networked software testing platform that pays guaranteed hourly rates to freelance QA testers for exploratory and functional testing runs on top global apps.',
    
    aiGuide: {
      screeningExamSecrets: [
        'Testlio tests your ability to write clear, reproducible bug reports. Always format as: 1. Steps to Reproduce, 2. Expected Result, 3. Actual Result, 4. Attach Screen Recording/Logs.',
        'List all physical devices you own (Android versions, iOS devices, smart TVs, PCs) — device variety dramatically increases test run invitations.'
      ],
      sandboxCalibrationTips: [
        'Accept test run invitations quickly and arrive on time in the Testlio test chat workspace.',
        'Testlio pays for all scheduled testing time, regardless of whether you find a bug.'
      ],
      avoidDisqualificationRules: [
        'Never submit duplicate bugs that have already been reported in the test run chat by another tester.',
        'Always attach clean video screen recordings showing the bug happening in real time.'
      ],
      nigeriaPayoutSetupSteps: [
        '1. Link your Payoneer account in the Testlio profile payment tab.',
        '2. Hours logged during weekly test runs are calculated automatically and disbursed every Friday directly to Payoneer.'
      ],
      commonTestQuestionsAndRubric: [
        {
          type: 'Bug Severity Classification',
          advice: 'Classify bugs accurately: Blocker (app crash/payment failure), Critical (feature broken), Major (workaround exists), Minor (visual/UI cosmetic).'
        }
      ],
      faqs: [
        {
          question: 'Do I get paid if I don’t find any bugs during a Testlio run?',
          answer: 'Yes! Unlike bug bounty sites, Testlio pays a guaranteed hourly rate for the full duration of the testing run.'
        }
      ],
      quickPrompts: [
        'How to pass the Testlio QA certification exam?',
        'How to format bug reports on Testlio for maximum approval?',
        'How does Testlio weekly payout work in Nigeria?'
      ]
    },

    milestones: [
      {
        step: 1,
        title: 'Sign Up & Add Test Devices',
        duration: '15 Minutes',
        description: 'Create an account on testlio.com/for-testers/ and list your smartphone and computer models.',
        deliverable: 'Tester Profile Active',
        proTip: 'Adding multiple devices (iOS + Android + Mac/PC) increases your test run invite rate by 3x.'
      },
      {
        step: 2,
        title: 'Pass Functional Testing Certification',
        duration: '40 Minutes',
        description: 'Complete the online quiz evaluating bug reproduction and reporting standards.',
        deliverable: 'Certified QA Tester Badge',
        proTip: 'Review sample approved bug reports in the tester handbook before taking the test.'
      },
      {
        step: 3,
        title: 'Accept Test Run Invitations',
        duration: '1 to 3 Hours per run',
        description: 'Receive scheduled run invites, join the run with the Test Lead, execute test cases, and log hours.',
        deliverable: 'Logged Hourly Earnings',
        proTip: 'Confirm run invitations within 2 hours of receiving email alerts.'
      },
      {
        step: 4,
        title: 'Receive Weekly Friday Pay via Payoneer',
        duration: 'Ongoing',
        description: 'Get paid weekly for all completed run hours directly to your Payoneer account.',
        deliverable: 'Weekly Guaranteed Payouts',
        proTip: 'High-performing testers are invited to dedicated client teams with steady 20+ weekly hours.'
      }
    ]
  }
];
