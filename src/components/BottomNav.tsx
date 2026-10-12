import React from 'react';

export type TabType = 'dashboard' | 'rates' | 'global' | 'news';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onQuickConvert: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onQuickConvert,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'الرئيسة',
      icon: 'dashboard',
    },
    {
      id: 'rates' as TabType,
      label: 'أسعار الصرف',
      icon: 'currency_exchange',
    },
    {
      id: 'quick-convert',
      label: 'تحويل',
      icon: 'swap_horizontal_circle',
      isAction: true,
    },
    {
      id: 'global' as TabType,
      label: 'الاقتصاد العالمي',
      icon: 'monitoring',
    },
    {
      id: 'news' as TabType,
      label: 'الأخبار والتحليلات',
      icon: 'newspaper',
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#f7f9fb]/92 backdrop-blur-xl border-t border-[#eceef0] shadow-[0_-4px_24px_rgba(11,19,43,0.06)]">
      <div className="max-w-md mx-auto h-16 px-2 flex items-center justify-around">
        {tabs.map((tab) => {
          if (tab.isAction) {
            return (
              <button
                key="action-convert"
                onClick={onQuickConvert}
                aria-label="محول العملات السريع"
                className="flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 text-[#45464d] hover:text-[#006c49] active:scale-90 transition-all group"
                type="button"
              >
                <div className="w-8 h-8 rounded-full bg-[#131a33] text-[#6ffbbe] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[19px]">swap_vert</span>
                </div>
                <span className="text-[10px] font-semibold tracking-tight text-[#45464d] group-hover:text-[#006c49]">
                  تحويل
                </span>
              </button>
            );
          }

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id as TabType)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[58px] h-12 gap-0.5 transition-all relative ${
                isActive
                  ? 'text-[#131a33] font-bold'
                  : 'text-[#45464d] hover:text-[#191c1e] font-medium'
              }`}
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[23px] transition-transform ${
                  isActive ? 'scale-110 text-[#006c49]' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[11px] leading-tight transition-colors ${
                  isActive ? 'text-[#131a33] font-bold' : 'text-[#45464d]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-6 h-0.5 bg-[#006c49] rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
