import React, { useState, useMemo } from 'react';
import { CurrencyItem, NewsArticle } from '../types/finance';
import { getCurrentDateInfo } from '../utils/dateUtils';

interface ScreenDashboardProps {
  onGoToNews: () => void;
  onGoToRates: () => void;
  onOpenArticle: (article: NewsArticle) => void;
  onOpenAlertModal: (currency?: CurrencyItem) => void;
}

export const ScreenDashboard: React.FC<ScreenDashboardProps> = ({
  onGoToNews,
  onGoToRates,
  onOpenArticle,
  onOpenAlertModal,
}) => {
  const dateInfo = useMemo(() => getCurrentDateInfo(), []);

  // Converter State
  const [convertAmount, setConvertAmount] = useState<number>(100);
  const [targetRate, setTargetRate] = useState<number>(48.65);
  const [targetSymbol, setTargetSymbol] = useState<string>('ج.م');
  const [targetCode, setTargetCode] = useState<string>('EGP');
  const [isUsdBase, setIsUsdBase] = useState<boolean>(true);

  // Live filter tab for exchange rates
  const [activeFilter, setActiveFilter] = useState<'all' | 'arab' | 'global' | 'metals'>('all');

  // DXY live refresh simulation
  const [dxyVal, setDxyVal] = useState<number>(104.28);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const handleRefreshDxy = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      const delta = (Math.random() * 0.1 - 0.05);
      setDxyVal((prev) => parseFloat((prev + delta).toFixed(2)));
    }, 500);
  };

  const handleCurrencySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.selectedOptions[0];
    const rate = parseFloat(selectedOption.value) || 1;
    const sym = selectedOption.getAttribute('data-symbol') || '';
    const code = selectedOption.getAttribute('data-code') || '';
    setTargetRate(rate);
    setTargetSymbol(sym);
    setTargetCode(code);
  };

  const convertedTotal = isUsdBase
    ? (convertAmount * targetRate).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : (convertAmount / targetRate).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  // Sample items for rate cards
  const rateCards = [
    {
      id: 'xau',
      name: 'XAU / USD',
      badge: 'أونصة',
      sub: 'الذهب مقابل الدولار',
      value: '$2,385.40',
      change: '+1.15%',
      isUp: true,
      category: 'metals',
      icon: 'monetization_on',
      isGold: true,
    },
    {
      id: 'eur',
      name: 'EUR / USD',
      sub: 'شراء: 1.0840 • بيع: 1.0844',
      value: '1.0842',
      change: '-0.18%',
      isUp: false,
      category: 'global',
      flag: '🇪🇺',
    },
    {
      id: 'egp',
      name: 'USD / EGP',
      badge: 'الجنيه المصري',
      sub: 'شراء: 48.60 • بيع: 48.70',
      value: '48.65 ج.م',
      change: '+0.08%',
      isUp: true,
      category: 'arab',
      flag: '🇪🇬',
    },
    {
      id: 'sar',
      name: 'USD / SAR',
      badge: 'مربوط',
      sub: 'الريال السعودي',
      value: '3.7510 ر.س',
      change: '0.00% مستقر',
      isUp: true,
      isStable: true,
      category: 'arab',
      flag: '🇸🇦',
    },
    {
      id: 'aed',
      name: 'USD / AED',
      badge: 'مربوط',
      sub: 'الدرهم الإماراتي',
      value: '3.6725 د.إ',
      change: '0.00% مستقر',
      isUp: true,
      isStable: true,
      category: 'arab',
      flag: '🇦🇪',
    },
    {
      id: 'kwd',
      name: 'USD / KWD',
      sub: 'الدينار الكويتي',
      value: '0.3072 د.ك',
      change: '-0.03%',
      isUp: false,
      category: 'arab',
      flag: '🇰🇼',
    },
    {
      id: 'iqd',
      name: 'USD / IQD',
      badge: 'بورصة الكفاح',
      sub: 'الدينار العراقي (رسمي 1,320)',
      value: '1,490 د.ع',
      change: '+0.20%',
      isUp: true,
      category: 'arab',
      flag: '🇮🇶',
    },
  ];

  const filteredRateCards = rateCards.filter(
    (c) => activeFilter === 'all' || c.category === activeFilter
  );

  return (
    <div className="flex flex-col w-full gap-5 pb-8 select-none">
      {/* 1. HERO DXY LIVE TICKER CARD */}
      <section className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#131a33] via-[#1c2541] to-[#131a33] text-white p-4 shadow-xl border border-white/5">
        <div className="relative z-10 flex flex-col gap-2">
          {/* Top Meta Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#6ffbbe] animate-ping"></span>
              <span className="inline-flex items-center gap-1 bg-[#e0e3e5]/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[#6ffbbe] text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]"></span>
                مباشر • {dateInfo.fullArabicDate}
              </span>
              <span className="text-[11px] text-[#c6c6ce]">{dateInfo.isoDate} نيويورك</span>
            </div>
            <button
              type="button"
              onClick={handleRefreshDxy}
              aria-label="تحديث مباشر"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#c6c6ce] hover:text-white active:scale-95 transition-all"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isSpinning ? 'animate-spin text-[#6ffbbe]' : ''
                }`}
              >
                sync
              </span>
            </button>
          </div>

          {/* Main Numbers & Sparkline */}
          <div className="flex items-end justify-between mt-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[16px] text-[#e0e3e5] font-bold tracking-tight">DXY</span>
                <span className="text-[11px] text-[#7b83a0] font-medium">مؤشر الدولار العالمي</span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-[32px] text-white font-extrabold tracking-tight tabular-nums">
                  {dxyVal}
                </span>
                <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#006c49]/40 text-[#6ffbbe] text-[11px] font-bold tabular-nums">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span>+0.32%</span>
                </div>
              </div>
            </div>

            {/* Inline Sparkline */}
            <div className="w-28 h-12 flex items-center justify-end">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 110 45">
                <defs>
                  <linearGradient id="dxyGradDash" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6ffbbe" stopOpacity="0.38"></stop>
                    <stop offset="100%" stopColor="#6ffbbe" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M0,38 Q18,36 32,24 T60,26 T82,10 T110,6 L110,45 L0,45 Z"
                  fill="url(#dxyGradDash)"
                ></path>
                <path
                  d="M0,38 Q18,36 32,24 T60,26 T82,10 T110,6"
                  stroke="#6ffbbe"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                ></path>
                <circle cx="110" cy="6" r="3.5" fill="#6ffbbe" className="animate-pulse"></circle>
              </svg>
            </div>
          </div>

          {/* Footer Context Row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[#c6c6ce] text-[11px]">
            <span>
              الأعلى: <strong className="text-white font-bold tabular-nums">104.45</strong>
            </span>
            <span>
              الأدنى: <strong className="text-white font-bold tabular-nums">103.92</strong>
            </span>
            <span>
              الإغلاق السابق: <strong className="text-white font-bold tabular-nums">103.95</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Multi-Bank & Bourse Live Ticker Strip */}
      <section className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-[#eceef0] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#131a33] text-[#6ffbbe] flex items-center justify-center">
              <span className="material-symbols-outlined text-[17px]">account_balance</span>
            </span>
            <div className="flex flex-col">
              <h3 className="text-[13px] font-bold text-[#191c1e]">
                أسعار الدولار في المصارف والبورصات أولاً بأول
              </h3>
              <span className="text-[10px] text-[#45464d]">تحديث آلي مباشر من 12 جهة مصرفية</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoToRates}
            className="text-[11px] font-bold text-[#006c49] hover:underline flex items-center gap-0.5"
          >
            المقارنة الكاملة
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
          <div className="bg-[#f2f4f6] p-2 rounded-xl border border-[#c6c6ce]/30 flex flex-col justify-between">
            <span className="text-[10px] text-[#76767e] font-semibold">المركزي (CBI)</span>
            <span className="text-[14px] font-extrabold text-[#191c1e] tabular-nums mt-0.5">1,320</span>
            <span className="text-[9px] text-[#006c49] font-bold mt-0.5 bg-[#6ffbbe]/20 rounded py-0.2">رسمي معتمد</span>
          </div>

          <div className="bg-[#f2f4f6] p-2 rounded-xl border border-[#c6c6ce]/30 flex flex-col justify-between">
            <span className="text-[10px] text-[#76767e] font-semibold">بورصة الكفاح</span>
            <span className="text-[14px] font-extrabold text-[#006c49] tabular-nums mt-0.5">1,490</span>
            <span className="text-[9px] text-[#131a33] font-bold mt-0.5 bg-[#eceef0] rounded py-0.2">سوق موازي</span>
          </div>

          <div className="bg-[#f2f4f6] p-2 rounded-xl border border-[#c6c6ce]/30 flex flex-col justify-between">
            <span className="text-[10px] text-[#76767e] font-semibold">بورصة أربيل</span>
            <span className="text-[14px] font-extrabold text-[#191c1e] tabular-nums mt-0.5">1,498</span>
            <span className="text-[9px] text-[#45464d] font-bold mt-0.5 bg-[#eceef0] rounded py-0.2">إقليم كوردستان</span>
          </div>
        </div>
      </section>

      {/* 2. QUICK CURRENCY CONVERTER WIDGET */}
      <section className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#191c1e]">
              <span className="material-symbols-outlined text-[18px]">calculate</span>
            </div>
            <h2 className="text-[15px] text-[#191c1e] font-bold">محول العملات السريع</h2>
          </div>
          <span className="text-[11px] text-[#76767e] bg-[#eceef0] px-2.5 py-0.5 rounded-full font-semibold">
            سعر البنك المركزي
          </span>
        </div>

        {/* Conversion Interactive Interface */}
        <div className="flex flex-col gap-2 mt-1 relative">
          {/* Top Currency Box */}
          <div className="bg-[#f2f4f6] rounded-xl p-3 flex items-center justify-between focus-within:ring-2 focus-within:ring-[#006c49]/30 transition-all">
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[11px] text-[#76767e] font-medium">
                {isUsdBase ? 'المبلغ المُرسل' : 'المبلغ بالعملة الأجنبية'}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[18px] text-[#191c1e] font-bold">
                  {isUsdBase ? '$' : targetSymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-[18px] text-[#191c1e] font-bold tabular-nums focus:outline-none placeholder-[#76767e]"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg shadow-xs border border-[#eceef0]">
              <span className="text-[18px]">🇺🇸</span>
              <span className="text-[14px] text-[#191c1e] font-bold">USD</span>
            </div>
          </div>

          {/* Swap Button Pill */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={() => setIsUsdBase(!isUsdBase)}
              aria-label="تبديل العملتين"
              className="w-9 h-9 rounded-full bg-[#131a33] text-white flex items-center justify-center shadow-md active:scale-90 hover:bg-[#1c2541] transition-transform border-2 border-white"
            >
              <span className="material-symbols-outlined text-[19px]">swap_vert</span>
            </button>
          </div>

          {/* Bottom Currency Box */}
          <div className="bg-[#f2f4f6] rounded-xl p-3 flex items-center justify-between">
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[11px] text-[#76767e] font-medium">
                {isUsdBase ? 'المبلغ المُستلم (تقديري)' : 'القيمة بالدولار الأمريكي'}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[18px] text-[#006c49] font-extrabold tabular-nums">
                  {convertedTotal} {isUsdBase ? targetSymbol : '$'}
                </span>
              </div>
            </div>
            <div className="relative">
              <select
                onChange={handleCurrencySelect}
                defaultValue="48.65"
                className="appearance-none bg-white pl-7 pr-2.5 py-1.5 rounded-lg shadow-xs text-[14px] text-[#191c1e] font-bold focus:outline-none cursor-pointer border border-[#eceef0]"
              >
                <option value="48.65" data-symbol="ج.م" data-code="EGP">
                  🇪🇬 EGP
                </option>
                <option value="3.751" data-symbol="ر.س" data-code="SAR">
                  🇸🇦 SAR
                </option>
                <option value="3.6725" data-symbol="د.إ" data-code="AED">
                  🇦🇪 AED
                </option>
                <option value="0.3072" data-symbol="د.ك" data-code="KWD">
                  🇰🇼 KWD
                </option>
                <option value="1490" data-symbol="د.ع" data-code="IQD">
                  🇮🇶 IQD
                </option>
                <option value="98.15" data-symbol="₽" data-code="RUB">
                  🇷🇺 RUB
                </option>
                <option value="0.922" data-symbol="€" data-code="EUR">
                  🇪🇺 EUR
                </option>
              </select>
              <span className="material-symbols-outlined text-[16px] text-[#76767e] absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Live Rate Footnote */}
        <div className="flex items-center justify-between text-[11px] text-[#76767e] pt-1">
          <span className="tabular-nums">
            1 USD = {targetRate} {targetCode}
          </span>
          <span className="flex items-center gap-1 text-[#006c49] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse"></span>
            تحديث فوري تلقائي
          </span>
        </div>
      </section>

      {/* 3. LIVE EXCHANGE RATES & METALS TABBED SECTION */}
      <section className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-[#191c1e]">
              <span className="material-symbols-outlined text-[18px]">candlestick_chart</span>
            </div>
            <h2 className="text-[15px] text-[#191c1e] font-bold">أسعار الصرف المباشرة</h2>
          </div>
          <button
            type="button"
            onClick={onGoToRates}
            className="text-[11px] text-[#006c49] font-bold hover:underline"
          >
            عرض الكل (40+ دولة)
          </button>
        </div>

        {/* Filter Tabs Pill */}
        <div className="flex items-center gap-1 bg-[#eceef0] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] transition-all font-bold ${
              activeFilter === 'all'
                ? 'bg-white text-[#191c1e] shadow-xs'
                : 'text-[#76767e] hover:text-[#191c1e]'
            }`}
          >
            الكل
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('arab')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] transition-all font-bold ${
              activeFilter === 'arab'
                ? 'bg-white text-[#191c1e] shadow-xs'
                : 'text-[#76767e] hover:text-[#191c1e]'
            }`}
          >
            العملات العربية
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('global')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] transition-all font-bold ${
              activeFilter === 'global'
                ? 'bg-white text-[#191c1e] shadow-xs'
                : 'text-[#76767e] hover:text-[#191c1e]'
            }`}
          >
            العالمية
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('metals')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] transition-all font-bold ${
              activeFilter === 'metals'
                ? 'bg-white text-[#191c1e] shadow-xs'
                : 'text-[#76767e] hover:text-[#191c1e]'
            }`}
          >
            المعادن
          </button>
        </div>

        {/* Exchange Rate Cards Stack */}
        <div className="flex flex-col gap-2 mt-0.5">
          {filteredRateCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onOpenAlertModal()}
              className="bg-white p-3 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer border border-[#eceef0]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
                    card.isGold
                      ? 'bg-amber-100/70 text-amber-800'
                      : 'bg-[#eceef0] text-[20px]'
                  }`}
                >
                  {card.isGold ? (
                    <span className="material-symbols-outlined text-[22px]">monetization_on</span>
                  ) : (
                    card.flag
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] text-[#191c1e] font-bold">{card.name}</span>
                    {card.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-[#eceef0] text-[#76767e] text-[10px] font-bold">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#76767e] font-medium">{card.sub}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[15px] font-bold text-[#191c1e] tabular-nums">
                  {card.value}
                </span>
                <div
                  className={`flex items-center gap-0.5 text-[11px] font-bold tabular-nums ${
                    card.isStable
                      ? 'text-[#76767e]'
                      : card.isUp
                      ? 'text-[#006c49]'
                      : 'text-[#ef4444]'
                  }`}
                >
                  {!card.isStable && (
                    <span className="material-symbols-outlined text-[14px]">
                      {card.isUp ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  )}
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. GLOBAL ECONOMIC MARKETS & MACRO INDICATORS */}
      <section className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-[#191c1e]">
              <span className="material-symbols-outlined text-[18px]">public</span>
            </div>
            <h2 className="text-[15px] text-[#191c1e] font-bold">الأسواق والمؤشرات العالمية</h2>
          </div>
          <button
            type="button"
            onClick={onGoToRates}
            className="text-[11px] text-[#006c49] font-bold hover:underline"
          >
            المزيد
          </button>
        </div>

        {/* 2x2 Grid of Key Indicators */}
        <div className="grid grid-cols-2 gap-2">
          {/* Brent Crude Oil */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eceef0] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#76767e]">
                <span className="material-symbols-outlined text-[16px]">oil_barrel</span>
              </div>
              <span className="flex items-center gap-0.5 text-[#006c49] text-[11px] font-bold tabular-nums">
                <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                +0.72%
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-[11px] text-[#76767e]">نفط برنت</span>
              <p className="text-[18px] text-[#191c1e] font-extrabold tabular-nums mt-0.5">
                $82.40
              </p>
              <span className="text-[10px] text-[#76767e]">للبرميل</span>
            </div>
          </div>

          {/* S&P 500 */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eceef0] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#76767e]">
                <span className="material-symbols-outlined text-[16px]">stacked_line_chart</span>
              </div>
              <span className="flex items-center gap-0.5 text-[#006c49] text-[11px] font-bold tabular-nums">
                <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                +0.45%
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-[11px] text-[#76767e]">مؤشر S&amp;P 500</span>
              <p className="text-[18px] text-[#191c1e] font-extrabold tabular-nums mt-0.5">
                5,465.20
              </p>
              <span className="text-[10px] text-[#76767e]">وول ستريت</span>
            </div>
          </div>

          {/* US 10Y Yield */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eceef0] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#76767e]">
                <span className="material-symbols-outlined text-[16px]">account_balance</span>
              </div>
              <span className="flex items-center gap-0.5 text-[#ef4444] text-[11px] font-bold tabular-nums">
                <span className="material-symbols-outlined text-[12px]">arrow_downward</span>
                -1.20%
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-[11px] text-[#76767e]">سندات الخزانة 10Y</span>
              <p className="text-[18px] text-[#191c1e] font-extrabold tabular-nums mt-0.5">
                4.22%
              </p>
              <span className="text-[10px] text-[#76767e]">العائد السنوي</span>
            </div>
          </div>

          {/* Fed Interest Rate Target */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eceef0] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#76767e]">
                <span className="material-symbols-outlined text-[16px]">policy</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#eceef0] text-[#76767e] text-[10px] font-bold">
                تثبيت
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-[11px] text-[#76767e]">الفائدة الفيدرالية</span>
              <p className="text-[15px] text-[#191c1e] font-extrabold tabular-nums mt-0.5">
                5.25% - 5.50%
              </p>
              <span className="text-[10px] text-[#006c49] font-bold">القرار القادم: 45 يوماً</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST BREAKING ECONOMIC NEWS & ANALYSIS */}
      <section className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-[#191c1e]">
              <span className="material-symbols-outlined text-[18px]">newspaper</span>
            </div>
            <h2 className="text-[15px] text-[#191c1e] font-bold">آخر الأخبار والتحليلات</h2>
          </div>
          <div className="flex items-center gap-1 text-[#ef4444] text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
            عاجل
          </div>
        </div>

        {/* News Cards Stack */}
        <div className="flex flex-col gap-3">
          {/* Breaking News Card 1 with Image */}
          <article className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col border border-[#eceef0]">
            <div className="relative w-full h-36 overflow-hidden bg-[#eceef0]">
              <img
                className="w-full h-full object-cover"
                alt="Federal Reserve Washington DC"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAItMj0yTJ2bhOhYQRSzddf0g0hB_AtPXkTcj3RQ05vDB0yHzzVBQW-LWocHXKxI5MjRAiA3WlJ3Nu6E6EXoCwgNYfjEmMX4IwDkB8LrRqeoqzZuTj7mu6WWAYye4oTM04xzplHtxdlmvwcXUNC8Fneb11VZW7XwP7LgQNm8tERy-wX3PSHJxD5HXukIdIvsREQSXGESuALeW-qdHj72CDDS_JtYJEB0HhKBrjoc6tU5sJnqJfCYvFU"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <span className="absolute top-2.5 right-2.5 bg-[#ba1a1a] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-md">
                عاجل • الفيدرالي
              </span>
              <div className="absolute bottom-2.5 right-2.5 left-2.5 text-white">
                <span className="text-[10px] text-[#c6c6ce]">منذ 15 دقيقة • وول ستريت</span>
              </div>
            </div>
            <div className="p-3.5 flex flex-col gap-1.5">
              <h3 className="text-[14px] text-[#191c1e] font-bold leading-snug">
                الفيدرالي الأمريكي يثبت أسعار الفائدة وسط ترقب حذر لبيانات التضخم القادمة
              </h3>
              <p className="text-[12px] text-[#76767e] line-clamp-2 leading-relaxed">
                أكد جيروم باول التزام البنك المركزي بمراقبة دقيقة لمؤشرات سوق العمل قبل الإقدام على
                أي خطوة لخفض تكاليف الإقراض خلال الربع القادم.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#eceef0] text-[11px] text-[#76767e]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  3.4 ألف قراءة
                </span>
                <button
                  type="button"
                  onClick={onGoToNews}
                  className="text-[#131a33] font-bold flex items-center gap-0.5 hover:text-[#006c49]"
                >
                  قراءة التحليل
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                </button>
              </div>
            </div>
          </article>

          {/* News Item 2 (Compact Layout) */}
          <article
            onClick={onGoToNews}
            className="bg-white p-3 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center gap-3 border border-[#eceef0] cursor-pointer"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-[#eceef0]">
              <img
                className="w-full h-full object-cover"
                alt="Exchange trading screens"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-FB_r9ynx5qtLTuJPrRls69lg_JaTrAkB3F8P0oTDcQx28bpcrEcBeC8rVNFq51aSfWQ3bdWJ4yxk08pz-52W-Vy0KH0Wd2iE9lBk3K1FHurusr8N0GOlxf-vARRlbuFGCrizYdZBgeGu4RYuICzzbosFGcObRa9D2uvkDrq2VzWsjS6mus28POkTeuVom0AryJMDS29dXvob3Fb6TqwTLBlzs1qKutU_XrRbKpaB9ikAiuCzcKQ9"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#6ffbbe]/30 text-[#002113] text-[10px] px-1.5 py-0.2 rounded font-bold">
                  اقتصاد إقليمي
                </span>
                <span className="text-[10px] text-[#76767e]">منذ ساعة</span>
              </div>
              <h4 className="text-[13px] text-[#191c1e] font-bold line-clamp-2 leading-snug">
                ارتفاع ملحوظ في احتياطيات النقد الأجنبي وصعود متواصل للعملات الإقليمية
              </h4>
            </div>
          </article>

          {/* News Item 3 (Compact Layout) */}
          <article
            onClick={onGoToNews}
            className="bg-white p-3 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center gap-3 border border-[#eceef0] cursor-pointer"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-[#eceef0]">
              <img
                className="w-full h-full object-cover"
                alt="Gold Bullion"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-v3ddweFzn9uv6fZB-4nskk7CL-eyzYbKoZaMLh_tuLlS6jNkh575lwdSHylyyJEH_sItWTGFNtsYOF84USM6U3E38inPkQ9ppDQv8co9dEsPPNzAOwRewtPtF1C4J77Ge9sV3Kz77i1pKBNqzXjIoJslfodkTULeCH_1iEVQjpQF5MRWBZ5LvkL1VY74pl-VjOV__Owp9tjjS4CU-otMOEQk1W7HbV9UrxaTDBgxQYMQMl4CLTMM"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#eceef0] text-[#45464d] text-[10px] px-1.5 py-0.2 rounded font-bold">
                  سلع ومعادن
                </span>
                <span className="text-[10px] text-[#76767e]">منذ ساعتين</span>
              </div>
              <h4 className="text-[13px] text-[#191c1e] font-bold line-clamp-2 leading-snug">
                تقرير خاص: توجهات أسعار الذهب والدولار للربع الثالث من العام الحالي
              </h4>
            </div>
          </article>
        </div>

        {/* View All Button */}
        <button
          type="button"
          onClick={onGoToNews}
          className="w-full py-3 bg-[#eceef0] hover:bg-[#e0e3e5] rounded-xl text-[#191c1e] text-[13px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-xs mt-1"
        >
          <span>عرض جميع الأخبار والتقارير المالية</span>
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>
      </section>
    </div>
  );
};
