import React from 'react';

interface ToastProps {
  message: string | null;
  iconName?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, iconName = 'check_circle' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#131a33] text-white px-4 py-2.5 rounded-full text-[13px] font-bold shadow-2xl transition-all duration-300 flex items-center gap-2 border border-white/10 animate-bounce">
      <span className="material-symbols-outlined text-[19px] text-[#6ffbbe]">
        {iconName}
      </span>
      <span>{message}</span>
    </div>
  );
};
