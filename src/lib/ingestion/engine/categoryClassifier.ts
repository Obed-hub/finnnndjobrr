/**
 * Category & Subcategory Classification Engine
 * Maps external categories, titles, tags, and descriptions into standard Findjobber taxonomy.
 */

export interface ClassificationResult {
  category: string;
  subcategory: string;
  industry: string;
  atsKeywords: string[];
}

export function classifyJobCategory(title: string, tags: string[] = [], description = ''): ClassificationResult {
  const combined = (title + ' ' + tags.join(' ') + ' ' + description.slice(0, 1000)).toLowerCase();

  // 1. Web3 / Crypto / Blockchain
  if (combined.match(/(solidity|smart contract|evm|web3|blockchain|ethereum|solana|defi|nft|tokenomics|foundry|hardhat|rust.*contract)/)) {
    let sub = 'Smart Contracts & Web3';
    if (combined.includes('defi')) sub = 'DeFi Protocols';
    else if (combined.includes('solana') || combined.includes('rust')) sub = 'Solana & Rust Programs';
    else if (combined.includes('audit') || combined.includes('security')) sub = 'Smart Contract Security';

    return {
      category: 'Software Engineering',
      subcategory: sub,
      industry: 'Web3 / Crypto',
      atsKeywords: ['Solidity', 'Web3', 'EVM', 'Smart Contracts', 'DeFi', 'Foundry', 'Git']
    };
  }

  // 2. AI & Data Annotation / Training
  if (combined.match(/(ai trainer|data annotat|rlhf|model eval|prompt engineer|llm eval|ai rater|search quality|annotation|data labeling)/)) {
    return {
      category: 'AI & Data Annotation',
      subcategory: 'AI Training & Evaluation',
      industry: 'Artificial Intelligence',
      atsKeywords: ['RLHF', 'AI Evaluation', 'Prompt Engineering', 'LLM Benchmarking', 'Data Quality']
    };
  }

  // 3. Data & Analytics / Machine Learning
  if (combined.match(/(data analyst|data engineer|data science|bi developer|tableau|power bi|sql|pandas|machine learning|deep learning|nlp|mlops|bigquery|snowflake)/)) {
    let sub = 'Data Analytics';
    if (combined.includes('engineer') || combined.includes('pipeline')) sub = 'Data Engineering & Pipelines';
    else if (combined.includes('machine learning') || combined.includes('mlops')) sub = 'Machine Learning & MLOps';

    return {
      category: 'Data & AI',
      subcategory: sub,
      industry: 'Technology',
      atsKeywords: ['SQL', 'Python', 'Data Pipelines', 'ETL', 'Analytics', 'Dashboards']
    };
  }

  // 4. Software Engineering (Frontend, Backend, Full-Stack, Mobile, DevOps, QA)
  if (combined.match(/(developer|engineer|software|full stack|backend|frontend|react|node|python|golang|rust|typescript|javascript|mobile|ios|android|devops|cloud|kubernetes|qa |sre)/)) {
    let sub = 'Full-Stack Development';
    if (combined.includes('frontend') || combined.includes('react') || combined.includes('vue') || combined.includes('next.js')) sub = 'Frontend Engineering';
    else if (combined.includes('backend') || combined.includes('node') || combined.includes('golang') || combined.includes('python')) sub = 'Backend Engineering';
    else if (combined.includes('devops') || combined.includes('cloud') || combined.includes('kubernetes') || combined.includes('sre')) sub = 'DevOps & Cloud Infrastructure';
    else if (combined.includes('mobile') || combined.includes('ios') || combined.includes('android') || combined.includes('flutter')) sub = 'Mobile App Development';
    else if (combined.includes('qa') || combined.includes('test') || combined.includes('automation')) sub = 'Quality Assurance & Testing';

    return {
      category: 'Software Engineering',
      subcategory: sub,
      industry: 'Software & Technology',
      atsKeywords: ['TypeScript', 'Git', 'Agile', 'CI/CD', 'API Design', 'System Architecture']
    };
  }

  // 5. Product & UI/UX Design
  if (combined.match(/(product manager|ui\/ux|ux designer|ui designer|product designer|figma|graphic designer|creative director)/)) {
    return {
      category: 'Product & Design',
      subcategory: combined.includes('manager') ? 'Product Management' : 'UI/UX & Product Design',
      industry: 'Design & Product',
      atsKeywords: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Product Strategy']
    };
  }

  // 6. Operations & Customer Support
  if (combined.match(/(customer support|customer success|operations|virtual assistant|technical support|help desk|account manager)/)) {
    return {
      category: 'Operations & Support',
      subcategory: 'Customer Success & Support',
      industry: 'Customer Operations',
      atsKeywords: ['Zendesk', 'Customer Success', 'Troubleshooting', 'Communication', 'CRM']
    };
  }

  // 7. Writing & Marketing
  if (combined.match(/(writer|copywriter|technical writer|content creator|seo|marketing|growth|community|social media)/)) {
    return {
      category: 'Writing & Content',
      subcategory: combined.includes('technical') ? 'Technical Writing' : 'Content & Growth Marketing',
      industry: 'Content & Media',
      atsKeywords: ['Content Strategy', 'SEO', 'Technical Documentation', 'Copywriting', 'Research']
    };
  }

  return {
    category: 'Software Engineering',
    subcategory: 'General Tech & Operations',
    industry: 'Technology',
    atsKeywords: ['Remote Workflow', 'Async Collaboration', 'Communication', 'Documentation']
  };
}
