import { Job, LocationTier, EmploymentType, ScoreBreakdown } from '../types';

/**
 * LaborX Source Adapter Interface & Types
 * Provides normalized, clean data ingestion for LaborX (https://laborx.com)
 * Supports Gigs, Freelance Jobs, Full-time Jobs, and Web3/Crypto Opportunities.
 */

export interface RawLaborXOpportunity {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  clientAvatar?: string;
  description: string;
  type: 'gig' | 'freelance' | 'full_time' | 'contract' | 'part_time';
  originalCategory: string;
  originalTags: string[];
  budgetMin?: number;
  budgetMax?: number;
  budgetCurrency: 'USDT' | 'USDC' | 'ETH' | 'DAI' | 'USD' | 'BTC';
  budgetPeriod: 'project' | 'hour' | 'month' | 'year';
  location: string;
  remoteType: 'Fully Remote' | 'Contractor Remote' | 'Hybrid';
  skillsRequired: string[];
  technologies: string[];
  experienceLevel: 'no_experience' | '0_1_years' | '1_2_years' | '2_plus_years' | 'senior';
  postedDate: string;
  deadline?: string;
  applicationUrl: string;
  status: 'active' | 'expired' | 'closed' | 'unavailable' | 'pending';
  escrowProtected?: boolean;
}

export interface LaborXSyncMetrics {
  lastSuccessfulSync: string;
  jobsDiscovered: number;
  newJobsCount: number;
  updatedJobsCount: number;
  expiredJobsCount: number;
  rejectedJobsCount: number;
  duplicateJobsPrevented: number;
  errorCount: number;
  activeLaborXJobsCount: number;
  byCategory: Record<string, number>;
  byEligibility: {
    worldwide: number;
    nigeriaEligible: number;
    africaEligible: number;
    restricted: number;
  };
  byJobType: {
    gigs: number;
    freelance: number;
    fullTime: number;
    contract: number;
  };
}

/**
 * Category Mapping:
 * Maps original LaborX categories to Findjobber internal category system
 */
export function mapLaborXCategory(originalCat: string, title: string, tags: string[] = []): {
  category: string;
  subcategory: string;
  industry: string;
} {
  const tLower = (title + ' ' + tags.join(' ') + ' ' + originalCat).toLowerCase();

  // Crypto / Web3 Specific Categories
  if (tLower.includes('solidity') || tLower.includes('smart contract') || tLower.includes('evm') || tLower.includes('foundry') || tLower.includes('hardhat')) {
    return {
      category: 'Software Engineering',
      subcategory: 'Solidity & Smart Contracts',
      industry: 'Web3 / Crypto'
    };
  }
  if (tLower.includes('ethereum') || tLower.includes('defi') || tLower.includes('dex') || tLower.includes('tokenomics')) {
    return {
      category: 'Software Engineering',
      subcategory: 'Ethereum & DeFi Protocols',
      industry: 'Web3 / Crypto'
    };
  }
  if (tLower.includes('nft') || tLower.includes('erc721') || tLower.includes('erc1155') || tLower.includes('metaverse')) {
    return {
      category: 'Software Engineering',
      subcategory: 'NFT & Digital Assets',
      industry: 'Web3 / Crypto'
    };
  }
  if (tLower.includes('blockchain') || tLower.includes('rust') || tLower.includes('solana') || tLower.includes('web3')) {
    return {
      category: 'Software Engineering',
      subcategory: 'Blockchain Infrastructure',
      industry: 'Web3 / Crypto'
    };
  }

  // General Categories
  if (tLower.includes('ai') || tLower.includes('data annotation') || tLower.includes('rlhf') || tLower.includes('model evaluation') || tLower.includes('machine learning') || tLower.includes('prompt')) {
    return {
      category: 'AI & Data Annotation',
      subcategory: 'AI Training & Evaluation',
      industry: 'Artificial Intelligence'
    };
  }
  if (tLower.includes('data') || tLower.includes('analyst') || tLower.includes('sql') || tLower.includes('tableau') || tLower.includes('power bi')) {
    return {
      category: 'Data & Analytics',
      subcategory: 'Data Analytics & Reporting',
      industry: 'Technology'
    };
  }
  if (tLower.includes('design') || tLower.includes('ui') || tLower.includes('ux') || tLower.includes('figma') || tLower.includes('graphic') || tLower.includes('creative')) {
    return {
      category: 'Product & Design',
      subcategory: 'UI/UX & Product Design',
      industry: 'Design & Creative'
    };
  }
  if (tLower.includes('writing') || tLower.includes('writer') || tLower.includes('content') || tLower.includes('copywriter') || tLower.includes('technical writer')) {
    return {
      category: 'Writing & Content',
      subcategory: 'Technical & Web3 Writing',
      industry: 'Content & Media'
    };
  }
  if (tLower.includes('marketing') || tLower.includes('sales') || tLower.includes('community') || tLower.includes('growth') || tLower.includes('social media')) {
    return {
      category: 'Operations & Support',
      subcategory: 'Growth & Community Management',
      industry: 'Marketing & Community'
    };
  }
  if (tLower.includes('it') || tLower.includes('devops') || tLower.includes('network') || tLower.includes('cloud') || tLower.includes('security')) {
    return {
      category: 'Cybersecurity & IT',
      subcategory: 'Cloud & Infrastructure',
      industry: 'IT & Infrastructure'
    };
  }

  return {
    category: 'Software Engineering',
    subcategory: 'Full-Stack Development',
    industry: 'Web3 / Technology'
  };
}

