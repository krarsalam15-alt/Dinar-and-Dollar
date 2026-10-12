import React, { useState } from 'react';
import { CurrencyItem } from '../types/finance';

interface QuickConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencies: CurrencyItem[];
  onGoToFullConverter: () => void;
}

export const QuickConvertModal: React.FC<QuickConvertModalProps> = ({
  isOpen,
  onClose,
  currencies,
  onGoToFullConverter,
}) => {
  const [amount, setAmount] = useState<number>(100);
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('IQD');

  if (!isOpen) return null;

  const rates: Record<string, number> = {
    USD: 1.0,
    IQD: 0.00067114,
    RUB: 0.0102,
    SAR: 0.26659,
    AED: 0.27229,
    EGP: 0.02055,
    KWD: 3.259,
    EUR: 1.0845,
    TRY: 0.02923,
  };

  const fromRate = rates[fromCode] || 1;
  const toRate = rates[toCode] || 1;

  // RUB -> IQD custom accuracy
  let total = 0;
  if (fromCode === 'RUB' && toCode === 'IQD') {
    total = amount * 14.95;
  } else if (fromCode === 'IQD' && toCode === 'RUB') {
    total = amount / 14.95;
  } else {
    total = amount * (fromRate / toRate);
  }

  const resultFormatted =
    total >= 100
      ? Math.round(total).toLocaleString('en-US')
      : total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp border border-[#eceef0]">
        <div className="p-4 flex items-center justify-between border-b border-[#eceef0] bg-[#f7f9fb]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#131a33] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[19px]">swap_horizontal_circle</span>
            </span>
            <h3 className="text-[15px] font-bold text-[#191c1e]">التحويل السريع للعملات</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:bg-[#e0e3e5]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#45464d]">المبلغ المطلوب تحويله</label>
            <div className="flex items-center gap-2 bg-[#f2f4f6] p-3 rounded-xl border border-[#c6c6ce]/40">
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent text-[22px] font-bold tabular-nums text-[#191c1e] focus:outline-none"
              />
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="bg-white border border-[#c6c6ce]/60 rounded-lg px-2.5 py-1.5 text-[14px] font-bold text-[#191c1e]"
              >
                {Object.keys(rates).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center -my-2 z-10">
            <button
              type="button"
              onClick={handleSwap}
              className="w-9 h-9 rounded-full bg-[#131a33] text-white flex items-center justify-center shadow-md active:scale-90 border-2 border-white"
            >
              <span className="material-symbols-outlined text-[19px]">swap_vert</span>
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#45464d]">النتيجة المقابلة</label>
            <div className="flex items-center justify-between bg-[#f2f4f6] p-3 rounded-xl border border-[#c6c6ce]/40">
              <span className="text-[22px] font-extrabold text-[#006c49] tabular-nums">
                {resultFormatted}
              </span>
              <select
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                className="bg-white border border-[#c6c6ce]/60 rounded-lg px-2.5 py-1.5 text-[14px] font-bold text-[#191c1e]"
              >
                {Object.keys(rates).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToFullConverter();
              }}
              className="flex-1 py-3 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] text-[13px] font-bold rounded-xl active:scale-[0.98] transition-all"
            >
              فتح المحول الشامل
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#006c49] text-white text-[13px] font-bold rounded-xl active:scale-[0.98] transition-all"
            >
              تم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
