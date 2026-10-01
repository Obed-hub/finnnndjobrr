import { 
  Code2, 
  Bot, 
  Palette, 
  Server, 
  Briefcase, 
  Globe, 
  Zap, 
  Keyboard, 
  FileText,
  ShieldCheck
} from 'lucide-react';

export interface CategoryTrack {
  id: string;
  title: string;
  searchQuery: string;
  categoryKey: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  liveCount: number;
}

export const REMOTE_CATEGORIES: CategoryTrack[] = [
  {
    id: 'ai',
    title: 'AI & RLHF Evaluation',
    searchQuery: 'AI',
    categoryKey: 'ai',
    icon: Bot,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    liveCount: 18
  },
  {
    id: 'engineering',
    title: 'Software Engineering',
    searchQuery: 'Software',
    categoryKey: 'engineering',
    icon: Code2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-[#00875A]',
    liveCount: 24
  },
  {
    id: 'data',
    title: 'Data & Analytics',
    searchQuery: 'Data',
    categoryKey: 'data',
    icon: Server,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    liveCount: 16
  },
  {
    id: 'design',
    title: 'Product & UI/UX Design',
    searchQuery: 'Design',
    categoryKey: 'design',
    icon: Palette,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    liveCount: 12
  },
  {
    id: 'support',
    title: 'Customer Operations',
    searchQuery: 'Support',
    categoryKey: 'support',
    icon: Briefcase,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    liveCount: 15
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & InfoSec',
    searchQuery: 'Security',
    categoryKey: 'cybersecurity',
    icon: ShieldCheck,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    liveCount: 14
  },
  {
    id: 'bounties',
    title: 'Web3 & Bounties',
    searchQuery: 'Bounty',
    categoryKey: 'all',
    icon: Zap,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    liveCount: 9
  }
];