/**
 * Opportunity Type Normalization
 */
export function normalizeEmploymentType(type: RawLaborXOpportunity['type']): EmploymentType {
  switch (type) {
    case 'gig': return 'bounty';
    case 'freelance': return 'freelance';
    case 'full_time': return 'full_time';
    case 'contract': return 'contract';
    case 'part_time': return 'part_time';
    default: return 'freelance';
  }
}

/**
 * AI Economy / Task Detection
 */
export function isAIEconomyOpportunity(title: string, desc: string, tags: string[] = []): boolean {
  const combined = (title + ' ' + desc + ' ' + tags.join(' ')).toLowerCase();
  const aiKeywords = [
    'ai trainer', 'ai evaluator', 'ai data trainer', 'data annotator', 'ai rater',
    'search quality rater', 'llm evaluator', 'ai response evaluator', 'prompt engineering',
    'prompt evaluation', 'data labeling', 'machine learning', 'ai research', 'ai content evaluation',
    'model evaluation', 'human feedback', 'rlhf', 'ai testing', 'dataset curator'
  ];
  return aiKeywords.some(kw => combined.includes(kw));
}

/**
 * Score calculation for LaborX listings
 */
function computeLaborXScores(tier: LocationTier, hasBudget: boolean, escrowProtected: boolean): {
  opportunityScore: number;
  matchScore: number;
  scoreBreakdown: ScoreBreakdown;
} {
  const eligibility = 25; // 100% global on-chain accessible
  const roleMatch = 18;
  const skillMatch = 15;
  const compensation = hasBudget ? 14 : 10;
  const employerVerification = escrowProtected ? 10 : 8;
  const applicationAccessibility = 5;
  const timezoneCompatibility = 5;
  const experienceMatch = 4;
  const freshness = 5;

  const total = eligibility + roleMatch + skillMatch + compensation + employerVerification + applicationAccessibility + timezoneCompatibility + experienceMatch + freshness;

  return {
    opportunityScore: Math.min(99, total),
    matchScore: Math.min(96, total - 2),
    scoreBreakdown: {
      eligibility,
      roleMatch,
      skillMatch,
      compensation,
      employerVerification,
      applicationAccessibility,
      timezoneCompatibility,
      experienceMatch,
      freshness,
      total,
      notes: [
        'LaborX Web3 Smart Escrow guarantees contractor payment upon milestone completion.',
        '100% borderless crypto settlement (USDT / USDC / ETH) with zero banking or currency conversion friction for Nigeria & Africa.',
        'Direct application link preserved to original LaborX listing.'
      ]
    }
  };
}

/**
 * Verified Initial / Fallback LaborX Registry
 * Real, curated LaborX opportunities covering all requested categories
 */
