import React, { useState } from 'react';
import { CurrencyItem, PriceAlert } from '../types/finance';

interface PriceAlertModalProps {
  initialCurrency?: CurrencyItem;
  currencies: CurrencyItem[];
  alerts: PriceAlert[];
  onClose: () => void;
  onSaveAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => void;
  onDeleteAlert: (id: string) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  initialCurrency,
  currencies,
  alerts,
  onClose,
  onSaveAlert,
  onDeleteAlert,
}) => {
  const [selectedCode, setSelectedCode] = useState<string>(
    initialCurrency?.code || 'USD / IQD'
  );
  const [targetPrice, setTargetPrice] = useState<number>(
    initialCurrency
      ? (initialCurrency.buyRate + initialCurrency.sellRate) / 2
      : 1490
  );
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const selectedCurr = currencies.find((c) => c.code === selectedCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || targetPrice <= 0) return;
    onSaveAlert({
      currencyCode: selectedCode,
      currencyName: selectedCurr?.name || selectedCode,
      targetPrice,
      condition,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp border border-[#eceef0]">
        <div className="p-4 flex items-center justify-between border-b border-[#eceef0] bg-[#f7f9fb]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#131a33] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[19px]">add_alert</span>
            </span>
            <div className="flex flex-col">
              <h3 className="text-[15px] font-bold text-[#191c1e]">ضبط تنبيه فوري للأسعار</h3>
              <p className="text-[11px] text-[#45464d]">
                إشعار فوري عند وصول السعر للهدف المحدد
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:bg-[#e0e3e5]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Select Currency */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#191c1e]">اختر العملة أو السلعة</label>
            <select
              value={selectedCode}
              onChange={(e) => {
                const newCode = e.target.value;
                setSelectedCode(newCode);
                const item = currencies.find((c) => c.code === newCode);
                if (item) {
                  setTargetPrice((item.buyRate + item.sellRate) / 2);
                }
              }}
              className="w-full bg-[#f2f4f6] border border-[#c6c6ce]/60 rounded-xl px-3 py-2.5 text-[14px] font-bold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#131a33]/20"
            >
              {currencies.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.flag} {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#191c1e]">شرط التنبيه</label>
            <div className="grid grid-cols-2 gap-2 bg-[#f2f4f6] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setCondition('above')}
                className={`py-2 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-1 ${
                  condition === 'above'
                    ? 'bg-[#131a33] text-white shadow-xs'
                    : 'text-[#45464d] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                إذا ارتفع عن السعر
              </button>
              <button
                type="button"
                onClick={() => setCondition('below')}
                className={`py-2 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-1 ${
                  condition === 'below'
                    ? 'bg-[#131a33] text-white shadow-xs'
                    : 'text-[#45464d] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                إذا انخفض عن السعر
              </button>
            </div>
          </div>

          {/* Target Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#191c1e]">السعر المستهدف</label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#f2f4f6] border border-[#c6c6ce]/60 rounded-xl px-3 py-2.5 text-[18px] font-bold text-[#191c1e] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#131a33]/20"
                placeholder="0.00"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#006c49] hover:bg-[#005236] text-white text-[13px] font-bold rounded-xl active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">notifications_active</span>
            <span>تفعيل التنبيه الآن</span>
          </button>

          {/* Existing Alerts Section */}
          {alerts.length > 0 && (
            <div className="mt-2 pt-3 border-t border-[#eceef0] flex flex-col gap-2">
              <span className="text-[12px] font-bold text-[#191c1e]">
                التنبيهات المفعلة حالياً ({alerts.length})
              </span>
              <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-2.5 rounded-xl bg-[#f2f4f6] flex items-center justify-between text-[12px]"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-[#191c1e]">{alt.currencyCode}</span>
                      <span className="text-[10px] text-[#45464d]">
                        {alt.condition === 'above' ? 'أعلى من' : 'أقل من'}{' '}
                        <strong className="text-[#006c49] tabular-nums">
                          {alt.targetPrice.toLocaleString('en-US')}
                        </strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteAlert(alt.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#ef4444] hover:bg-[#ffdad6]"
                      title="حذف التنبيه"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
