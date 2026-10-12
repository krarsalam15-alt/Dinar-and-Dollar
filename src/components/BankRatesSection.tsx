import React, { useState } from 'react';
import { BankRate } from '../types/finance';

interface BankRatesSectionProps {
  bankRates: BankRate[];
  onOpenAlertModal: (currencyCode: string) => void;
  currentDateBadge: string;
}

export const BankRatesSection: React.FC<BankRatesSectionProps> = ({
  bankRates,
  onOpenAlertModal,
  currentDateBadge,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'iraq-bourses' | 'iraq-banks' | 'arab-banks'>('all');
  const [searchBank, setSearchBank] = useState<string>('');

  const filteredBanks = bankRates.filter((bank) => {
    const matchesCategory =
      selectedCategory === 'all' || bank.category === selectedCategory;
    const q = searchBank.trim().toLowerCase();
    const matchesQuery =
      !q ||
      bank.bankName.toLowerCase().includes(q) ||
      bank.bankCode.toLowerCase().includes(q) ||
      bank.branchLocation.toLowerCase().includes(q) ||
      bank.feeNote?.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Header with Connection Indicator */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#131a33] text-[#6ffbbe] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[19px]">account_balance</span>
            </span>
            <div>
              <h2 className="text-[15px] text-[#191c1e] font-bold">
                أسعار الصرف في المصارف والبورصات
              </h2>
              <p className="text-[11px] text-[#45464d]">
                ربط مباشر مع البنك المركزي والبورصات النقدية والمصارف الحكومية والخاصة
              </p>
            </div>
          </div>
          <span className="text-[11px] text-[#006c49] bg-[#6ffbbe]/25 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#006c49] animate-ping"></span>
            12 جهة متصلة
          </span>
        </div>

        {/* Date Context Bar */}
        <div className="bg-[#eceef0]/70 px-3 py-1.5 rounded-xl flex items-center justify-between text-[11px] text-[#45464d] mt-1">
          <span className="font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#006c49]">sync</span>
            تحديث تلقائي لحظة بلحظة:
          </span>
          <span className="font-bold text-[#191c1e] tabular-nums">{currentDateBadge}</span>
        </div>
      </div>

      {/* Highlights: Best Rates Banner */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gradient-to-br from-[#131a33] to-[#1c2541] text-white p-3 rounded-2xl shadow-sm border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6ffbbe] font-bold">السوق الموازي (الكفاح/الحارثية)</span>
            <span className="material-symbols-outlined text-[16px] text-[#6ffbbe]">trending_up</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-extrabold tabular-nums">1,490</span>
              <span className="text-[10px] text-[#bec5e5]">د.ع / $</span>
            </div>
            <span className="text-[10px] text-[#e0e3e5] block mt-0.5">شراء: 1,485 • بيع: 1,495</span>
          </div>
          <div className="text-[9px] text-[#7b83a0] pt-1 border-t border-white/10 flex items-center justify-between">
            <span>فارق 10 دنانير</span>
            <span className="text-[#6ffbbe] font-semibold">نشط الآن</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#eceef0] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#006c49] font-bold">البنك المركزي العراقي (CBI)</span>
            <span className="material-symbols-outlined text-[16px] text-[#006c49]">verified</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-extrabold text-[#191c1e] tabular-nums">1,320</span>
              <span className="text-[10px] text-[#45464d]">د.ع / $</span>
            </div>
            <span className="text-[10px] text-[#45464d] block mt-0.5">شراء: 1,310 • بيع: 1,320</span>
          </div>
          <div className="text-[9px] text-[#76767e] pt-1 border-t border-[#eceef0] flex items-center justify-between">
            <span>المنصة والمسافرين</span>
            <span className="text-[#006c49] font-semibold">السعر الرسمي</span>
          </div>
        </div>
      </div>

      {/* Filter Category Chips & Search */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === 'all'
                ? 'bg-[#131a33] text-white'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            الكل ({bankRates.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('iraq-bourses')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'iraq-bourses'
                ? 'bg-[#131a33] text-white'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            البورصات والأسواق (بغداد، أربيل، البصرة)
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('iraq-banks')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'iraq-banks'
                ? 'bg-[#131a33] text-white'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            المصارف العراقية (المركزي، الرافدين، TBI)
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('arab-banks')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'arab-banks'
                ? 'bg-[#131a33] text-white'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            المصارف المركزية العربية
          </button>
        </div>

        {/* Search input for banks */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#76767e]">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </div>
          <input
            type="text"
            value={searchBank}
            onChange={(e) => setSearchBank(e.target.value)}
            placeholder="ابحث عن المصرف أو البورصة (مثال: الكفاح، الرافدين، أربيل)..."
            className="w-full bg-white rounded-xl py-2 pr-9 pl-3 text-[#191c1e] placeholder:text-[#76767e] text-[12px] shadow-xs border border-[#c6c6ce]/50 focus:outline-none focus:ring-2 focus:ring-[#131a33]/20"
          />
        </div>
      </div>

      {/* Bank & Bourse List */}
      <div className="flex flex-col gap-2">
        {filteredBanks.map((bank) => {
          const isOfficial = bank.category === 'iraq-banks';
          const isBourse = bank.category === 'iraq-bourses';

          return (
            <div
              key={bank.id}
              onClick={() => onOpenAlertModal(bank.currencyPair)}
              className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all border border-[#eceef0] cursor-pointer flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#eceef0] flex items-center justify-center text-[19px] shrink-0 font-bold">
                    {isBourse ? '🏛️' : isOfficial ? '🏦' : bank.flag}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] text-[#191c1e] font-bold leading-tight">
                        {bank.bankName}
                      </span>
                      {bank.isBestBuy && (
                        <span className="bg-[#6ffbbe]/25 text-[#006c49] text-[9px] font-bold px-1.5 py-0.2 rounded">
                          الرسمي
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#45464d] font-medium">
                      {bank.branchLocation}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#006c49] bg-[#6ffbbe]/15 px-2 py-0.5 rounded-full font-bold">
                    {bank.statusText}
                  </span>
                  <span className="text-[10px] text-[#76767e] mt-0.5">{bank.lastUpdated}</span>
                </div>
              </div>

              {/* Price Details Grid */}
              <div className="bg-[#f2f4f6] rounded-xl p-2.5 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="flex flex-col">
                  <span className="text-[#76767e] text-[10px]">شراء (سعر الإيداع)</span>
                  <span className="text-[14px] font-extrabold text-[#191c1e] tabular-nums mt-0.5">
                    {bank.buyRate >= 1000
                      ? bank.buyRate.toLocaleString('en-US')
                      : bank.buyRate}
                  </span>
                </div>

                <div className="flex flex-col border-x border-[#c6c6ce]/40 px-1">
                  <span className="text-[#76767e] text-[10px]">بيع (سعر الصرف)</span>
                  <span className="text-[14px] font-extrabold text-[#006c49] tabular-nums mt-0.5">
                    {bank.sellRate >= 1000
                      ? bank.sellRate.toLocaleString('en-US')
                      : bank.sellRate}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[#76767e] text-[10px]">فارق التداول</span>
                  <span className="text-[13px] font-bold text-[#191c1e] tabular-nums mt-0.5">
                    {bank.spread} {bank.category === 'arab-banks' ? '' : 'دينار'}
                  </span>
                </div>
              </div>

              {bank.feeNote && (
                <div className="flex items-center justify-between text-[10px] text-[#76767e] pt-1 border-t border-[#eceef0]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#006c49]">info</span>
                    {bank.feeNote}
                  </span>
                  <span className="text-[#131a33] font-bold flex items-center gap-0.5 hover:text-[#006c49]">
                    ضبط تنبيه
                    <span className="material-symbols-outlined text-[12px]">add_alert</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
