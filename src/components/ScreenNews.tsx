import React, { useState, useEffect, useMemo, useRef } from 'react';
import { NewsArticle } from '../types/finance';
import { BREAKING_NEWS_TICKER, LIVE_TIMELINE_FEED } from '../data/mockData';
import { getCurrentDateInfo } from '../utils/dateUtils';

interface ScreenNewsProps {
  articles: NewsArticle[];
  onOpenArticle: (article: NewsArticle) => void;
  onToggleBookmark: (articleId: string) => void;
  onShare: (title: string) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const ScreenNews: React.FC<ScreenNewsProps> = ({
  articles,
  onOpenArticle,
  onToggleBookmark,
  onShare,
  showToast,
}) => {
  const dateInfo = useMemo(() => getCurrentDateInfo(), []);

  // Breaking News Rotating Strip
  const [breakingIndex, setBreakingIndex] = useState<number>(0);
  const [isTickerFading, setIsTickerFading] = useState<boolean>(false);

  // Audio Podcast State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSeconds, setAudioSeconds] = useState<number>(0);

  // New updates dynamic banner simulation
  const [showNewStoriesBanner, setShowNewStoriesBanner] = useState<boolean>(false);
  const [timelineItems, setTimelineItems] = useState(LIVE_TIMELINE_FEED);

  // Filter category
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Auto rotate breaking news
  useEffect(() => {
    const interval = setInterval(() => {
      advanceBreakingNews();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const advanceBreakingNews = () => {
    setIsTickerFading(true);
    setTimeout(() => {
      setBreakingIndex((prev) => (prev + 1) % BREAKING_NEWS_TICKER.length);
      setIsTickerFading(false);
    }, 200);
  };

  // Audio briefing playback timer & speech synthesis
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioSeconds((prev) => {
          if (prev >= 204) {
            // 3:24 reached
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  const toggleAudioPodcast = () => {
    if (!isPlayingAudio) {
      setIsPlayingAudio(true);
      showToast(`جارٍ تشغيل ملخص الصباح المالي • ${dateInfo.fullArabicDate}`, 'play_arrow');

      // Attempt browser speech synthesis for rich audio experience
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `ملخص الصباح المالي ليوم ${dateInfo.fullArabicDate}. تشهد الأسواق العالمية استقراراً نسبياً في تداولات مؤشر الدولار فوق 104 نقاط، مع استمرار صعود الذهب لمستويات قياسية تاريخية بدعم من مشتريات البنوك المركزية واستقرار أسعار صرف الدينار العراقي في المصارف والبورصات.`
        );
        utterance.lang = 'ar-SA';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsPlayingAudio(false);
      showToast('تم إيقاف الملخص مؤقتاً', 'pause');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Trigger floating new stories notification after 7s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewStoriesBanner(true);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadNewStories = () => {
    setShowNewStoriesBanner(false);
    const freshTimelineItem = {
      id: `f-${Date.now()}`,
      category: 'عاجل • أسواق الصرف',
      color: 'emerald',
      timeAgo: 'الآن',
      text: 'مؤشر السيولة النقدية يسجل ارتفاعاً في تداولات العملات الإقليمية مدعوماً بمشتريات الصناديق السيادية واستقرار الدينار.',
    };
    setTimelineItems([freshTimelineItem, ...timelineItems]);
    showToast('تم تحميل أحدث المستجدات الفورية', 'feed');
  };

  const formatAudioTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s} / 3:24 دقيقة`;
  };

  // Filter articles
  const filteredArticles = articles.filter((art) => {
    if (activeCategory === 'all') return true;
    return art.categoryFilter === activeCategory;
  });

  const leadStory = articles[0];
  const listStories = filteredArticles.filter((art) => art.id !== leadStory.id);

  return (
    <div className="flex flex-col w-full pb-8 select-none">
      {/* Floating Live New Posts Banner */}
      {showNewStoriesBanner && (
        <div className="px-4 pt-2 pb-0 animate-fadeIn">
          <button
            type="button"
            onClick={handleLoadNewStories}
            className="w-full bg-[#131a33] text-white py-2 px-3 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-md border border-white/10 active:scale-[0.99] transition-all hover:bg-[#1c2541]"
          >
            <span className="w-2 h-2 rounded-full bg-[#6ffbbe] animate-ping"></span>
            <span>+2 تحديثات اقتصادية جديدة متاحة الآن</span>
            <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
          </button>
        </div>
      )}

      {/* Breaking News Rotating Strip with Live Indicator */}
      <div className="px-4 pt-2 pb-1">
        <div className="w-full bg-[#131a33] text-white rounded-xl p-3 flex items-center gap-2 shadow-md overflow-hidden relative border border-white/5">
          <div className="flex items-center gap-1.5 shrink-0 bg-[#410004] text-[#ffdad6] px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping"></span>
            <span>عاجل</span>
          </div>

          <div className="flex-1 overflow-hidden min-w-0">
            <p
              className={`text-[12px] text-white truncate font-medium transition-opacity duration-300 ${
                isTickerFading ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {BREAKING_NEWS_TICKER[breakingIndex]}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={advanceBreakingNews}
              aria-label="الخبر التالي"
              className="text-[#7b83a0] hover:text-white transition-colors p-1"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audio Briefing Pill Widget with Real Interactive State */}
      <div className="px-4 py-1.5">
        <div className="w-full bg-white rounded-2xl p-3 flex items-center justify-between shadow-xs border border-[#eceef0]">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={toggleAudioPodcast}
              aria-label="تشغيل ملخص الصباح"
              className="w-10 h-10 rounded-full bg-[#006c49] text-white flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[22px]">
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`material-symbols-outlined text-[#006c49] text-[16px] ${
                    isPlayingAudio ? 'animate-bounce' : ''
                  }`}
                >
                  graphic_eq
                </span>
                <span className="text-[14px] text-[#191c1e] font-bold truncate">
                  ملخص الصباح المالي • {dateInfo.fullArabicDate}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#45464d] truncate">
                  {isPlayingAudio
                    ? `جارٍ الاستماع: تحركات العملات والمصارف ليوم ${dateInfo.isoDate}...`
                    : 'استمع لأهم تحركات أسعار الصرف والمعادن والنفط اليوم'}
                </span>
                <span className="text-[11px] text-[#006c49] font-bold shrink-0 tabular-nums">
                  {isPlayingAudio ? formatAudioTime(audioSeconds) : '3:24 دقيقة'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-[#6ffbbe]/25 text-[#002113] px-2.5 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">headphones</span>
            <span>بودكاست</span>
          </div>
        </div>
      </div>

      {/* Live Real-Time Feed Section (Ticker & Timeline) */}
      <section className="px-4 pt-1.5 pb-2">
        <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#eceef0]">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#eceef0]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006c49] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006c49]"></span>
              </span>
              <h3 className="text-[14px] text-[#191c1e] font-bold">
                تغطية حية ومباشرة • {dateInfo.fullArabicDate}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[#45464d] text-[11px] font-medium">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span className="font-bold text-[#006c49] tabular-nums">
                محدث الآن ({dateInfo.isoDate})
              </span>
            </div>
          </div>

          {/* Timeline dynamic container */}
          <div className="space-y-3">
            {timelineItems.map((item, idx) => (
              <div key={item.id} className="flex items-start gap-2.5 relative">
                <div className="flex flex-col items-center">
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      item.color === 'emerald'
                        ? 'bg-[#006c49]'
                        : item.color === 'red'
                        ? 'bg-[#ef4444]'
                        : 'bg-[#131a33]'
                    }`}
                  ></span>
                  {idx < timelineItems.length - 1 && (
                    <span className="w-0.5 h-full bg-[#eceef0] my-0.5 min-h-[26px]"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-[11px] font-bold ${
                        item.color === 'emerald'
                          ? 'text-[#006c49]'
                          : item.color === 'red'
                          ? 'text-[#ef4444]'
                          : 'text-[#131a33]'
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className="text-[10px] text-[#45464d]">{item.timeAgo}</span>
                  </div>
                  <p className="text-[12px] text-[#191c1e] font-medium leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter Chips (Horizontal Scrollable) */}
      <div className="w-full py-1.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 px-4 min-w-max">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all shadow-xs ${
              activeCategory === 'all'
                ? 'bg-[#131a33] text-white'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            الكل (تحديث حي)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('central-banks')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              activeCategory === 'central-banks'
                ? 'bg-[#131a33] text-white'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            البنوك المركزية والفائدة
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('gold-metals')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              activeCategory === 'gold-metals'
                ? 'bg-[#131a33] text-white'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            الذهب والملاذات الآمنة
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('oil-energy')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              activeCategory === 'oil-energy'
                ? 'bg-[#131a33] text-white'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            أوبك+ والنفط الخام
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('forex')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              activeCategory === 'forex'
                ? 'bg-[#131a33] text-white'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            مؤشر الدولار والصرف
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('imf-reports')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              activeCategory === 'imf-reports'
                ? 'bg-[#131a33] text-white'
                : 'bg-[#eceef0] text-[#45464d] hover:text-[#191c1e]'
            }`}
          >
            تقارير صندوق النقد 2026
          </button>
        </div>
      </div>

      {/* Featured Lead Story Card: Updated 2025 IMF & Fed Analysis */}
      {leadStory && (
        <section className="px-4 pt-1 pb-3">
          <article
            onClick={() => onOpenArticle(leadStory)}
            className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-[#eceef0] cursor-pointer"
          >
            <div className="relative w-full h-48 bg-[#eceef0]">
              <img
                alt={leadStory.title}
                className="w-full h-full object-cover"
                src={leadStory.imageUrl}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131a33]/85 via-transparent to-black/20"></div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="bg-[#6ffbbe] text-[#002113] px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-xs">
                  <span className="material-symbols-outlined text-[14px]">insights</span>
                  {leadStory.categoryTag}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white">
                <span className="text-[11px] bg-[#131a33]/80 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium">
                  {leadStory.sourceName}
                </span>
                <span className="text-[11px] text-[#6ffbbe] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  {leadStory.readTime}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-[16px] text-[#191c1e] font-bold leading-snug">
                {leadStory.title}
              </h2>
              <p className="text-[13px] text-[#45464d] line-clamp-2 leading-relaxed">
                {leadStory.summary}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#eceef0]/60">
                <div className="flex items-center gap-1.5 text-[#45464d] text-[11px] font-medium">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span className="text-[#006c49] font-bold">{leadStory.timeAgo}</span>
                </div>
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(leadStory.id)}
                    aria-label="حفظ الخبر"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#45464d] hover:text-[#131a33] active:scale-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {leadStory.isSaved ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onShare(leadStory.title)}
                    aria-label="مشاركة الخبر"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#45464d] hover:text-[#131a33] active:scale-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* News Section Header */}
      <div className="px-4 pt-2 pb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#131a33] rounded-full"></div>
          <h3 className="text-[15px] font-bold text-[#191c1e]">أحدث الأخبار والتحليلات النقدية</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#006c49] font-bold">تغذية نشطة</span>
          <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
        </div>
      </div>

      {/* News Stream List */}
      <div className="px-4 flex flex-col gap-3">
        {listStories.map((article) => {
          const isDeepReport = article.categoryTag.includes('استراتيجي');

          if (isDeepReport) {
            return (
              <article
                key={article.id}
                onClick={() => onOpenArticle(article)}
                className="bg-[#e6e8ea]/50 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5 relative overflow-hidden border border-[#c6c6ce]/50 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-[#131a33] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                    {article.categoryTag}
                  </span>
                  <span className="text-[11px] text-[#45464d] font-semibold">
                    {article.readTime}
                  </span>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#191c1e] leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-[12px] text-[#45464d] mt-1 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#6ffbbe] flex items-center justify-center text-[#002113]">
                      <span className="material-symbols-outlined text-[14px]">psychology</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#191c1e]">
                      {article.sourceName}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(article.id)}
                      aria-label="حفظ التقرير"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#45464d] hover:text-[#131a33] active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[19px]">
                        {article.isSaved ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onShare(article.title)}
                      aria-label="مشاركة التقرير"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#45464d] hover:text-[#131a33] active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[19px]">share</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          }

          return (
            <article
              key={article.id}
              onClick={() => onOpenArticle(article)}
              className="bg-white rounded-2xl p-3.5 shadow-xs flex flex-col gap-2.5 border border-[#eceef0] cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex gap-3">
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#006c49] bg-[#eceef0] px-2 py-0.5 rounded-full">
                      {article.categoryTag}
                    </span>
                    <span className="text-[11px] text-[#45464d] font-medium">
                      {article.sourceName}
                    </span>
                  </div>
                  <h4 className="text-[13px] text-[#191c1e] font-bold leading-snug line-clamp-2">
                    {article.title}
                  </h4>
                </div>
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#eceef0] border border-[#eceef0]">
                  <img
                    alt={article.title}
                    className="w-full h-full object-cover"
                    src={article.imageUrl}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#eceef0]/60 text-[11px] text-[#45464d]">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {article.timeAgo}
                  </span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <div
                  className="flex items-center gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(article.id)}
                    aria-label="حفظ الخبر"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#45464d] hover:text-[#131a33] active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      {article.isSaved ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onShare(article.title)}
                    aria-label="مشاركة الخبر"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#45464d] hover:text-[#131a33] active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[19px]">share</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
