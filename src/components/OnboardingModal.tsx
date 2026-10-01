import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Briefcase, 
  Code2, 
  DollarSign, 
  FileText, 
  Bot, 
  Layers, 
  Coins, 
  Palette, 
  TrendingUp, 
  Github, 
  Linkedin, 
  Compass, 
  Check, 
  Zap, 
  RefreshCw,
  Upload,
  Globe,
  Building2,
  Edit3,
  Plus,
  SlidersHorizontal,
  Link as LinkIcon,
  BookOpen,
  FileCheck,
  AlertCircle,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface WorkModelOption {
  id: string;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultRoles: string[];
}

export interface CareerTrackOption {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestedRoles: string[];
  suggestedSkills: string[];
  description: string;
}

export const WORK_MODEL_OPTIONS: WorkModelOption[] = [
  {
    id: 'contract',
    title: 'Remote Global Contracts',
    badge: 'USD/EUR Invoices',
    icon: Globe,
    description: 'Long-term contracts for US/EU firms via Deel, Geegpay, or Wise.',
    defaultRoles: ['Junior Cybersecurity Analyst', 'SOC Analyst (Tier 1/2)', 'Full Stack Engineer', 'Junior Data Analyst', 'Frontend React Developer', 'Backend Python Engineer']
  },
  {
    id: 'bounty',
    title: 'Web3 & Security Bounties',
    badge: 'USDC / Crypto',
    icon: Coins,
    description: 'Bug bounties, vulnerability disclosures, smart contract audits, and protocol grants.',
    defaultRoles: ['Smart Contract Auditor', 'Security Vulnerability Researcher', 'Bug Bounty Hunter', 'Solidity Developer', 'Rust Web3 Engineer']
  },
  {
    id: 'ai_task',
    title: 'AI Training & Annotation Gigs',
    badge: '$25–$90/hr',
    icon: Bot,
    description: 'Flexible hourly tasks on Outlier, Alignerr, Micro1 (RLHF, STEM grading, reasoning).',
    defaultRoles: ['AI Prompt Evaluator', 'RLHF Data Trainer', 'STEM Reasoning Annotator', 'AI Code Reviewer', 'AI Safety & Security Evaluator']
  },
  {
    id: 'freelance',
    title: 'Freelance Retainers & Sprints',
    badge: 'Fixed Deliverables',
    icon: Zap,
    description: 'Fixed-fee project milestones ($1k–$5k sprints) and monthly client retainers.',
    defaultRoles: ['Freelance Web Developer', 'Security Audit Consultant', 'UI/UX Consultant', 'Workflow Automation Specialist']
  },
  {
    id: 'africa_hub',
    title: 'African Tech Scale-ups',
    badge: 'Lagos / Hybrid / Remote',
    icon: Building2,
    description: 'Leading African fintechs and tech scale-ups hiring across WAT/EAT timezones.',
    defaultRoles: ['Fintech Security Analyst', 'Fintech Integration Engineer', 'Growth Operations Associate', 'QA Analyst']
  },
  {
    id: 'direct_hire',
    title: 'Direct Full-Time Employment',
    badge: 'Global Remote',
    icon: Briefcase,
    description: 'Direct global remote employment with salary, equipment stipend, and benefits.',
    defaultRoles: ['Cybersecurity Analyst', 'Information Security Specialist', 'Software Engineer', 'Data Analyst', 'Product Operations Lead']
  }
];

export const CAREER_TRACKS: CareerTrackOption[] = [
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & InfoSec',
    icon: ShieldCheck,
    description: 'SOC monitoring, SIEM event analysis, vulnerability scanning, network defense, and incident response.',
    suggestedRoles: [
      'Junior Cybersecurity Analyst', 
      'SOC Analyst (Tier 1/2)', 
      'Information Security Specialist', 
      'Vulnerability Assessment Analyst', 
      'Cyber Incident Responder',
      'Cloud Security Associate',
      'Network Security Specialist'
    ],
    suggestedSkills: [
      'SIEM (Splunk/Sentinel)', 
      'Wireshark', 
      'Nmap', 
      'Vulnerability Scanning', 
      'Incident Response', 
      'Network Security', 
      'Firewalls & IDS/IPS', 
      'SOC Monitoring', 
      'Threat Hunting', 
      'NIST CSF', 
      'ISO 27001', 
      'OWASP Top 10', 
      'IAM & Active Directory', 
      'Endpoint Detection (EDR)',
      'Linux/Bash', 
      'Python for Security'
    ]
  },
  {
    id: 'data',
    name: 'Data & Analytics',
    icon: TrendingUp,
    description: 'SQL queries, business intelligence dashboards, Python data cleaning, and KPI reporting.',
    suggestedRoles: ['Junior Data Analyst', 'BI Specialist', 'Data Operations Associate', 'Analytics Engineer'],
    suggestedSkills: ['SQL', 'Power BI', 'Python', 'Excel', 'Tableau', 'Data Cleaning', 'PostgreSQL']
  },
  {
    id: 'engineering',
    name: 'Software Engineering',
    icon: Code2,
    description: 'Frontend, backend, and full-stack development for global remote engineering teams.',
    suggestedRoles: ['Frontend Developer', 'Full Stack Engineer', 'Backend Developer', 'React Engineer', 'Node.js Developer'],
    suggestedSkills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Git & GitHub']
  },
  {
    id: 'ai_rlhf',
    name: 'AI Training & Evaluation',
    icon: Bot,
    description: 'RLHF model grading, prompt engineering, code verification, and STEM data labeling.',
    suggestedRoles: ['AI Prompt Evaluator', 'RLHF Data Trainer', 'AI Content Specialist', 'AI Code Reviewer'],
    suggestedSkills: ['Prompt Engineering', 'Python', 'LLM Evaluation', 'Code Review', 'Critical Reasoning', 'Data Annotation']
  },
  {
    id: 'product_ops',
    name: 'Product, QA & Operations',
    icon: Layers,
    description: 'Technical support, customer onboarding, QA testing, sprint coordination, and operations.',
    suggestedRoles: ['Technical Support Specialist', 'Associate Product Manager', 'QA Analyst', 'Operations Associate'],
    suggestedSkills: ['Jira', 'API Testing', 'Agile/Scrum', 'Technical Writing', 'Customer Success', 'Notion']
  },
  {
    id: 'web3',
    name: 'Web3 & Blockchain',
    icon: Coins,
    description: 'Open-source code bounties, protocol documentation, DeFi integration, and smart contract audits.',
    suggestedRoles: ['Smart Contract Auditor', 'Web3 Developer', 'Protocol Contributor', 'Solidity Developer'],
    suggestedSkills: ['Solidity', 'Rust', 'EVM', 'Web3.js', 'Git & GitHub', 'Smart Contract Auditing']
  },
  {
    id: 'design',
    name: 'UI/UX & Product Design',
    icon: Palette,
    description: 'Modern Figma interfaces, user journey maps, design systems, and responsive mobile layouts.',
    suggestedRoles: ['UI/UX Designer', 'Product Designer', 'Design Systems Specialist', 'Visual Designer'],
    suggestedSkills: ['Figma', 'Design Systems', 'Wireframing', 'Prototyping', 'User Research', 'Tailwind CSS']
  },
  {
    id: 'technical_writing',
    name: 'Technical Writing & Content',
    icon: BookOpen,
    description: 'API documentation, developer tutorials, product guides, and case studies for global tech products.',
    suggestedRoles: ['Technical Writer', 'Developer Documentation Specialist', 'Content Strategist'],
    suggestedSkills: ['Technical Writing', 'Markdown', 'API Documentation', 'Git & GitHub', 'Developer Relations']
  }
];

