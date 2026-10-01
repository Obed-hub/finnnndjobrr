import React from 'react';
import { 
  Compass, 
  Bot, 
  Zap,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isNew?: boolean;
  count?: number | string;
}

export const MobileBottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab
  } = useApp();

  const primaryMobileTabs: MobileTab[] = [
    { id: 'discover', label: 'Find Jobs', icon: Compass },
    { id: 'earn', label: 'Earn ($)', icon: DollarSign, isNew: true },
    { id: 'aiwork', label: 'AI Gigs', icon: Bot },
    { id: 'bounties', label: 'Bounties', icon: Zap },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EDE8DF] px-3 py-2 xl:hidden shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {primaryMobileTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] py-1.5 px-3 rounded-2xl transition-all relative touch-manipulation active:scale-95 ${
                isActive ? 'text-[#D84315] font-black' : 'text-stone-600 hover:text-black font-bold'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-115 stroke-[2.75]' : 'stroke-2'}`} />
                {tab.count !== undefined && Boolean(tab.count) && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#D84315] text-white text-[10px] font-black rounded-full px-1.5 py-0.2 min-w-[18px] text-center border-2 border-white shadow-xs">
                    {tab.count}
                  </span>
                )}
                {tab.isNew && (
                  <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-[#D84315] ring-2 ring-white" />
                )}
              </div>
              <span className={`text-xs mt-1 truncate ${isActive ? 'font-black text-[#D84315]' : 'font-bold text-stone-700'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D84315] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