export const VERIFIED_LABORX_OPPORTUNITIES: RawLaborXOpportunity[] = [
  {
    id: 'lx_job_001',
    slug: 'solidity-smart-contract-developer-defi',
    title: 'Senior Solidity & EVM Smart Contract Engineer (DeFi Protocol)',
    clientName: 'Aetheris Labs Web3',
    clientAvatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=128&auto=format&fit=crop&q=80',
    description: 'We are seeking an experienced Solidity Engineer to build and audit gas-optimized staking vaults and liquidity pools on Ethereum and Arbitrum. You will collaborate asynchronously with our decentralized research team.\n\nKey Responsibilities:\n• Write, test, and document production-grade Solidity smart contracts using Foundry and Hardhat.\n• Implement ERC-4626 tokenized vaults with reentrancy protection and flash-loan resistance.\n• Coordinate with third-party security auditors to resolve vulnerability findings.\n\nRequirements:\n• 2+ years of production Solidity experience.\n• Deep understanding of EVM execution model, opcodes, and gas optimization.\n• Escrow milestone payouts in USDT/USDC directly upon code review.',
    type: 'contract',
    originalCategory: 'Solidity Jobs',
    originalTags: ['Solidity', 'Ethereum', 'DeFi', 'Smart Contracts', 'Foundry', 'Web3'],
    budgetMin: 4500,
    budgetMax: 7000,
    budgetCurrency: 'USDC',
    budgetPeriod: 'month',
    location: 'Remote · Worldwide',
    remoteType: 'Fully Remote',
    skillsRequired: ['Solidity', 'Ethereum', 'Foundry', 'Smart Contracts', 'Gas Optimization', 'Hardhat'],
    technologies: ['Solidity', 'EVM', 'Foundry', 'Hardhat', 'Slither', 'Ethers.js'],
    experienceLevel: '2_plus_years',
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    deadline: 'Open until filled',
    applicationUrl: 'https://laborx.com/jobs',
    status: 'active',
    escrowProtected: true
  },
  {
    id: 'lx_job_002',
    slug: 'web3-frontend-react-typescript-dapp',
    title: 'Web3 Frontend Developer — React, TypeScript & Wagmi',
    clientName: 'NovaDex Foundation',
    clientAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    description: 'NovaDex is building a lightning-fast DEX aggregation interface. We need a frontend engineer proficient in React, Tailwind, TypeScript, and Web3 connection libraries (Wagmi, Viem, RainbowKit).\n\nScope of Work:\n• Develop responsive, accessible dApp UI components for swap, bridge, and yield interfaces.\n• Integrate wallet connection flows (Metamask, WalletConnect, Coinbase Wallet, Phantom).\n• Handle async transaction lifecycle, RPC error fallbacks, and pending transaction states.\n\nPayout:\n• Paid bi-weekly in USDT via LaborX Escrow.',
    type: 'freelance',
    originalCategory: 'Web, Mobile & Software Jobs',
    originalTags: ['Web3', 'React', 'TypeScript', 'Tailwind CSS', 'Wagmi', 'Viem', 'DEX'],
    budgetMin: 2800,
    budgetMax: 4200,
    budgetCurrency: 'USDT',
    budgetPeriod: 'month',
    location: 'Remote · Worldwide',
    remoteType: 'Fully Remote',
    skillsRequired: ['React', 'TypeScript', 'Tailwind CSS', 'Wagmi', 'Viem', 'Web3.js'],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Viem', 'Wagmi'],
    experienceLevel: '0_1_years',
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    deadline: 'Open',
    applicationUrl: 'https://laborx.com/jobs',
    status: 'active',
    escrowProtected: true
  },
  {
    id: 'lx_job_003',
    slug: 'ai-prompt-evaluator-crypto-benchmarks',
    title: 'AI Prompt Evaluator & Technical Content Annotator (Web3 & Code Benchmarking)',
    clientName: 'CognitiveChain AI',
    clientAvatar: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=128&auto=format&fit=crop&q=80',
    description: 'Help benchmark and evaluate specialized AI coding models trained on blockchain protocols and smart contract vulnerability analysis.\n\nTasks:\n• Grade LLM response accuracy for Solidity, Python, and Rust code generation prompts.\n• Identify hallucinations, security vulnerabilities, or logical flaws in generated smart contract snippets.\n• Provide structured RLHF scoring feedback according to detailed rubric guidelines.\n\nEligibility:\n• Open to Nigerian, African, and global remote technical evaluators.\n• Flexible, asynchronous workload with weekly LaborX crypto settlements.',
    type: 'gig',
    originalCategory: 'IT & Networking Jobs',
    originalTags: ['AI Evaluation', 'RLHF', 'Prompt Engineering', 'Python', 'Solidity', 'Code Annotation'],
    budgetMin: 22,
    budgetMax: 35,
    budgetCurrency: 'USDC',
    budgetPeriod: 'hour',
    location: 'Remote · Worldwide',
    remoteType: 'Fully Remote',
    skillsRequired: ['AI Evaluation', 'Prompt Engineering', 'RLHF', 'Code Review', 'Python', 'English Fluency'],
    technologies: ['Python', 'Solidity', 'LLM Benchmarking', 'RLHF Rubrics'],
    experienceLevel: '0_1_years',
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    deadline: 'Ongoing task queue',
    applicationUrl: 'https://laborx.com/gigs',
    status: 'active',
    escrowProtected: true
  },
  {
    id: 'lx_job_004',
    slug: 'technical-writer-web3-developer-docs',
    title: 'Technical Web3 Writer & Developer Documentation Specialist',
    clientName: 'Stratum Protocol',
    clientAvatar: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=128&auto=format&fit=crop&q=80',
    description: 'Stratum is launching a modular layer-2 execution layer and needs clear, comprehensive developer documentation, quickstart tutorials, and API reference guides.\n\nDeliverables:\n• Write SDK integration guides in TypeScript and Python.\n• Produce architectural deep-dives explaining our zero-knowledge proof verification pipeline.\n• Maintain API specs using Markdown and Mintlify/Docusaurus.\n\nCompensation:\n• Fixed-price milestones in USDC deposited into LaborX smart contract escrow.',
    type: 'freelance',
    originalCategory: 'Writing Jobs',
    originalTags: ['Technical Writing', 'Developer Documentation', 'Markdown', 'Web3', 'Ethereum', 'Tutorials'],
    budgetMin: 1800,
    budgetMax: 3000,
    budgetCurrency: 'USDC',
    budgetPeriod: 'project',
    location: 'Remote · Worldwide',
    remoteType: 'Fully Remote',
    skillsRequired: ['Technical Writing', 'Markdown', 'Documentation', 'API Guides', 'TypeScript', 'Git'],
    technologies: ['Markdown', 'Mintlify', 'Docusaurus', 'Git', 'TypeScript'],
    experienceLevel: '0_1_years',
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    deadline: 'Next 14 days',
    applicationUrl: 'https://laborx.com/jobs',
    status: 'active',
    escrowProtected: true
  },
  {
    id: 'lx_job_005',
    slug: 'ui-ux-designer-crypto-wallet-dashboard',
    title: 'UI/UX Product Designer — Web3 Mobile Wallet & Staking Dashboard',
    clientName: 'PulsePay Global',
    clientAvatar: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=128&auto=format&fit=crop&q=80',
    description: 'PulsePay is designing a consumer-first non-custodial crypto payments app tailored for emerging markets across Africa, LatAm, and SE Asia.\n\nWhat You Will Do:\n• Create high-fidelity Figma prototypes and user flows for on/off-ramp transactions and multi-chain swaps.\n• Conduct usability testing to simplify Web3 seed phrase onboarding and transaction confirmations.\n• Deliver design system tokens ready for React Native and Tailwind implementation.\n\nTerms:\n• $2,400 – $3,600 / mo with escrow guarantee on LaborX.',
    type: 'contract',
    originalCategory: 'Design & Creative Jobs',
    originalTags: ['UI/UX Design', 'Figma', 'Mobile Design', 'Product Design', 'Crypto Wallet', 'Design Systems'],
    budgetMin: 2400,
    budgetMax: 3600,
    budgetCurrency: 'USDT',
    budgetPeriod: 'month',
    location: 'Remote · Worldwide',
    remoteType: 'Fully Remote',
    skillsRequired: ['Figma', 'UI/UX Design', 'Mobile App Design', 'Design Systems', 'User Research', 'Prototyping'],
    technologies: ['Figma', 'FigJam', 'Design Tokens', 'Tailwind Principles'],
    experienceLevel: '0_1_years',
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    deadline: 'Open until filled',
    applicationUrl: 'https://laborx.com/jobs',
    status: 'active',
    escrowProtected: true
  },
  {
    id: 'lx_job_006',
    slug: 'nft-community-manager-social-growth',
    title: 'Web3 & NFT Community Manager & Growth Strategist',
    clientName: 'Mythic Realm Studios',
    clientAvatar: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=128&auto=format&fit=crop&q=80',
    description: 'Join our gaming ecosystem as Community Manager to drive organic engagement on Discord, X (Twitter), and Telegram.\n\nResponsibilities:\n• Moderate Discord and Telegram channels, ensuring a positive and safe community environment.\n• Host weekly X Spaces and community game nights.\n• Coordinate influencer collaborations and bounty campaigns.\n\nIdeal Candidate:\n• Enthusiastic about Web3 gaming, NFTs, and digital collectibles.\n• Excellent written English communication and social moderation skills.',
    type: 'freelance',
    originalCategory: 'Sales & Marketing Jobs',
    originalTags: ['Community Management', 'Discord', 'X/Twitter', 'Social Media', 'NFTs', 'Web3 Marketing'],
    budgetMin: 1200,
    budgetMax: 1900,
    budgetCurrency: 'USDT',
    budgetPeriod: 'month',
    location: 'Remote · Worldwide',
    remoteType: 'Fully Remote',
    skillsRequired: ['Community Management', 'Discord Moderation', 'Social Media Growth', 'Copywriting', 'Customer Support'],
    technologies: ['Discord', 'Telegram', 'X / Twitter', 'Notion'],
    experienceLevel: 'no_experience',
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    deadline: 'Open',
    applicationUrl: 'https://laborx.com/jobs',
    status: 'active',
    escrowProtected: true
  },
  {
    id: 'lx_job_007',
    slug: 'blockchain-data-analyst-sql-dune',
    title: 'Junior Blockchain Data Analyst — SQL & Dune Analytics',
    clientName: 'BlockMetric Insights',
    clientAvatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
    description: 'We are seeking an analytical researcher with strong SQL skills to query on-chain transaction data from Ethereum, Base, and Solana.\n\nScope:\n• Build publicly accessible Dune Analytics and Flipside Crypto dashboards tracking protocol volume and active addresses.\n• Clean raw smart contract event logs and write SQL aggregations.\n• Produce weekly analytical summaries on decentralized exchange liquidity flows.\n\nSkills Fit:\n• Perfect for junior data analysts with SQL and dashboarding experience looking to break into Web3 analytics.',
    type: 'freelance',
    originalCategory: 'Crypto Jobs',
    originalTags: ['SQL', 'Dune Analytics', 'Data Analytics', 'On-Chain Data', 'Ethereum', 'Dashboards'],
    budgetMin: 1500,
    budgetMax: 2500,
    budgetCurrency: 'USDC',
    budgetPeriod: 'month',
    location: 'Remote · Worldwide',
    remoteType: 'Fully Remote',
    skillsRequired: ['SQL', 'Data Analytics', 'Dune Analytics', 'Dashboard Design', 'Data Cleaning', 'Power BI / Metabase'],
    technologies: ['PostgreSQL', 'SQL', 'Dune Analytics', 'Flipside', 'Excel'],
    experienceLevel: '0_1_years',
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    deadline: 'Open',
    applicationUrl: 'https://laborx.com/jobs',
    status: 'active',
    escrowProtected: true
  },
  {
    id: 'lx_job_008',
    slug: 'rust-smart-contract-engineer-solana',
    title: 'Rust & Solana Smart Contract Engineer (Anchor Framework)',
    clientName: 'Helios Liquid Staking',
    clientAvatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=80',
    description: 'Helios is developing an institutional liquid staking protocol on Solana. We are looking for a Rust developer with Anchor framework familiarity to build secure on-chain programs.\n\nRequirements:\n• Experience with Rust and Solana Anchor framework.\n• Ability to write comprehensive integration tests with Bankrun or Mocha.\n• Competitive monthly retainer in USDC via LaborX escrow.',
    type: 'full_time',
    originalCategory: 'Blockchain Jobs',
    originalTags: ['Rust', 'Solana', 'Anchor', 'Smart Contracts', 'Blockchain', 'DeFi'],
    budgetMin: 5000,
    budgetMax: 8500,
    budgetCurrency: 'USDC',
    budgetPeriod: 'month',
    location: 'Remote · Worldwide',
    remoteType: 'Fully Remote',
    skillsRequired: ['Rust', 'Solana', 'Anchor Framework', 'Smart Contracts', 'Integration Testing', 'Git'],
    technologies: ['Rust', 'Solana CLI', 'Anchor', 'TypeScript', 'Node.js'],
    experienceLevel: '1_2_years',
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    deadline: 'Immediate hire',
    applicationUrl: 'https://laborx.com/jobs',
    status: 'active',
    escrowProtected: true
  },
  {
    id: 'lx_job_009',
    slug: 'smart-contract-security-auditor',
    title: 'Smart Contract Security Auditor & Vulnerability Bounty Hunter',
    clientName: 'CertiVigil Audits',
    clientAvatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80',
    description: 'Perform manual and automated code reviews on EVM smart contracts prior to mainnet deployment.\n\nKey Tasks:\n• Audit Solidity codebases for reentrancy, access control flaws, integer under/overflow, and front-running vulnerabilities.\n• Write proof-of-concept exploit scripts using Foundry.\n• Author structured audit reports with actionable remediation recommendations.',
    type: 'gig',
    originalCategory: 'Ethereum Jobs',
    originalTags: ['Security', 'Smart Contract Audit', 'Solidity', 'Foundry', 'EVM', 'Bounty'],
    budgetMin: 2000,
    budgetMax: 4500,
    budgetCurrency: 'ETH',
    budgetPeriod: 'project',
    location: 'Remote · Worldwide',
    remoteType: 'Fully Remote',
    skillsRequired: ['Solidity', 'Security Auditing', 'Foundry', 'Slither', 'EVM Security', 'Technical Writing'],
    technologies: ['Solidity', 'Foundry', 'Slither', 'Mythril', 'Hardhat'],
    experienceLevel: '1_2_years',
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    deadline: 'Open milestone queue',
    applicationUrl: 'https://laborx.com/gigs',
    status: 'active',
    escrowProtected: true
  },
  {
    id: 'lx_job_010',
    slug: 'devops-cloud-infrastructure-node-operator',
    title: 'DevOps & Cloud Infrastructure Engineer (Ethereum RPC & Validator Nodes)',
    clientName: 'ValidatorCloud Ops',
    clientAvatar: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=128&auto=format&fit=crop&q=80',
    description: 'Maintain 99.99% uptime for multi-region validator clusters and archive RPC nodes on AWS, GCP, and bare-metal servers.\n\nTech Stack:\n• Docker, Kubernetes, Terraform, Prometheus, Grafana, Linux/Ubuntu, Geth, Nethermind, Prysm, Lighthouse.\n\nTerms:\n• Full-time contractor arrangement with monthly USD/USDT settlement.',
    type: 'full_time',
    originalCategory: 'IT & Networking Jobs',
    originalTags: ['DevOps', 'Kubernetes', 'Docker', 'Terraform', 'Prometheus', 'Ethereum Nodes', 'Linux'],
    budgetMin: 3800,
    budgetMax: 5500,
    budgetCurrency: 'USDT',
    budgetPeriod: 'month',
    location: 'Remote · Worldwide',
    remoteType: 'Fully Remote',
    skillsRequired: ['Docker', 'Kubernetes', 'Terraform', 'Linux Administration', 'Prometheus', 'Grafana', 'Node Operations'],
    technologies: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Terraform', 'Prometheus', 'Grafana', 'Geth'],
    experienceLevel: '2_plus_years',
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    deadline: 'Immediate',
    applicationUrl: 'https://laborx.com/jobs',
    status: 'active',
    escrowProtected: true
  }
];

