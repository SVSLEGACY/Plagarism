import React from 'react';
import { 
  Check, 
  Palette, 
  Search, 
  MessageSquare, 
  Globe 
} from 'lucide-react';

export type CategoryTab = 
  | 'grammar-check' 
  | 'plagiarism-checker' 
  | 'paraphrasing-tool' 
  | 'ai-detector' 
  | 'ai-humanizer' 
  | 'ai-chat' 
  | 'translator';

interface SecondaryTabBarProps {
  activeTab: CategoryTab;
  onSelectTab: (tab: CategoryTab) => void;
}

export const SecondaryTabBar: React.FC<SecondaryTabBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: Array<{
    id: CategoryTab;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'grammar-check',
      label: 'Grammar Check',
      icon: (
        <span className="w-4 h-4 rounded-full bg-[#11A683] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
      ),
    },
    {
      id: 'plagiarism-checker',
      label: 'Plagiarism Checker',
      icon: (
        <span className="text-[#0E7058] font-serif text-base leading-none font-black shrink-0 select-none">
          ❝
        </span>
      ),
    },
    {
      id: 'paraphrasing-tool',
      label: 'Paraphrasing Tool',
      icon: (
        <span className="text-amber-600 shrink-0 text-xs">
          <Palette className="w-3.5 h-3.5 text-amber-500 fill-amber-100" />
        </span>
      ),
    },
    {
      id: 'ai-detector',
      label: 'AI Detector',
      icon: (
        <span className="text-teal-600 shrink-0">
          <Search className="w-3.5 h-3.5 text-teal-600 stroke-[2.5]" />
        </span>
      ),
    },
    {
      id: 'ai-humanizer',
      label: 'AI Humanizer',
      icon: (
        <span className="w-4 h-4 rounded-full bg-[#D9383A] text-white flex items-center justify-center text-[8px] font-black shrink-0 tracking-tighter">
          HU
        </span>
      ),
    },
    {
      id: 'ai-chat',
      label: 'AI Chat',
      icon: (
        <span className="text-[#0E7058] shrink-0">
          <MessageSquare className="w-3.5 h-3.5 text-[#0E7058] fill-[#E6F4F1]" />
        </span>
      ),
    },
    {
      id: 'translator',
      label: 'Translator',
      icon: (
        <span className="text-sky-600 shrink-0">
          <Globe className="w-3.5 h-3.5 text-sky-600" />
        </span>
      ),
    },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center gap-2 py-3 px-2 sm:px-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer group ${
                  isActive
                    ? 'text-[#0E7058] font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>

                {/* Active Indicator Underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0E7058] rounded-t-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
