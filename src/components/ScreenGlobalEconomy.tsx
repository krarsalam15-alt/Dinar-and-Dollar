import React, { useState, useEffect, useMemo } from 'react';
import { MacroIndicator, MarketTickerItem, EconomicEvent } from '../types/finance';
import { getCurrentDateInfo, getCurrentTimeFormatted } from '../utils/dateUtils';

interface ScreenGlobalEconomyProps {
  macroIndicators: MacroIndicator[];
  tickers: MarketTickerItem[];
  economicEvents: EconomicEvent[];
  onOpenMacroReport: () => void;
}

export const ScreenGlobalEconomy: React.FC<ScreenGlobalEconomyProps> = ({
  macroIndicators,
  tickers,
  economicEvents,
  onOpenMacroReport,
}) => {
  const dateInfo = useMemo(() => getCurrentDateInfo(), []);
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'us' | 'eu' | 'asia' | 'mena'>('all');
  const [countdown, setCountdown] = useState<number>(15);
  const [lastUpdated, setLastUpdated] = useState<string>(() => `${dateInfo.fullBadge} • ${getCurrentTimeFormatted()}`);
  const [sentimentScore, setSentimentScore] = useState<number>(62);

  // Live ticking state for tickers
  const [liveTickers, setLiveTickers] = useState<MarketTickerItem[]>(tickers);
  const [flashingKey, setFlashingKey] = useState<string | null>(null);
  const [isFlashUp, setIsFlashUp] = useState<boolean>(true);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerLiveSync();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerLiveSync = () => {
    const currentDate = getCurrentDateInfo();
    const timeStr = getCurrentTimeFormatted();
    setLastUpdated(`${currentDate.fullArabicDate} - ${timeStr}`);

    // Fluctuate a random ticker slightly
    const randomIndex = Math.floor(Math.random() * liveTickers.length);
    const targetTicker = liveTickers[randomIndex];
    const delta = (Math.random() - 0.48) * 0.004;
    const isUp = delta >= 0;

    const newValue = parseFloat((targetTicker.value * (1 + delta)).toFixed(targetTicker.decimals));

    setLiveTickers((prev) =>
      prev.map((t, idx) => {
        if (idx === randomIndex) {
          return {
            ...t,
            value: newValue,
            changePct: parseFloat((t.changePct + (isUp ? 0.04 : -0.04)).toFixed(2)),
          };
        }
        return t;
      })
    );

    setFlashingKey(targetTicker.id);
    setIsFlashUp(isUp);
    setTimeout(() => setFlashingKey(null), 900);

    // Fluctuate sentiment slightly
    setSentimentScore((prev) => {
      const deltaS = Math.floor(Math.random() * 3 - 1);
      return Math.min(85, Math.max(30, prev + deltaS));
    });
  };

  const filteredMacros = macroIndicators.filter(
    (m) => selectedRegion === 'all' || m.category === selectedRegion || m.category === 'all'
  );

  const getSentimentText = (score: number) => {
    if (score >= 75) return 'طمع شديد (Extreme Greed)';
    if (score >= 56) return 'طمع معتدل (Greed)';
    if (score >= 45) return 'حيادي (Neutral)';
    if (score >= 25) return 'خوف (Fear)';
    return 'خوف شديد (Extreme Fear)';
  };

  return (
    <div className="flex flex-col w-full px-4 gap-4 pb-8" dir="rtl">
      {/* Live Stream Bar & Status */}
      <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-2xl shadow-xs border border-[#eceef0] text-[11px]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6ffbbe] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006c49]"></span>
          </span>
          <span className="font-bold text-[#006c49]">بث حي ومباشر</span>
          <span className="text-[#45464d]">•</span>
          <span className="text-[#45464d] font-medium">آخر تحديث: {lastUpdated}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#45464d]">
          <span>تحديث تلقائي خلال:</span>
          <span className="font-bold text-[#191c1e] font-mono bg-[#eceef0] px-1.5 py-0.5 rounded text-[11px] tabular-nums">
            {countdown}s
          </span>
        </div>
      </div>

      {/* Market Sentiment Card (Deep Midnight Blue Aesthetic) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-[#131a33] via-[#1c2541] to-[#131a33] text-white p-4 shadow-xl border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#6ffbbe] animate-ping"></span>
            <span className="text-[11px] text-[#bec5e5] uppercase tracking-wider font-semibold">
              مباشر • وول ستريت &amp; الأسواق الدولية
            </span>
          </div>
          <button
            type="button"
            onClick={triggerLiveSync}
            className="text-[11px] bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white px-2.5 py-1 rounded-full flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>تحديث فوري</span>
          </button>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12px] text-[#7b83a0] font-medium">
              مؤشر الخوف والطمع الاستثماري (Fear &amp; Greed)
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[32px] font-extrabold tracking-tight text-white tabular-nums">
                {sentimentScore}
              </span>
              <span className="text-[16px] text-[#bec5e5] font-semibold">/ 100</span>
              <span className="mr-2 text-[11px] text-[#6ffbbe] bg-[#6ffbbe]/15 px-2 py-0.5 rounded-full font-bold">
                {getSentimentText(sentimentScore)}
              </span>
            </div>
          </div>

          {/* Mini Circular Arc Gauge Representation */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/15"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              ></path>
              <path
                className="text-[#6ffbbe] transition-all duration-700 ease-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${sentimentScore}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              ></path>
            </svg>
            <span className="material-symbols-outlined absolute text-[20px] text-[#6ffbbe]">
              trending_up
            </span>
          </div>
        </div>

        {/* Sentiment Breakdown Scale */}
        <div className="mt-3 pt-1 flex items-center justify-between text-[#7b83a0] text-[11px]">
          <span className="text-[#ffdad6] font-semibold">خوف شديد (0)</span>
          <div className="h-1.5 flex-1 mx-3 bg-white/10 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-[#6ffbbe] rounded-full transition-all duration-700"
              style={{ width: `${sentimentScore}%` }}
            ></div>
          </div>
          <span className="text-[#6ffbbe] font-semibold">طمع استثماري (100)</span>
        </div>
      </div>

      {/* Regional Segment Control Filter */}
      <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedRegion('all')}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold transition-all shadow-xs ${
            selectedRegion === 'all'
              ? 'bg-[#131a33] text-white'
              : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          الكل (عالمي)
        </button>
        <button
          type="button"
          onClick={() => setSelectedRegion('us')}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
            selectedRegion === 'us'
              ? 'bg-[#131a33] text-white'
              : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          الولايات المتحدة
        </button>
        <button
          type="button"
          onClick={() => setSelectedRegion('eu')}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
            selectedRegion === 'eu'
              ? 'bg-[#131a33] text-white'
              : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          أوروبا
        </button>
        <button
          type="button"
          onClick={() => setSelectedRegion('asia')}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
            selectedRegion === 'asia'
              ? 'bg-[#131a33] text-white'
              : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          آسيا والمحيط الهادئ
        </button>
        <button
          type="button"
          onClick={() => setSelectedRegion('mena')}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
            selectedRegion === 'mena'
              ? 'bg-[#131a33] text-white'
              : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
          }`}
        >
          الشرق الأوسط (MENA)
        </button>
      </div>

      {/* Key Global Macro Indicators Section */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006c49] text-[20px]">
              account_balance
            </span>
            <h2 className="text-[15px] text-[#191c1e] font-bold">
              أهم المؤشرات الاقتصادية الكلية
            </h2>
          </div>
          <span className="text-[11px] text-[#45464d] font-semibold">البيانات الرسمية المحدثة</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {filteredMacros.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-2xl shadow-xs border border-[#eceef0] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#45464d] font-semibold truncate">
                  {item.title}
                </span>
                <span className="w-6 h-6 rounded-full bg-[#eceef0] flex items-center justify-center text-[#45464d] text-[11px] font-bold shrink-0">
                  {item.symbol}
                </span>
              </div>

              <div className="my-2">
                <div className="flex items-baseline gap-1">
                  <p className="text-[16px] text-[#191c1e] tracking-tight font-extrabold tabular-nums">
                    {item.value}
                  </p>
                  {item.subValue && (
                    <span className="text-[10px] text-[#45464d] font-medium truncate">
                      {item.subValue}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
                  <span className="text-[10px] text-[#45464d] font-medium truncate">
                    {item.changeText}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#eceef0] rounded-full h-1 overflow-hidden mt-1">
                <div
                  className="bg-[#006c49] h-full rounded-full"
                  style={{ width: `${item.progressPct || 50}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Major Indices & Commodities */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006c49] text-[20px]">
              candlestick_chart
            </span>
            <h2 className="text-[15px] text-[#191c1e] font-bold">
              المؤشرات والسلع الأساسية (مباشر)
            </h2>
          </div>
          <div className="flex items-center gap-1 text-[#45464d] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse"></span>
            <span>أسعار التداول الفورية</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {liveTickers.map((ticker) => {
            const isFlashing = flashingKey === ticker.id;
            const flashClass = isFlashing
              ? isFlashUp
                ? 'flash-up'
                : 'flash-down'
              : '';
            const isUp = ticker.changePct >= 0;

            return (
              <div
                key={ticker.id}
                className={`bg-white p-3 rounded-2xl shadow-xs flex items-center justify-between transition-all border border-[#eceef0] ${flashClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#eceef0] flex items-center justify-center text-[#131a33] font-bold text-[12px] shadow-2xs">
                    {ticker.id === 'gold' ? (
                      <span className="material-symbols-outlined text-[20px] text-amber-600">
                        monetization_on
                      </span>
                    ) : ticker.id === 'brent' ? (
                      <span className="material-symbols-outlined text-[20px] text-[#191c1e]">
                        oil_barrel
                      </span>
                    ) : (
                      ticker.code.slice(0, 3)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#191c1e] font-bold leading-tight">
                      {ticker.name}
                    </span>
                    <span className="text-[11px] text-[#45464d] font-medium">
                      {ticker.code} • {ticker.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[15px] text-[#191c1e] font-extrabold tabular-nums">
                    {ticker.prefix || ''}
                    {ticker.value >= 1000
                      ? ticker.value.toLocaleString('en-US', {
                          minimumFractionDigits: ticker.decimals,
                          maximumFractionDigits: ticker.decimals,
                        })
                      : ticker.value.toFixed(ticker.decimals)}
                  </span>
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5 mt-0.5 tabular-nums ${
                      isUp ? 'bg-[#6ffbbe]/25 text-[#006c49]' : 'bg-[#ffdad6] text-[#ef4444]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {isUp ? 'arrow_drop_up' : 'arrow_drop_down'}
                    </span>
                    {isUp ? `+${ticker.changePct.toFixed(2)}%` : `${ticker.changePct.toFixed(2)}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Economic Calendar Section */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006c49] text-[20px]">
              calendar_month
            </span>
            <h2 className="text-[15px] text-[#191c1e] font-bold">التقويم والأحداث المرتقبة</h2>
          </div>
          <span className="text-[11px] bg-[#eceef0] text-[#45464d] px-2 py-0.5 rounded-md font-semibold">
            بتوقيت GMT
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {economicEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white p-3.5 rounded-2xl shadow-xs flex flex-col gap-1.5 relative overflow-hidden border border-[#eceef0]"
            >
              <div
                className={`absolute top-0 right-0 w-1.5 h-full ${
                  evt.impact === 'high'
                    ? 'bg-[#ef4444]'
                    : evt.impact === 'medium'
                    ? 'bg-[#131a33]'
                    : 'bg-[#76767e]'
                }`}
              ></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 font-bold text-[10px] rounded-full ${
                      evt.impact === 'high'
                        ? 'bg-[#ffdad6] text-[#ef4444]'
                        : 'bg-[#dbe1ff] text-[#131a33]'
                    }`}
                  >
                    {evt.impact === 'high' ? 'تأثير مرتفع جداً' : 'بيانات حاسمة'}
                  </span>
                  <span className="text-[11px] text-[#45464d] font-semibold">{evt.timeGMT}</span>
                </div>
                <span className="material-symbols-outlined text-[#45464d] text-[18px]">
                  notifications_active
                </span>
              </div>

              <h3 className="text-[14px] text-[#191c1e] font-bold mt-0.5">{evt.title}</h3>
              <p className="text-[12px] text-[#45464d] leading-relaxed">{evt.description}</p>

              <div className="flex items-center justify-between pt-1 bg-[#f2f4f6] p-2 rounded-xl text-[#191c1e] text-[11px]">
                <span>
                  السابق: <strong className="font-bold tabular-nums">{evt.previousValue}</strong>
                </span>
                <span>
                  التقدير:{' '}
                  <strong className="font-bold text-[#006c49] tabular-nums">
                    {evt.estimatedValue}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Macro Analysis Feature Card with Contextual Imagery */}
      <section className="bg-white rounded-2xl overflow-hidden shadow-xs p-3.5 flex flex-col gap-2 border border-[#eceef0]">
        <div className="flex items-center gap-1.5 text-[#006c49] text-[12px] font-bold">
          <span className="material-symbols-outlined text-[18px]">insights</span>
          <span>رؤية تحليلية سريعة</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col flex-1">
            <h4 className="text-[14px] text-[#191c1e] font-bold mb-1 leading-snug">
              تراجع حذر لمؤشر الدولار وسط ترقب عالمي
            </h4>
            <p className="text-[12px] text-[#45464d] line-clamp-2 leading-relaxed">
              تظهر أسواق العملات استقراراً نسبياً في ظل تراجع عوائد سندات الخزانة، مما يدعم أسعار
              الذهب والسلع الأساسية.
            </p>
          </div>
          <img
            className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#eceef0] border border-[#eceef0]"
            alt="Macro Trade analytics"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBODwhHaYRvO8E4ol9fyCTmf6wiHmob3wwwnlz-FfFddXY-vYgey_ZnE5nPPlbJJIRfW2XV6sRRTFTk6mnO-9JLprHC0yYIlF2azG9E6avoD1DXDnAotVDhtXJgFAoPcYLa_Ys2o9U5c8areA2GWmHNqEOrgiWoUWS8Gv0DM6jtcKrHNvFFN2uk4Q8EeBZPe1XZ8gWLVBxst0aftvErd6up30rwcB8zLzzkDGRoSN8NAO41QH9Ai5IV"
          />
        </div>

        <button
          type="button"
          onClick={onOpenMacroReport}
          className="w-full mt-1 py-2.5 bg-[#eceef0] hover:bg-[#e0e3e5] active:scale-[0.99] text-[#191c1e] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
        >
          <span>قراءة التقرير الماكرو الشامل</span>
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        </button>
      </section>
    </div>
  );
};