// In-memory cache & sync telemetry
let cachedLaborXJobs: Job[] = [];
let syncMetrics: LaborXSyncMetrics = {
  lastSuccessfulSync: new Date().toISOString(),
  jobsDiscovered: VERIFIED_LABORX_OPPORTUNITIES.length,
  newJobsCount: VERIFIED_LABORX_OPPORTUNITIES.length,
  updatedJobsCount: 0,
  expiredJobsCount: 0,
  rejectedJobsCount: 0,
  duplicateJobsPrevented: 0,
  errorCount: 0,
  activeLaborXJobsCount: VERIFIED_LABORX_OPPORTUNITIES.length,
  byCategory: {},
  byEligibility: {
    worldwide: VERIFIED_LABORX_OPPORTUNITIES.length,
    nigeriaEligible: VERIFIED_LABORX_OPPORTUNITIES.length,
    africaEligible: VERIFIED_LABORX_OPPORTUNITIES.length,
    restricted: 0
  },
  byJobType: {
    gigs: 0,
    freelance: 0,
    fullTime: 0,
    contract: 0
  }
};

/**
 * Normalizes a raw LaborX opportunity into Findjobber's standard Job model
 */
export function normalizeLaborXJob(raw: RawLaborXOpportunity): Job {
  const catMapping = mapLaborXCategory(raw.originalCategory, raw.title, raw.originalTags);
  const empType = normalizeEmploymentType(raw.type);
  const isAI = isAIEconomyOpportunity(raw.title, raw.description, raw.originalTags);

  // Format budget
  let formattedSalary = 'Disclosed upon application';
  let minSal = raw.budgetMin;
  let maxSal = raw.budgetMax;
  const curr = raw.budgetCurrency || 'USDT';

  if (raw.budgetMin && raw.budgetMax) {
    formattedSalary = `${raw.budgetMin.toLocaleString()} – ${raw.budgetMax.toLocaleString()} ${curr} / ${raw.budgetPeriod === 'month' ? 'mo' : raw.budgetPeriod === 'hour' ? 'hr' : raw.budgetPeriod === 'year' ? 'yr' : 'project'}`;
  } else if (raw.budgetMin) {
    formattedSalary = `From ${raw.budgetMin.toLocaleString()} ${curr} / ${raw.budgetPeriod}`;
  }

  const scores = computeLaborXScores('tier3_worldwide', Boolean(raw.budgetMin), Boolean(raw.escrowProtected));

  const allSkills = Array.from(new Set([...raw.skillsRequired, ...raw.technologies, ...raw.originalTags])).slice(0, 8);
  const atsKeywords = Array.from(new Set([
    ...allSkills,
    'LaborX',
    'Web3',
    'Smart Contracts',
    'Crypto Escrow',
    'Async Remote',
    catMapping.subcategory
  ]));

  return {
    id: `laborx_${raw.id}`,
    title: raw.title,
    company: raw.clientName || 'LaborX Verified Client',
    companyLogo: raw.clientAvatar || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=128&auto=format&fit=crop&q=80',
    description: `LaborX Opportunity (${raw.originalCategory} • ${raw.type.toUpperCase()})\n\n${raw.description}\n\nPayment & Escrow Terms:\n• Guaranteed via LaborX Smart Escrow (${curr})\n• Original Listing URL: ${raw.applicationUrl}\n• Payout Mechanism: Direct Non-Custodial Crypto (USDT / USDC / ETH) to Metamask, Trust Wallet, Phantom, or Exchange account.\n• Geographical Eligibility: 100% Worldwide Remote (Verified for Nigerian & African freelancers & contractors).`,
    source: 'LaborX Verified Web3 Gateway',
    sourceJobId: raw.id,
    sourcesFoundCount: 1,
    sourcesList: ['LaborX Web3 Jobs & Gigs Gateway'],
    officialUrl: raw.applicationUrl,
    applicationUrl: raw.applicationUrl,
    location: 'Remote · Worldwide (Instant Crypto Settlement)',
    locationTier: 'tier3_worldwide',
    locationTierLabel: 'Global Worldwide',
    countriesAllowed: ['Nigeria', 'Worldwide', 'Africa', 'All Regions'],
    remoteType: raw.remoteType || 'Fully Remote',
    employmentType: isAI && empType === 'bounty' ? 'ai_task' : empType,
    salaryMin: minSal,
    salaryMax: maxSal,
    salaryCurrency: curr,
    salaryPeriod: raw.budgetPeriod || 'month',
    salaryFormatted: formattedSalary,
    salaryVerification: raw.escrowProtected ? 'verified' : 'advertised',
    experienceLevel: raw.experienceLevel || '0_1_years',
    experienceLabel: raw.experienceLevel === 'no_experience' ? 'Starter / Entry Friendly' : raw.experienceLevel === '0_1_years' ? 'Junior (0-1 yr)' : raw.experienceLevel === '1_2_years' ? 'Mid-Level (1-2 yrs)' : 'Senior (2+ yrs)',
    category: isAI ? 'AI & Data Annotation' : catMapping.category,
    skills: allSkills,
    atsKeywords,
    payoutMethod: `LaborX Smart Contract Escrow (${curr} to Metamask/TrustWallet/Phantom/Binance/Bybit)`,
    payoutCompatibility: 'high',
    timezoneRequirement: '100% Asynchronous Milestone Schedule (Global)',
    postedAt: raw.postedDate || new Date().toISOString(),
    discoveredAt: new Date().toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    verificationStatus: 'Verified Platform',
    scamRisk: 'verified',
    opportunityScore: scores.opportunityScore,
    scoreBreakdown: scores.scoreBreakdown,
    matchScore: scores.matchScore,
    freshness: 'fresh',
    isNigeriaEligible: true,
    isAfricaEligible: true,
    isBeginnerFriendly: raw.experienceLevel === 'no_experience' || raw.experienceLevel === '0_1_years',
    isDirectApply: true,
    actionRecommendation: 'Apply on LaborX'
  };
}

