import React, { useMemo } from 'react';
import { getCurrentDateInfo } from '../utils/dateUtils';

interface HeaderProps {
  currentTab: 'dashboard' | 'rates' | 'global' | 'news';
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  onRefresh,
  isRefreshing,
}) => {
  const dateInfo = useMemo(() => getCurrentDateInfo(), []);

  const getSubheaderTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return {
          title: 'دولار تراك',
          subtitle: `DollarTrack • ${dateInfo.fullArabicDate}`,
          isDollarTrack: true,
        };
      case 'rates':
        return {
          title: 'دينار و دولار',
          subtitle: 'أسعار الصرف والعملات والمصارف',
          isDollarTrack: false,
        };
      case 'global':
        return {
          title: 'دينار و دولار',
          subtitle: 'Global Economy & Macro',
          isDollarTrack: false,
        };
      case 'news':
        return {
          title: 'دينار و دولار',
          subtitle: `الأخبار والتغطية المباشرة • ${dateInfo.fullArabicDate}`,
          isDollarTrack: false,
        };
      default:
        return {
          title: 'دينار و دولار',
          subtitle: 'أسعار الصرف والعملات العالمية',
          isDollarTrack: false,
        };
    }
  };

  const info = getSubheaderTitle();

  return (
    <header className="fixed top-0 w-full z-40 bg-[#f7f9fb]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe border-b border-[#eceef0]/80">
      <div className="h-16 px-4 md:px-6 max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          {info.isDollarTrack ? (
            <div className="w-9 h-9 rounded-xl bg-[#131a33] flex items-center justify-center text-[#6ffbbe] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
          ) : (
            <img
              alt="Financial Currency Tracker Logo"
              className="h-8 w-auto object-contain drop-shadow-xs"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UsSvWKo1lI1YXR19Q3Yu8ejPi_uTyR6ONcDTiS_XpqcDkHgKDPsKdf0SqWRcCoBaiaQFz-vLQqKrWOdC1JIE1_7F8AybDV9FMkKtY6GlaW4L3h2zLxxtPws7mdD1dTvfEbKn2d7xk5Dylkxht4SIRSmxvD6qkcqMUn7UPrEZdGFqKEsf4IOGvNByb2bopS3pYlnZ76rsUfPHFhuCQqpdGQQjrKOUNk_oxSa75-dM7v8zx4PlmtEILAow"
            />
          )}

          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-[#191c1e] leading-tight tracking-tight">
              {info.title}
            </span>
            <span className="text-[11px] text-[#45464d] font-medium leading-none mt-0.5">
              {info.subtitle}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Refresh Action */}
          <button
            aria-label="تحديث يدوي فوري"
            onClick={onRefresh}
            title="تحديث البيانات لحظياً"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#45464d] hover:text-[#191c1e] hover:bg-[#eceef0] active:scale-95 transition-all relative"
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[20px] transition-transform duration-500 ${
                isRefreshing ? 'rotate-180 text-[#006c49]' : ''
              }`}
            >
              sync
            </span>
          </button>

          {/* Notifications Button */}
          <button
            aria-label="التنبيهات الفورية"
            onClick={onOpenNotifications}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#45464d] hover:text-[#191c1e] hover:bg-[#eceef0] active:scale-95 transition-all relative"
            type="button"
          >
            <span className="material-symbols-outlined text-[21px]">
              {unreadCount > 0 ? 'notifications_active' : 'notifications'}
            </span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#006c49] ring-2 ring-[#f7f9fb] animate-pulse"></span>
            )}
          </button>

          {/* User Profile Button */}
          <button
            aria-label="الملف الشخصي والتفضيلات"
            onClick={onOpenProfile}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#131a33]/20 transition-all ml-0.5"
            type="button"
          >
            <img
              alt="User Profile"
              className="w-8 h-8 rounded-full object-cover shadow-[0_1px_4px_rgba(0,0,0,0.12)] border border-white"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRWPTZvP1Hw6BpXRxFrEeST9Ek2I-Ey4BkwmX9jcOVy59W06Eex1N1ExSdFkpi3TGUGvtsymCfKq7RHbklfTmgRVmNN0T-s_WCNmQqYXZwq2Rw117nJvilGeVKDZ08uEEPfU6-IhCPSrgbWbQUP73Vy1nBCXhzpNrwoR9oFaxSzfJR3F4Vrm-n-NfeMzQuHqhU453z7A63R6lYuaOoQXpQeNFK0aun03UrXsbmjCP8ROP6ydONIeNP"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
