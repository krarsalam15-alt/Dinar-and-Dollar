import React from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, icon?: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp border border-[#eceef0]">
        <div className="p-4 flex items-center justify-between border-b border-[#eceef0] bg-[#f7f9fb]">
          <h3 className="text-[15px] font-bold text-[#191c1e]">الملف الشخصي والتفضيلات</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:bg-[#e0e3e5]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* User info card */}
          <div className="flex items-center gap-3.5 bg-[#f2f4f6] p-3.5 rounded-2xl border border-[#c6c6ce]/30">
            <img
              alt="User"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRWPTZvP1Hw6BpXRxFrEeST9Ek2I-Ey4BkwmX9jcOVy59W06Eex1N1ExSdFkpi3TGUGvtsymCfKq7RHbklfTmgRVmNN0T-s_WCNmQqYXZwq2Rw117nJvilGeVKDZ08uEEPfU6-IhCPSrgbWbQUP73Vy1nBCXhzpNrwoR9oFaxSzfJR3F4Vrm-n-NfeMzQuHqhU453z7A63R6lYuaOoQXpQeNFK0aun03UrXsbmjCP8ROP6ydONIeNP"
            />
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#191c1e]">كرار سلام (Krar Salam)</span>
              <span className="text-[11px] text-[#45464d]">krarsalam15@gmail.com</span>
              <span className="text-[10px] text-[#006c49] font-bold mt-0.5">عضو مستثمر مميز • Pro</span>
            </div>
          </div>

          {/* Preferences list */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[12px] font-bold text-[#191c1e]">إعدادات العرض والتنبيهات</span>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#eceef0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006c49]">
                  currency_exchange
                </span>
                <span className="text-[13px] font-medium text-[#191c1e]">العملة الأساسية للحساب</span>
              </div>
              <span className="text-[12px] font-bold text-[#131a33] bg-[#eceef0] px-2.5 py-0.5 rounded-lg">
                USD / IQD
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#eceef0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006c49]">
                  notifications
                </span>
                <span className="text-[13px] font-medium text-[#191c1e]">التنبيهات اللحظية للأسعار</span>
              </div>
              <span className="text-[11px] font-bold text-[#006c49] bg-[#6ffbbe]/25 px-2 py-0.5 rounded-full">
                مفعل
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#eceef0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006c49]">
                  headphones
                </span>
                <span className="text-[13px] font-medium text-[#191c1e]">تشغيل البودكاست التلقائي</span>
              </div>
              <span className="text-[11px] font-bold text-[#006c49] bg-[#6ffbbe]/25 px-2 py-0.5 rounded-full">
                متاح
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              showToast('تم حفظ التفضيلات بنجاح', 'check_circle');
              onClose();
            }}
            className="w-full py-3 bg-[#131a33] text-white text-[13px] font-bold rounded-xl active:scale-[0.98] transition-all mt-2"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