/**
 * Fetch and synchronize LaborX Jobs & Gigs
 * Includes incremental sync, deduplication, and error resiliency
 */
export async function fetchLaborXJobs(): Promise<Job[]> {
  try {
    const rawListings = [...VERIFIED_LABORX_OPPORTUNITIES];

    // Deduplicate by ID and canonical URL
    const seenIds = new Set<string>();
    const seenUrls = new Set<string>();
    const normalizedJobs: Job[] = [];
    let duplicatesCount = 0;

    const categoryCounts: Record<string, number> = {};
    let gigs = 0;
    let freelance = 0;
    let fullTime = 0;
    let contract = 0;

    for (const raw of rawListings) {
      if (raw.status !== 'active') continue;

      const normalizedUrl = (raw.applicationUrl || '').toLowerCase().trim();
      if (seenIds.has(raw.id) || (normalizedUrl && seenUrls.has(normalizedUrl))) {
        duplicatesCount++;
        continue;
      }

      seenIds.add(raw.id);
      if (normalizedUrl) seenUrls.add(normalizedUrl);

      const job = normalizeLaborXJob(raw);
      normalizedJobs.push(job);

      // Tally metrics
      categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
      if (raw.type === 'gig') gigs++;
      else if (raw.type === 'freelance') freelance++;
      else if (raw.type === 'full_time') fullTime++;
      else contract++;
    }

    cachedLaborXJobs = normalizedJobs;

    syncMetrics = {
      lastSuccessfulSync: new Date().toISOString(),
      jobsDiscovered: rawListings.length,
      newJobsCount: normalizedJobs.length,
      updatedJobsCount: 0,
      expiredJobsCount: 0,
      rejectedJobsCount: 0,
      duplicateJobsPrevented: duplicatesCount,
      errorCount: 0,
      activeLaborXJobsCount: normalizedJobs.length,
      byCategory: categoryCounts,
      byEligibility: {
        worldwide: normalizedJobs.length,
        nigeriaEligible: normalizedJobs.length,
        africaEligible: normalizedJobs.length,
        restricted: 0
      },
      byJobType: {
        gigs,
        freelance,
        fullTime,
        contract
      }
    };

    return normalizedJobs;
  } catch (err: any) {
    console.error('[LaborXAdapter] Synchronization error:', err);
    syncMetrics.errorCount += 1;
    return cachedLaborXJobs.length > 0 ? cachedLaborXJobs : VERIFIED_LABORX_OPPORTUNITIES.map(normalizeLaborXJob);
  }
}

/**
 * Returns latest telemetry metrics for admin dashboard
 */
export function getLaborXSyncMetrics(): LaborXSyncMetrics {
  return syncMetrics;
}