const POPULAR_SKILL_CHIPS = [
  'SQL', 'Python', 'React', 'TypeScript', 'Power BI', 'Excel', 'Prompt Engineering',
  'Node.js', 'Next.js', 'Figma', 'PostgreSQL', 'Git & GitHub', 'Tailwind CSS',
  'Docker', 'FastAPI', 'Tableau', 'LLM Evaluation', 'Data Cleaning', 'Solidity', 'Rust'
];

export const OnboardingModal: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    userProfile, 
    updateUserProfile, 
    showToast,
    setActiveTab 
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [entryMode, setEntryMode] = useState<'resume' | 'manual'>('resume');
  
  // Selected Work Models (Multi-selection)
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>(() => {
    if (userProfile.preferredWorkTypes && userProfile.preferredWorkTypes.length > 0) {
      return userProfile.preferredWorkTypes;
    }
    return ['contract'];
  });

  // Selected Career Tracks (Multi-selection)
  const [selectedTracks, setSelectedTracks] = useState<string[]>(() => {
    if (userProfile.careerTracks && userProfile.careerTracks.length > 0) {
      return userProfile.careerTracks;
    }
    return userProfile.careerTrack ? [userProfile.careerTrack] : ['data'];
  });

  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [newRoleInput, setNewRoleInput] = useState<string>('');
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false);
  const [detectedResumeRoles, setDetectedResumeRoles] = useState<string[]>([]);
  const [detectedResumeSkills, setDetectedResumeSkills] = useState<string[]>([]);
  const [resumeParsedFileName, setResumeParsedFileName] = useState<string>(userProfile.uploadedResumeName || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
    country: userProfile.country || 'Nigeria',
    city: userProfile.city || 'Lagos',
    timezone: userProfile.timezone || 'WAT (UTC+1)',
    targetRoles: Array.from(new Set(Array.isArray(userProfile.targetRoles) ? userProfile.targetRoles : [])),
    experienceLevel: userProfile.experienceLevel || '0_1_years',
    yearsOfExperience: userProfile.yearsOfExperience || 0,
    skills: Array.from(new Set(Array.isArray(userProfile.skills) ? userProfile.skills : [])),
    preferredSalaryMin: userProfile.preferredSalaryMin || 1500,
    preferredCurrency: userProfile.preferredCurrency || 'USD',
    cvText: userProfile.cvText || '',
    portfolioUrl: userProfile.portfolioUrl || '',
    linkedinUrl: userProfile.linkedinUrl || '',
    githubUrl: userProfile.githubUrl || ''
  });

  // Strict onboarding requirement validations:
  // 1. Resume must be uploaded or have text content (>= 30 characters)
  const isResumeSubmitted = Boolean(
    resumeParsedFileName ||
    (formData.cvText && formData.cvText.trim().length >= 30) ||
    userProfile.uploadedResumeName
  );

  // 2. Candidate must select at least one job type
  const isJobTypeSelected = Boolean(
    formData.targetRoles && formData.targetRoles.length > 0
  );

  const isStep1Valid = Boolean(selectedWorkTypes.length > 0 && selectedTracks.length > 0);
  const isStep2Valid = Boolean(isResumeSubmitted && isJobTypeSelected);
  const isStep3Valid = Boolean(formData.skills.length > 0);

  // Step click navigation guard
  const handleStepClick = (targetStep: number) => {
    if (targetStep === 1) {
      setStep(1);
      return;
    }
    if (targetStep === 2) {
      if (!isStep1Valid) {
        showToast('Please select at least 1 work model and 1 career track first.', 'info');
        return;
      }
      setStep(2);
      return;
    }
    if (targetStep >= 3) {
      if (!isStep1Valid) {
        showToast('Please complete Step 1 (Work Models & Career Tracks) first.', 'info');
        setStep(1);
        return;
      }
      if (!isResumeSubmitted && !isJobTypeSelected) {
        showToast('Resume submission and job type selection are required before proceeding.', 'error');
        setStep(2);
        return;
      }
      if (!isResumeSubmitted) {
        showToast('Please submit your resume (upload file or paste text) before proceeding.', 'error');
        setStep(2);
        return;
      }
      if (!isJobTypeSelected) {
        showToast('Please select at least 1 target job type before proceeding.', 'error');
        setStep(2);
        return;
      }
      setStep(targetStep);
    }
  };

  // Step footer "Continue" navigation guard
  const handleNextStep = () => {
    if (step === 1) {
      if (!isStep1Valid) {
        showToast('Please select at least 1 work model and 1 career track to continue.', 'error');
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!isResumeSubmitted && !isJobTypeSelected) {
        showToast('Resume submission and job type selection are required before proceeding.', 'error');
        return;
      }
      if (!isResumeSubmitted) {
        showToast('Resume required: Please upload your resume document or paste your resume text.', 'error');
        return;
      }
      if (!isJobTypeSelected) {
        showToast('Job type required: Please select at least 1 target job type.', 'error');
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      if (formData.skills.length === 0) {
        showToast('Please select or add at least 1 skill to proceed.', 'error');
        return;
      }
      setStep(4);
      return;
    }
  };

  // Sync form data with current user profile whenever opened or profile changes
  useEffect(() => {
    if (isOnboardingOpen) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        country: userProfile.country || 'Nigeria',
        city: userProfile.city || 'Lagos',
        timezone: userProfile.timezone || 'WAT (UTC+1)',
        targetRoles: Array.from(new Set(Array.isArray(userProfile.targetRoles) ? userProfile.targetRoles : [])),
        experienceLevel: userProfile.experienceLevel || '0_1_years',
        yearsOfExperience: userProfile.yearsOfExperience || 0,
        skills: Array.from(new Set(Array.isArray(userProfile.skills) ? userProfile.skills : [])),
        preferredSalaryMin: userProfile.preferredSalaryMin || 1500,
        preferredCurrency: userProfile.preferredCurrency || 'USD',
        cvText: userProfile.cvText || '',
        portfolioUrl: userProfile.portfolioUrl || '',
        linkedinUrl: userProfile.linkedinUrl || '',
        githubUrl: userProfile.githubUrl || ''
      });
      setResumeParsedFileName(userProfile.uploadedResumeName || '');
    }
  }, [isOnboardingOpen, userProfile]);

  // Toggle Work Model Multi-selection
  const toggleWorkType = (id: string) => {
    setSelectedWorkTypes(prev => {
      const exists = prev.includes(id);
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Toggle Career Track Multi-selection
  const toggleCareerTrack = (track: CareerTrackOption) => {
    setSelectedTracks(prev => {
      const exists = prev.includes(track.id);
      let nextTracks: string[];
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least one
        nextTracks = prev.filter(t => t !== track.id);
      } else {
        nextTracks = [...prev, track.id];
      }
      return nextTracks;
    });
  };

  // Dynamic role suggestions aggregated from all selected work models and career tracks
  const dynamicSuggestedRoles = useMemo(() => {
    const rolesSet = new Set<string>();
    
    // Roles from selected career tracks
    selectedTracks.forEach(trackId => {
      const track = CAREER_TRACKS.find(t => t.id === trackId);
      if (track) {
        track.suggestedRoles.forEach(r => rolesSet.add(r));
      }
    });

    // Roles from selected work models
    selectedWorkTypes.forEach(modelId => {
      const model = WORK_MODEL_OPTIONS.find(m => m.id === modelId);
      if (model) {
        model.defaultRoles.forEach(r => rolesSet.add(r));
      }
    });

    return Array.from(rolesSet);
  }, [selectedTracks, selectedWorkTypes]);

  // Dynamic skill suggestions prioritized by detected resume skills, target roles, and selected career tracks
  const dynamicSuggestedSkills = useMemo(() => {
    const skillSet = new Set<string>();

    // 1. Skills detected directly from the candidate's uploaded resume come FIRST
    detectedResumeSkills.forEach(s => skillSet.add(s));

    // 2. Currently selected skills in form data
    formData.skills.forEach(s => skillSet.add(s));

    // 3. Domain skills from the user's selected career tracks (e.g. Cybersecurity, Engineering, Data, etc.)
    selectedTracks.forEach(trackId => {
      const track = CAREER_TRACKS.find(t => t.id === trackId);
      if (track) {
        track.suggestedSkills.forEach(s => skillSet.add(s));
      }
    });

    // 4. If Cybersecurity is in target roles or selected tracks, ensure all core security competencies are top of list
    const hasSecurityRole = formData.targetRoles.some(r => /cyber|security|soc|infosec|vulnerability|pentest|threat/i.test(r));
    if (selectedTracks.includes('cybersecurity') || hasSecurityRole) {
      [
        'SIEM (Splunk/Sentinel)', 'Wireshark', 'Nmap', 'Vulnerability Scanning',
        'Incident Response', 'Network Security', 'Firewalls & IDS/IPS', 'SOC Monitoring',
        'Threat Hunting', 'NIST CSF', 'ISO 27001', 'OWASP Top 10', 'IAM & Active Directory',
        'Endpoint Detection (EDR)', 'Burp Suite', 'Linux/Bash', 'Python for Security'
      ].forEach(s => skillSet.add(s));
    }

    // 5. Popular supplemental skills
    POPULAR_SKILL_CHIPS.forEach(s => skillSet.add(s));

    return Array.from(skillSet);
  }, [detectedResumeSkills, formData.skills, selectedTracks, formData.targetRoles]);

  if (!isOnboardingOpen) return null;

  // Toggle target role
  const toggleTargetRole = (role: string) => {
    setFormData(prev => {
      const exists = prev.targetRoles.includes(role);
      if (exists) {
        return { ...prev, targetRoles: prev.targetRoles.filter(r => r !== role) };
      } else {
        return { ...prev, targetRoles: Array.from(new Set([...prev.targetRoles, role])) };
      }
    });
  };

  // Toggle skill chip
  const toggleSkill = (skill: string) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: Array.from(new Set([...prev.skills, skill])) };
      }
    });
  };

  const addCustomSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData(prev => ({ ...prev, skills: Array.from(new Set([...prev.skills, trimmed])) }));
      setNewSkillInput('');
    }
  };

  const addCustomRole = () => {
    const trimmed = newRoleInput.trim();
    if (trimmed && !formData.targetRoles.includes(trimmed)) {
      setFormData(prev => ({ ...prev, targetRoles: Array.from(new Set([...prev.targetRoles, trimmed])) }));
      setNewRoleInput('');
    }
  };

  const removeRole = (role: string, index?: number) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: typeof index === 'number'
        ? prev.targetRoles.filter((_, idx) => idx !== index)
        : prev.targetRoles.filter(r => r !== role)
    }));
  };

  // Fast client-side resume parser and extractor with deep multi-domain intelligence
  const parseResumeTextContent = (text: string, fileName?: string) => {
    setIsParsingResume(true);
    try {
      const normalizedFileName = (fileName || '')
        .replace(/[_\-.]/g, ' ')
        .replace(/\b(pdf|docx|doc|txt|resume|cv)\b/gi, ' ')
        .trim();
      const combinedSource = `${normalizedFileName} ${text}`.toLowerCase();

      // Check domain triggers
      const isCybersecurity = /(cyber\s*sec|security\s+analyst|infosec|soc\s+analyst|soc\s+tier|vulnerability|wireshark|siem|splunk|nmap|firewall|penetration\s+test|ethical\s+hack|threat\s+hunt|incident\s+respons|edr|crowdstrike|sentinel|kali|cissp|ceh|security\+|ids\s*\/\s*ips|burp\s*suite)/i.test(combinedSource);
      const isData = /(data\s+analyst|business\s+intelligence|power\s*bi|tableau|data\s+science|data\s+engineer|etl|pandas|sql\s+queries)/i.test(combinedSource);
      const isAi = /(ai\s+evaluat|prompt\s+engineer|rlhf|llm|model\s+trainer|data\s+annotation|stem\s+reasoning)/i.test(combinedSource);
      const isEngineering = /(frontend|backend|full\s*stack|software\s+engineer|react|node|next\.?js|web\s+developer|typescript)/i.test(combinedSource);
      const isWeb3 = /(smart\s+contract|solidity|web3|blockchain|crypto|rust)/i.test(combinedSource);
      const isDesign = /(ui\s*\/\s*ux|product\s+design|figma|user\s+interface)/i.test(combinedSource);
      const isProductOps = /(product\s+manag|qa\s+analyst|scrum\s+master|customer\s+support)/i.test(combinedSource);

      // Extract skills
      const detectedSkills: string[] = [];

      // Cybersecurity skills checks
      const SECURITY_SKILL_CHECKS: { regex: RegExp; skill: string }[] = [
        { regex: /\b(siem|splunk|sentinel)\b/i, skill: 'SIEM (Splunk/Sentinel)' },
        { regex: /\bwireshark\b/i, skill: 'Wireshark' },
        { regex: /\bnmap\b/i, skill: 'Nmap' },
        { regex: /\bvulnerability\s*(scan|assess|management)?\b|\bnessus\b/i, skill: 'Vulnerability Scanning' },
        { regex: /\bincident\s*response\b|\bir\s*triage\b/i, skill: 'Incident Response' },
        { regex: /\bnetwork\s*security\b|\btcp\s*\/\s*ip\b/i, skill: 'Network Security' },
        { regex: /\bfirewall(s)?\b|\bids\s*\/\s*ips\b/i, skill: 'Firewalls & IDS/IPS' },
        { regex: /\bsoc\b|\bsecurity\s*operations\b/i, skill: 'SOC Monitoring' },
        { regex: /\bthreat\s*hunt(ing)?\b|\bthreat\s*intel(ligence)?\b/i, skill: 'Threat Hunting' },
        { regex: /\bnist\b|\bnist\s*csf\b/i, skill: 'NIST CSF' },
        { regex: /\biso\s*27001\b/i, skill: 'ISO 27001' },
        { regex: /\bsoc\s*2\b/i, skill: 'SOC 2' },
        { regex: /\bowasp\b/i, skill: 'OWASP Top 10' },
        { regex: /\biam\b|\bactive\s*directory\b|\bidentity\s*(and|&)\s*access\b/i, skill: 'IAM & Active Directory' },
        { regex: /\bedr\b|\bcrowdstrike\b|\bendpoint\s*detection\b/i, skill: 'Endpoint Detection (EDR)' },
        { regex: /\bburp\s*suite\b/i, skill: 'Burp Suite' },
        { regex: /\bkali(\s*linux)?\b/i, skill: 'Kali Linux' },
        { regex: /\blinux\b|\bbash\b/i, skill: 'Linux/Bash' },
        { regex: /\bpython\b/i, skill: isCybersecurity ? 'Python for Security' : 'Python' },
        { regex: /\bsecurity\+\b|\bcomptia\s*security\b/i, skill: 'CompTIA Security+' },
        { regex: /\bphishing\s*(analysis)?\b/i, skill: 'Phishing Analysis' },
        { regex: /\bcloud\s*security\b|\baws\s*security\b|\bazure\s*security\b/i, skill: 'Cloud Security' }
      ];

      SECURITY_SKILL_CHECKS.forEach(item => {
        if (item.regex.test(combinedSource)) {
          detectedSkills.push(item.skill);
        }
      });

      // General tech & other domain skills
      const GENERAL_SKILLS = [
        'SQL', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'Power BI', 
        'Excel', 'Tableau', 'Prompt Engineering', 'LLM Evaluation', 'Figma', 'Solidity', 
        'Rust', 'PostgreSQL', 'Docker', 'Git & GitHub', 'Next.js', 'Tailwind CSS', 
        'Data Cleaning', 'Pandas', 'NumPy', 'Jira', 'API Testing', 'Technical Writing'
      ];

      GENERAL_SKILLS.forEach(skill => {
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(combinedSource)) {
          detectedSkills.push(skill);
        }
      });

      // Extract role suggestions
      const detectedRoles: string[] = [];
      const ROLE_PATTERNS = [
        // Cybersecurity & InfoSec Patterns
        { regex: /(junior|entry|associate|graduate)?.*(cyber\s*sec|information\s+sec|infosec|security\s+analyst)/i, role: 'Junior Cybersecurity Analyst' },
        { regex: /soc\s+(analyst|tier\s*[12]|monitoring)|security\s+operations/i, role: 'SOC Analyst (Tier 1/2)' },
        { regex: /vulnerability\s+(analyst|assess|scan)|penetration\s+test|ethical\s+hack/i, role: 'Vulnerability Assessment Analyst' },
        { regex: /incident\s+response|threat\s+hunt|threat\s+intel/i, role: 'Cyber Incident Responder' },
        { regex: /cloud\s+security|devsecops|aws\s+security|azure\s+security/i, role: 'Cloud Security Associate' },
        { regex: /network\s+security|firewall|ids\s*\/\s*ips/i, role: 'Network Security Specialist' },
        { regex: /security\s+compliance|grc|iso\s*27001|soc\s*2|security\s+audit/i, role: 'Security Compliance Analyst' },

        // Data & Analytics Patterns
        { regex: /data\s+analyst/i, role: 'Junior Data Analyst' },
        { regex: /business\s+intelligence|bi\s+specialist|power\s*bi/i, role: 'BI Specialist' },
        { regex: /analytics\s+engineer|data\s+engineer/i, role: 'Analytics Engineer' },

        // AI & RLHF Patterns
        { regex: /prompt\s+engineer|ai\s+evaluat|llm|rlhf/i, role: 'AI Prompt Evaluator' },
        { regex: /rlhf\s+data\s+trainer|ai\s+trainer/i, role: 'RLHF Data Trainer' },

        // Engineering Patterns
        { regex: /frontend|react|vue/i, role: 'Frontend Developer' },
        { regex: /full\s*stack|software\s+engineer/i, role: 'Full Stack Engineer' },
        { regex: /backend|node|django|fastapi/i, role: 'Backend Developer' },

        // Web3 & Design Patterns
        { regex: /smart\s+contract|solidity|web3|blockchain/i, role: 'Smart Contract Auditor' },
        { regex: /ui\s*\/\s*ux|product\s+design|figma/i, role: 'UI/UX Designer' },
        { regex: /technical\s+writ|documentation/i, role: 'Technical Writer' }
      ];

      ROLE_PATTERNS.forEach(item => {
        if (item.regex.test(combinedSource)) {
          detectedRoles.push(item.role);
        }
      });

      // Domain-aware fallbacks if specific patterns were not matched
      if (detectedRoles.length === 0) {
        if (isCybersecurity) {
          detectedRoles.push('Junior Cybersecurity Analyst', 'SOC Analyst (Tier 1/2)');
        } else if (isData) {
          detectedRoles.push('Junior Data Analyst', 'BI Specialist');
        } else if (isAi) {
          detectedRoles.push('AI Prompt Evaluator', 'RLHF Data Trainer');
        } else if (isEngineering) {
          detectedRoles.push('Frontend Developer', 'Full Stack Engineer');
        } else if (isWeb3) {
          detectedRoles.push('Smart Contract Auditor', 'Web3 Developer');
        } else if (isDesign) {
          detectedRoles.push('UI/UX Designer', 'Product Designer');
        } else {
          detectedRoles.push('Junior Tech Specialist', 'Remote Operations Associate');
        }
      }

      // Domain-aware skill fallbacks if specific skills were not matched
      if (detectedSkills.length === 0) {
        if (isCybersecurity) {
          detectedSkills.push(
            'SIEM (Splunk/Sentinel)', 'Wireshark', 'Nmap', 
            'Vulnerability Scanning', 'Incident Response', 'Network Security', 'Firewalls & IDS/IPS'
          );
        } else if (isData) {
          detectedSkills.push('SQL', 'Python', 'Power BI', 'Excel');
        } else if (isAi) {
          detectedSkills.push('Prompt Engineering', 'LLM Evaluation', 'Critical Reasoning');
        } else if (isEngineering) {
          detectedSkills.push('React', 'TypeScript', 'Git & GitHub', 'Tailwind CSS');
        } else {
          detectedSkills.push('Communication', 'Git & GitHub', 'Problem Solving');
        }
      }

      // Check experience level hints
      let expLevel = formData.experienceLevel;
      let yoe = formData.yearsOfExperience;
      if (combinedSource.includes('junior') || combinedSource.includes('entry') || combinedSource.includes('graduate') || combinedSource.includes('tier 1')) {
        expLevel = '0_1_years';
        yoe = 1;
      } else if (combinedSource.includes('senior') || combinedSource.includes('lead') || combinedSource.includes('5+ years') || combinedSource.includes('4 years')) {
        expLevel = 'senior';
        yoe = 4;
      } else if (combinedSource.includes('2 years') || combinedSource.includes('3 years') || combinedSource.includes('mid-level') || combinedSource.includes('tier 2')) {
        expLevel = '1_2_years';
        yoe = 2;
      }

      // Check candidate name hint from first line if plausible
      const firstLine = text.split('\n').map(l => l.trim()).filter(Boolean)[0] || '';
      const nameCandidate = firstLine.length > 2 && firstLine.length < 40 && !firstLine.includes('http') && !firstLine.includes('@') && !firstLine.toLowerCase().includes('resume') && !firstLine.toLowerCase().includes('candidate') ? firstLine : formData.name;

      // STRICT DOMAIN ISOLATION: When a candidate uploads a resume from a specific domain (like Cybersecurity),
      // eliminate any conflicting roles from other domains (such as Junior Data Analyst or Backend Developer)
      let domainFilteredRoles: string[] = detectedRoles;
      let domainFilteredSkills: string[] = detectedSkills;

      if (isCybersecurity) {
        // Strictly filter to cybersecurity target roles only
        domainFilteredRoles = detectedRoles.filter(r => 
          /cyber|security|soc|infosec|vulnerability|incident|threat|pentest|compliance/i.test(r)
        );
        if (domainFilteredRoles.length === 0) {
          domainFilteredRoles = ['Junior Cybersecurity Analyst', 'SOC Analyst (Tier 1/2)', 'Vulnerability Assessment Analyst'];
        }

        // Strictly isolate cybersecurity-specific skills so generic tech skills do not hijack the candidate profile
        const securitySkillsOnly = detectedSkills.filter(s => 
          SECURITY_SKILL_CHECKS.some(c => c.skill.toLowerCase() === s.toLowerCase()) ||
          /siem|splunk|wireshark|nmap|vulnerability|incident|network security|firewall|soc|threat|nist|owasp|burp|kali|bash|security|edr/i.test(s)
        );
        domainFilteredSkills = securitySkillsOnly.length >= 3 ? securitySkillsOnly : [
          'SIEM (Splunk/Sentinel)', 'Wireshark', 'Nmap', 'Vulnerability Scanning', 
          'Incident Response', 'Network Security', 'Firewalls & IDS/IPS', 'Linux/Bash'
        ];
      } else if (isData && !isCybersecurity) {
        domainFilteredRoles = detectedRoles.filter(r => /data|analytics|bi\b/i.test(r));
        if (domainFilteredRoles.length === 0) domainFilteredRoles = ['Junior Data Analyst', 'BI Specialist'];
      } else if (isEngineering && !isCybersecurity && !isData) {
        domainFilteredRoles = detectedRoles.filter(r => /software|frontend|backend|full\s*stack|developer/i.test(r));
        if (domainFilteredRoles.length === 0) domainFilteredRoles = ['Frontend Developer', 'Full Stack Engineer'];
      }

      const finalRoles = Array.from(new Set(domainFilteredRoles));
      const finalSkills = Array.from(new Set(domainFilteredSkills));

      setDetectedResumeRoles(finalRoles);
      setDetectedResumeSkills(finalSkills);

      // Automatically update Career Track to match the uploaded resume domain
      if (isCybersecurity) {
        setSelectedTracks(['cybersecurity']);
      } else if (isData && !isCybersecurity) {
        setSelectedTracks(['data']);
      } else if (isAi && !isCybersecurity) {
        setSelectedTracks(['ai_rlhf']);
      } else if (isEngineering && !isCybersecurity) {
        setSelectedTracks(['engineering']);
      } else if (isDesign && !isCybersecurity) {
        setSelectedTracks(['design']);
      } else if (isWeb3 && !isCybersecurity) {
        setSelectedTracks(['web3']);
      }

      // Adopt the detected roles and skills directly into the form data, replacing obsolete initial defaults
      setFormData(prev => ({
        ...prev,
        cvText: text,
        name: prev.name || nameCandidate,
        experienceLevel: expLevel,
        yearsOfExperience: yoe,
        targetRoles: finalRoles,
        skills: finalSkills
      }));

      if (fileName) {
        setResumeParsedFileName(fileName);
        updateUserProfile({
          uploadedResumeName: fileName,
          cvText: text,
          careerTrack: isCybersecurity ? 'Cybersecurity & InfoSec' : (isData ? 'Data & Analytics' : userProfile.careerTrack),
          careerTracks: isCybersecurity ? ['cybersecurity'] : (userProfile.careerTracks || ['data']),
          targetRoles: finalRoles,
          skills: finalSkills
        });
      }

      showToast(`✨ Resume parsed! Extracted ${finalSkills.length} domain skills & ${finalRoles.length} matching job types.`, 'success');
    } catch (err) {
      console.error('Resume parsing error:', err);
      showToast('Could not automatically parse resume text.', 'info');
    } finally {
      setIsParsingResume(false);
    }
  };

  // Handle file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const candidateName = userProfile.name && !userProfile.name.toLowerCase().includes('guest')
      ? userProfile.name
      : (formData.name && !formData.name.toLowerCase().includes('guest') ? formData.name : 'Candidate');
    const candidateEmail = userProfile.email || formData.email || '';

    // Infer candidate specialization directly from the uploaded file name
    const cleanFileName = fileName.replace(/[_\-.]/g, ' ').replace(/\b(pdf|docx|doc|txt|resume|cv)\b/gi, ' ').trim();
    const isSecurityDoc = /cyber|security|soc|infosec|pentest|incident/i.test(fileName);
    const isDataDoc = /data|analyst|analytics|power\s*bi/i.test(fileName);
    const isAiDoc = /ai|prompt|rlhf|llm|evaluat/i.test(fileName);
    const isEngDoc = /frontend|backend|software|engineer|developer/i.test(fileName);
    const isDesignDoc = /design|ui|ux|figma/i.test(fileName);

    const detectedSpecialization = isSecurityDoc
      ? 'Junior Cybersecurity & InfoSec Analyst'
      : isDataDoc
      ? 'Junior Data Analyst'
      : isAiDoc
      ? 'AI Prompt & RLHF Evaluator'
      : isEngDoc
      ? 'Software Engineer'
      : isDesignDoc
      ? 'UI/UX Designer'
      : cleanFileName || 'Remote Professional Candidate';

    const reader = new FileReader();

    if (fileName.toLowerCase().endsWith('.pdf') || fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc')) {
      reader.onload = (event) => {
        const result = (event.target?.result as string) || '';
        let extractedText = '';
        if (typeof result === 'string') {
          const matches = result.match(/[\x20-\x7E\t\n\r]{4,}/g);
          if (matches && matches.length > 8) {
            extractedText = matches.join(' ').replace(/[\\\/()[\]<>{}]/g, ' ').replace(/\s+/g, ' ').substring(0, 3500);
          }
        }

        // Refine specialization if extracted text strongly indicates a domain
        let resolvedSpecialization = detectedSpecialization;
        const lowerExtracted = (extractedText || '').toLowerCase();
        if (/cyber|security|soc\b|infosec|pentest|vulnerab|siem|wireshark/i.test(lowerExtracted)) {
          resolvedSpecialization = 'Junior Cybersecurity & InfoSec Analyst';
        } else if (/data\s*analyst|power\s*bi|tableau|sql.*analy/i.test(lowerExtracted) && !/cyber|security/i.test(lowerExtracted)) {
          resolvedSpecialization = 'Junior Data Analyst';
        }

        const syntheticHeader = `CANDIDATE RESUME: ${fileName}
Target Specialization: ${resolvedSpecialization}
Candidate Name: ${candidateName}
Email: ${candidateEmail}
Location: ${formData.city}, ${formData.country}
Document File: ${fileName} (${Math.round(file.size / 1024)} KB)`;

        const fullResumeText = extractedText && extractedText.length > 100
          ? `${syntheticHeader}\n\nExtracted Content:\n${extractedText}`
          : `${syntheticHeader}\n\nCore Competencies & Profile:\n${resolvedSpecialization} with verified technical background submitted for remote contracts, bounties, and global roles.`;

        parseResumeTextContent(fullResumeText, fileName);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        parseResumeTextContent(text, fileName);
      };
      reader.readAsText(file);
    }
  };

  // Quick auto-fill with a sample Nigerian tech candidate profile
  const handleAutoFillSample = () => {
    const sampleName = userProfile.name && userProfile.name !== 'Guest Candidate' ? userProfile.name : 'Chidi Okafor';
    const sampleEmail = userProfile.email || 'candidate@example.com';

    if (selectedTracks.includes('cybersecurity')) {
      setFormData({
        name: sampleName,
        email: sampleEmail,
        country: 'Nigeria',
        city: 'Lagos',
        timezone: 'WAT (UTC+1)',
        targetRoles: ['Junior Cybersecurity Analyst', 'SOC Analyst (Tier 1/2)'],
        experienceLevel: '0_1_years',
        yearsOfExperience: 1,
        skills: ['SIEM (Splunk/Sentinel)', 'Wireshark', 'Nmap', 'Vulnerability Scanning', 'Incident Response', 'Network Security', 'Firewalls & IDS/IPS', 'Linux/Bash'],
        preferredSalaryMin: 1800,
        preferredCurrency: 'USD',
        cvText: `${sampleName.toUpperCase()} | Lagos, Nigeria | ${sampleEmail}
Junior Cybersecurity Analyst & SOC Specialist with hands-on experience in SIEM event monitoring (Splunk, Microsoft Sentinel), packet capture analysis with Wireshark, port scanning & vulnerability assessment with Nmap, and incident triage. Familiar with NIST CSF, ISO 27001, and OWASP Top 10 guidelines.`,
        portfolioUrl: 'https://github.com/candidate-cyber-lab',
        linkedinUrl: 'https://linkedin.com/in/candidate',
        githubUrl: 'https://github.com/candidate-cyber'
      });
      setResumeParsedFileName('Junior_Cybersecurity_Analyst_Resume.pdf');
      setDetectedResumeRoles(['Junior Cybersecurity Analyst', 'SOC Analyst (Tier 1/2)', 'Vulnerability Assessment Analyst']);
      setDetectedResumeSkills(['SIEM (Splunk/Sentinel)', 'Wireshark', 'Nmap', 'Vulnerability Scanning', 'Incident Response', 'Network Security']);
      setSelectedWorkTypes(['contract', 'bounty', 'direct_hire']);
      showToast('Sample Cybersecurity profile loaded with resume text and job types!', 'success');
      return;
    }

    setFormData({
      name: sampleName,
      email: sampleEmail,
      country: 'Nigeria',
      city: 'Lagos',
      timezone: 'WAT (UTC+1)',
      targetRoles: ['Junior Data Analyst', 'AI Prompt Evaluator'],
      experienceLevel: '0_1_years',
      yearsOfExperience: 1,
      skills: ['SQL', 'Python', 'Power BI', 'Excel', 'Prompt Engineering', 'React', 'TypeScript'],
      preferredSalaryMin: 1500,
      preferredCurrency: 'USD',
      cvText: `${sampleName.toUpperCase()} | Lagos, Nigeria | ${sampleEmail}
Junior Data Analyst & Prompt Evaluator with experience in SQL queries, data wrangling with Python (Pandas), and reporting dashboards in Power BI. Evaluated AI reasoning benchmarks and tested prompt safety.`,
      portfolioUrl: 'https://github.com/candidate-projects',
      linkedinUrl: 'https://linkedin.com/in/candidate',
      githubUrl: 'https://github.com/candidate-dev'
    });
    setResumeParsedFileName('Candidate_Resume_Profile.txt');
    setDetectedResumeRoles(['Junior Data Analyst', 'AI Prompt Evaluator']);
    setDetectedResumeSkills(['SQL', 'Python', 'Power BI', 'Prompt Engineering']);
    setSelectedWorkTypes(['contract', 'bounty', 'ai_task']);
    setSelectedTracks(['data', 'ai_rlhf']);
    showToast('Sample profile loaded with resume text and job types!', 'success');
  };

  // Calculate live readiness score
  const calculateScore = () => {
    let score = 45;
    if (isResumeSubmitted) score += 20;
    if (formData.targetRoles.length >= 1) score += 15;
    if (formData.skills.length >= 3) score += 10;
    if (formData.skills.length >= 6) score += 5;
    if (formData.portfolioUrl || formData.githubUrl) score += 5;
    return Math.min(score, 98);
  };

  const readinessScore = calculateScore();

  const handleComplete = (destinationTab: string = 'discover') => {
    if (!isStep1Valid) {
      showToast('Please select at least 1 work model and 1 career track.', 'error');
      setStep(1);
      return;
    }
    if (!isResumeSubmitted || !isJobTypeSelected) {
      if (!isResumeSubmitted && !isJobTypeSelected) {
        showToast('Resume submission and job type selection are required before proceeding.', 'error');
      } else if (!isResumeSubmitted) {
        showToast('Please submit your resume (upload file or paste text) before proceeding.', 'error');
      } else {
        showToast('Please select at least 1 target job type before proceeding.', 'error');
      }
      setStep(2);
      return;
    }

    const improvements = [
      'Highlight specific business metric results in your past project descriptions.',
      'Maintain an active GitHub or portfolio with live interactive demos.',
      'Use the AI Job Intel tool to review employer requirements before applying.'
    ];

    const resolvedResumeName = resumeParsedFileName || (formData.cvText ? 'Candidate_Resume_Profile.txt' : '');

    updateUserProfile({
      name: formData.name || 'Candidate',
      email: formData.email || userProfile.email || '',
      country: formData.country,
      city: formData.city,
      timezone: formData.timezone,
      targetRoles: formData.targetRoles,
      experienceLevel: formData.experienceLevel,
      yearsOfExperience: Number(formData.yearsOfExperience),
      skills: formData.skills,
      preferredSalaryMin: Number(formData.preferredSalaryMin),
      preferredCurrency: formData.preferredCurrency,
      cvText: formData.cvText,
      uploadedResumeName: resolvedResumeName,
      portfolioUrl: formData.portfolioUrl,
      linkedinUrl: formData.linkedinUrl,
      githubUrl: formData.githubUrl,
      careerTrack: selectedTracks[0] === 'cybersecurity' 
        ? 'Cybersecurity & InfoSec' 
        : selectedTracks[0] === 'data' 
        ? 'Data & Analytics' 
        : selectedTracks[0] === 'engineering' 
        ? 'Frontend & Software Development' 
        : selectedTracks[0] === 'ai_rlhf' 
        ? 'AI Evaluation & RLHF' 
        : selectedTracks[0] || 'Cybersecurity & InfoSec',
      careerTracks: selectedTracks,
      preferredWorkTypes: selectedWorkTypes,
      hasCompletedOnboarding: true,
      careerReadinessScore: readinessScore,
      readinessImprovements: improvements
    });

    setIsOnboardingOpen(false, true);
    setActiveTab(destinationTab);
    showToast('🎉 Onboarding completed! Your personalized job feed is unlocked.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[96vh] sm:max-h-[92vh] my-auto">
        
        {/* Step Progress Indicator Bar */}
        <div className="w-full h-1 bg-stone-100 shrink-0 flex">
          <div 
            className="h-full bg-gradient-to-r from-[#D84315] to-[#00875A] transition-all duration-300 rounded-r-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Compact Step Tabs Navigation */}
        <div className="flex items-center justify-between border-b border-stone-200/80 bg-[#FBF9F4] px-2.5 sm:px-4 py-2 shrink-0">
          <div className="grid grid-cols-4 flex-1 gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => handleStepClick(1)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                step === 1 ? 'text-[#D84315] font-bold bg-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] inline-flex items-center justify-center font-mono shrink-0 ${
                isStep1Valid ? 'bg-[#00875A]/15 text-[#00875A]' : 'bg-stone-200 text-stone-700'
              }`}>
                {isStep1Valid ? <Check className="w-2.5 h-2.5 text-[#00875A]" /> : '1'}
              </span>
              <span className="truncate">Work Models</span>
            </button>
            <button
              type="button"
              onClick={() => handleStepClick(2)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                step === 2 ? 'text-[#D84315] font-bold bg-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] inline-flex items-center justify-center font-mono shrink-0 ${
                isStep2Valid ? 'bg-[#00875A]/15 text-[#00875A]' : 'bg-stone-200 text-stone-700'
              }`}>
                {isStep2Valid ? <Check className="w-2.5 h-2.5 text-[#00875A]" /> : '2'}
              </span>
              <span className="truncate">Resume & Roles</span>
            </button>
            <button
              type="button"
              onClick={() => handleStepClick(3)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                step === 3 ? 'text-[#D84315] font-bold bg-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] inline-flex items-center justify-center font-mono shrink-0 ${
                isStep3Valid ? 'bg-[#00875A]/15 text-[#00875A]' : 'bg-stone-200 text-stone-700'
              }`}>
                {isStep3Valid ? <Check className="w-2.5 h-2.5 text-[#00875A]" /> : '3'}
              </span>
              <span className="truncate">Skills & Links</span>
            </button>
            <button
              type="button"
              onClick={() => handleStepClick(4)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                step === 4 ? 'text-[#D84315] font-bold bg-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 text-[10px] inline-flex items-center justify-center font-mono shrink-0">4</span>
              <span className="truncate">AI Launch</span>
            </button>
          </div>

          {userProfile.hasCompletedOnboarding && (
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(false)}
              className="p-1.5 ml-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          
          {/* STEP 1: WORK MODELS & CAREER TRACKS (MULTI-SELECT) */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Choose Your Preferred Work Models (Select Multiple)</h4>
                  <p className="text-xs text-stone-500">Pick which types of remote income streams and contracts you want to target.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillSample}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-[#D84315]" />
                  <span>Auto-fill Sample</span>
                </button>
              </div>

              {/* Work Models Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {WORK_MODEL_OPTIONS.map(model => {
                  const IconComp = model.icon;
                  const isSelected = selectedWorkTypes.includes(model.id);
                  return (
                    <button
                      key={`work-model-${model.id}`}
                      type="button"
                      onClick={() => toggleWorkType(model.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#D84315] bg-[#D84315]/5 ring-1 ring-[#D84315]' 
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className={`p-2 rounded-xl shrink-0 ${
                            isSelected ? 'bg-[#D84315] text-white' : 'bg-stone-100 text-stone-600'
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            isSelected ? 'bg-[#D84315]/15 text-[#D84315]' : 'bg-stone-200/70 text-stone-600'
                          }`}>
                            {model.badge}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-stone-900">{model.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D84315] shrink-0" />}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                          {model.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Career Specialization Tracks (Multi-Select) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">Career Domain Tracks (Select All That Apply)</h5>
                    <p className="text-[11px] text-stone-500">Tailors dynamic job titles, tech stacks, and AI matching rules.</p>
                  </div>
                  <span className="text-[11px] text-[#D84315] font-semibold">
                    {selectedTracks.length} track{selectedTracks.length > 1 ? 's' : ''} selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CAREER_TRACKS.map(track => {
                    const IconComp = track.icon;
                    const isSelected = selectedTracks.includes(track.id);
                    return (
                      <button
                        key={`career-track-${track.id}`}
                        type="button"
                        onClick={() => toggleCareerTrack(track)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected 
                            ? 'border-[#00875A] bg-[#00875A]/5 ring-1 ring-[#00875A]' 
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${
                          isSelected ? 'bg-[#00875A] text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900">{track.name}</span>
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 text-[#00875A]" />
                            ) : (
                              <Plus className="w-3 h-3 text-stone-400" />
                            )}
                          </div>
                          <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            {track.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Minimum Compensation */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">Target Monthly Compensation (USD)</span>
                  <span className="text-xs font-black text-[#00875A] font-mono">
                    ${formData.preferredSalaryMin.toLocaleString()} / month
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={8000}
                  step={250}
                  value={formData.preferredSalaryMin}
                  onChange={e => setFormData({ ...formData, preferredSalaryMin: Number(e.target.value) })}
                  className="w-full accent-[#D84315] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>$500/mo (Entry/Gigs)</span>
                  <span>$2,500/mo (Mid-Contract)</span>
                  <span>$8,000+/mo (Senior Global)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: RESUME SUBMISSION & JOB TYPE SELECTION (BOTH REQUIRED) */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Step 2 Progress Summary Banner */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Step 2: Submit Resume & Select Job Types</h4>
                    <p className="text-xs text-stone-500">Both requirements are mandatory to unlock verified remote opportunities.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      isResumeSubmitted 
                        ? 'bg-[#00875A]/10 text-[#00875A] border border-[#00875A]/20' 
                        : 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
                    }`}>
                      {isResumeSubmitted ? <Check className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                      <span>1. Resume {isResumeSubmitted ? 'Submitted' : 'Required'}</span>
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      isJobTypeSelected 
                        ? 'bg-[#00875A]/10 text-[#00875A] border border-[#00875A]/20' 
                        : 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
                    }`}>
                      {isJobTypeSelected ? <Check className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                      <span>2. Job Types ({formData.targetRoles.length})</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION A: SUBMIT YOUR RESUME (REQUIRED) */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#D84315]/10 text-[#D84315]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900">Requirement 1: Submit Your Resume (Upload or Paste Text)</h5>
                      <p className="text-[11px] text-stone-500">Upload your PDF/DOCX resume file or paste your professional experience bio.</p>
                    </div>
                  </div>
                  {isResumeSubmitted ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#00875A]/10 text-[#00875A] text-xs font-bold flex items-center gap-1 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold shrink-0">
                      Action Required
                    </span>
                  )}
                </div>

                {/* File Upload Dropzone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 border-2 border-dashed rounded-2xl transition-all text-center cursor-pointer space-y-2 group ${
                    resumeParsedFileName
                      ? 'border-[#00875A] bg-[#00875A]/5'
                      : 'border-stone-300 hover:border-[#D84315] bg-stone-50 hover:bg-[#D84315]/5'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept=".pdf,.docx,.txt,.doc"
                    className="hidden" 
                  />
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto transition-colors ${
                    resumeParsedFileName ? 'bg-[#00875A]/20 text-[#00875A]' : 'bg-stone-200/80 group-hover:bg-[#D84315]/10 text-stone-600 group-hover:text-[#D84315]'
                  }`}>
                    {resumeParsedFileName ? <FileCheck className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800">
                      {resumeParsedFileName ? `Attached: ${resumeParsedFileName}` : 'Click to Upload Resume Document (.pdf, .docx, .txt)'}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {resumeParsedFileName ? 'Click to replace or re-upload your document' : 'Instantly extracts your skills and recommends verified matching roles.'}
                    </p>
                  </div>
                </div>

                {/* Or Paste Text Area */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      Or Paste Resume Bio / Project Summary ({formData.cvText.trim().length} chars, min 30 chars)
                    </label>
                    {formData.cvText.length >= 30 && (
                      <button
                        type="button"
                        onClick={() => parseResumeTextContent(formData.cvText)}
                        disabled={isParsingResume}
                        className="text-[11px] font-bold text-[#D84315] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Re-analyze text</span>
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={formData.cvText}
                    onChange={e => {
                      setFormData({ ...formData, cvText: e.target.value });
                      if (e.target.value.length > 50) {
                        parseResumeTextContent(e.target.value);
                      }
                    }}
                    placeholder="Paste your past roles, project summaries, or LinkedIn bio here (e.g. Junior Data Analyst with SQL and Python experience...)"
                    className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#D84315] focus:bg-white"
                  />
                </div>

                {/* Extracted Roles from Resume */}
                {detectedResumeRoles.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-[#00875A]" />
                        <span className="text-xs font-bold text-emerald-900">
                          Detected Job Types from Your Resume
                        </span>
                      </div>
                      <span className="text-[11px] text-[#00875A] font-semibold">Click to add to target roles</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedResumeRoles.map((role, rIdx) => {
                        const isSelected = formData.targetRoles.includes(role);
                        return (
                          <button
                            key={`detected-role-${role}-${rIdx}`}
                            type="button"
                            onClick={() => toggleTargetRole(role)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#00875A] text-white shadow-2xs'
                                : 'bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100/60'
                            }`}
                          >
                            {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            <span>{role}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION B: SELECT THE JOB TYPES YOU WANT (REQUIRED) */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#D84315]/10 text-[#D84315]">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900">Requirement 2: Select Target Job Types (At Least 1 Required)</h5>
                      <p className="text-[11px] text-stone-500">Pick the exact roles you want remote contracts and bounty tasks for.</p>
                    </div>
                  </div>
                  {isJobTypeSelected ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#00875A]/10 text-[#00875A] text-xs font-bold flex items-center gap-1 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                      <span>{formData.targetRoles.length} Selected</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold shrink-0">
                      At Least 1 Required
                    </span>
                  )}
                </div>

                {/* CURRENT SELECTED TARGET ROLES */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800 block">
                      Your Selected Target Job Roles ({formData.targetRoles.length})
                    </label>
                    <span className="text-[11px] text-stone-500">Tap &apos;X&apos; to remove</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 min-h-[44px] p-2.5 rounded-2xl bg-stone-50 border border-stone-200">
                    {formData.targetRoles.map((role, idx) => (
                      <span 
                        key={`target-role-${role}-${idx}`} 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs font-semibold shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D84315]" />
                        <span>{role}</span>
                        <button
                          type="button"
                          onClick={() => removeRole(role, idx)}
                          className="text-stone-400 hover:text-stone-700 cursor-pointer ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {formData.targetRoles.length === 0 && (
                      <span className="text-xs text-amber-700 italic py-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>No job roles selected yet. Please pick at least one suggestion below or type your custom title.</span>
                      </span>
                    )}
                  </div>

                  {/* Add Custom Role Input */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newRoleInput}
                      onChange={e => setNewRoleInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomRole(); } }}
                      placeholder="Type custom title (e.g. Junior Analytics Engineer, AI Prompt Evaluator)..."
                      className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#D84315] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={addCustomRole}
                      className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer shrink-0"
                    >
                      Add Title
                    </button>
                  </div>
                </div>

                {/* DYNAMIC RELATED ROLE SUGGESTIONS MATRIX */}
                <div className="space-y-2.5 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D84315]" />
                      <span className="text-xs font-bold text-stone-900">
                        Suggested Job Types (Based on your tracks & work models)
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 uppercase font-mono">Click to toggle</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {dynamicSuggestedRoles.map((sRole, sIdx) => {
                      const isSelected = formData.targetRoles.includes(sRole);
                      return (
                        <button
                          key={`dyn-sug-role-${sRole}-${sIdx}`}
                          type="button"
                          onClick={() => toggleTargetRole(sRole)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#D84315] text-white shadow-2xs scale-102'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-stone-400" />}
                          <span>{sRole}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS, LOCATION & PROOF */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="text-sm font-bold text-stone-900">Your Core Skills & Proof of Work</h4>
                <p className="text-xs text-stone-500">Add technical skills and links to accelerate employer match credibility.</p>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  Experience & Seniority Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'no_experience', label: 'Beginner / 0 Yr' },
                    { id: '0_1_years', label: '0–1 Year Junior' },
                    { id: '1_2_years', label: '1–2 Years Mid' },
                    { id: 'senior', label: '3+ Years Pro' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, experienceLevel: lvl.id })}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        formData.experienceLevel === lvl.id
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Skill Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">
                    Selected Skills ({formData.skills.length})
                  </label>
                  <span className="text-[11px] text-stone-500">Click chips to toggle</span>
                </div>

                {/* Extracted Skills from Resume */}
                {detectedResumeSkills.length > 0 && (
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-[#00875A]" />
                        <span className="text-xs font-bold text-emerald-900">
                          Detected Skills from Your Resume
                        </span>
                      </div>
                      <span className="text-[10px] text-[#00875A] font-semibold">Pre-selected for matching</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedResumeSkills.map((skill, sIdx) => {
                        const isSelected = formData.skills.includes(skill);
                        return (
                          <button
                            key={`detected-skill-${skill}-${sIdx}`}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#00875A] text-white shadow-2xs'
                                : 'bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                            }`}
                          >
                            {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {dynamicSuggestedSkills.map((skill, idx) => {
                    const isSelected = formData.skills.includes(skill);
                    return (
                      <button
                        key={`skill-chip-${skill}-${idx}`}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#00875A] text-white shadow-2xs scale-102'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Skill */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                    placeholder="Add custom skill (e.g. Scikit-learn, DBT, Supabase)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#D84315] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Location & Timezone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">Country & City</label>
                  <input
                    type="text"
                    value={`${formData.city}, ${formData.country}`}
                    onChange={e => {
                      const parts = e.target.value.split(',');
                      setFormData({ 
                        ...formData, 
                        city: parts[0]?.trim() || '', 
                        country: parts[1]?.trim() || 'Nigeria' 
                      });
                    }}
                    placeholder="Lagos, Nigeria"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#D84315] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">Timezone & Remote Hours</label>
                  <select
                    value={formData.timezone}
                    onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#D84315] focus:bg-white"
                  >
                    <option value="WAT (UTC+1)">WAT (UTC+1) — Lagos, Abuja (Prime EU overlap)</option>
                    <option value="GMT (UTC+0)">GMT (UTC+0) — Accra, London</option>
                    <option value="EAT (UTC+3)">EAT (UTC+3) — Nairobi, Addis Ababa</option>
                    <option value="Worldwide Any">Flexible Any Timezone</option>
                  </select>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-stone-800 block">
                  Proof of Work & Professional Links
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="relative">
                    <Github className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="GitHub URL"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#D84315] focus:bg-white"
                    />
                  </div>

                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-[#0077B5] absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="LinkedIn URL"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#D84315] focus:bg-white"
                    />
                  </div>

                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="Portfolio / Projects"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#D84315] focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AI READINESS SCORE & LAUNCH */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              {/* Score Display Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FBF9F4] to-white border border-[#EDE8DF] space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#00875A]/10 border border-[#00875A]/20 flex items-center justify-center text-[#00875A] font-black text-lg font-mono">
                      {readinessScore}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-stone-900">Career Readiness Score</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          High Match Potential
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        {formData.name || 'Candidate'} • {formData.targetRoles[0] || 'Remote Candidate'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-mono block">Target Comp</span>
                    <span className="text-xs font-bold text-stone-900 font-mono">${formData.preferredSalaryMin.toLocaleString()}/mo</span>
                  </div>
                </div>

                {/* Match Summary Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block mb-0.5 font-medium">Work Streams</span>
                    <span className="font-bold text-stone-900">{selectedWorkTypes.length} models selected</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block mb-0.5 font-medium">Target Roles</span>
                    <span className="font-bold text-[#00875A]">{formData.targetRoles.length} verified titles</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 block mb-0.5 font-medium">Location Eligibility</span>
                    <span className="font-bold text-[#D84315]">{formData.city}, {formData.country}</span>
                  </div>
                </div>
              </div>

              {/* Key High-Impact Recommendations */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider font-mono">
                  Personalized AI Strategy
                </span>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Tailored For You Feed is Ready</p>
                      <p className="text-[11px] text-emerald-800/80">
                        We indexed 40+ verified remote jobs matching your &quot;{formData.targetRoles[0] || 'Technical'}&quot; target track with confirmed payouts to Nigeria.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Instant AI Job Intel on Every Card</p>
                      <p className="text-[11px] text-amber-800/80">
                        Use the &quot;AI Intel & Q&A&quot; button to audit role safety, candidate match gaps, and prepare custom interview responses in 30 seconds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#FBF9F4] border-t border-stone-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer text-white ${
                step === 2 && !isStep2Valid
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#D84315] hover:bg-[#BF360C]'
              }`}
            >
              <span>
                {step === 2 && !isStep2Valid 
                  ? 'Submit Resume & Roles to Continue' 
                  : `Continue to Step ${step + 1}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleComplete('discover')}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Onboarding & Unlock Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
