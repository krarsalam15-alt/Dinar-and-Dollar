import React, { useState, useMemo, useEffect } from 'react';
import { CurrencyItem, BankRate } from '../types/finance';
import { BankRatesSection } from './BankRatesSection';
import { getCurrentDateInfo, getCurrentTimeFormatted } from '../utils/dateUtils';

interface ScreenRatesProps {
  currencies: CurrencyItem[];
  bankRates: BankRate[];
  onOpenAlertModal: (currency?: CurrencyItem | string) => void;
  onSelectCurrencyForConvert?: (from: string, to: string, amount?: number) => void;
}

export const ScreenRates: React.FC<ScreenRatesProps> = ({
  currencies,
  bankRates,
  onOpenAlertModal,
}) => {
  // Active View Tab: All Currencies vs Multiple Banks & Bourses
  const [activeMainTab, setActiveMainTab] = useState<'currencies' | 'banks'>('currencies');

  // Dynamic Date State (automatically updates every day / every minute)
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(() => getCurrentTimeFormatted());
  const dateInfo = useMemo(() => getCurrentDateInfo(), [currentTimeStr]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(getCurrentTimeFormatted());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // Converter States
  const [amount, setAmount] = useState<number>(100);
  const [fromCode, setFromCode] = useState<string>('RUB');
  const [toCode, setToCode] = useState<string>('IQD');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Currency lookup map for rapid math
  const currencyMap = useMemo(() => {
    const map = new Map<string, CurrencyItem>();
    currencies.forEach((c) => {
      // Map base code
      const parts = c.code.split(' / ');
      if (parts.length === 2) {
        if (!map.has(parts[0])) map.set(parts[0], c);
        if (!map.has(parts[1])) map.set(parts[1], c);
      }
    });
    return map;
  }, [currencies]);

  // Standard USD rates for conversion between ANY currency
  const ratesInUsd: Record<string, { name: string; country: string; flag: string; usdRate: number }> = {
    RUB: { name: 'روبل روسي', country: 'روسيا الاتحادية', flag: '🇷🇺', usdRate: 0.0102 },
    IQD: { name: 'دينار عراقي', country: 'العراق', flag: '🇮🇶', usdRate: 0.00067114 },
    USD: { name: 'دولار أمريكي', country: 'الولايات المتحدة', flag: '🇺🇸', usdRate: 1.0 },
    SAR: { name: 'ريال سعودي', country: 'المملكة العربية السعودية', flag: '🇸🇦', usdRate: 0.26659 },
    AED: { name: 'درهم إماراتي', country: 'الإمارات العربية المتحدة', flag: '🇦🇪', usdRate: 0.27229 },
    KWD: { name: 'دينار كويتي', country: 'الكويت', flag: '🇰🇼', usdRate: 3.259 },
    EGP: { name: 'جنيه مصري', country: 'جمهورية مصر العربية', flag: '🇪🇬', usdRate: 0.02055 },
    EUR: { name: 'يورو', country: 'الاتحاد الأوروبي', flag: '🇪🇺', usdRate: 1.0845 },
    GBP: { name: 'جنيه إسترليني', country: 'المملكة المتحدة', flag: '🇬🇧', usdRate: 1.2980 },
    TRY: { name: 'ليرة تركية', country: 'تركيا', flag: '🇹🇷', usdRate: 0.02923 },
    JOD: { name: 'دينار أردني', country: 'الأردن', flag: '🇯🇴', usdRate: 1.4104 },
    QAR: { name: 'ريال قطري', country: 'قطر', flag: '🇶🇦', usdRate: 0.2747 },
    MAD: { name: 'درهم مغربي', country: 'المغرب', flag: '🇲🇦', usdRate: 0.1011 },
    SYP: { name: 'ليرة سورية', country: 'سوريا', flag: '🇸🇾', usdRate: 0.0000673 },
    BHD: { name: 'دينار بحريني', country: 'البحرين', flag: '🇧🇭', usdRate: 2.659 },
    OMR: { name: 'ريال عماني', country: 'سلطنة عمان', flag: '🇴🇲', usdRate: 2.600 },
    CNY: { name: 'يوان صيني', country: 'الصين', flag: '🇨🇳', usdRate: 0.1402 },
    JPY: { name: 'ين ياباني', country: 'اليابان', flag: '🇯🇵', usdRate: 0.006568 },
    CHF: { name: 'فرنك سويسري', country: 'سويسرا', flag: '🇨🇭', usdRate: 1.155 },
    CAD: { name: 'دولار كندي', country: 'كندا', flag: '🇨🇦', usdRate: 0.7202 },
  };

  // Convert calculation
  const { resultText, rangeText, formulaText, fromCountry, toCountry } = useMemo(() => {
    const fromInfo = ratesInUsd[fromCode] || { name: fromCode, country: '', flag: '', usdRate: 1 };
    const toInfo = ratesInUsd[toCode] || { name: toCode, country: '', flag: '', usdRate: 1 };

    // Precise handling for RUB -> IQD default (1 RUB = 14.95 IQD)
    if (fromCode === 'RUB' && toCode === 'IQD') {
      const customRate = 14.95;
      const total = amount * customRate;
      const low = Math.round(amount * 14.80).toLocaleString('en-US');
      const high = Math.round(amount * 15.20).toLocaleString('en-US');
      return {
        resultText: Math.round(total).toLocaleString('en-US'),
        rangeText: `النطاق التقديري: ${low} - ${high} IQD`,
        formulaText: '1 RUB = 14.95 IQD',
        fromCountry: fromInfo.country,
        toCountry: toInfo.country,
      };
    }

    if (fromCode === 'IQD' && toCode === 'RUB') {
      const customRate = 1 / 14.95;
      const total = amount * customRate;
      return {
        resultText: total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
        rangeText: 'النطاق التقديري: 0.065 - 0.068 RUB',
        formulaText: '1 IQD = 0.0669 RUB',
        fromCountry: fromInfo.country,
        toCountry: toInfo.country,
      };
    }

    const unitRate = fromInfo.usdRate / toInfo.usdRate;
    const total = amount * unitRate;

    let res = '';
    if (unitRate >= 100) {
      res = Math.round(total).toLocaleString('en-US');
    } else if (unitRate >= 1) {
      res = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      res = total.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    }

    const rateStr = unitRate >= 10 ? unitRate.toFixed(2) : unitRate.toFixed(4);
    const lowEst = (total * 0.995).toLocaleString('en-US', { maximumFractionDigits: 2 });
    const highEst = (total * 1.005).toLocaleString('en-US', { maximumFractionDigits: 2 });

    return {
      resultText: res,
      rangeText: `النطاق التقديري: ${lowEst} - ${highEst} ${toCode}`,
      formulaText: `1 ${fromCode} = ${rateStr} ${toCode}`,
      fromCountry: fromInfo.country,
      toCountry: toInfo.country,
    };
  }, [amount, fromCode, toCode]);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 300);
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handlePreset = (amt: number, f: string, t: string) => {
    setAmount(amt);
    setFromCode(f);
    setToCode(t);
  };

  // Filtered Currencies list
  const filteredCurrencies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return currencies.filter((item) => {
      // Category match
      let matchesCategory = true;
      if (activeCategory !== 'all') {
        matchesCategory = item.category.includes(activeCategory as any);
      }

      // Query match
      let matchesQuery = true;
      if (q) {
        matchesQuery =
          item.code.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          item.searchKeywords.toLowerCase().includes(q);
      }

      return matchesCategory && matchesQuery;
    });
  }, [currencies, searchQuery, activeCategory]);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Ticker Bar & Market Status */}
      <div className="px-4 pt-2 pb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006c49] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006c49]"></span>
          </span>
          <span className="text-[12px] text-[#45464d] font-semibold">
            الأسواق والبورصات مفتوحة • بث مباشر
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#45464d]">
          <span className="material-symbols-outlined text-[15px] text-[#006c49]">calendar_today</span>
          <span className="text-[11px] font-bold text-[#006c49] tabular-nums">
            {dateInfo.fullBadge}
          </span>
        </div>
      </div>

      {/* Main Mode Toggle: Currencies & Converter vs Multi-Bank Live Rates */}
      <div className="px-4 mb-3">
        <div className="bg-[#eceef0] p-1 rounded-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveMainTab('currencies')}
            className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMainTab === 'currencies'
                ? 'bg-white text-[#191c1e] shadow-xs'
                : 'text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">currency_exchange</span>
            <span>أسعار العملات والمحول الذكي</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('banks')}
            className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMainTab === 'banks'
                ? 'bg-[#131a33] text-white shadow-xs'
                : 'text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">account_balance</span>
            <span>أسعار المصارف والبورصات</span>
            <span className="bg-[#6ffbbe]/25 text-[#006c49] text-[9px] px-1.5 py-0.2 rounded-full font-bold">
              12 جهة
            </span>
          </button>
        </div>
      </div>

      {/* Conditional Content based on activeMainTab */}
      {activeMainTab === 'banks' ? (
        <div className="px-4">
          <BankRatesSection
            bankRates={bankRates}
            onOpenAlertModal={onOpenAlertModal}
            currentDateBadge={dateInfo.fullBadge}
          />
        </div>
      ) : (
        <>
          {/* Hero Card: USD Index (DXY) */}
          <div className="px-4 mb-4">
            <div className="relative overflow-hidden rounded-2xl bg-[#131a33] text-white p-4 shadow-xl border border-white/5">
          {/* Decorative Ambient Gradient Glow */}
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-[#6cf8bb]/15 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#e0e3e5]/20 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[18px]">query_stats</span>
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#7b83a0] font-bold">
                    مؤشر الدولار الأمريكي الرئيسي
                  </span>
                  <span className="text-[16px] font-bold tracking-wide">USD INDEX (DXY)</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb]/20 text-[#6cf8bb] text-[11px] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +0.32%
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-extrabold tracking-tight tabular-nums text-white">
                  104.28
                </span>
                <span className="text-[12px] text-[#6cf8bb] font-semibold tabular-nums">
                  +0.33 نقطة
                </span>
              </div>
              <div className="text-left flex flex-col items-end">
                <span className="text-[10px] text-[#7b83a0] font-medium">النطاق اليومي</span>
                <span className="text-[12px] text-white font-bold tabular-nums">
                  103.95 - 104.42
                </span>
              </div>
            </div>

            {/* SVG Micro Sparkline */}
            <div className="w-full h-10 mt-1 flex items-center">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 280 36">
                <defs>
                  <linearGradient id="dxyGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6cf8bb" stopOpacity="0.32"></stop>
                    <stop offset="100%" stopColor="#6cf8bb" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M0 28 C 30 26, 45 32, 70 24 C 95 16, 120 25, 150 14 C 180 3, 210 18, 240 8 C 260 2, 270 5, 280 4"
                  fill="none"
                  stroke="#6cf8bb"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                ></path>
                <path
                  d="M0 28 C 30 26, 45 32, 70 24 C 95 16, 120 25, 150 14 C 180 3, 210 18, 240 8 C 260 2, 270 5, 280 4 L280 36 L0 36 Z"
                  fill="url(#dxyGlow)"
                ></path>
                <circle cx="280" cy="4" r="3.5" fill="#6cf8bb" className="animate-pulse"></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: محول العملات الشامل والذكي بين أي عملتين */}
      <div className="px-4 mb-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-2 relative">
          <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#131a33] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[19px]">currency_exchange</span>
              </span>
              <div>
                <h2 className="text-[15px] text-[#191c1e] font-bold">
                  محول العملات الشامل والذكي
                </h2>
                <p className="text-[11px] text-[#45464d]">تحويل مباشر ودقيق بين أي عملتين عالميتين</p>
              </div>
            </div>
            <span className="text-[11px] text-[#006c49] bg-[#6ffbbe]/25 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse"></span>
              سعر فوري
            </span>
          </div>

          {/* Convert Inputs & Interactive Swap */}
          <div className="flex flex-col gap-2 relative mt-1">
            {/* From Currency Box */}
            <div className="bg-[#f2f4f6] rounded-xl p-3 border border-transparent focus-within:border-[#131a33] focus-within:bg-white transition-all">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-[#45464d] font-semibold" htmlFor="amount-from">
                  تحويل من (المبلغ)
                </label>
                <span className="text-[11px] text-[#131a33] font-bold">{fromCountry}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 flex-1">
                  <input
                    id="amount-from"
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent text-[22px] text-[#191c1e] font-bold tabular-nums focus:outline-none"
                    placeholder="100"
                  />
                </div>
                <div className="relative shrink-0">
                  <select
                    aria-label="اختر العملة المصدر"
                    value={fromCode}
                    onChange={(e) => setFromCode(e.target.value)}
                    className="appearance-none bg-white border border-[#c6c6ce]/60 rounded-xl pl-8 pr-3 py-1.5 text-[15px] font-bold text-[#191c1e] shadow-xs focus:outline-none cursor-pointer"
                  >
                    {Object.entries(ratesInUsd).map(([code, item]) => (
                      <option key={code} value={code}>
                        {item.flag} {code}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined text-[18px] text-[#45464d] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Center Floating Swap Button */}
            <div className="flex justify-center -my-3 z-10">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="تبديل العملتين"
                className={`w-9 h-9 rounded-full bg-[#131a33] text-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-2 border-white ${
                  isSwapping ? 'rotate-180' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">swap_vert</span>
              </button>
            </div>

            {/* To Currency Box */}
            <div className="bg-[#f2f4f6] rounded-xl p-3 border border-transparent">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-[#45464d] font-semibold">
                  التحويل إلى (النتيجة المقابلة)
                </label>
                <span className="text-[11px] text-[#131a33] font-bold">{toCountry}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[22px] font-extrabold text-[#191c1e] tabular-nums tracking-tight truncate">
                    {resultText}
                  </span>
                  <span className="text-[11px] text-[#45464d] font-medium">{rangeText}</span>
                </div>
                <div className="relative shrink-0">
                  <select
                    aria-label="اختر العملة المقابلة"
                    value={toCode}
                    onChange={(e) => setToCode(e.target.value)}
                    className="appearance-none bg-white border border-[#c6c6ce]/60 rounded-xl pl-8 pr-3 py-1.5 text-[15px] font-bold text-[#191c1e] shadow-xs focus:outline-none cursor-pointer"
                  >
                    {Object.entries(ratesInUsd).map(([code, item]) => (
                      <option key={code} value={code}>
                        {item.flag} {code}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined text-[18px] text-[#45464d] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Rate Bar & Quick Preset Chips */}
          <div className="mt-1 pt-2 border-t border-[#eceef0] flex flex-col gap-2">
            <div className="flex items-center justify-between text-[#45464d]">
              <span className="text-[11px] font-medium">سعر الصرف المعتمد:</span>
              <span className="text-[13px] font-bold text-[#191c1e] tabular-nums">
                {formulaText}
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] text-[#45464d] font-medium shrink-0">
                تحويلات شائعة:
              </span>
              <button
                type="button"
                onClick={() => handlePreset(100, 'RUB', 'IQD')}
                className="px-2.5 py-1 rounded-full bg-[#eceef0] text-[#191c1e] text-[11px] font-semibold hover:bg-[#e0e3e5] active:scale-95 transition-all shrink-0"
              >
                100 روبل ⇋ عراقي
              </button>
              <button
                type="button"
                onClick={() => handlePreset(100, 'USD', 'IQD')}
                className="px-2.5 py-1 rounded-full bg-[#eceef0] text-[#191c1e] text-[11px] font-semibold hover:bg-[#e0e3e5] active:scale-95 transition-all shrink-0"
              >
                100 دولار ⇋ عراقي
              </button>
              <button
                type="button"
                onClick={() => handlePreset(100, 'USD', 'RUB')}
                className="px-2.5 py-1 rounded-full bg-[#eceef0] text-[#191c1e] text-[11px] font-semibold hover:bg-[#e0e3e5] active:scale-95 transition-all shrink-0"
              >
                100 دولار ⇋ روبل
              </button>
              <button
                type="button"
                onClick={() => handlePreset(100, 'USD', 'SAR')}
                className="px-2.5 py-1 rounded-full bg-[#eceef0] text-[#191c1e] text-[11px] font-semibold hover:bg-[#e0e3e5] active:scale-95 transition-all shrink-0"
              >
                100 دولار ⇋ سعودي
              </button>
              <button
                type="button"
                onClick={() => handlePreset(100, 'USD', 'EGP')}
                className="px-2.5 py-1 rounded-full bg-[#eceef0] text-[#191c1e] text-[11px] font-semibold hover:bg-[#e0e3e5] active:scale-95 transition-all shrink-0"
              >
                100 دولار ⇋ مصري
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Instant Search Bar for All Countries & Currencies */}
      <div className="px-4 mb-2">
        <div className="relative w-full">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#45464d]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن الدولة أو العملة (مثال: العراق، روسيا، مصر، SAR)..."
            className="w-full bg-white rounded-xl py-3 pr-10 pl-10 text-[#191c1e] placeholder:text-[#45464d] text-[13px] shadow-xs border border-[#c6c6ce]/50 focus:outline-none focus:ring-2 focus:ring-[#131a33]/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="مسح البحث"
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#45464d] hover:text-[#191c1e]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filters & Alert Action */}
      <div className="px-4 mb-2 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 flex-1">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all shadow-xs ${
              activeCategory === 'all'
                ? 'bg-[#131a33] text-white shadow-xs'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            الكل (أكثر من 40 دولة)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('arab')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeCategory === 'arab'
                ? 'bg-[#131a33] text-white shadow-xs'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            الدول العربية
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('major')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeCategory === 'major'
                ? 'bg-[#131a33] text-white shadow-xs'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            العملات الكبرى
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('asia')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeCategory === 'asia'
                ? 'bg-[#131a33] text-white shadow-xs'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            آسيا والشرق
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('europe-americas')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeCategory === 'europe-americas'
                ? 'bg-[#131a33] text-white shadow-xs'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            أوروبا والأمريكتين
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('metals')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeCategory === 'metals'
                ? 'bg-[#131a33] text-white shadow-xs'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            المعادن والذهب
          </button>
        </div>

        {/* Set Price Alert Button */}
        <button
          type="button"
          onClick={() => onOpenAlertModal()}
          aria-label="ضبط تنبيه أسعار"
          title="ضبط تنبيه فوري لسعر العملة"
          className="w-9 h-9 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:bg-[#e0e3e5] active:scale-95 transition-all shrink-0 shadow-xs"
        >
          <span className="material-symbols-outlined text-[19px]">add_alert</span>
        </button>
      </div>

      {/* Rates Table Header */}
      <div className="px-4 py-1.5 flex items-center justify-between text-[#45464d] text-[11px] font-semibold border-b border-[#eceef0]/60 mb-1">
        <div className="w-2/5">الدولة والعملة / الرمز</div>
        <div className="w-3/10 text-center">شراء / بيع</div>
        <div className="w-3/10 text-left">السعر المباشر والتغير</div>
      </div>

      {/* Comprehensive Exchange Rates List */}
      <div className="px-4 flex flex-col gap-1.5">
        {filteredCurrencies.map((item) => {
          const isUserHighlight = item.id === 'rub-iqd';
          const isPositive = item.changePct > 0;
          const isZero = item.changePct === 0;

          return (
            <div
              key={item.id}
              onClick={() => onOpenAlertModal(item)}
              title="انقر لضبط تنبيه أو تفاصيل"
              className={`rounded-2xl p-3 shadow-xs flex items-center justify-between transition-all hover:shadow-md cursor-pointer border ${
                isUserHighlight
                  ? 'border-[#006c49]/30 bg-gradient-to-l from-[#6cf8bb]/10 via-white to-white'
                  : 'bg-white border-[#eceef0]/80'
              }`}
            >
              {/* Left Column: Flag & Name */}
              <div className="flex items-center gap-2.5 w-2/5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#eceef0] flex items-center justify-center text-xl shrink-0 relative shadow-2xs">
                  {item.flag}
                  {item.flagSecondary && (
                    <span className="text-xs absolute -bottom-1 -left-1">
                      {item.flagSecondary}
                    </span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] text-[#191c1e] font-bold truncate">
                      {item.code}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#45464d] truncate font-medium">
                    {item.name}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold mt-0.5 truncate ${
                        item.badgeType === 'secondary'
                          ? 'text-[#006c49]'
                          : item.badgeType === 'error'
                          ? 'text-[#ef4444]'
                          : 'text-[#131a33]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Center Column: Buy / Sell */}
              <div className="w-3/10 flex flex-col items-center">
                <div className="flex items-center gap-1 text-[12px] font-bold text-[#191c1e] tabular-nums">
                  <span>
                    {item.buyRate >= 1000
                      ? item.buyRate.toLocaleString('en-US')
                      : item.buyRate}
                  </span>
                  <span className="text-[#c6c6ce] font-normal">|</span>
                  <span>
                    {item.sellRate >= 1000
                      ? item.sellRate.toLocaleString('en-US')
                      : item.sellRate}
                  </span>
                </div>
                <span className="text-[10px] text-[#45464d] font-medium truncate mt-0.5">
                  {item.marketNote}
                </span>
              </div>

              {/* Right Column: Live Rate & Change Badge */}
              <div className="w-3/10 flex flex-col items-end">
                <span className="text-[14px] font-bold text-[#191c1e] tabular-nums">
                  {/* Calculate display rate */}
                  {item.id === 'rub-iqd'
                    ? '14.95'
                    : item.sellRate >= 1000
                    ? ((item.buyRate + item.sellRate) / 2).toLocaleString('en-US')
                    : ((item.buyRate + item.sellRate) / 2).toFixed(
                        item.buyRate < 1 ? 4 : 2
                      )}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 mt-0.5 tabular-nums ${
                    isZero
                      ? 'bg-[#eceef0] text-[#45464d]'
                      : isPositive
                      ? 'bg-[#6ffbbe]/30 text-[#006c49]'
                      : 'bg-[#ffdad6] text-[#ef4444]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {isZero
                      ? 'horizontal_rule'
                      : isPositive
                      ? 'arrow_drop_up'
                      : 'arrow_drop_down'}
                  </span>
                  {isPositive ? `+${item.changePct.toFixed(2)}%` : `${item.changePct.toFixed(2)}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Search State */}
      {filteredCurrencies.length === 0 && (
        <div className="px-4 py-12 text-center flex flex-col items-center justify-center gap-2">
          <span className="material-symbols-outlined text-4xl text-[#76767e]">search_off</span>
          <span className="text-[16px] text-[#191c1e] font-bold">لم يتم العثور على عملة مطابقة</span>
          <p className="text-[12px] text-[#45464d]">
            تأكد من كتابة اسم الدولة أو رمز العملة بالشكل الصحيح.
          </p>
        </div>
      )}

          {/* Integrated Bank & Bourse Rates Comparison */}
          <div className="px-4 mt-6 pt-5 border-t border-[#eceef0]">
            <BankRatesSection
              bankRates={bankRates}
              onOpenAlertModal={onOpenAlertModal}
              currentDateBadge={dateInfo.fullBadge}
            />
          </div>

          {/* Micro Insight Callout */}
          <div className="px-4 mt-5">
            <div className="bg-[#f2f4f6] rounded-2xl p-4 flex items-start gap-3 border border-[#c6c6ce]/30">
              <div className="w-8 h-8 rounded-full bg-[#6ffbbe] flex items-center justify-center text-[#002113] shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] text-[#191c1e] font-bold">تحليل الجلسة وحركة الصرف</span>
                <p className="text-[13px] text-[#45464d] mt-0.5 leading-relaxed">
                  تشهد تداولات الروبل الروسي والدينار العراقي استقراراً نسبياً مع ثبات أسعار الصرف الرسمية،
                  في حين يواصل مؤشر الدولار تماسكه فوق 104 نقاط، محافظاً على استقرار العملات الخليجية
                  المرتبطة وسوق النفط.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
