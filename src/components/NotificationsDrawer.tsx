import React from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  isRead: boolean;
  type: 'rate' | 'news' | 'market';
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllAsRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center sm:justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full sm:w-96 h-full max-h-screen bg-white shadow-2xl flex flex-col overflow-hidden animate-slideLeft border-l border-[#eceef0]">
        <div className="p-4 flex items-center justify-between border-b border-[#eceef0] bg-[#f7f9fb]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#006c49]">
              notifications_active
            </span>
            <h3 className="text-[15px] font-bold text-[#191c1e]">التنبيهات المباشرة</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:bg-[#e0e3e5]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-3 bg-[#eceef0]/60 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[#006c49] font-bold hover:underline"
          >
            تحديد الكل كمقروء
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="text-[#ef4444] font-medium hover:underline"
          >
            مسح الكل
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-[#76767e] gap-2">
              <span className="material-symbols-outlined text-4xl">notifications_off</span>
              <p className="text-[13px] font-medium">لا توجد تنبيهات جديدة في الوقت الحالي</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all ${
                  item.isRead
                    ? 'bg-white border-[#eceef0]'
                    : 'bg-[#6ffbbe]/10 border-[#006c49]/30 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-bold text-[#191c1e]">{item.title}</span>
                  <span className="text-[10px] text-[#76767e]">{item.timeAgo}</span>
                </div>
                <p className="text-[12px] text-[#45464d] leading-relaxed">{item.body}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
